import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendEmail, isValidHttpUrl, prepareEmailContent, isBase64DataUri } from './email.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dev server strictly binds to port 3000
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Persistent Contacts Storage (Local JSON database with Firestore blueprint compatibility)
const DATA_DIR = path.join(__dirname, 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

interface StoredContact {
  email: string;
  addedAt: string;
  lastUsedAt?: string;
  sentCount: number;
}

function loadContacts(): StoredContact[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading contacts:', err);
  }
  return [];
}

function saveContacts(contacts: StoredContact[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving contacts:', err);
  }
}

function recordRecipients(emails: string[]) {
  const contacts = loadContacts();
  const contactMap = new Map<string, StoredContact>();
  for (const c of contacts) {
    contactMap.set(c.email.toLowerCase(), c);
  }

  const now = new Date().toISOString();
  for (const email of emails) {
    const key = email.toLowerCase();
    if (contactMap.has(key)) {
      const existing = contactMap.get(key)!;
      existing.lastUsedAt = now;
      existing.sentCount = (existing.sentCount || 0) + 1;
    } else {
      contactMap.set(key, {
        email,
        addedAt: now,
        lastUsedAt: now,
        sentCount: 1,
      });
    }
  }

  saveContacts(Array.from(contactMap.values()));
}

interface SendRequestBody {
  brandName?: string;
  title?: string;
  description?: string;
  link?: string;
  contactEmail?: string;
  logo?: string; // base64 or URL
  images?: string[]; // array of up to 10 base64 or URLs
  recipients?: string; // One email per line or comma-separated
}

interface RecipientResult {
  email: string;
  status: 'sent' | 'failed';
  error?: string;
}

// Contacts API
app.get('/api/contacts', (_req: Request, res: Response) => {
  const contacts = loadContacts();
  res.json({ contacts });
});

app.post('/api/contacts', (req: Request, res: Response) => {
  const { emails } = req.body;
  if (!emails || typeof emails !== 'string') {
    return res.status(400).json({ error: 'Emails string is required' });
  }

  const rawList = emails
    .split(/[\r\n,;]+/)
    .map(s => s.trim())
    .filter(s => EMAIL_REGEX.test(s));

  if (rawList.length === 0) {
    return res.status(400).json({ error: 'No valid email addresses provided' });
  }

  recordRecipients(rawList);
  res.json({ contacts: loadContacts(), addedCount: rawList.length });
});

app.delete('/api/contacts', (req: Request, res: Response) => {
  const { email } = req.body;
  let contacts = loadContacts();
  if (email) {
    contacts = contacts.filter(c => c.email.toLowerCase() !== email.toLowerCase());
  } else {
    contacts = [];
  }
  saveContacts(contacts);
  res.json({ contacts });
});

// Email Preview API
app.post('/api/preview', (req: Request<{}, {}, SendRequestBody>, res: Response) => {
  const { brandName, title, description, link, contactEmail, logo, images } = req.body;
  try {
    const prepared = prepareEmailContent({
      brandName: brandName?.trim() || 'BRAND NAME',
      title: title?.trim() || 'Email Campaign Title',
      description: description?.trim() || 'Your campaign description message goes here.',
      link: link?.trim() || 'https://example.com',
      contactEmail: contactEmail?.trim() || 'contact@brand.com',
      logo: logo?.trim() || undefined,
      images: Array.isArray(images) ? images.slice(0, 10) : undefined,
      to: 'preview@example.com',
    });

    res.json({ html: prepared.html });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate preview' });
  }
});

// Email Send API
app.post('/api/send', async (req: Request<{}, {}, SendRequestBody>, res: Response) => {
  const { brandName, title, description, link, contactEmail, logo, images, recipients } = req.body;

  // 1. Validate required fields
  if (!brandName?.trim()) {
    return res.status(400).json({ error: 'Brand name is required.' });
  }
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  if (!description?.trim()) {
    return res.status(400).json({ error: 'Description is required.' });
  }
  if (!link?.trim() || !isValidHttpUrl(link.trim())) {
    return res.status(400).json({ error: 'Link is required and must start with http:// or https://.' });
  }
  if (!contactEmail?.trim() || !EMAIL_REGEX.test(contactEmail.trim())) {
    return res.status(400).json({ error: 'A valid contact email is required.' });
  }

  // 2. Parse, deduplicate, and limit recipients (supports newline, comma, semicolon)
  if (!recipients?.trim()) {
    return res.status(400).json({ error: 'At least one recipient email address is required.' });
  }

  const rawLines = recipients
    .split(/[\r\n,;]+/)
    .map(r => r.trim())
    .filter(r => r.length > 0);

  const seen = new Set<string>();
  const recipientList: string[] = [];

  for (const email of rawLines) {
    const lower = email.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      recipientList.push(email);
    }
  }

  if (recipientList.length === 0) {
    return res.status(400).json({ error: 'No valid recipient email addresses found.' });
  }

  if (recipientList.length > 400) {
    return res.status(400).json({ error: 'Maximum 400 recipients allowed per batch.' });
  }

  // 3. Check credentials from environment
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    return res.status(500).json({
      error: 'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASS in environment.',
    });
  }

  // Filter valid emails and save to contacts database
  const validRecipients = recipientList.filter(e => EMAIL_REGEX.test(e));
  if (validRecipients.length > 0) {
    recordRecipients(validRecipients);
  }

  const results: RecipientResult[] = [];
  const safeImages = Array.isArray(images) ? images.slice(0, 10) : undefined;

  // 4. Send emails with 1.5s delay between sends to protect Gmail sender reputation
  for (let i = 0; i < recipientList.length; i++) {
    const to = recipientList[i];

    if (!EMAIL_REGEX.test(to)) {
      results.push({ email: to, status: 'failed', error: 'Invalid email address format' });
      continue;
    }

    try {
      await sendEmail({
        brandName: brandName.trim(),
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        contactEmail: contactEmail.trim(),
        logo: logo?.trim() || undefined,
        images: safeImages,
        to,
      });

      results.push({ email: to, status: 'sent' });
    } catch (err: any) {
      results.push({
        email: to,
        status: 'failed',
        error: err?.message || 'Failed to send',
      });
    }

    // Wait 1.5 seconds between sends (except after the final email)
    if (i < recipientList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  const sentCount = results.filter(r => r.status === 'sent').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  res.json({
    summary: {
      total: results.length,
      sent: sentCount,
      failed: failedCount,
    },
    results,
  });
});

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

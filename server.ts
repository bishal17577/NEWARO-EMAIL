import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendEmail, isValidHttpUrl } from './email.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SendRequestBody {
  brandName?: string;
  title?: string;
  description?: string;
  link?: string;
  contactEmail?: string;
  imageUrl?: string;
  recipients?: string; // One email per line
}

interface RecipientResult {
  email: string;
  status: 'sent' | 'failed';
  error?: string;
}

app.post('/api/send', async (req: Request<{}, {}, SendRequestBody>, res: Response) => {
  const { brandName, title, description, link, contactEmail, imageUrl, recipients } = req.body;

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
  if (imageUrl?.trim() && !isValidHttpUrl(imageUrl.trim())) {
    return res.status(400).json({ error: 'Image URL must start with http:// or https://.' });
  }

  // 2. Parse, deduplicate, and limit recipients (max 100)
  if (!recipients?.trim()) {
    return res.status(400).json({ error: 'At least one recipient email address is required.' });
  }

  const rawLines = recipients
    .split(/\r?\n/)
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
    return res.status(400).json({ error: 'No valid recipient lines found.' });
  }

  if (recipientList.length > 100) {
    return res.status(400).json({ error: 'Maximum 100 recipients allowed per send.' });
  }

  // 3. Check credentials from environment
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    return res.status(500).json({
      error: 'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASS in environment.',
    });
  }

  const results: RecipientResult[] = [];

  // 4. Send one email per recipient with 1.5s delay between sends
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
        imageUrl: imageUrl?.trim() || undefined,
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

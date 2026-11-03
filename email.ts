import nodemailer from 'nodemailer';

export interface EmailPayload {
  brandName: string;
  title: string;
  description: string;
  link: string;
  contactEmail: string;
  imageUrl?: string;
  to: string;
}

// Escape all user text to prevent XSS and HTML injection
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Ensure URLs only use http or https protocols
export function isValidHttpUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Generate the plain-text alternative version of the email
export function buildPlainText(payload: EmailPayload): string {
  const lines: string[] = [
    payload.brandName.toUpperCase(),
    '='.repeat(payload.brandName.length),
    '',
    payload.title,
    '',
  ];

  if (payload.imageUrl && isValidHttpUrl(payload.imageUrl)) {
    lines.push(`[Image: ${payload.imageUrl}]`, '');
  }

  lines.push(payload.description, '');
  lines.push(`Link: ${payload.link}`, '');
  lines.push('---');
  lines.push(`Questions? Contact ${payload.contactEmail}`);
  lines.push(payload.brandName);

  return lines.join('\n');
}

// Generate the HTML email template
export function buildHtml(payload: EmailPayload): string {
  const safeBrand = escapeHtml(payload.brandName);
  const safeTitle = escapeHtml(payload.title);
  const safeContact = escapeHtml(payload.contactEmail);
  const safeLink = isValidHttpUrl(payload.link) ? escapeHtml(payload.link) : '#';

  // Format description into paragraphs
  const paragraphs = payload.description
    .split(/\r?\n\r?\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${escapeHtml(p).replace(/\r?\n/g, '<br/>')}</p>`)
    .join('');

  // Optional image block
  const imageHtml = payload.imageUrl && isValidHttpUrl(payload.imageUrl)
    ? `<div style="margin-bottom: 24px;">
        <img src="${escapeHtml(payload.imageUrl)}" alt="${safeTitle}" style="width: 100%; max-height: 360px; object-fit: cover; border-radius: 8px; display: block;" />
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; text-align: left;">
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <!-- Brand name in small uppercase text at the top -->
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700; margin-bottom: 12px;">
                ${safeBrand}
              </div>

              <!-- Title as the main heading -->
              <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${safeTitle}
              </h1>

              <!-- Optional image, then description paragraphs -->
              ${imageHtml}
              ${paragraphs}

              <!-- One button that links to the Link field -->
              <div style="margin: 28px 0 12px 0;">
                <a href="${safeLink}" target="_blank" rel="noopener noreferrer" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Learn More
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer with Questions? Contact [contact email] and brand name -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; line-height: 1.5;">
              Questions? Contact <a href="mailto:${safeContact}" style="color: #0f172a; text-decoration: underline;">${safeContact}</a>
              <div style="margin-top: 4px; font-weight: 600; color: #334155;">
                ${safeBrand}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Create Nodemailer Transporter using environment variables
export function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASS?.replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASS environment variables must be configured.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

// Send a single email with all headers and plain-text fallback
export async function sendEmail(payload: EmailPayload) {
  const transporter = createTransporter();
  const gmailUser = process.env.GMAIL_USER!;
  const unsubscribeUrl = process.env.UNSUBSCRIBE_URL;

  const headers: Record<string, string> = {};
  if (unsubscribeUrl && isValidHttpUrl(unsubscribeUrl)) {
    headers['List-Unsubscribe'] = `<${unsubscribeUrl}>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  } else {
    headers['List-Unsubscribe'] = `<mailto:${gmailUser}?subject=unsubscribe>`;
  }

  return transporter.sendMail({
    from: `"${payload.brandName.replace(/"/g, '')}" <${gmailUser}>`,
    to: payload.to,
    replyTo: payload.contactEmail,
    subject: payload.title,
    text: buildPlainText(payload),
    html: buildHtml(payload),
    headers,
  });
}

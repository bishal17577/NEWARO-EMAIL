import nodemailer from 'nodemailer';

export interface EmailPayload {
  brandName: string;
  title: string;
  description: string;
  link: string;
  contactEmail: string;
  logo?: string; // base64 data URL or http(s) URL
  images?: string[]; // array of up to 10 base64 data URLs or http(s) URLs
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

// Helper to inspect if a string is a base64 data URI
export function isBase64DataUri(str: string): boolean {
  return typeof str === 'string' && /^data:image\/[a-zA-Z0-9-.+]+;base64,/.test(str);
}

// Generate the plain-text alternative version of the email
export function buildPlainText(payload: EmailPayload): string {
  const lines: string[] = [
    payload.brandName.toUpperCase(),
    '='.repeat(Math.max(payload.brandName.length, 12)),
    '',
    payload.title,
    '',
  ];

  lines.push(payload.description, '');

  if (payload.images && payload.images.length > 0) {
    lines.push(`[Attached images: ${payload.images.length}]`, '');
  }

  lines.push(`Action Link: ${payload.link}`, '');
  lines.push('---');
  lines.push(`Questions? Contact ${payload.contactEmail}`);
  lines.push(payload.brandName);

  return lines.join('\n');
}

export interface PreparedEmailContent {
  html: string;
  text: string;
  attachments: Array<{
    filename: string;
    content: Buffer;
    cid: string;
    contentType?: string;
  }>;
}

export function prepareEmailContent(payload: EmailPayload): PreparedEmailContent {
  const attachments: Array<{
    filename: string;
    content: Buffer;
    cid: string;
    contentType?: string;
  }> = [];

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

  // 1. Process Logo
  let logoHtml = '';
  if (payload.logo) {
    if (isBase64DataUri(payload.logo)) {
      const match = payload.logo.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const ext = mime.split('/')[1] || 'png';
        const cid = 'brand-logo-cid';
        attachments.push({
          filename: `brand-logo.${ext}`,
          content: Buffer.from(match[2], 'base64'),
          cid,
          contentType: mime,
        });
        logoHtml = `<div style="margin-bottom: 16px;">
          <img src="cid:${cid}" alt="${safeBrand}" style="max-height: 52px; max-width: 180px; object-fit: contain; display: block;" />
        </div>`;
      }
    } else if (isValidHttpUrl(payload.logo)) {
      logoHtml = `<div style="margin-bottom: 16px;">
        <img src="${escapeHtml(payload.logo)}" alt="${safeBrand}" style="max-height: 52px; max-width: 180px; object-fit: contain; display: block;" />
      </div>`;
    }
  }

  // 2. Process Up to 10 Images
  let imagesHtml = '';
  const validImages = (payload.images || []).slice(0, 10);
  if (validImages.length > 0) {
    const renderedImgs: string[] = [];

    validImages.forEach((imgSrc, idx) => {
      if (isBase64DataUri(imgSrc)) {
        const match = imgSrc.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match) {
          const mime = match[1];
          const ext = mime.split('/')[1] || 'jpg';
          const cid = `image-attachment-${idx}`;
          attachments.push({
            filename: `attachment-${idx + 1}.${ext}`,
            content: Buffer.from(match[2], 'base64'),
            cid,
            contentType: mime,
          });
          renderedImgs.push(
            `<div style="margin-bottom: 16px;">
              <img src="cid:${cid}" alt="Image ${idx + 1}" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; display: block;" />
            </div>`
          );
        }
      } else if (isValidHttpUrl(imgSrc)) {
        renderedImgs.push(
          `<div style="margin-bottom: 16px;">
            <img src="${escapeHtml(imgSrc)}" alt="Image ${idx + 1}" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; display: block;" />
          </div>`
        );
      }
    });

    if (renderedImgs.length > 0) {
      imagesHtml = `<div style="margin: 24px 0 16px 0;">${renderedImgs.join('')}</div>`;
    }
  }

  const html = `<!DOCTYPE html>
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
            <td style="padding: 32px 32px 20px 32px;">
              ${logoHtml}

              <!-- Brand name in small uppercase text at the top -->
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700; margin-bottom: 12px;">
                ${safeBrand}
              </div>

              <!-- Title as the main heading -->
              <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${safeTitle}
              </h1>

              <!-- Description paragraphs -->
              ${paragraphs}

              <!-- Images Gallery (up to 10 images) -->
              ${imagesHtml}

              <!-- One button that links to the Link field -->
              <div style="margin: 28px 0 16px 0;">
                <a href="${safeLink}" target="_blank" rel="noopener noreferrer" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Learn More
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer with Questions? Contact [contact email] and brand name (no newaronp@gmail.com visible) -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; line-height: 1.5;">
              Questions? Contact <a href="mailto:${safeContact}" style="color: #0f172a; font-weight: 600; text-decoration: underline;">${safeContact}</a>
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

  return {
    html,
    text: buildPlainText(payload),
    attachments,
  };
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

// Send a single email with all headers, attachments, and plain-text fallback
export async function sendEmail(payload: EmailPayload) {
  const transporter = createTransporter();
  const gmailUser = process.env.GMAIL_USER!;
  const unsubscribeUrl = process.env.UNSUBSCRIBE_URL;

  const prepared = prepareEmailContent(payload);

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
    text: prepared.text,
    html: prepared.html,
    attachments: prepared.attachments,
    headers,
  });
}

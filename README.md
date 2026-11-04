# NEWARO Brand Problem Solver & Campaign Dispatcher

A high-deliverability marketing and office notification campaign platform built with Node.js, Express, Nodemailer, and a clean light-theme interface.

---

## Key Features

1. **Clean Light Theme**:
   - Minimalist white background (`#ffffff`), crisp black/dark slate typography (`#0f172a`), and clean subtle borders.
   - High-contrast responsive design for desktop and mobile screens.

2. **Brand Privacy & Identity**:
   - The underlying Gmail address is never displayed visibly in the email body or footer.
   - The recipient sees the **Brand Name** as the sender, the **Title** as the main heading, followed by the **Description** paragraphs.
   - The footer displays only your official contact email (`Questions? Contact [contactEmail]`) and Brand Name.

3. **Logo & Multi-Image Gallery Upload**:
   - **Brand Logo Upload**: Drag-and-drop or file upload for the brand logo. Rendered crisply as an inline CID attachment or embedded header.
   - **Up to 10 Campaign Images**: Multi-file drag-and-drop gallery uploader with thumbnail cards, image counters (`X / 10 images`), and single-click removal.

4. **Persistent Contact Vault & Quick Select**:
   - Automatically stores all dispatched recipient email addresses in the Contact Vault.
   - One-click batch selection buttons:
     - `[All Saved]` (selects entire contact vault)
     - `[First 10]`
     - `[Office 30]` (tailored for worker and office packages)
     - `[First 40]`
     - `[Clear]`
   - Quick bulk import (comma-separated, newline-separated, or CSV paste).
   - Checkbox selection for individual contacts.

5. **Up to 400 Recipients per Batch**:
   - Supports sending to up to 400 email addresses with duplicate filtering and syntax validation.
   - Rate-limited with a 1.5-second delay between sends to protect sender reputation.

6. **Live Preview**:
   - Click **Preview Email** to view exactly how your email renders before dispatching to any recipients.

---

## Setup & Configuration

### 1. Environment Variables

Create or update `.env`:

```env
GMAIL_USER="newaronp@gmail.com"
GMAIL_APP_PASS="xccultbxvwtyrfip"
UNSUBSCRIBE_URL="https://example.com/unsubscribe"
PORT=3000
```

### 2. Run Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## API Endpoints

- `GET /api/contacts`: Retrieve all saved contacts in the vault.
- `POST /api/contacts`: Bulk add contacts into the vault.
- `DELETE /api/contacts`: Remove specific or all contacts.
- `POST /api/preview`: Generate instant HTML preview of the email template.
- `POST /api/send`: Dispatch email campaign to up to 400 recipients via Gmail SMTP.

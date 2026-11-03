# Node.js + Express Email Sender

A lightweight, single-page application built with Node.js, Express, and Nodemailer for sending customized brand emails through Gmail SMTP with rate-limiting and deliverability headers.

## Features

- **Single-Page Form**: Only six fields (Brand name, Title/Subject, Description, Link, Contact email, optional Image URL) plus a line-by-line recipient list.
- **Recipient Management**: Automatically trims and deduplicates recipients, up to 100 per campaign.
- **Rate-Limited Dispatch**: Enforces a 1.5-second pause between outgoing emails to respect SMTP thresholds.
- **Deliverability & Safety**:
  - Escapes all user inputs in HTML to prevent injection.
  - Generates both HTML and clean plain-text MIME alternatives.
  - Adds `List-Unsubscribe` headers (supports custom `UNSUBSCRIBE_URL` or mailto fallback).
  - Validates `http://` and `https://` protocol on links and image URLs.
- **Real-Time Delivery Summary**: Displays per-recipient status (`SENT` or `FAILED` with exact error) alongside total metrics.

---

## Prerequisites

1. **Node.js** (v18 or higher) and **npm**
2. A **Google Account** with:
   - **2-Step Verification** enabled
   - A dedicated **16-character App Password** (regular account passwords will not work with SMTP)

---

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the sample environment file to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Gmail credentials:

```env
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASS=your_16_character_app_password
UNSUBSCRIBE_URL=https://yourbrand.com/unsubscribe
PORT=3000
```

#### How to Generate a Gmail App Password
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is turned ON.
3. Search for or navigate to **App Passwords** (`https://myaccount.google.com/apppasswords`).
4. Enter an app name (e.g. `Email Sender`) and click **Create**.
5. Copy the 16-character code (spaces can be omitted) and paste it into `GMAIL_APP_PASS`.

---

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Visit **`http://localhost:3000`** in your browser.

---

## Project Structure

```
├── .env.example       # Example environment configuration
├── email.ts           # Email template builder, plain-text generator, and Nodemailer logic
├── package.json       # Project dependencies and scripts
├── public/
│   └── index.html     # Single-page form and per-recipient delivery report UI
├── README.md          # Setup and configuration guide
├── server.ts          # Express API server and input validator
└── tsconfig.json      # TypeScript compiler configuration
```

---

## API Reference

### `POST /api/send`

Dispatches the campaign to the recipient list.

**Request Body (JSON):**
```json
{
  "brandName": "Acme Corp",
  "title": "New Product Announcement",
  "description": "We are excited to share our latest update.\n\nRead more below.",
  "link": "https://acme.com/announcement",
  "contactEmail": "hello@acme.com",
  "imageUrl": "https://acme.com/banner.jpg",
  "recipients": "user1@example.com\nuser2@example.com"
}
```

**Response (JSON):**
```json
{
  "summary": {
    "total": 2,
    "sent": 2,
    "failed": 0
  },
  "results": [
    { "email": "user1@example.com", "status": "sent" },
    { "email": "user2@example.com", "status": "sent" }
  ]
}
```

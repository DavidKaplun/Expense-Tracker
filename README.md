# Expense Tracker

A full-stack expense tracker with automated expense entry — upload a photo of an invoice and a multimodal LLM extracts the details and fills in the expense for you.

## Demo

📹 **[Demo video — link to be added]**

🔗 **Live:** https://kaplunexpensetracker.com/

## Stack

- **Frontend:** React, React Native Web (Expo), file-based routing
- **Backend:** Node.js, Express, REST API
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT, bcrypt
- **AI:** Claude API (invoice data extraction)
- **Infra:** AWS (EC2, RDS, S3, CloudFront), Nginx, PM2

## Architecture

A single React Native Web (Expo) codebase that serves web clients, talking to a separate Node.js/Express REST API. The API is backed by PostgreSQL through Prisma. Uploaded invoice images are sent to the Claude API for one-time data extraction and then discarded, with only a per-user upload count kept to enforce usage limits.

## Key decisions

- **Multimodal LLM for invoice entry** — instead of manual typing or brittle OCR, invoice images are sent to the Claude API, which reads the image and returns structured expense data. Per-user monthly usage limits keep API costs bounded.
- **One codebase for web and mobile** — React Native Web (Expo) means the same client code renders on both platforms rather than maintaining two separate apps.
- **Prisma ORM** — type-safe queries and version-controlled migrations instead of hand-written SQL, so schema changes are tracked and repeatable.
- **JWT + bcrypt for auth** — stateless tokens so the server holds no session state; passwords hashed with bcrypt, never stored in plaintext. Categories and expenses are isolated per user.

## Known limitations / next steps

- **No password recovery yet** — there's no forgot-password or email-verification flow. Next step: add email verification and a reset flow.
- **Single currency** — amounts are stored and displayed in one currency. Next step: per-user currency settings and conversion.

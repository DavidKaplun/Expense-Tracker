# Expense Tracker

A full-stack web application for tracking and analyzing personal expenses, with automated expense entry from invoice images using a multimodal LLM.

## Screenshots

| Add expense | Analysis | Monthly summary |
|:---:|:---:|:---:|
| ![Add expense](assets/images/add-expense.png) | ![Analysis](assets/images/analysis.png) | ![Monthly summary](assets/images/monthly-summary.png) |

**Live demo:** _coming soon_

---

## Overview

Expense Tracker lets users record expenses, organize them into per-user categories, and view spending analysis across months and categories. Beyond manual entry, users can upload a photo of an invoice and have the expense details extracted and auto-filled by the Claude API.

The project is a single React (Expo / React Native Web) codebase for the client and a separate Node.js/Express API for the backend, backed by PostgreSQL via Prisma.

## Features

- **User accounts** — registration and login with hashed passwords (bcrypt) and JWT-based authentication.
- **Expense management** — add, view, and categorize expenses, each with amount, description, date, and an optional invoice image.
- **Per-user categories** — every user has their own isolated set of categories, with colors assigned automatically.
- **Invoice auto-fill** — upload an invoice image and the Claude API extracts the relevant details to pre-fill the expense, with per-user monthly usage limits.
- **Spending analysis** — monthly and yearly summaries, plus per-category breakdowns.

## Tech stack

**Frontend:** React, React Native Web (Expo), file-based routing
**Backend:** Node.js, Express, REST API
**Database:** PostgreSQL with Prisma ORM
**Auth:** JWT, bcrypt
**AI:** Claude API (invoice data extraction)
**Infrastructure:** AWS (EC2, RDS, S3, CloudFront), Nginx, PM2

## Project structure

```
.
├── app/          # Expo Router screens (file-based routing)
├── components/   # Reusable UI components
├── context/      # React context providers
├── hooks/        # Custom React hooks
├── constants/    # Shared constants
├── utils/        # Helper functions
├── assets/       # Images and static assets
└── server/       # Node.js / Express backend + Prisma schema
```

## Getting started

### Prerequisites

- Node.js (LTS)
- A local PostgreSQL instance
- A Claude API key (for the invoice auto-fill feature)

### 1. Clone and install

```bash
git clone https://github.com/DavidKaplun/Expense-Tracker.git
cd Expense-Tracker
npm install
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/expense_tracker"
JWT_SECRET="your_jwt_secret"
ANTHROPIC_API_KEY="your_claude_api_key"
```

Run the Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

Start the backend (from inside the `server/` directory):

```bash
node index.js
```

### 3. Run the frontend

From the project root:

```bash
npm start
```

Press `w` to open the web version in your browser.

## License

This project is for portfolio purposes.

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

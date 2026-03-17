# Crypton

A cyberpunk-themed cryptic hunt web platform built for **Crypton**, a hackathon event organized by **CoddyIO &middot; Vibecon**. Participants solve a series of progressively harder levels by deciphering clues, with a live leaderboard tracking scores.

## Stack

- **Frontend** — SvelteKit + TypeScript
- **Styling** — Tailwind CSS + DaisyUI (custom `crypton` theme)
- **Backend** — Firebase (Firestore, Auth, Cloud Functions)
- **Deployment** — Vercel (frontend) + Firebase (functions/rules)
- **Monitoring** — Sentry

## Features

- Invite-only access via site password
- Google OAuth sign-in
- Multi-level cryptic hunt with answer validation
- Live leaderboard
- Per-user answer history logs
- Matrix rain / cyberpunk UI theme
- Server-side session cookies (secure, HttpOnly)

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte          # Home / hero
│   ├── info/                 # Event info, rules, resources
│   ├── ready/                # Registration (Google sign-in + username)
│   ├── play/                 # Game page
│   ├── leaderboard/          # Live leaderboard
│   └── api/                  # Server endpoints (auth, verify, submit, create)
├── lib/
│   ├── components/           # MatrixRain, UI components
│   ├── firebase.ts           # Client SDK init
│   └── server/admin.ts       # Admin SDK init
functions/
└── main.py                   # Firebase Cloud Functions (Python)
```

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd CryptIQ
npm install
```

### 2. Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore**, **Authentication** (Google provider), and **Storage**
3. Go to **Project Settings → Service Accounts** and generate a new private key
4. Go to **Project Settings → General → Your apps** and copy the client SDK config

### 3. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# Firebase Admin SDK (server-side)
FB_PROJECT_ID=""
FB_PRIVATE_KEY=""
FB_CLIENT_EMAIL=""

# Firebase Client SDK (public)
PUBLIC_FB_API_KEY=""
PUBLIC_FB_AUTH_DOMAIN=""
PUBLIC_FB_PROJECT_ID=""
PUBLIC_FB_STORAGE_BUCKET=""
PUBLIC_FB_MESSAGING_SENDER_ID=""
PUBLIC_FB_APP_ID=""

# Sentry (optional)
SENTRY_AUTH_TOKEN=""
PUBLIC_SENTRY_DSN=""

# Site access password
SITE_PASSWORD=""
```

### 4. Firestore rules

Deploy the included security rules:

```bash
firebase deploy --only firestore:rules
```

### 5. Seed levels

Edit `scripts/seed.mjs` with your questions, then run:

```bash
node scripts/seed.mjs
```

### 6. Run locally

```bash
npm run dev
```

## Deployment

The project uses `@sveltejs/adapter-vercel`. Push to your repo and connect it to a Vercel project. Add all environment variables in the Vercel dashboard.

```bash
npm run build
```

## Firestore Structure

| Collection | Description |
|---|---|
| `levels/{id}` | Question data (prompt, answer, files, images) — server-only |
| `users/{uid}` | User profile (username, level, completed_levels, banned) |
| `logs/{uid}` | Per-user answer submission history |
| `index/userIndex` | Cached map of registered UIDs for fast lookup |

## License

MIT

# Crypton

> **🌐 Live Site:** [https://crypton-bay.vercel.app/](https://crypton-bay.vercel.app/)

A cyberpunk-themed cryptic hunt web platform built for **Crypton**, an online puzzle-solving event hosted during **Vibecon 2026** at Galgotias. Participants solve a series of progressively challenging levels by deciphering clues, riddles, and hidden patterns, with a live leaderboard tracking their progress.

---

## 🎯 What is Crypton?

Crypton is a cryptic hunt where players tackle mind-bending puzzles that test wit, creativity, and problem-solving skills. Each level contains clues hidden in text, images, audio, code, or URLs. Players must think outside the box, use online tools, and connect the dots to find answers and advance.

---

## 🚀 Tech Stack

- **Frontend** — SvelteKit + TypeScript
- **Styling** — Tailwind CSS (custom Matrix/cyberpunk theme)
- **Backend** — Firebase (Firestore, Authentication, Cloud Functions)
- **Deployment** — Vercel (frontend) + Firebase (backend)
- **UI Components** — Custom Svelte components with glassmorphism, glitch effects, and Matrix rain animation

---

## ✨ Features

- ✅ Invite-only access via site password
- ✅ Google OAuth sign-in with Firebase Authentication
- ✅ Multi-level cryptic hunt with progressive difficulty
- ✅ Answer validation with real-time feedback
- ✅ Live leaderboard ranked by completion speed
- ✅ Answer history logs per user
- ✅ Cyberpunk UI with Matrix rain, scanlines, glitch text, and neon accents
- ✅ Secure sessions using server-side HttpOnly cookies
- ✅ File attachments support for questions (images, documents, audio)

---

## 📁 Project Structure

```
Crypton/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Landing page with hero section
│   │   ├── +layout.svelte            # Root layout with navigation
│   │   ├── info/+page.svelte         # Event info, rules, resources, team
│   │   ├── ready/+page.svelte        # Registration (Google sign-in + username)
│   │   ├── play/+page.svelte         # Main game interface
│   │   ├── leaderboard/+page.svelte  # Live leaderboard
│   │   └── api/
│   │       ├── verify/+server.ts     # Site password verification
│   │       ├── auth/+server.ts       # Session creation after sign-in
│   │       ├── submit/+server.ts     # Answer submission
│   │       └── create/+server.ts     # User registration
│   ├── lib/
│   │   ├── components/
│   │   │   ├── MatrixRain.svelte     # Canvas-based Matrix rain effect
│   │   │   └── ui/                   # Reusable UI components
│   │   ├── firebase.ts               # Firebase client SDK initialization
│   │   ├── server/admin.ts           # Firebase Admin SDK (lazy init)
│   │   ├── toast_utils.ts            # Toast notification utilities
│   │   └── utils.ts                  # Utility functions
│   ├── app.css                       # Global styles (glitch, scanlines, animations)
│   ├── app.html                      # HTML template
│   └── hooks.server.ts               # Server hooks (session validation)
├── functions/
│   └── main.py                       # Firebase Cloud Functions (Python)
├── scripts/
│   ├── seed.mjs                      # Seed levels into Firestore
│   └── reset.mjs                     # Clear all user data and logs
├── static/
│   └── Crypton.png                   # Logo
├── .env.example                      # Environment variables template
├── firebase.json                     # Firebase configuration
├── firestore.rules                   # Firestore security rules
├── firestore.indexes.json            # Firestore indexes
├── svelte.config.js                  # SvelteKit configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── vite.config.ts                    # Vite configuration
└── Cryptic Hunt Solution.docx        # Solutions to all levels
```

---

## 🛠️ Local Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd Crypton
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database**
3. Enable **Authentication** → Sign-in method → Google
4. Enable **Storage** (if using file uploads)
5. Go to **Project Settings → Service Accounts** → Generate new private key (download JSON)
6. Go to **Project Settings → General → Your apps** → Copy Firebase SDK config
7. Add authorized domain: `crypton-bay.vercel.app` (or your custom domain)

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

```env
# Firebase Admin SDK (server-side, from service account JSON)
FB_PROJECT_ID="your-project-id"
FB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FB_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"

# Firebase Client SDK (public, from web app config)
PUBLIC_FB_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
PUBLIC_FB_AUTH_DOMAIN="your-project.firebaseapp.com"
PUBLIC_FB_PROJECT_ID="your-project-id"
PUBLIC_FB_STORAGE_BUCKET="your-project.appspot.com"
PUBLIC_FB_MESSAGING_SENDER_ID="123456789012"
PUBLIC_FB_APP_ID="1:123456789012:web:abcdef123456"

# Site Access Password
SITE_PASSWORD="your-secret-password"

# Sentry (optional)
SENTRY_AUTH_TOKEN=""
PUBLIC_SENTRY_DSN=""
```

**⚠️ Important:** When deploying to Vercel, ensure environment variables do not contain CRLF line endings (`\r\n`). Use the Vercel dashboard or REST API to set them, not PowerShell `echo` commands.

### 4. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 5. Seed Levels

Edit `scripts/seed.mjs` with your questions and answers, then run:

```bash
node scripts/seed.mjs
```

**Level Structure:**
```javascript
{
  id: "level-1",
  prompt: "Your question text here",
  answer: "correctanswer",  // lowercase, no spaces
  images: ["https://url-to-image.png"],  // optional
  files: ["https://url-to-file.pdf"]     // optional, can be strings or {name, url} objects
}
```

You can also add levels directly via Firebase Console:
- Go to Firestore Database → `levels` collection
- Add document with ID `level-{n}`
- Fields: `prompt` (string), `answer` (string), `images` (array), `files` (array)

### 6. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## � Deployment

### Vercel Deployment

1. Push your code to GitHub/GitLab
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy

```bash
npm run build
vercel --prod
```

### Firebase Deployment

Deploy Firestore rules and Cloud Functions:

```bash
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

---

## 📊 Firestore Structure

| Collection | Document ID | Fields | Access |
|---|---|---|---|
| `levels` | `level-{n}` | `prompt`, `answer`, `images[]`, `files[]` | Server-only |
| `users` | `{uid}` | `username`, `level`, `completed_levels[]`, `banned`, `timestamps` | Read: user, Write: server |
| `logs` | `{uid}` | `answers[]` (array of `{level, answer, correct, timestamp}`) | Read: user, Write: server |
| `index` | `userIndex` | `{uid: true, ...}` (map of registered users) | Server-only |

---

## 🎮 How to Play

1. Visit [https://crypton-bay.vercel.app/](https://crypton-bay.vercel.app/)
2. Enter the site password (provided by organizers)
3. Sign in with Google
4. Choose a unique username
5. Start solving levels
6. Submit answers (lowercase, no spaces)
7. Check the leaderboard to see your rank

---

## 🧩 Cryptic Hunt Tips

- **Inspect everything** — source code, image metadata, audio spectrograms
- **Use online tools** — cipher decoders, steganography analyzers, QR readers
- **Think creatively** — answers may be hidden in URLs, file names, or page titles
- **Google is your friend** — but it won't give you direct answers
- **Collaborate** — join the official WhatsApp group (but don't share answers!)
- **File passwords** — allow all characters, brute forcing won't help

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Svelte type checking |
| `node scripts/seed.mjs` | Seed levels into Firestore |
| `node scripts/reset.mjs` | Clear all user data and logs |

---

## 🏆 Solutions

All level solutions are documented in **`Cryptic Hunt Solution.docx`** for reference and post-event review.

---

## � Design System

- **Primary Color:** Matrix Green (`#13ec49`)
- **Accent Colors:** Cyan (`#00d9ff`), Purple (`#a855f7`), Pink (`#ec4899`)
- **Fonts:** Space Grotesk (display), Space Mono (monospace)
- **Effects:** Glitch text, scanlines, vignette, glassmorphism, Matrix rain
- **Theme:** Cyberpunk/Matrix-inspired with neon accents

---

## 🔒 Security

- Site password required for initial access
- Google OAuth for authentication
- Server-side session cookies (HttpOnly, Secure, SameSite)
- Firestore security rules prevent unauthorized access
- Admin SDK operations isolated to server-side
- Answer validation happens server-side only
- Lazy Firebase Admin initialization to avoid cold start issues

---

## 🐛 Known Issues & Fixes

### CRLF in Environment Variables
If deploying from Windows PowerShell, avoid using `echo "value" | vercel env add` as it adds CRLF (`\r\n`) to values. Use Vercel dashboard or REST API instead.

### Firebase Admin Initialization
The app uses lazy initialization for Firebase Admin SDK to avoid cold start issues. All env vars are trimmed to handle potential whitespace.

### Node.js Version
Vercel deployment is pinned to Node.js 20.x in `svelte.config.js` for compatibility.

### Build Memory Issues
Build script uses `--max-old-space-size=4096` to avoid heap out-of-memory errors during Vite build.

---

## 📄 License

MIT

---

## 👥 Team

**Team Kivy**  
Kushwaha Abhay — Designer & Developer

---

## 📞 Contact & Support

For issues or questions:
- Join the official WhatsApp group (link provided during event)
- DM any team member for misconduct reports
- Check the `/info` page for rules and resources

---

**Event:** Crypton · Vibecon 2026 · Galgotias  
**Live Site:** [https://crypton-bay.vercel.app/](https://crypton-bay.vercel.app/)  
**Built with:** SvelteKit, Firebase, Tailwind CSS, and lots of Matrix vibes 🟢

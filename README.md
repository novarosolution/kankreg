# KankreG

Premium e-commerce monorepo — **mobile app** (Expo React Native + web) and **backend API** (Express + MongoDB).

## Project layout

```txt
kankreG/
├── mobile/          # Expo app (iOS, Android, web storefront + admin)
│   ├── src/
│   ├── assets/
│   ├── android/
│   ├── package.json
│   └── .env         # EXPO_PUBLIC_* (create from .env.example)
├── backend/         # Express API + MongoDB
│   ├── server.js
│   ├── src/
│   └── .env         # MONGO_URI, JWT, Razorpay, etc.
└── package.json     # Root shortcuts (mobile:*, backend:*)
```

## Quick start

**Install both:**

```bash
npm run install:all
```

**Backend** (terminal 1):

```bash
cd backend
cp .env.example .env   # set MONGO_URI, JWT_SECRET, Cloudinary, Razorpay
npm run dev
```

**Mobile** (terminal 2):

```bash
cd mobile
cp .env.example .env   # EXPO_PUBLIC_API_URL=http://127.0.0.1:5001
npm run start
```

Or from repo root:

```bash
npm run backend:dev
npm run mobile:start
```

Press `i` (iOS), `a` (Android), or `w` (web).

## Environment

| App | File | Key vars |
|-----|------|----------|
| Mobile | `mobile/.env` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_RAZORPAY_KEY_ID` |
| Backend | `backend/.env` | `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_*` |

Production API: `https://kankregserver.onrender.com`

Restart Expo after changing mobile env: `npm run mobile:start:clean`

## Deploy

| Target | Folder | Command |
|--------|--------|---------|
| **Web (Vercel)** | `mobile/` | Set Vercel **Root Directory** to `mobile`, then deploy |
| **Android (EAS)** | `mobile/` | `cd mobile && eas build --platform android` |
| **Backend (Render)** | `backend/` | Push to GitHub — Render auto-deploys |

Vercel env vars (build time): `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_RAZORPAY_KEY_ID`

Local web export check:

```bash
npm run mobile:export:web
npx serve mobile/dist
```

## Features

- Customer storefront, cart/checkout, auth, rewards, delivery dashboard, admin console
- React Navigation with role-based guards
- Razorpay checkout
- Responsive web + native layouts

See `backend/README.md` for API details and `mobile/docs/` for UI notes.

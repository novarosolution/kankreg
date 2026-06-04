# KankreG (Expo React Native)

A premium e-commerce app built with Expo and React Native (iOS, Android, web).

## Features

- Customer storefront, cart/checkout, auth, rewards, delivery dashboard, and admin tools
- React Navigation with role-based guards
- Razorpay checkout integration
- Responsive web layout aligned with `kankreg.html` design tokens

## Run

```bash
npm install
npm run start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

### Backend connection (all live data)

1. **Start MongoDB**, then from `backend/` (use the **exact** database name casing from Atlas — e.g. `Zeevan` not `zeevan`; optional `MONGO_DB_NAME=Zeevan` in `backend/.env`):
   ```bash
   npm install
   cp .env.example .env   # set MONGO_URI, JWT_SECRET, Cloudinary, Razorpay
   npm run dev
   ```
2. **App root `.env`:** `EXPO_PUBLIC_API_URL=http://127.0.0.1:5001` (must match backend port).
3. Restart Expo after changing env (`npx expo start --clear`). A **“Cannot reach server”** banner means the API is down or the URL is wrong.

Authenticated requests use `apiClient` (auto refresh on 401). Public catalog uses `GET /products` and `GET /home-view`.

### Populating the store (no fake catalog on the customer app)

- **Products:** Admin → **Products** / **Add product** (categories come from each product’s `category` field).
- **Home hero & sections:** Admin → **Home view** (saved in MongoDB `HomeViewConfig`; `GET /home-view` creates defaults on first request).
- Trust strip, marquee, and brand quote copy stay in `src/content/appContent.js` (not CMS).
- An empty database shows real empty states — not placeholder category tiles.

### API URL (fix “Route not found” / 404)

1. **Start the backend** from `backend/` (default port **5001**): `npm run dev`
2. **Optional:** create `.env` in the app root with:
   - `EXPO_PUBLIC_API_URL=http://127.0.0.1:5001` (local)
   - Or, if your API is under a path: `EXPO_PUBLIC_API_URL=https://yourdomain.com/api`
3. **Production builds** default to `https://novarosolution.com/api`. If your API is at the **domain root** (e.g. `https://novarosolution.com/products`), set:
   - `EXPO_PUBLIC_API_URL=https://novarosolution.com`
4. Restart Expo after changing `.env`.

The server exposes routes at both `/products` and `/api/products` (same for users, orders, admin, etc.).

### Razorpay (online checkout)

Set **`EXPO_PUBLIC_RAZORPAY_KEY_ID`** in the app root `.env` to the same **Key ID** as backend `RAZORPAY_KEY_ID` (safe to expose — it is public). Restart Expo after changing. The backend still requires `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET`; see `backend/README.md`.

### Google / Apple sign-in (optional)

Until these are set, Login and Register show disabled social buttons with a “Coming soon” hint (email/password still works).

**App root `.env`:**

- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — required for Google on web
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` — native Google
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID` — Expo Go fallback
- `EXPO_PUBLIC_APPLE_CLIENT_ID` — Apple Sign In (iOS / web)

**Backend `backend/.env`:** `GOOGLE_OAUTH_CLIENT_ID` (comma-separated client IDs), optional `APPLE_CLIENT_ID` / `APPLE_BUNDLE_ID`. See `backend/.env.example`.

Restart Expo with `npx expo start --clear` after changing env vars.

## Deploy (Vercel — web storefront)

The web app is a static export (`npm run export:web` → `dist/`). `vercel.json` is already set for that build and SPA deep links (`/shop`, `/cart`, `/admin`, etc.).

1. Import the GitHub repo in [Vercel](https://vercel.com) (root directory `.`, framework **Other**).
2. Set **Environment variables** for Production (and Preview if needed). They are baked in at build time:
   - `EXPO_PUBLIC_API_URL` — your live API base (e.g. `https://novarosolution.com/api`)
   - `EXPO_PUBLIC_RAZORPAY_KEY_ID` — Razorpay Key ID (same as backend `RAZORPAY_KEY_ID`)
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — optional; enables Google sign-in on web
3. Deploy. Vercel runs `npm run export:web` and serves `dist/`.

**Backend** (Node + MongoDB in `backend/`) is not deployed by this project config — host it separately (VPS, Railway, Render, etc.) and point `EXPO_PUBLIC_API_URL` at it.

**After first deploy:** add your Vercel URL to Google OAuth authorized JavaScript origins / redirect URIs if you use Google login.

Local check before pushing:

```bash
npm run export:web
npx serve dist
```

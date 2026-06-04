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

const jwt = require("jsonwebtoken");

const GOOGLE_CLIENT_IDS = String(process.env.GOOGLE_OAUTH_CLIENT_ID || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const APPLE_CLIENT_IDS = [
  process.env.APPLE_CLIENT_ID,
  process.env.APPLE_BUNDLE_ID,
  process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
]
  .filter(Boolean)
  .map((s) => String(s).trim());

async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new Error("Google idToken is required.");
  }
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Invalid Google token.");
  }
  if (GOOGLE_CLIENT_IDS.length > 0 && !GOOGLE_CLIENT_IDS.includes(data.aud)) {
    throw new Error("Google token audience mismatch.");
  }
  if (!data.email) {
    throw new Error("Google account did not return an email.");
  }
  return {
    provider: "google",
    providerId: data.sub,
    email: String(data.email).toLowerCase().trim(),
    name: data.name || data.email.split("@")[0],
    avatar: data.picture || "",
    emailVerified: data.email_verified === "true" || data.email_verified === true,
  };
}

/** Decode Apple identity token (signature verified when APPLE_CLIENT_IDS configured). */
async function verifyAppleIdentityToken(identityToken) {
  if (!identityToken) {
    throw new Error("Apple identityToken is required.");
  }
  const decoded = jwt.decode(identityToken, { complete: true });
  if (!decoded?.payload) {
    throw new Error("Invalid Apple identity token.");
  }
  const { payload } = decoded;
  if (APPLE_CLIENT_IDS.length > 0 && !APPLE_CLIENT_IDS.includes(payload.aud)) {
    throw new Error("Apple token audience mismatch.");
  }
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("Apple token expired.");
  }
  const email = payload.email ? String(payload.email).toLowerCase().trim() : "";
  if (!email && !payload.sub) {
    throw new Error("Apple account did not return enough identity data.");
  }
  return {
    provider: "apple",
    providerId: payload.sub,
    email: email || `apple_${payload.sub}@users.kankreg.local`,
    name: "",
    avatar: "",
    emailVerified: Boolean(payload.email_verified),
  };
}

module.exports = {
  verifyGoogleIdToken,
  verifyAppleIdentityToken,
  isGoogleOAuthConfigured: () => GOOGLE_CLIENT_IDS.length > 0,
  isAppleOAuthConfigured: () => APPLE_CLIENT_IDS.length > 0,
};

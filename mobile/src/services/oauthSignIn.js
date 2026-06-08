import { Platform } from "react-native";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";

WebBrowser.maybeCompleteAuthSession();

function getExtra() {
  return Constants.expoConfig?.extra || Constants.manifest?.extra || {};
}

function normalizeClientId(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getGoogleClientIds() {
  const extra = getExtra();
  return {
    webClientId: normalizeClientId(
      extra.googleOAuthWebClientId || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    ),
    iosClientId: normalizeClientId(
      extra.googleOAuthIosClientId || process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
    ),
    androidClientId: normalizeClientId(
      extra.googleOAuthAndroidClientId || process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
    ),
    expoClientId: normalizeClientId(
      extra.googleOAuthClientId || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
    ),
  };
}

export function isGoogleSignInConfigured() {
  const ids = getGoogleClientIds();
  if (Platform.OS === "web") {
    return Boolean(ids.webClientId);
  }
  if (Platform.OS === "ios") {
    return Boolean(ids.iosClientId || ids.expoClientId);
  }
  if (Platform.OS === "android") {
    return Boolean(ids.androidClientId || ids.expoClientId);
  }
  return Boolean(ids.webClientId || ids.iosClientId || ids.androidClientId || ids.expoClientId);
}

export function isAppleSignInConfigured() {
  if (Platform.OS !== "ios" && Platform.OS !== "web") {
    return false;
  }
  const extra = getExtra();
  return Boolean(
    normalizeClientId(extra.appleOAuthClientId || process.env.EXPO_PUBLIC_APPLE_CLIENT_ID)
  );
}

export function isOAuthSocialConfigured() {
  return isGoogleSignInConfigured() || isAppleSignInConfigured();
}

/** Hook for Google id_token flow — only mount via GoogleSignInButtonInner when configured. */
export function useGoogleIdTokenAuthRequest() {
  const ids = getGoogleClientIds();
  const clientId =
    Platform.OS === "web"
      ? ids.webClientId
      : ids.expoClientId || ids.iosClientId || ids.androidClientId;

  return Google.useIdTokenAuthRequest({
    clientId,
    iosClientId: ids.iosClientId,
    androidClientId: ids.androidClientId,
    webClientId: ids.webClientId,
  });
}

export async function signInWithAppleNative() {
  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw new Error("Apple Sign In is not available on this device.");
  }
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  if (!credential.identityToken) {
    throw new Error("Apple Sign In did not return a token.");
  }
  return {
    identityToken: credential.identityToken,
    fullName: credential.fullName,
  };
}

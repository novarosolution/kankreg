import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

export const APP_ICON_PREF_KEY = "@kankreg_app_icon_pref";

/** @typedef {"auto" | "light" | "dark"} AppIconPreference */

export const APP_ICON_PREF = {
  auto: "auto",
  light: "light",
  dark: "dark",
};

export const APP_ICON_ASSETS = {
  light: require("../../assets/app-icon-light.png"),
  dark: require("../../assets/app-icon-dark.png"),
};

export function isAppIconChangeSupported() {
  return Platform.OS === "ios" || Platform.OS === "android";
}

/** Launcher icon swap needs a dev build — not available in Expo Go. */
export function isDynamicAppIconAvailable() {
  return isAppIconChangeSupported() && !isRunningInExpoGo();
}

/** @returns {Promise<AppIconPreference>} */
export async function getAppIconPreference() {
  try {
    const stored = await AsyncStorage.getItem(APP_ICON_PREF_KEY);
    if (stored === APP_ICON_PREF.light || stored === APP_ICON_PREF.dark || stored === APP_ICON_PREF.auto) {
      return stored;
    }
  } catch {
    // ignore
  }
  return APP_ICON_PREF.auto;
}

/** @param {AppIconPreference} pref */
export async function setAppIconPreference(pref) {
  if (pref !== APP_ICON_PREF.light && pref !== APP_ICON_PREF.dark && pref !== APP_ICON_PREF.auto) {
    return;
  }
  try {
    await AsyncStorage.setItem(APP_ICON_PREF_KEY, pref);
  } catch {
    // ignore
  }
}

/** @param {AppIconPreference} pref @param {boolean} isDark */
export function resolveAppIconName(pref, isDark) {
  if (pref === APP_ICON_PREF.light) return "light";
  if (pref === APP_ICON_PREF.dark) return "dark";
  return isDark ? "dark" : "light";
}

/**
 * Apply launcher icon on device. Requires a dev/production build with prebuild.
 * @param {AppIconPreference} pref
 * @param {boolean} isDark
 */
export async function applyAppIcon(pref, isDark) {
  if (!isAppIconChangeSupported()) {
    return { ok: false, reason: "unsupported_platform" };
  }
  if (!isDynamicAppIconAvailable()) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    const { setAppIcon } = await import("@howincodes/expo-dynamic-app-icon");
    const name = resolveAppIconName(pref, isDark);
    const result = await setAppIcon(name, false);
    if (result === false) {
      return { ok: false, reason: "native_failed", name };
    }
    return { ok: true, name: result || name };
  } catch (err) {
    return { ok: false, reason: "unavailable", error: err?.message || String(err) };
  }
}

/** @returns {Promise<string | null>} */
export async function getCurrentNativeAppIcon() {
  if (!isDynamicAppIconAvailable()) return null;
  try {
    const { getAppIcon } = await import("@howincodes/expo-dynamic-app-icon");
    return await getAppIcon();
  } catch {
    return null;
  }
}

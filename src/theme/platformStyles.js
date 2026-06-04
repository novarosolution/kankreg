import { platformShadow } from "./shadowPlatform";

/**
 * Cross-platform elevation — boxShadow on web, native shadows on iOS, elevation on Android.
 * Prefer resolving via platformShadow() before StyleSheet.create (avoids RNW shadow* warnings).
 */
export const platformElevation = platformShadow;
export { platformShadow };

/** Vertical gap between major page sections. */
export const sectionStackGap = 22;

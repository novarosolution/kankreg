import { Platform } from "react-native";

/** Web: use boxShadow. Native: use shadow* / elevation. */
export function platformShadow({ web, ios, android, default: fallback }) {
  if (Platform.OS === "web") {
    return web ?? fallback ?? {};
  }
  if (Platform.OS === "ios") {
    return ios ?? fallback ?? {};
  }
  return android ?? fallback ?? ios ?? {};
}

/** Alias for layout panels (auth, pills). */
export const platformElevation = platformShadow;

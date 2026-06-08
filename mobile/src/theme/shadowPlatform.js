import { Platform } from "react-native";

/** Web: use boxShadow. Native: use shadow* / elevation. */
export function platformShadow({ web, ios, android, default: fallback }) {
  if (Platform.OS === "web") {
    return shadowStyleForPlatform(web ?? fallback ?? {});
  }
  if (Platform.OS === "ios") {
    return ios ?? fallback ?? {};
  }
  return android ?? fallback ?? ios ?? {};
}

/** Alias for layout panels (auth, pills). */
export const platformElevation = platformShadow;

/** On web, drop shadow* / elevation so RN does not warn — keep boxShadow only. */
export function shadowStyleForPlatform(style) {
  if (!style || Platform.OS !== "web") return style ?? {};
  const {
    shadowColor: _sc,
    shadowOffset: _so,
    shadowOpacity: _sp,
    shadowRadius: _sr,
    elevation: _el,
    ...rest
  } = style;
  return rest;
}

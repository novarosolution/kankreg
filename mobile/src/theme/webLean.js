import { Platform } from "react-native";

/** Customer web: catalog + account first — hide redundant marketing chrome. */
export function isWebLean() {
  return Platform.OS === "web";
}

export function webEyebrow(value) {
  return isWebLean() ? undefined : value;
}

export function webSubtitle(value) {
  return isWebLean() ? undefined : value;
}

export function webOverline(value) {
  return isWebLean() ? undefined : value;
}

import { Platform } from "react-native";
import { NATIVE_HEADER_HEIGHT, WEB_CHROME_TOP } from "./web";

/** Total chrome height for scroll padding (web: fixed; native: safe area + bar). */
export function getKankregChromeTop(insets) {
  if (Platform.OS === "web") return WEB_CHROME_TOP;
  return (insets?.top || 0) + NATIVE_HEADER_HEIGHT;
}

import { Platform } from "react-native";

let refreshTimer = null;
let refreshRaf = null;

/** Native: no-op. Web uses scrollTriggerRefresh.web.js. */
export function scheduleScrollTriggerRefresh() {
  if (Platform.OS !== "web") return;
}

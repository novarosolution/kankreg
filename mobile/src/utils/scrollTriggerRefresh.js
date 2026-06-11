import { Platform } from "react-native";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let refreshTimer = null;
let refreshRaf = null;

/** Debounced ScrollTrigger.refresh — avoids N sections each forcing a full layout pass. */
export function scheduleScrollTriggerRefresh() {
  if (Platform.OS !== "web" || typeof globalThis === "undefined") return;

  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    if (refreshRaf) cancelAnimationFrame(refreshRaf);
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = null;
      ScrollTrigger.refresh();
    });
  }, 120);
}

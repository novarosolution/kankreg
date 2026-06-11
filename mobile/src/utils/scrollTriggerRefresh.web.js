import { Platform } from "react-native";
import { getScrollTrigger } from "./loadGsap";

let refreshTimer = null;
let refreshRaf = null;

/** Debounced ScrollTrigger.refresh — dynamic GSAP load (not in main bundle). */
export function scheduleScrollTriggerRefresh() {
  if (Platform.OS !== "web" || typeof globalThis === "undefined") return;

  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    if (refreshRaf) cancelAnimationFrame(refreshRaf);
    refreshRaf = requestAnimationFrame(async () => {
      refreshRaf = null;
      const ScrollTrigger = await getScrollTrigger();
      ScrollTrigger?.refresh?.();
    });
  }, 120);
}

import { useEffect, useState } from "react";
import { Platform } from "react-native";

const MIN_SCROLL_RANGE = 400;

/**
 * Web-only: true once the page's main scroll container has scrolled past `threshold`.
 * RN Web's actual scroller is a nested overflow:auto div, and `scroll` events don't
 * bubble — a capture-phase listener on `document` still sees them from any descendant.
 * Ignores small/horizontal scrollers (e.g. the community reel) via a scroll-range guard.
 */
export default function usePageScrollElevation(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return undefined;

    const onScroll = (event) => {
      const target = event.target;
      if (target === document || target === globalThis.window) {
        const y = globalThis.window?.scrollY || document.documentElement?.scrollTop || 0;
        setScrolled(y > threshold);
        return;
      }
      if (!target || typeof target.scrollTop !== "number") return;
      const range = (target.scrollHeight || 0) - (target.clientHeight || 0);
      if (range < MIN_SCROLL_RANGE) return;
      setScrolled(target.scrollTop > threshold);
    };

    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, [threshold]);

  return Platform.OS === "web" ? scrolled : false;
}

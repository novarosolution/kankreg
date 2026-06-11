import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

/**
 * Web: defer heavy children until near viewport (IntersectionObserver).
 * Native: always visible — no observer overhead.
 */
export default function useWhenVisible({ rootMargin = "320px", once = true } = {}) {
  const [visible, setVisible] = useState(Platform.OS !== "web");
  const ref = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "web" || visible) return undefined;
    if (typeof globalThis.IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, visible]);

  return { ref, visible };
}

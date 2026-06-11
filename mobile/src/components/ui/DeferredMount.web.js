import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

/** Web: mount heavy subtrees when near the viewport (saves main-thread work on load). */
export default function DeferredMount({ children, minHeight = 160, rootMargin = "280px 0px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const node = ref.current;
    if (!node) return undefined;

    const target =
      typeof node === "object" && node.getBoundingClientRect
        ? node
        : node._nativeNode || node;

    if (!target?.getBoundingClientRect) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (!visible) {
    return <View ref={ref} style={[styles.placeholder, { minHeight }]} />;
  }

  return <View ref={ref}>{children}</View>;
}

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
  },
});

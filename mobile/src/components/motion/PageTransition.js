import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useReducedMotion from "../../hooks/useReducedMotion";

const WEB_DURATION = 320;
const WEB_DISTANCE = 12;

/**
 * Screen-level focus transition on navigation.
 * - Web: CSS fade + slide-up (skips first focus).
 * - Native: static wrapper (Reanimated remount/entering races Fabric on Android).
 * - Reduced motion: passthrough.
 */
export default function PageTransition({
  children,
  style,
  distance = WEB_DISTANCE,
  duration = WEB_DURATION,
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const firstFocusRef = useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (reducedMotion) return undefined;

      if (Platform.OS === "web") {
        const node = ref.current;
        if (!node || typeof node.style === "undefined") return undefined;

        if (firstFocusRef.current) {
          firstFocusRef.current = false;
          return undefined;
        }
        const prevTransition = node.style.transition;
        node.style.transition = "none";
        node.style.opacity = "0";
        node.style.transform = `translateY(${distance}px)`;
        const raf = globalThis.requestAnimationFrame?.(() => {
          node.style.transition = `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          node.style.opacity = "1";
          node.style.transform = "translateY(0)";
        });
        return () => {
          if (raf != null && typeof globalThis.cancelAnimationFrame === "function") {
            globalThis.cancelAnimationFrame(raf);
          }
          node.style.transition = prevTransition || "";
        };
      }

      return undefined;
    }, [distance, duration, reducedMotion]),
  );

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = ref.current;
    if (!node || typeof node.style === "undefined") return;
    if (reducedMotion) {
      node.style.opacity = "1";
      node.style.transform = "translateY(0)";
    }
  }, [reducedMotion]);

  if (reducedMotion || Platform.OS !== "web") {
    return <View style={[styles.fill, style]}>{children}</View>;
  }

  return (
    <View ref={ref} style={[styles.fill, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: "100%",
    minHeight: 0,
  },
});

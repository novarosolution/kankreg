import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import useReducedMotion from "../../hooks/useReducedMotion";
import { motionDuration } from "../../theme/motion";

const WEB_DURATION = 320;
const WEB_DISTANCE = 12;
const NATIVE_DURATION = motionDuration.base;

/**
 * Screen-level focus transition on navigation.
 * - Web: CSS fade + slide-up (skips first focus).
 * - Native: Reanimated FadeInDown on refocus (skips first focus).
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
  const [nativeKey, setNativeKey] = useState(0);

  const bumpNative = useCallback(() => {
    setNativeKey((k) => k + 1);
  }, []);

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

      if (firstFocusRef.current) {
        firstFocusRef.current = false;
        return undefined;
      }
      bumpNative();
      return undefined;
    }, [distance, duration, reducedMotion, bumpNative]),
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

  if (reducedMotion) {
    return <View style={[styles.fill, style]}>{children}</View>;
  }

  if (Platform.OS !== "web") {
    const entering = FadeInDown.duration(NATIVE_DURATION).springify().damping(20).stiffness(240);
    return (
      <Animated.View key={nativeKey} entering={entering} style={[styles.fill, style]}>
        {children}
      </Animated.View>
    );
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

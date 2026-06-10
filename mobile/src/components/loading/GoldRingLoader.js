import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";
import { getLoadingPalette, LOADING_THEME } from "../../theme/loadingTheme";
import useReducedMotion from "../../hooks/useReducedMotion";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";

const RING_CSS_ID = "kankreg-ring-spin";
const RING_CLASS = "kankreg-ring-loader";

/** Gold conic ring — full-screen / launch waits (HTML loader kit). */
export default function GoldRingLoader({ size = 54, color, style, light = false }) {
  const { colors: c, isDark } = useTheme();
  const palette = getLoadingPalette(isDark, c);
  const reducedMotion = useReducedMotion();
  const spin = useSharedValue(0);
  const ringColor = light ? "#fff" : color || palette.ring;

  useEffect(() => {
    if (reducedMotion) return undefined;
    spin.value = withRepeat(
      withTiming(360, { duration: LOADING_THEME.ringDurationMs, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(spin);
  }, [reducedMotion, spin]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  if (Platform.OS === "web" && !reducedMotion) {
    return (
      <View
        className={RING_CLASS}
        style={[
          styles.webRing,
          {
            width: size,
            height: size,
            background: `conic-gradient(from 90deg, transparent 0 18%, ${ringColor})`,
          },
          style,
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.nativeRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderTopColor: ringColor,
          borderRightColor: ringColor,
        },
        !reducedMotion && spinStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  webRing: {
    borderRadius: 999,
    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)",
    mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)",
  },
  nativeRing: {
    borderWidth: 4,
    borderColor: "transparent",
  },
});

injectWebCssOnce(
  RING_CSS_ID,
  `@keyframes kankregRingSpin { to { transform: rotate(360deg); } }
.${RING_CLASS} { animation: kankregRingSpin 1s linear infinite; }`
);

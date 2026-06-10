import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";
import { getLoadingPalette, LOADING_THEME } from "../../theme/loadingTheme";
import useReducedMotion from "../../hooks/useReducedMotion";

function Dot({ delay = 0, size = 8, color = LOADING_THEME.gold }) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (reducedMotion) {
      scale.value = 1;
      opacity.value = 1;
      return undefined;
    }
    const anim = withRepeat(
      withSequence(
        withTiming(1, { duration: LOADING_THEME.dotsDurationMs * 0.33 }),
        withTiming(0.6, { duration: LOADING_THEME.dotsDurationMs * 0.67 })
      ),
      -1,
      false
    );
    scale.value = withDelay(delay, anim);
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 240 }), withTiming(0.4, { duration: 960 })),
        -1,
        false
      )
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay, opacity, reducedMotion, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    />
  );
}

/** Three bouncing dots — inline / button loading. */
export default function BouncingDots({ size = 8, color, style }) {
  const { colors: c, isDark } = useTheme();
  const palette = getLoadingPalette(isDark, c);
  const dotColor = color || palette.dot;
  return (
    <View style={[styles.row, style]} accessibilityRole="progressbar" accessibilityLabel="Loading">
      <Dot delay={0} size={size} color={dotColor} />
      <Dot delay={180} size={size} color={dotColor} />
      <Dot delay={360} size={size} color={dotColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  dot: {},
});

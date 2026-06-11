import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing as ReanimatedEasing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";
import { FIGMA } from "../../theme/figmaApp";
import { fonts, typography } from "../../theme/tokens";
import { getOrderStatusLabel, isCancelledOrder, isDeliveredOrder } from "../../utils/orderStatus";
import useReducedMotion from "../../hooks/useReducedMotion";

/** Animated status pill for order cards. */
export default function OrderStatusChip({ status, style }) {
  const { colors: c, isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const s = String(status || "");
  const isDel = isDeliveredOrder(s);
  const isCan = isCancelledOrder(s);
  const targetState = isDel ? 2 : isCan ? 1 : 0;
  const stateAnim = useSharedValue(targetState);

  useEffect(() => {
    if (reducedMotion) {
      stateAnim.value = targetState;
      return;
    }
    stateAnim.value = withTiming(targetState, {
      duration: 360,
      easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
    });
  }, [targetState, stateAnim, reducedMotion]);

  const animatedChipStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      stateAnim.value,
      [0, 1, 2],
      [c.primarySoft, "rgba(220, 38, 38, 0.08)", c.secondarySoft]
    );
    const border = interpolateColor(
      stateAnim.value,
      [0, 1, 2],
      [c.primaryBorder, c.danger, c.secondaryBorder]
    );
    return { backgroundColor: bg, borderColor: border };
  });

  return (
    <Animated.View style={[styles.chip, animatedChipStyle, style]}>
      <Text style={[styles.text, { color: isDark ? c.textPrimary : FIGMA.ink }]}>
        {getOrderStatusLabel(s)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: typography.overline,
    letterSpacing: 0.2,
  },
});

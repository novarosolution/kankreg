import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { fonts } from "../../theme/tokens";
import { FIGMA } from "../../theme/figmaApp";

function Dot({ delay, color }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 320, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 320, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.Text style={[styles.dot, { color }, style]}>.</Animated.Text>;
}

/** Animated ellipsis after "Finding location". */
export default function NativeFindingDots({ color = FIGMA.inkSoft }) {
  if (Platform.OS === "web") return null;

  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Dot delay={0} color={color} />
      <Dot delay={160} color={color} />
      <Dot delay={320} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 1,
  },
  dot: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 14,
    width: 4,
  },
});

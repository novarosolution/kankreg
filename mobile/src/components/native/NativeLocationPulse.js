import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { FIGMA } from "../../theme/figmaApp";

/** Pulsing pin rings — "finding location" affordance in the home header. */
export default function NativeLocationPulse({ active = false, size = 13 }) {
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const pinScale = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      ring1.value = 0;
      ring2.value = 0;
      pinScale.value = 1;
      return;
    }

    const pulse = (delay) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }),
            withTiming(0, { duration: 0 })
          ),
          -1,
          false
        )
      );

    ring1.value = pulse(0);
    ring2.value = pulse(420);
    pinScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 520, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 520, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [active, pinScale, ring1, ring2]);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: (1 - ring1.value) * 0.55,
    transform: [{ scale: 0.55 + ring1.value * 1.45 }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: (1 - ring2.value) * 0.55,
    transform: [{ scale: 0.55 + ring2.value * 1.45 }],
  }));
  const pinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pinScale.value }],
  }));

  if (Platform.OS === "web") return null;

  return (
    <View style={[styles.wrap, { width: size + 18, height: size + 18 }]}>
      {active ? (
        <>
          <Animated.View style={[styles.ring, ring1Style]} />
          <Animated.View style={[styles.ring, ring2Style]} />
        </>
      ) : null}
      <Animated.View style={pinStyle}>
        <Ionicons name={active ? "location" : "location-outline"} size={size} color={FIGMA.gold} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: FIGMA.gold,
  },
});

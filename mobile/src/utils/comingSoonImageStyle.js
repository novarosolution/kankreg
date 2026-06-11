import { Platform, StyleSheet } from "react-native";

/** Blur + slight zoom so edges stay hidden under the red overlay. */
export function getComingSoonImageBlurStyle(extra = {}) {
  return StyleSheet.flatten([
    Platform.select({
      web: {
        filter: "blur(8px)",
        transform: [{ scale: 1.08 }],
      },
      ios: {
        blurRadius: 10,
        opacity: 0.88,
        transform: [{ scale: 1.06 }],
      },
      android: {
        opacity: 0.55,
        transform: [{ scale: 1.08 }],
      },
      default: {
        opacity: 0.65,
        transform: [{ scale: 1.06 }],
      },
    }),
    extra,
  ]);
}

import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_DISPLAY_NAME } from "../../constants/brand";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";

/** kankreg.html `.brand` + `.dot` */
export default function KankregBrandMark({ onPress, compact = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.hit,
        pressed && { opacity: 0.88 },
        Platform.OS === "web" ? { cursor: "pointer" } : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${APP_DISPLAY_NAME} — Home`}
    >
      <LinearGradient
        colors={["#d9b463", "#9c6b27"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dot}
      />
      <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>{APP_DISPLAY_NAME.toLowerCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    ...Platform.select({
      web: { boxShadow: "0 0 0 4px rgba(169, 119, 46, 0.16)" },
      default: {},
    }),
  },
  wordmark: {
    fontFamily: FONT_DISPLAY,
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0.01,
    color: KANKREG_PALETTE.ink,
    textTransform: "lowercase",
  },
  wordmarkCompact: {
    fontSize: 21,
  },
});

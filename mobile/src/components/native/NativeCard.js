import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { figmaCardShell } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";

/** Figma card surface — use across account, orders, settings */
export default function NativeCard({ children, style }) {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return <View style={style}>{children}</View>;

  return <View style={[figmaCardShell(isDark), styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: "hidden",
  },
});

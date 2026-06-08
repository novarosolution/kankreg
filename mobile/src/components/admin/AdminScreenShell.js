import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { adminScreenRoot } from "../../theme/adminLayout";

/**
 * Admin backdrop — warm dot grid on web (kankreg admin design board).
 */
export default function AdminScreenShell({ children, style }) {
  const { colors: c, isDark } = useTheme();
  const background = isDark ? c.background : "#d9d0c0";

  return (
    <View style={[styles.root, adminScreenRoot({ background }), style]}>
      {!isDark && Platform.OS === "web" ? <View style={styles.dotGrid} pointerEvents="none" /> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    position: "relative",
    ...Platform.select({
      web: { minHeight: 0 },
      default: {},
    }),
  },
  dotGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
    ...Platform.select({
      web: {
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(25,20,15,0.09) 1px, transparent 0)",
        backgroundSize: "26px 26px",
      },
      default: {},
    }),
  },
  content: {
    flex: 1,
    width: "100%",
  },
});

import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { adminScreenRoot } from "../../theme/adminLayout";

/**
 * Flat admin backdrop — no customer gradient orbs.
 * Replaces CustomerScreenShell on all admin tool screens.
 */
export default function AdminScreenShell({ children, style }) {
  const { colors: c, isDark } = useTheme();
  const background = isDark ? c.background : KANKREG_PALETTE.paper;

  return (
    <View style={[styles.root, adminScreenRoot({ background }), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    ...Platform.select({
      web: { minHeight: 0 },
      default: {},
    }),
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, spacing } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";

/** kankreg.html `.kv` key-value grid for profile / checkout details. */
export default function KankregKvGrid({ rows = [] }) {
  const { isXs } = useKankregLayout();
  const { isDark } = useTheme();
  const cols = isXs ? 1 : 2;

  return (
    <View style={[styles.grid, cols === 1 && styles.gridSingle]}>
      {rows.map((row) => (
        <View key={row.key} style={[styles.cell, { width: cols === 1 ? "100%" : "48%" }]}>
          <Text style={[styles.k, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.inkFaint }]}>
            {row.label}
          </Text>
          <Text style={[styles.v, { color: isDark ? "#e8e0d4" : KANKREG_PALETTE.inkSoft }]} numberOfLines={3}>
            {row.value || "—"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md + 2,
  },
  gridSingle: {
    flexDirection: "column",
  },
  cell: {
    minWidth: 120,
  },
  k: {
    fontSize: 11.5,
    fontFamily: fonts.semibold,
    letterSpacing: 0.04,
    textTransform: "uppercase",
  },
  v: {
    fontSize: 15,
    marginTop: 3,
    fontFamily: fonts.medium,
    lineHeight: 22,
  },
});

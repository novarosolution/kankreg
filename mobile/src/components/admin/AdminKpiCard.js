import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

export default function AdminKpiCard({ label, value, delta, deltaUp = true, style }) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      {delta ? (
        <Text style={[styles.delta, deltaUp ? styles.up : styles.down]} numberOfLines={1}>
          {deltaUp ? "▲" : "▼"} {delta}
        </Text>
      ) : null}
    </View>
  );
}

export function AdminKpiGrid({ children, columns = 4, compact = false }) {
  return (
    <View
      style={[
        styles.grid,
        compact && styles.gridCompact,
        columns === 2 && styles.grid2,
        columns === 3 && styles.grid3,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 4,
  },
  gridCompact: {
    gap: 10,
    marginBottom: 2,
  },
  grid2: {},
  grid3: {},
  card: {
    flexGrow: 1,
    flexBasis: Platform.select({ web: "22%", default: "48%" }),
    minWidth: Platform.select({ web: 140, default: 148 }),
    maxWidth: Platform.select({ web: undefined, default: "48%" }),
    backgroundColor: KANKREG_PALETTE.card,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    borderRadius: 14,
    padding: 18,
  },
  label: {
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontFamily: fonts.medium,
  },
  value: {
    fontFamily: FONT_DISPLAY,
    fontSize: 27,
    fontWeight: "600",
    color: KANKREG_PALETTE.ink,
    marginTop: 7,
  },
  delta: {
    fontSize: 11.5,
    fontFamily: fonts.semibold,
    marginTop: 6,
  },
  up: { color: KANKREG_PALETTE.green },
  down: { color: KANKREG_PALETTE.danger },
});

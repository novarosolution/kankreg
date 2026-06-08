import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { fonts, spacing } from "../../theme/tokens";

/** kankreg.html `.reward-hero` */
export default function KankregRewardHero({ points = 0, tierHint }) {
  const { isXs } = useKankregLayout();
  const pct = Math.min(100, Math.round((points % 3000) / 30) || 68);

  return (
    <View style={[styles.hero, isXs && styles.heroStack]}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Your balance</Text>
        <Text style={styles.pts}>
          {points.toLocaleString()}{" "}
          <Text style={styles.ptsUnit}>pts</Text>
        </Text>
        {tierHint ? <Text style={styles.hint}>{tierHint}</Text> : null}
      </View>
      <View style={styles.ring}>
        <View style={styles.ringInner}>
          <Text style={styles.ringPct}>{pct}%</Text>
          <Text style={styles.ringLbl}>to Gold</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: KANKREG_PALETTE.ink,
    borderRadius: 20,
    padding: spacing.lg + 4,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  heroStack: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  copy: { flex: 1, minWidth: 200 },
  eyebrow: {
    color: KANKREG_PALETTE.goldBright,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: fonts.semibold,
  },
  pts: {
    fontFamily: FONT_DISPLAY,
    fontSize: 36,
    color: KANKREG_PALETTE.paper,
    marginTop: 6,
  },
  ptsUnit: {
    fontSize: 20,
    fontFamily: fonts.medium,
  },
  hint: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(245, 239, 228, 0.82)",
    maxWidth: 280,
    lineHeight: 20,
  },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: KANKREG_PALETTE.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: { alignItems: "center" },
  ringPct: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: KANKREG_PALETTE.paper,
  },
  ringLbl: {
    fontSize: 11,
    color: KANKREG_PALETTE.goldBright,
    textAlign: "center",
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

const TONES = {
  paid: { bg: "rgba(60,98,72,0.13)", color: KANKREG_PALETTE.green },
  ok: { bg: "rgba(60,98,72,0.13)", color: KANKREG_PALETTE.green },
  pend: { bg: "rgba(169,119,46,0.15)", color: KANKREG_PALETTE.goldDeep },
  cancel: { bg: "rgba(168,68,47,0.12)", color: KANKREG_PALETTE.danger },
  low: { bg: "rgba(168,68,47,0.12)", color: KANKREG_PALETTE.danger },
};

export function orderStatusTone(status) {
  const s = String(status || "").toLowerCase();
  if (s === "delivered" || s === "paid") return "paid";
  if (s === "cancelled") return "cancel";
  return "pend";
}

export default function AdminStatusPill({ label, tone = "pend", style }) {
  const palette = TONES[tone] || TONES.pend;
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.text, { color: palette.color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  text: {
    fontSize: 10,
    fontFamily: fonts.semibold,
  },
});

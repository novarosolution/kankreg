import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FONT_HEADING } from "../../theme/typographyRoles";
import {
  COMING_SOON_PANEL_GRAD_DARK,
  COMING_SOON_PANEL_GRAD_LIGHT,
  COMING_SOON_RED,
} from "../../theme/comingSoonTheme";
import { fonts, radius } from "../../theme/tokens";
import { PRODUCT_SCREEN } from "../../content/appContent";

/** PDP purchase-area banner when product is coming soon. */
export default function ComingSoonPurchasePanel({ note = "", isDark = false, ink, muted }) {
  const launchNote = String(note || PRODUCT_SCREEN.comingSoonNoteFallback).trim();
  const titleColor = ink || (isDark ? COMING_SOON_RED.ink : COMING_SOON_RED.deep);
  const bodyColor = muted || (isDark ? COMING_SOON_RED.inkMuted : "#7F1D1D");

  return (
    <View style={[styles.shell, isDark && styles.shellDark]}>
      <LinearGradient
        colors={isDark ? COMING_SOON_PANEL_GRAD_DARK : COMING_SOON_PANEL_GRAD_LIGHT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.grad}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="time-outline" size={20} color={COMING_SOON_RED.ink} />
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: titleColor }]}>{PRODUCT_SCREEN.comingSoonTitle}</Text>
            <View style={styles.livePill}>
              <Text style={styles.livePillText}>Preview only</Text>
            </View>
          </View>
          <Text style={[styles.note, { color: bodyColor }]}>{launchNote}</Text>
          <Text style={[styles.hint, { color: bodyColor }]}>{PRODUCT_SCREEN.comingSoonBody}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COMING_SOON_RED.cardBorder,
    ...Platform.select({
      web: { boxShadow: "0 12px 32px rgba(127, 29, 29, 0.12)" },
      default: {},
    }),
  },
  shellDark: {
    borderColor: COMING_SOON_RED.cardBorderDark,
  },
  grad: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COMING_SOON_RED.border,
    backgroundColor: COMING_SOON_RED.mid,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontFamily: FONT_HEADING,
    fontSize: 20,
    letterSpacing: -0.2,
    textTransform: "uppercase",
  },
  livePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: "rgba(127, 29, 29, 0.12)",
    borderWidth: 1,
    borderColor: COMING_SOON_RED.borderStrong,
  },
  livePillText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: COMING_SOON_RED.mid,
  },
  note: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.88,
  },
});

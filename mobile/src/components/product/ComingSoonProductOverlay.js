import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FONT_HEADING } from "../../theme/typographyRoles";
import {
  COMING_SOON_OVERLAY_GRAD,
  COMING_SOON_RED,
  COMING_SOON_RIBBON_GRAD,
} from "../../theme/comingSoonTheme";
import { fonts, icon, radius, spacing } from "../../theme/tokens";
import { SHOP_SCREEN_UI } from "../../content/appContent";

/**
 * Premium coming-soon treatment — blurred image underneath, red veil, white label.
 * `variant="hero"` pins the label to the top of the product page image well.
 */
export default function ComingSoonProductOverlay({
  note = "",
  compact = false,
  isDark = false,
  variant = "card",
}) {
  const launchNote = String(note || SHOP_SCREEN_UI.card.comingSoonNoteFallback).trim();
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <View style={styles.wrapHero} pointerEvents="none">
        <LinearGradient
          colors={[
            "rgba(127, 29, 29, 0.82)",
            "rgba(185, 28, 28, 0.38)",
            "rgba(185, 28, 28, 0.08)",
            "transparent",
          ]}
          locations={[0, 0.22, 0.42, 0.72]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroTopBar}>
          <LinearGradient
            colors={COMING_SOON_RIBBON_GRAD}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroTopGrad}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroTopIcon}>
                <Ionicons name="time-outline" size={icon.md} color={COMING_SOON_RED.ink} />
              </View>
              <View style={styles.heroTopCopy}>
                <Text style={styles.heroTopTitle}>{SHOP_SCREEN_UI.card.comingSoon}</Text>
                {launchNote ? (
                  <Text style={styles.heroTopNote} numberOfLines={2}>
                    {launchNote}
                  </Text>
                ) : null}
              </View>
              <View style={styles.heroTopPill}>
                <Ionicons name="sparkles" size={12} color={COMING_SOON_RED.ink} />
                <Text style={styles.heroTopPillText}>Soon</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      <LinearGradient colors={COMING_SOON_OVERLAY_GRAD} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.redWash, isDark && styles.redWashDark]} />

      <View style={[styles.ribbonWrap, compact && styles.ribbonWrapCompact]}>
        <LinearGradient
          colors={COMING_SOON_RIBBON_GRAD}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ribbon}
        >
          <Ionicons name="time-outline" size={compact ? 10 : 11} color={COMING_SOON_RED.ink} />
          <Text style={styles.ribbonText}>{SHOP_SCREEN_UI.card.comingSoon}</Text>
        </LinearGradient>
      </View>

      <View style={[styles.center, compact && styles.centerCompact]}>
        <View style={[styles.badge, compact && styles.badgeCompact]}>
          <Ionicons name="sparkles" size={compact ? icon.sm : icon.md} color={COMING_SOON_RED.ink} />
          <Text style={[styles.badgeTitle, compact && styles.badgeTitleCompact]}>
            {SHOP_SCREEN_UI.card.comingSoon}
          </Text>
        </View>
        {launchNote ? (
          <Text style={[styles.note, compact && styles.noteCompact]} numberOfLines={2}>
            {launchNote}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  wrapHero: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 6,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  heroTopBar: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: COMING_SOON_RED.border,
    ...Platform.select({
      web: { boxShadow: "0 10px 28px rgba(127, 29, 29, 0.28)" },
      default: {},
    }),
  },
  heroTopGrad: {
    width: "100%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  heroTopIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COMING_SOON_RED.border,
    backgroundColor: "rgba(255, 252, 248, 0.14)",
  },
  heroTopCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  heroTopTitle: {
    fontFamily: FONT_HEADING,
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COMING_SOON_RED.ink,
  },
  heroTopNote: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COMING_SOON_RED.inkMuted,
  },
  heroTopPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: COMING_SOON_RED.border,
    backgroundColor: "rgba(255, 252, 248, 0.12)",
  },
  heroTopPillText: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COMING_SOON_RED.ink,
  },
  redWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(185, 28, 28, 0.14)",
  },
  redWashDark: {
    backgroundColor: "rgba(127, 29, 29, 0.22)",
  },
  ribbonWrap: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 2,
  },
  ribbonWrapCompact: {
    top: spacing.xs,
    left: spacing.xs,
  },
  ribbon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: COMING_SOON_RED.border,
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(127, 29, 29, 0.35)" },
      default: {},
    }),
  },
  ribbonText: {
    color: COMING_SOON_RED.ink,
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  centerCompact: {
    paddingHorizontal: spacing.sm,
    gap: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: COMING_SOON_RED.border,
    backgroundColor: "rgba(127, 29, 29, 0.72)",
    ...Platform.select({
      web: { boxShadow: "0 8px 28px rgba(69, 10, 10, 0.42)" },
      default: {},
    }),
  },
  badgeCompact: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  badgeTitle: {
    fontFamily: FONT_HEADING,
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: COMING_SOON_RED.ink,
  },
  badgeTitleCompact: {
    fontSize: 13,
  },
  note: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
    maxWidth: 180,
    color: COMING_SOON_RED.inkMuted,
  },
  noteCompact: {
    fontSize: 10,
    lineHeight: 13,
    maxWidth: 150,
  },
});

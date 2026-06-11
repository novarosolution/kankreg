import React, { memo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { FONT_HEADING } from "../../theme/typographyRoles";
import {
  COMING_SOON_PANEL_GRAD_DARK,
  COMING_SOON_PANEL_GRAD_LIGHT,
  COMING_SOON_RED,
  COMING_SOON_RIBBON_GRAD,
} from "../../theme/comingSoonTheme";
import { fonts, icon, radius, spacing, typography } from "../../theme/tokens";
import { HOME_SCREEN_UI } from "../../content/appContent";
import { isProductComingSoon } from "../../utils/productAvailability";
import { platformShadow } from "../../theme/shadowPlatform";

/** Premium home strip — highlights products admin marked as coming soon. */
function HomeComingSoonStrip({ products = [] }) {
  const { isDark } = useTheme();
  const copy = HOME_SCREEN_UI.comingSoon;
  const items = (Array.isArray(products) ? products : []).filter(isProductComingSoon);

  if (!items.length) return null;

  return (
    <View
      style={[
        styles.shell,
        isDark ? styles.shellDark : null,
        platformShadow({
          web: {
            boxShadow: isDark
              ? "0 16px 40px rgba(0,0,0,0.35)"
              : "0 14px 36px rgba(127, 29, 29, 0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
          },
          default: {},
        }),
      ]}
    >
      <LinearGradient
        colors={isDark ? COMING_SOON_PANEL_GRAD_DARK : COMING_SOON_PANEL_GRAD_LIGHT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={COMING_SOON_RIBBON_GRAD}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.topAccent}
      />
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="time-outline" size={icon.md} color={COMING_SOON_RED.ink} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.eyebrow, { color: isDark ? "#FCA5A5" : COMING_SOON_RED.mid }]}>
            {copy.stripEyebrow}
          </Text>
          <Text style={[styles.title, { color: isDark ? COMING_SOON_RED.ink : COMING_SOON_RED.deep }]}>
            {copy.stripTitle}
          </Text>
          <Text style={[styles.body, { color: isDark ? COMING_SOON_RED.inkMuted : "#7F1D1D" }]}>
            {copy.stripBody}
          </Text>
        </View>
      </View>
      <View style={styles.chips}>
        {items.slice(0, 4).map((p) => (
          <View key={p.id} style={[styles.chip, isDark ? styles.chipDark : styles.chipLight]}>
            <Text
              style={[styles.chipName, { color: isDark ? COMING_SOON_RED.ink : COMING_SOON_RED.deep }]}
              numberOfLines={1}
            >
              {p.name}
            </Text>
            {p.comingSoonNote ? (
              <Text
                style={[styles.chipNote, { color: isDark ? "#FCA5A5" : COMING_SOON_RED.mid }]}
                numberOfLines={1}
              >
                {p.comingSoonNote}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(HomeComingSoonStrip);

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: COMING_SOON_RED.cardBorder,
    overflow: "hidden",
    marginBottom: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...Platform.select({ web: { maxWidth: "100%" }, default: {} }),
  },
  shellDark: {
    borderColor: COMING_SOON_RED.cardBorderDark,
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
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
    gap: 4,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: FONT_HEADING,
    fontSize: typography.h3,
    letterSpacing: -0.3,
    lineHeight: typography.h3 + 4,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall,
    lineHeight: 20,
    marginTop: 2,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    maxWidth: "100%",
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  chipLight: {
    borderColor: COMING_SOON_RED.cardBorder,
    backgroundColor: "rgba(254, 242, 242, 0.72)",
  },
  chipDark: {
    borderColor: COMING_SOON_RED.cardBorderDark,
    backgroundColor: "rgba(127, 29, 29, 0.28)",
  },
  chipName: {
    fontFamily: fonts.semibold,
    fontSize: typography.bodySmall,
  },
  chipNote: {
    fontFamily: fonts.medium,
    fontSize: typography.caption,
  },
});

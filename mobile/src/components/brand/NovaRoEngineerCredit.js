import React, { useMemo } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_ENGINEER_CREDIT } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, icon, radius, spacing, typography } from "../../theme/tokens";

/**
 * Premium “Created by NovaRo Solution” credit — site footers & auth tails.
 * @param {"light"|"dark"|"ink"} variant
 */
export default function NovaRoEngineerCredit({ variant = "light", compact = false, align = "center" }) {
  const { isDark } = useTheme();
  const copy = APP_ENGINEER_CREDIT;
  const url = String(copy.url || "").trim();
  const name = String(copy.name || "").trim();
  const { styles, gradientColors, iconColor, badgeIcon } = useMemo(
    () => buildStyles(variant, compact, align, isDark),
    [variant, compact, align, isDark]
  );

  if (!name || !url) return null;

  const openSite = () => Linking.openURL(url);

  return (
    <Pressable
      onPress={openSite}
      style={({ pressed, hovered }) => [
        styles.wrap,
        hovered && styles.wrapHover,
        pressed && styles.wrapPressed,
      ]}
      accessibilityRole="link"
      accessibilityLabel={copy.cta || `${copy.eyebrow} ${name}`}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGradient}
      >
        <View style={styles.inner}>
          <View style={styles.copyCol}>
            <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              <Ionicons name="open-outline" size={compact ? 11 : 12} color={iconColor} />
            </View>
            {!compact && copy.tagline ? (
              <Text style={styles.tagline} numberOfLines={1}>
                {copy.tagline}
              </Text>
            ) : null}
          </View>
          {!compact ? (
            <View style={styles.badge}>
              <Ionicons name="sparkles-outline" size={icon.xs} color={badgeIcon} />
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function buildStyles(variant, compact, align, isDark) {
  const isInk = variant === "ink" || variant === "dark";
  const gradientColors =
    variant === "ink"
      ? ["rgba(214, 173, 91, 0.55)", "rgba(116, 79, 28, 0.35)", "rgba(214, 173, 91, 0.2)"]
      : isDark || isInk
        ? ["rgba(232, 200, 90, 0.45)", "rgba(201, 162, 39, 0.2)", "transparent"]
        : ["rgba(201, 162, 39, 0.65)", "rgba(116, 79, 28, 0.18)", "rgba(201, 162, 39, 0.35)"];

  const innerBg =
    variant === "ink"
      ? "rgba(22, 19, 16, 0.92)"
      : isDark
        ? "rgba(255,255,255,0.045)"
        : "rgba(255, 252, 246, 0.96)";

  const eyebrowColor =
    variant === "ink" ? KANKREG_PALETTE.goldBright : isDark ? "rgba(245, 239, 228, 0.62)" : KANKREG_PALETTE.goldDeep;

  const nameColor =
    variant === "ink" ? KANKREG_PALETTE.paper : isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink;

  const taglineColor =
    variant === "ink" ? "#c8bdaf" : isDark ? "rgba(245, 239, 228, 0.55)" : KANKREG_PALETTE.inkSoft;

  const iconColor = variant === "ink" ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.goldDeep;

  const styles = StyleSheet.create({
    wrap: {
      alignSelf: align === "stretch" ? "stretch" : align === "left" ? "flex-start" : "center",
      marginTop: compact ? spacing.sm : spacing.md,
      maxWidth: align === "stretch" ? "100%" : 420,
      width: align === "stretch" ? "100%" : undefined,
      borderRadius: radius.lg,
      ...Platform.select({
        web: { cursor: "pointer", transition: "transform 0.2s ease, opacity 0.2s ease" },
        default: {},
      }),
    },
    wrapHover: Platform.select({
      web: { transform: [{ translateY: -1 }] },
      default: {},
    }),
    wrapPressed: { opacity: 0.88 },
    borderGradient: {
      borderRadius: radius.lg,
      padding: 1,
    },
    inner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      backgroundColor: innerBg,
      borderRadius: radius.lg - 1,
      paddingVertical: compact ? spacing.sm : spacing.sm + 4,
      paddingHorizontal: compact ? spacing.sm + 2 : spacing.md,
    },
    copyCol: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    eyebrow: {
      fontFamily: fonts.semibold,
      fontSize: compact ? 9 : typography.overline,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      color: eyebrowColor,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
    },
    name: {
      fontFamily: fonts.bold,
      fontSize: compact ? typography.bodySmall : typography.body,
      letterSpacing: -0.2,
      color: nameColor,
    },
    tagline: {
      fontFamily: fonts.medium,
      fontSize: typography.caption - 1,
      color: taglineColor,
      marginTop: 1,
    },
    badge: {
      width: compact ? 28 : 34,
      height: compact ? 28 : 34,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        variant === "ink" ? "rgba(214, 173, 91, 0.14)" : isDark ? "rgba(232, 200, 90, 0.12)" : "rgba(201, 162, 39, 0.12)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor:
        variant === "ink" ? "rgba(214, 173, 91, 0.28)" : isDark ? "rgba(232, 200, 90, 0.22)" : "rgba(201, 162, 39, 0.22)",
    },
  });

  return { styles, gradientColors, iconColor, badgeIcon: iconColor };
}

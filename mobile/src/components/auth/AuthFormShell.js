import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { AUTH_UI } from "../../content/appContent";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, lineHeight, spacing, typography } from "../../theme/tokens";
import AuthRoutePills from "./AuthRoutePills";
import GoldHairline from "../ui/GoldHairline";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/**
 * kankreg.html `.auth-form` — title, subtitle, route pills, fields slot, social slot, footer links.
 */
export default function AuthFormShell({
  navigation,
  activeRoute,
  title,
  subtitle,
  children,
  socialSlot,
  footerSlot,
  showRoutePills = true,
  showForgotPassword = false,
  onForgotPassword,
  compact = false,
}) {
  const { isDark } = useTheme();
  const { isXs } = useKankregLayout();
  const isNativeApp = Platform.OS !== "web";

  return (
    <View style={[styles.shell, compact && styles.shellCompact]}>
      {!isNativeApp ? (
        <Text
          style={[
            styles.h1,
            isXs && styles.h1Compact,
            { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink },
          ]}
        >
          {title}
        </Text>
      ) : null}
      {!isNativeApp && subtitle ? (
        <Text style={[styles.sub, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
          {subtitle}
        </Text>
      ) : null}
      {!isNativeApp && showRoutePills && navigation ? (
        <AuthRoutePills navigation={navigation} activeRoute={activeRoute} />
      ) : null}
      <View style={styles.fields}>{children}</View>
      {showForgotPassword ? (
        <Pressable
          onPress={onForgotPassword}
          style={styles.forgotWrap}
          accessibilityRole="button"
        >
          <Text style={[styles.forgot, { color: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold }]}>
            {AUTH_UI.forgotPassword}
          </Text>
        </Pressable>
      ) : null}
      {socialSlot ? (
        <>
          <Text style={[styles.orDivider, { color: isDark ? "#9a8f82" : KANKREG_PALETTE.inkFaint }]}>
            {AUTH_UI.socialDivider}
          </Text>
          {socialSlot}
        </>
      ) : null}
      {footerSlot ? <View style={styles.footer}>{footerSlot}</View> : null}
      <GoldHairline marginVertical={spacing.sm} short />
      <Text style={[styles.trust, { color: isDark ? "#9a8f82" : KANKREG_PALETTE.inkFaint }]}>
        {AUTH_UI.trustLine}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    maxWidth: 468,
    alignSelf: "center",
  },
  shellCompact: {
    maxWidth: "100%",
  },
  h1: {
    fontFamily: FONT_HEADING,
    fontWeight: "400",
    fontSize: Platform.select({ web: 38, default: typography.h1 }),
    lineHeight: Platform.select({ web: 44, default: lineHeight.h1 + 4 }),
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  h1Compact: {
    fontSize: typography.h2 + 2,
    lineHeight: lineHeight.h2 + 4,
  },
  sub: {
    fontSize: typography.bodySmall,
    lineHeight: lineHeight.bodySmall + 2,
    marginBottom: spacing.md,
  },
  fields: {
    width: "100%",
    gap: spacing.sm,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  forgot: {
    fontSize: typography.caption,
    fontFamily: fonts.semibold,
  },
  orDivider: {
    textAlign: "center",
    fontSize: typography.caption,
    marginVertical: spacing.md,
  },
  footer: {
    marginTop: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  trust: {
    fontSize: typography.caption,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});

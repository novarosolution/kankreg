import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts, spacing, typography } from "../../theme/tokens";
import { ALCHEMY } from "../../theme/customerAlchemy";
import { FONT_HEADING_ITALIC } from "../../theme/typographyRoles";
import { useTheme } from "../../context/ThemeContext";
import { BouncingDots, GoldRingLoader } from "../loading";

const SIZE_TOKENS = {
  sm: { useDots: true, titleSize: typography.bodySmall, captionSize: typography.caption },
  md: { useDots: false, ring: 48, titleSize: typography.h3, captionSize: typography.bodySmall },
  lg: { useDots: false, ring: 54, titleSize: typography.h2, captionSize: typography.body },
};

/**
 * Themed loader — gold ring (full wait) or bouncing dots (inline).
 */
function PremiumLoaderBase({ size = "md", caption, hint, inline = false, color, style }) {
  const { colors: c, isDark } = useTheme();
  const tokens = SIZE_TOKENS[size] || SIZE_TOKENS.md;
  const accent = color || (isDark ? ALCHEMY.goldBright : ALCHEMY.gold);
  const styles = useMemo(() => createStyles(c, isDark, inline), [c, isDark, inline]);

  return (
    <View style={[styles.wrap, style]} accessibilityRole="progressbar" accessibilityLabel={caption || "Loading"}>
      {tokens.useDots || inline ? (
        <BouncingDots color={accent} />
      ) : (
        <GoldRingLoader size={tokens.ring} color={accent} />
      )}
      {caption ? (
        <Text style={[styles.caption, { color: c.textPrimary, fontSize: tokens.titleSize }]} numberOfLines={2}>
          {caption}
        </Text>
      ) : null}
      {hint ? (
        <Text style={[styles.hint, { color: c.textMuted, fontSize: tokens.captionSize }]} numberOfLines={3}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(_c, _isDark, inline) {
  return StyleSheet.create({
    wrap: {
      flexDirection: inline ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      gap: inline ? spacing.sm : spacing.sm + 2,
      paddingVertical: inline ? 0 : spacing.lg,
    },
    caption: {
      fontFamily: FONT_HEADING_ITALIC,
      letterSpacing: -0.2,
      textAlign: "center",
      marginTop: inline ? 0 : 4,
    },
    hint: {
      fontFamily: fonts.medium,
      textAlign: "center",
      maxWidth: 320,
    },
  });
}

const PremiumLoader = memo(PremiumLoaderBase);

export default PremiumLoader;

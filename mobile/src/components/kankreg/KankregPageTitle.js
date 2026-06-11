import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { FIGMA, figmaDisplayTitle, figmaEyebrow } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, spacing } from "../../theme/tokens";

/** figmaforkankreg.html — eyebrow + serif page title (app + web) */
export default function KankregPageTitle({ eyebrow, title, subtitle, right, style, compact = false }) {
  const { isDark } = useTheme();
  const { pageGutterClamp } = useKankregLayout();
  const gutter = Platform.OS === "web" ? pageGutterClamp : FIGMA.gutter;

  return (
    <View
      style={[
        styles.wrap,
        compact && styles.wrapCompact,
        { paddingHorizontal: gutter },
        style,
      ]}
    >
      <View style={styles.textCol}>
        {eyebrow ? <Text style={figmaEyebrow(isDark)}>{eyebrow}</Text> : null}
        <Text style={[figmaDisplayTitle(compact ? 20 : 22, isDark), eyebrow && styles.titleTight]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: isDark ? "rgba(245,239,228,0.62)" : FIGMA.inkSoft }]} numberOfLines={3}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 2,
    paddingBottom: spacing.sm + 2,
    gap: spacing.sm,
  },
  wrapCompact: {
    paddingBottom: spacing.xs,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  titleTight: {
    marginTop: 4,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 520,
  },
  right: {
    flexShrink: 0,
  },
});

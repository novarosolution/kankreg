import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FIGMA, figmaDisplayTitle, figmaEyebrow } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { HOME_SCREEN_UI } from "../../content/appContent";
import { fonts, spacing } from "../../theme/tokens";

export default function NativeSectionHeader({
  title,
  eyebrow,
  actionLabel = HOME_SCREEN_UI.categories.action,
  onAction,
  tight = false,
}) {
  const { isDark } = useTheme();
  const { isMobileWeb, pageGutterClamp } = useKankregLayout();
  if (Platform.OS === "web" && !isMobileWeb) return null;

  const gutter = isMobileWeb ? pageGutterClamp : FIGMA.gutter;

  return (
    <View
      style={[
        styles.row,
        tight && styles.rowTight,
        { marginHorizontal: gutter },
      ]}
    >
      <View style={styles.titleCol}>
        {eyebrow ? <Text style={figmaEyebrow(isDark)}>{eyebrow}</Text> : null}
        <Text style={figmaDisplayTitle(16, isDark)}>{title}</Text>
      </View>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.action, { color: isDark ? FIGMA.goldBright : FIGMA.goldDeep }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: spacing.md + 6,
    marginBottom: spacing.sm + 4,
    paddingHorizontal: 2,
  },
  rowTight: {
    marginTop: spacing.sm,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  action: {
    fontFamily: fonts.semibold,
    fontSize: 10,
  },
});

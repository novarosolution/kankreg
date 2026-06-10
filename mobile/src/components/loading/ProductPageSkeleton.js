import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FIGMA } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";
import { getLoadingPalette } from "../../theme/loadingTheme";
import SkeletonBlock from "../ui/SkeletonBlock";
import BouncingDots from "./BouncingDots";

/** Product screen loading — HTML frame 03. */
export default function ProductPageSkeleton({ showBuyBar = true }) {
  const insets = useSafeAreaInsets();
  const { colors: c, isDark } = useTheme();
  const palette = useMemo(() => getLoadingPalette(isDark, c), [isDark, c]);
  const styles = useMemo(() => createStyles(c, isDark), [c, isDark]);

  return (
    <View style={styles.wrap}>
      <View style={[styles.topRow, { paddingTop: Math.max(insets.top, spacing.xs) }]}>
        <SkeletonBlock width={34} height={34} rounded="full" />
        <SkeletonBlock width={34} height={34} rounded="full" />
      </View>

      <View style={styles.body}>
        <SkeletonBlock width="100%" height={230} rounded="xl" />
        <BouncingDots color={palette.dot} style={styles.dots} />
        <SkeletonBlock width={80} height={18} rounded="pill" style={styles.gapSm} />
        <SkeletonBlock width="75%" height={22} rounded="md" style={styles.gapMd} />
        <SkeletonBlock width="55%" height={22} rounded="md" style={styles.gapSm} />
        <SkeletonBlock width="38%" height={18} rounded="md" style={styles.gapLg} />
        <SkeletonBlock width="100%" height={11} rounded="sm" />
        <SkeletonBlock width="90%" height={11} rounded="sm" style={styles.gapXs} />
        <SkeletonBlock width="60%" height={11} rounded="sm" style={styles.gapXs} />
      </View>

      {showBuyBar ? (
        <View style={[styles.buyBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <View>
            <SkeletonBlock width={30} height={8} rounded="sm" />
            <SkeletonBlock width={60} height={16} rounded="sm" style={styles.gapXs} />
          </View>
          <SkeletonBlock height={44} rounded="pill" style={styles.buyCta} />
        </View>
      ) : null}
    </View>
  );
}

function createStyles(c, isDark) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      backgroundColor: isDark ? c.background : FIGMA.paper,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: FIGMA.gutter,
      paddingBottom: spacing.xs,
    },
    body: {
      flex: 1,
      paddingHorizontal: FIGMA.gutter,
      paddingTop: spacing.sm,
    },
    dots: {
      marginTop: spacing.sm + 2,
      marginBottom: spacing.xs,
    },
    gapXs: { marginTop: 8 },
    gapSm: { marginTop: 10 },
    gapMd: { marginTop: 12 },
    gapLg: { marginTop: 14 },
    buyBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? c.border : FIGMA.line,
      paddingHorizontal: 18,
      paddingTop: 12,
      backgroundColor: isDark ? c.surface : FIGMA.card,
      ...Platform.select({
        ios: {
          shadowColor: isDark ? "#000" : "#3D2A12",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.2 : 0.06,
          shadowRadius: 12,
        },
        android: { elevation: 8 },
        default: {},
      }),
    },
    buyCta: {
      flex: 1,
    },
  });
}

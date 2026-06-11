import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { FIGMA } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import SkeletonBlock from "../ui/SkeletonBlock";
import useLoadingShell from "./useLoadingShell";

/** Home loading — HTML frame 02 (native + web). */
export default function HomePageSkeleton({ showHeader = true }) {
  const shell = useLoadingShell();
  const { width, isMobileWeb } = useKankregLayout();
  const heroSkeletonHeight =
    Platform.OS === "web" && isMobileWeb
      ? Math.min(720, Math.max(420, Math.round(width * 0.62)))
      : 150;

  return (
    <View style={[styles.wrap, shell.wrap]}>
      {showHeader ? (
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <SkeletonBlock width={54} height={8} rounded="sm" />
            <SkeletonBlock width={96} height={13} rounded="sm" style={styles.gapXs} />
          </View>
          <SkeletonBlock width={36} height={36} rounded="full" />
          <SkeletonBlock width={36} height={36} rounded="full" />
        </View>
      ) : null}

      <View style={[styles.content, !showHeader && styles.contentFlush]}>
        <SkeletonBlock width="100%" height={heroSkeletonHeight} rounded="xl" />

        <View style={styles.sectionHead}>
          <SkeletonBlock width={90} height={14} rounded="sm" />
          <SkeletonBlock width={44} height={10} rounded="sm" />
        </View>

        <View style={styles.catRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.catCell}>
              <SkeletonBlock width={78} height={78} rounded={14} />
              <SkeletonBlock width={50} height={8} rounded="sm" style={styles.gapXs} />
            </View>
          ))}
        </View>

        <View style={styles.sectionHead}>
          <SkeletonBlock width={84} height={14} rounded="sm" />
          <SkeletonBlock width={44} height={10} rounded="sm" />
        </View>

        <View style={styles.grid}>
          {[0, 1].map((i) => (
            <View key={i} style={styles.gridCell}>
              <SkeletonBlock width="100%" height={140} rounded={14} />
              <SkeletonBlock width="60%" height={9} rounded="sm" style={styles.gapSm} />
              <SkeletonBlock width="40%" height={12} rounded="sm" style={styles.gapXs} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: FIGMA.gutter,
    paddingTop: 4,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    paddingHorizontal: FIGMA.gutter,
  },
  contentFlush: {
    paddingTop: spacing.xs,
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  catRow: {
    flexDirection: "row",
    gap: 9,
  },
  catCell: {
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    gap: 11,
  },
  gridCell: {
    flex: 1,
    minWidth: 0,
  },
  gapXs: { marginTop: 7 },
  gapSm: { marginTop: 9 },
});

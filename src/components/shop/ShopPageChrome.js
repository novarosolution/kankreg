import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SHOP_SCREEN_UI } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { getKankregChromeTop } from "../kankreg/KankregSiteHeader";
import { fonts, radius, spacing, typography } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";
import GoldHairline from "../ui/GoldHairline";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const cardShadow = platformShadow({
  web: { boxShadow: "0 12px 32px -16px rgba(61, 42, 18, 0.14)" },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  android: { elevation: 3 },
});

export function ShopCollectionPills({ selected, onSelect, pills = SHOP_SCREEN_UI.collectionPills, compact = false }) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.pillRow, compact && styles.pillRowCompact]}>
      {pills.map((p) => {
        const on = selected === p;
        return (
          <Pressable
            key={p}
            onPress={() => onSelect(p)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : KANKREG_PALETTE.paper2,
                borderColor: isDark ? "rgba(232, 200, 90, 0.2)" : KANKREG_PALETTE.line,
              },
              on && styles.pillOn,
              on && isDark && styles.pillOnDark,
              pressed && styles.pillPressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Text
              style={[
                styles.pillText,
                { color: on ? KANKREG_PALETTE.paper : isDark ? "rgba(245, 239, 228, 0.78)" : KANKREG_PALETTE.inkSoft },
              ]}
            >
              {p}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ShopNativeMetaLine({ filtered, total }) {
  const { isDark } = useTheme();
  return (
    <Text style={[styles.nativeMeta, { color: isDark ? "rgba(245, 239, 228, 0.65)" : KANKREG_PALETTE.inkFaint }]}>
      {SHOP_SCREEN_UI.showingPrefix}{" "}
      <Text style={[styles.nativeMetaBold, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
        {filtered}
      </Text>{" "}
      {SHOP_SCREEN_UI.showingOf} {total} {SHOP_SCREEN_UI.showingSuffix}
    </Text>
  );
}

export function ShopTrustStrip() {
  const { isDark } = useTheme();
  return (
    <View style={[styles.trustStrip, isDark && styles.trustStripDark]}>
      <Ionicons name="sparkles-outline" size={14} color={KANKREG_PALETTE.goldDeep} />
      <Text style={[styles.trustText, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
        {SHOP_SCREEN_UI.trustLine}
      </Text>
    </View>
  );
}

export function ShopResultToolbar({
  filtered,
  total,
  categoryLabel,
  sortLabel,
  onSort,
  sortAnimStyle,
  showPills,
  pill,
  onPill,
  compact,
  isDark,
}) {
  return (
    <View style={[styles.resultCard, isDark && styles.resultCardDark, cardShadow]}>
      <LinearGradient
        colors={
          isDark
            ? ["rgba(232, 200, 90, 0.45)", "rgba(201, 162, 39, 0.12)", "transparent"]
            : ["rgba(201, 162, 39, 0.55)", "rgba(116, 79, 28, 0.08)", "transparent"]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.resultAccent}
      />
      <View style={styles.resultRow}>
        <View style={styles.resultCopy}>
          <Text style={[styles.resultCount, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
            <Text style={styles.resultCountBold}>{filtered}</Text>
            <Text style={styles.resultCountMuted}> / {total}</Text>
          </Text>
          <Text style={[styles.resultLabel, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
            {SHOP_SCREEN_UI.showingSuffix}
          </Text>
        </View>
        <Text style={[styles.resultCategory, { color: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.goldDeep }]} numberOfLines={1}>
          {categoryLabel}
        </Text>
      </View>

      <View style={[styles.toolbar, compact && styles.toolbarStack]}>
        {showPills ? <ShopCollectionPills selected={pill} onSelect={onPill} compact /> : null}
        <AnimatedPressable
          onPress={onSort}
          style={[
            styles.sortBtn,
            isDark && styles.sortBtnDark,
            compact && styles.sortBtnFull,
            sortAnimStyle,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${SHOP_SCREEN_UI.sortA11y}: ${sortLabel}`}
        >
          <Ionicons name="swap-vertical" size={16} color={KANKREG_PALETTE.goldDeep} />
          <Text style={[styles.sortLabel, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
            {sortLabel}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

export function ShopFilterSidebarHeader({ onReset, hasFilters }) {
  const { isDark } = useTheme();
  return (
    <View
      style={[
        styles.sidebarHead,
        { borderBottomColor: isDark ? "rgba(232, 200, 90, 0.18)" : KANKREG_PALETTE.line },
      ]}
    >
      <Text style={[styles.sidebarTitle, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
        {SHOP_SCREEN_UI.refineTitle}
      </Text>
      {hasFilters ? (
        <Pressable onPress={onReset} hitSlop={8} accessibilityRole="button">
          <Text style={styles.sidebarReset}>{SHOP_SCREEN_UI.resetFilters}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ShopMobileFilterCard({ children, onClear, hasFilters }) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.mobileFilterCard, isDark && styles.mobileFilterCardDark, cardShadow]}>
      <View style={styles.mobileFilterHead}>
        <Text style={[styles.mobileFilterTitle, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {SHOP_SCREEN_UI.refineTitle}
        </Text>
        {hasFilters ? (
          <Pressable onPress={onClear} hitSlop={8}>
            <Text style={styles.sidebarReset}>{SHOP_SCREEN_UI.resetFilters}</Text>
          </Pressable>
        ) : null}
      </View>
      <GoldHairline marginVertical={spacing.sm} />
      {children}
    </View>
  );
}

export function shopFilterSidebarStyle() {
  return {
    width: 248,
    flexShrink: 0,
    ...Platform.select({
      web: { position: "sticky", top: getKankregChromeTop() + 12 },
      default: {},
    }),
  };
}

const styles = StyleSheet.create({
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1,
  },
  pillRowCompact: {
    gap: 7,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillOn: {
    backgroundColor: KANKREG_PALETTE.ink,
    borderColor: KANKREG_PALETTE.ink,
  },
  pillOnDark: {
    backgroundColor: KANKREG_PALETTE.goldDeep,
    borderColor: KANKREG_PALETTE.goldDeep,
  },
  pillPressed: { opacity: 0.88 },
  pillText: {
    fontSize: typography.caption,
    fontFamily: fonts.semibold,
  },
  nativeMeta: {
    fontSize: typography.caption - 1,
    fontFamily: fonts.regular,
    paddingHorizontal: spacing.md + 2,
    marginTop: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  nativeMetaBold: {
    fontFamily: fonts.semibold,
  },
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: KANKREG_PALETTE.paper2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    marginBottom: spacing.md,
  },
  trustStripDark: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(232, 200, 90, 0.16)",
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  resultCard: {
    backgroundColor: KANKREG_PALETTE.card,
    borderRadius: radius.lg + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    paddingHorizontal: spacing.md + 2,
    paddingTop: spacing.md + 4,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  resultCardDark: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(232, 200, 90, 0.18)",
  },
  resultAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: spacing.sm + 2,
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  resultCopy: { minWidth: 0 },
  resultCount: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h3 - 2,
    letterSpacing: -0.3,
  },
  resultCountBold: { fontFamily: FONT_DISPLAY },
  resultCountMuted: {
    fontFamily: fonts.medium,
    fontSize: typography.bodySmall,
    opacity: 0.72,
  },
  resultLabel: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resultCategory: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    maxWidth: "46%",
    textAlign: "right",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  toolbarStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.paper,
  },
  sortBtnDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(232, 200, 90, 0.22)",
  },
  sortBtnFull: {
    alignSelf: "stretch",
  },
  sortBtnPressed: { opacity: 0.9 },
  sortLabel: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold,
  },
  sidebarHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: KANKREG_PALETTE.line,
  },
  sidebarTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.body + 1,
    letterSpacing: -0.2,
  },
  sidebarReset: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    color: KANKREG_PALETTE.goldDeep,
  },
  mobileFilterCard: {
    backgroundColor: KANKREG_PALETTE.card,
    borderRadius: radius.lg + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  mobileFilterCardDark: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(232, 200, 90, 0.18)",
  },
  mobileFilterHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileFilterTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.body,
  },
});

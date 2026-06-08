import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { platformElevation } from "../../theme/platformStyles";
import { useTheme } from "../../context/ThemeContext";
import { fonts, spacing } from "../../theme/tokens";
import { adminShellMainPadding } from "../../theme/adminLayout";
import AdminPageHeading from "../admin/AdminPageHeading";
import AdminBackLink from "../admin/AdminBackLink";

const ADMIN_LINKS = [
  { key: "AdminDashboard", label: "Dashboard", icon: "grid-outline" },
  { key: "AdminProducts", label: "Products", icon: "cube-outline" },
  { key: "AdminInventory", label: "Inventory", icon: "layers-outline" },
  { key: "AdminOrders", label: "Orders", icon: "receipt-outline" },
  { key: "AdminUsers", label: "Users", icon: "people-outline" },
  { key: "AdminNotifications", label: "Notify", icon: "notifications-outline" },
  { key: "AdminAnalytics", label: "Analytics", icon: "bar-chart-outline" },
  { key: "AdminCoupons", label: "Coupons", icon: "pricetag-outline" },
  { key: "AdminRewards", label: "Rewards", icon: "gift-outline" },
  { key: "AdminSupport", label: "Support", icon: "chatbubbles-outline" },
  { key: "AdminHomeView", label: "Home View", icon: "home-outline" },
];

/** kankreg.html `.admin` sidebar + main — native uses dashboard hub + back link (no cramped top nav). */
export default function KankregAdminShell({ navigation, route, title, subtitle, headerRight, children }) {
  const { useSidebarLayout, pageGutter, isXs } = useKankregLayout();
  const { colors: c, isDark } = useTheme();
  const stackNav = navigation?.getParent?.() || navigation;
  const current = route?.name || "AdminDashboard";
  const isNative = Platform.OS !== "web";
  const isPhone = isNative || isXs;
  const showSidebar = useSidebarLayout && Platform.OS === "web";
  const showTopNavStrip = !showSidebar && Platform.OS === "web" && !isXs;
  const isDashboard = current === "AdminDashboard";
  const showBackLink = !isDashboard && (isNative || isXs);

  const palette = useMemo(
    () => ({
      sideBg: isDark ? "#1a1612" : KANKREG_PALETTE.ink,
      mainBg: isDark ? c.background : KANKREG_PALETTE.paper,
      shellBg: isDark ? c.surface : KANKREG_PALETTE.card,
      shellBorder: isDark ? c.border : KANKREG_PALETTE.line,
      linkMuted: isDark ? "#9a9188" : "#bcb1a3",
      linkOnBg: isDark ? "rgba(214, 173, 91, 0.2)" : "rgba(214, 173, 91, 0.16)",
      linkOnBorder: isDark ? "rgba(214, 173, 91, 0.45)" : "rgba(214, 173, 91, 0.35)",
      brand: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.paper,
    }),
    [c.background, c.border, c.surface, isDark]
  );

  const navLinks = ADMIN_LINKS.map((link) => {
    const on = current === link.key;
    return (
      <Pressable
        key={link.key}
        onPress={() => stackNav.navigate(link.key)}
        style={[
          styles.sideLink,
          showTopNavStrip && styles.sideLinkRow,
          on && {
            backgroundColor: palette.linkOnBg,
            borderWidth: 1,
            borderColor: palette.linkOnBorder,
            ...platformElevation({
              web: { boxShadow: "0 2px 8px rgba(25, 20, 15, 0.08)" },
              ios: {
                shadowColor: "#19140f",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
              },
              android: { elevation: 1 },
            }),
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
      >
        <Ionicons
          name={link.icon}
          size={17}
          color={on ? KANKREG_PALETTE.goldBright : palette.linkMuted}
        />
        <Text
          style={[
            styles.sideLinkText,
            { color: palette.linkMuted },
            on && styles.sideLinkTextOn,
          ]}
        >
          {link.label}
        </Text>
      </Pressable>
    );
  });

  return (
    <View
      style={[
        styles.shell,
        !showSidebar && styles.shellStack,
        isPhone && styles.shellPhone,
        {
          backgroundColor: palette.shellBg,
          borderColor: palette.shellBorder,
        },
      ]}
    >
      {showSidebar ? (
        <View style={[styles.side, { backgroundColor: palette.sideBg }]}>
          <Text style={[styles.brand, { color: palette.brand }]}>kankreg</Text>
          {navLinks}
        </View>
      ) : null}

      {showTopNavStrip ? (
        <View style={[styles.sideRow, styles.topNavStrip, { backgroundColor: palette.sideBg }]}>
          <Text style={styles.brandRowLabel} numberOfLines={1}>
            Admin
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sideScrollContent}
          >
            {navLinks}
          </ScrollView>
        </View>
      ) : null}

      <View
        style={[
          styles.main,
          {
            backgroundColor: palette.mainBg,
            padding: isPhone ? spacing.md : adminShellMainPadding(),
          },
          isPhone && !showSidebar ? { paddingHorizontal: pageGutter } : null,
        ]}
      >
        {showBackLink ? (
          <AdminBackLink navigation={navigation} label="Dashboard" style={styles.backLink} />
        ) : null}
        <View style={[styles.head, isPhone && styles.headPhone]}>
          <AdminPageHeading
            title={title}
            subtitle={isPhone && subtitle ? undefined : subtitle}
            right={headerRight}
            compact={isPhone}
          />
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: "row",
    minHeight: Platform.OS === "web" ? "70vh" : undefined,
    flex: Platform.OS === "web" ? undefined : 1,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 2px rgba(25,20,15,.04), 0 20px 48px -24px rgba(25,20,15,.22)",
      },
      default: {},
    }),
  },
  shellPhone: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
  shellStack: { flexDirection: "column" },
  side: {
    width: 240,
    paddingVertical: 26,
    paddingHorizontal: 18,
  },
  sideRow: {
    width: "100%",
    paddingVertical: 14,
  },
  topNavStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  sideScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 4,
  },
  brand: {
    fontFamily: FONT_DISPLAY,
    fontSize: 21,
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  brandRowLabel: {
    fontFamily: FONT_DISPLAY,
    fontSize: 15,
    color: KANKREG_PALETTE.goldBright,
    paddingHorizontal: 10,
    marginRight: 4,
    flexShrink: 0,
  },
  sideLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginVertical: 4,
  },
  sideLinkRow: { marginVertical: 0, marginHorizontal: 4 },
  sideLinkText: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
  },
  sideLinkTextOn: {
    color: KANKREG_PALETTE.goldBright,
    fontFamily: fonts.semibold,
  },
  main: {
    flex: 1,
  },
  backLink: {
    marginBottom: spacing.sm,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  headPhone: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
});

import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { platformElevation } from "../../theme/platformStyles";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { fonts, spacing } from "../../theme/tokens";
import { adminShellMainPadding } from "../../theme/adminLayout";
import AdminBackLink from "../admin/AdminBackLink";
import AdminTopBar from "../admin/AdminTopBar";

const NAV_GROUPS = [
  {
    key: "overview",
    label: "Overview",
    links: [
      { key: "AdminDashboard", label: "Dashboard", icon: "grid-outline" },
      { key: "AdminOrders", label: "Orders", icon: "receipt-outline" },
    ],
  },
  {
    key: "catalog",
    label: "Catalog",
    links: [
      { key: "AdminProducts", label: "Products", icon: "cube-outline" },
      { key: "AdminInventory", label: "Inventory", icon: "layers-outline" },
      { key: "AdminAnalytics", label: "Analytics", icon: "bar-chart-outline" },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    links: [
      { key: "AdminUsers", label: "Users", icon: "people-outline" },
      { key: "AdminCoupons", label: "Coupons", icon: "pricetag-outline" },
      { key: "AdminRewards", label: "Rewards", icon: "gift-outline" },
      { key: "AdminHomeView", label: "Home View", icon: "home-outline" },
    ],
  },
  {
    key: "system",
    label: "System",
    links: [
      { key: "AdminSupport", label: "Support", icon: "chatbubbles-outline" },
      { key: "AdminNotifications", label: "Notify", icon: "notifications-outline" },
    ],
  },
];

const FLAT_LINKS = NAV_GROUPS.flatMap((g) => g.links);

/** kankreg admin design board — ink sidebar + cream main + grouped nav. */
export default function KankregAdminShell({ navigation, route, title, subtitle, headerRight, children }) {
  const { useSidebarLayout, pageGutter, isXs } = useKankregLayout();
  const { colors: c, isDark } = useTheme();
  const { user } = useAuth();
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
      groupLabel: isDark ? "#6f6557" : "#6f6557",
    }),
    [c.background, c.border, c.surface, isDark]
  );

  const adminInitial = String(user?.name || user?.email || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  function renderLink(link, row = false) {
    const on = current === link.key;
    return (
      <Pressable
        key={link.key}
        onPress={() => stackNav.navigate(link.key)}
        style={[
          styles.sideLink,
          row && styles.sideLinkRow,
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
          size={16}
          color={on ? KANKREG_PALETTE.goldBright : palette.linkMuted}
        />
        <Text style={[styles.sideLinkText, { color: palette.linkMuted }, on && styles.sideLinkTextOn]}>
          {link.label}
        </Text>
      </Pressable>
    );
  }

  const sidebarContent = showSidebar ? (
    <View style={[styles.side, { backgroundColor: palette.sideBg }]}>
      <View style={styles.brandRow}>
        <View style={styles.brandDot} />
        <Text style={[styles.brand, { color: palette.brand }]}>kankreg</Text>
      </View>
      <Text style={styles.badge}>ADMIN CONSOLE</Text>
      {NAV_GROUPS.map((group) => (
        <View key={group.key}>
          <Text style={[styles.grp, { color: palette.groupLabel }]}>{group.label}</Text>
          {group.links.map((link) => renderLink(link))}
        </View>
      ))}
      <View style={styles.sideSpacer} />
      <View style={styles.me}>
        <View style={styles.meAv}>
          <Text style={styles.meAvText}>{adminInitial}</Text>
        </View>
        <View style={styles.meText}>
          <Text style={styles.meName} numberOfLines={1}>
            {user?.name || "Admin"}
          </Text>
          <Text style={styles.meEmail} numberOfLines={1}>
            {user?.email || "admin@kankreg.com"}
          </Text>
        </View>
      </View>
    </View>
  ) : null;

  const topNavStrip = showTopNavStrip ? (
    <View style={[styles.sideRow, styles.topNavStrip, { backgroundColor: palette.sideBg }]}>
      <Text style={styles.brandRowLabel} numberOfLines={1}>
        kankreg
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sideScrollContent}>
        {FLAT_LINKS.map((link) => renderLink(link, true))}
      </ScrollView>
    </View>
  ) : null;

  return (
    <View
      style={[
        styles.shell,
        !showSidebar && styles.shellStack,
        isPhone && styles.shellPhone,
        { backgroundColor: palette.shellBg, borderColor: palette.shellBorder },
      ]}
    >
      {sidebarContent}
      {topNavStrip}

      <View
        style={[
          styles.main,
          {
            backgroundColor: palette.mainBg,
            padding: isPhone ? spacing.md : 0,
          },
          isPhone && !showSidebar ? { paddingHorizontal: pageGutter } : null,
        ]}
      >
        {showBackLink ? (
          <AdminBackLink navigation={navigation} label="Dashboard" style={styles.backLink} />
        ) : null}

        <AdminTopBar
          title={title}
          subtitle={subtitle}
          headerRight={headerRight}
          compact={isPhone}
          onNotifications={() => stackNav.navigate("AdminNotifications")}
        />

        <View style={[styles.content, isPhone ? styles.contentPhone : styles.contentWeb]}>{children}</View>
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
    width: 224,
    paddingVertical: 22,
    paddingHorizontal: 14,
    flexDirection: "column",
    minHeight: Platform.OS === "web" ? 680 : undefined,
  },
  sideSpacer: { flex: 1, minHeight: 12 },
  sideRow: { width: "100%", paddingVertical: 14 },
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: KANKREG_PALETTE.goldBright,
  },
  brand: {
    fontFamily: FONT_DISPLAY,
    fontSize: 21,
    fontWeight: "600",
  },
  badge: {
    fontSize: 9,
    letterSpacing: 2.2,
    color: KANKREG_PALETTE.goldBright,
    paddingHorizontal: 10,
    marginBottom: 22,
    fontFamily: fonts.bold,
  },
  grp: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 6,
    fontFamily: fonts.semibold,
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
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 3,
  },
  sideLinkRow: { marginVertical: 0, marginHorizontal: 4 },
  sideLinkText: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  sideLinkTextOn: {
    color: KANKREG_PALETTE.goldBright,
    fontFamily: fonts.semibold,
  },
  me: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  meAv: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KANKREG_PALETTE.goldBright,
    alignItems: "center",
    justifyContent: "center",
  },
  meAvText: {
    fontFamily: FONT_DISPLAY,
    fontSize: 14,
    color: "#fff",
  },
  meText: { flex: 1, minWidth: 0 },
  meName: {
    fontSize: 12,
    color: KANKREG_PALETTE.paper,
    fontFamily: fonts.semibold,
  },
  meEmail: {
    fontSize: 10,
    color: "#bcb1a3",
    fontFamily: fonts.regular,
  },
  main: { flex: 1 },
  backLink: { marginBottom: spacing.sm },
  content: {},
  contentWeb: {
    paddingHorizontal: adminShellMainPadding(),
    paddingBottom: spacing.lg,
  },
  contentPhone: {
    paddingTop: spacing.xs,
  },
});

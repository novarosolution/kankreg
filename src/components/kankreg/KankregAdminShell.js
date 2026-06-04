import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { platformElevation } from "../../theme/platformStyles";
import { fonts, spacing } from "../../theme/tokens";

const ADMIN_LINKS = [
  { key: "AdminDashboard", label: "Dashboard", icon: "grid-outline" },
  { key: "AdminProducts", label: "Products", icon: "cube-outline" },
  { key: "AdminOrders", label: "Orders", icon: "receipt-outline" },
  { key: "AdminUsers", label: "Users", icon: "people-outline" },
  { key: "AdminAnalytics", label: "Analytics", icon: "bar-chart-outline" },
  { key: "AdminCoupons", label: "Coupons", icon: "pricetag-outline" },
  { key: "AdminRewards", label: "Rewards", icon: "gift-outline" },
  { key: "AdminSupport", label: "Support", icon: "chatbubbles-outline" },
];

/** kankreg.html `.admin` sidebar + main */
export default function KankregAdminShell({ navigation, route, title, headerRight, children }) {
  const { useSidebarLayout, pageGutter, isXs } = useKankregLayout();
  const stackNav = navigation?.getParent?.() || navigation;
  const current = route?.name || "AdminDashboard";
  const sideRow = !useSidebarLayout;
  const phone = Platform.OS !== "web" || isXs;

  const navLinks = ADMIN_LINKS.map((link) => {
    const on = current === link.key;
    return (
      <Pressable
        key={link.key}
        onPress={() => stackNav.navigate(link.key)}
        style={[styles.sideLink, on && styles.sideLinkOn, sideRow && styles.sideLinkRow]}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
      >
        <Ionicons name={link.icon} size={17} color={on ? KANKREG_PALETTE.goldBright : "#bcb1a3"} />
        <Text style={[styles.sideLinkText, on && styles.sideLinkTextOn]}>{link.label}</Text>
      </Pressable>
    );
  });

  return (
    <View style={[styles.shell, sideRow && styles.shellStack, phone && styles.shellPhone]}>
      <View style={[styles.side, sideRow && styles.sideRow, phone && styles.sidePhone]}>
        {sideRow && phone ? null : <Text style={[styles.brand, sideRow && styles.brandRow]}>kankreg</Text>}
        {sideRow ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sideScrollContent}
          >
            {navLinks}
          </ScrollView>
        ) : (
          navLinks
        )}
      </View>
      <View style={[styles.main, phone && { padding: pageGutter }]}>
        <View style={[styles.head, phone && styles.headPhone]}>
          <Text style={[styles.headTitle, phone && styles.headTitlePhone]}>{title}</Text>
          {headerRight ? <View style={styles.headRight}>{headerRight}</View> : null}
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
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.paper,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
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
    backgroundColor: KANKREG_PALETTE.ink,
    paddingVertical: 26,
    paddingHorizontal: 18,
  },
  sideRow: {
    width: "100%",
    paddingVertical: 14,
  },
  sideScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 4,
  },
  sidePhone: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  brand: {
    fontFamily: FONT_DISPLAY,
    fontSize: 21,
    color: KANKREG_PALETTE.paper,
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  brandRow: {
    marginBottom: 0,
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
  sideLinkOn: {
    backgroundColor: "rgba(214, 173, 91, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(214, 173, 91, 0.35)",
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
  sideLinkText: {
    fontSize: 13.5,
    color: "#bcb1a3",
    fontFamily: fonts.medium,
  },
  sideLinkTextOn: {
    color: KANKREG_PALETTE.goldBright,
    fontFamily: fonts.semibold,
  },
  main: {
    flex: 1,
    backgroundColor: KANKREG_PALETTE.paper,
    padding: spacing.lg,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
    flexWrap: "wrap",
    gap: 14,
  },
  headPhone: {
    marginBottom: spacing.md,
    gap: 8,
  },
  headTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    color: KANKREG_PALETTE.ink,
  },
  headTitlePhone: {
    fontSize: 22,
    flex: 1,
    minWidth: 0,
  },
  headRight: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
});

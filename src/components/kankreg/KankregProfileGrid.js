import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { fonts, spacing } from "../../theme/tokens";

const MENU = [
  { key: "orders", label: "My orders", icon: "receipt-outline", route: "MyOrders" },
  { key: "rewards", label: "Rewards", icon: "gift-outline", route: "RedeemRewards" },
  { key: "address", label: "Addresses", icon: "location-outline", route: "ManageAddress" },
  { key: "settings", label: "Settings", icon: "settings-outline", route: "Settings" },
  { key: "support", label: "Support", icon: "chatbubbles-outline", route: "Support" },
];

/** kankreg.html `.prof-grid` */
export default function KankregProfileGrid({
  navigation,
  user,
  memberLabel,
  pointsLabel,
  children,
}) {
  const { useSidebarLayout } = useKankregLayout();
  const stack = !useSidebarLayout;
  const initial = String(user?.name || user?.email || "K").trim().charAt(0).toUpperCase();

  return (
    <View style={[styles.grid, stack && styles.gridStack]}>
      <View style={[styles.side, stack && styles.sideStack]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{user?.name || "Member"}</Text>
        <Text style={styles.email}>{user?.email || ""}</Text>
        {pointsLabel ? (
          <View style={styles.memberTag}>
            <Text style={styles.memberTagText}>{pointsLabel}</Text>
          </View>
        ) : null}
        {memberLabel ? <Text style={styles.memberSince}>{memberLabel}</Text> : null}
        <View style={styles.menu}>
          {MENU.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => navigation.navigate(item.route)}
              style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name={item.icon} size={18} color={KANKREG_PALETTE.gold} />
              <Text style={styles.menuText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.main}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 28,
    alignItems: "flex-start",
  },
  gridStack: { flexDirection: "column" },
  side: {
    width: 220,
    flexShrink: 0,
  },
  sideStack: { width: "100%" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: KANKREG_PALETTE.paper2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontFamily: FONT_DISPLAY,
    fontSize: 32,
    color: KANKREG_PALETTE.ink,
  },
  name: {
    fontFamily: FONT_DISPLAY,
    fontSize: 20,
    color: KANKREG_PALETTE.ink,
  },
  email: {
    fontSize: 13,
    color: KANKREG_PALETTE.inkFaint,
    marginTop: 4,
  },
  memberTag: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(214, 173, 91, 0.18)",
  },
  memberTagText: {
    fontSize: 11,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.gold,
  },
  memberSince: {
    fontSize: 12,
    color: KANKREG_PALETTE.inkFaint,
    marginTop: 8,
  },
  menu: { marginTop: spacing.lg },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
});

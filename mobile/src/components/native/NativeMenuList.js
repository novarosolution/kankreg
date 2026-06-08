import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  FIGMA,
  figmaCardShell,
  figmaRowBorder,
  figmaTextMuted,
  figmaTextPrimary,
} from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { fonts } from "../../theme/tokens";

const DEFAULT_ITEMS = [
  { key: "orders", label: "My orders", icon: "bag-handle-outline", route: "MyOrders" },
  { key: "address", label: "Saved addresses", icon: "home-outline", route: "ManageAddress" },
  { key: "rewards", label: "Rewards", icon: "star-outline", route: "RedeemRewards" },
  { key: "notifications", label: "Notifications", icon: "notifications-outline", route: "Notifications" },
  { key: "settings", label: "Settings", icon: "settings-outline", route: "Settings" },
  { key: "support", label: "Help & support", icon: "help-circle-outline", route: "Support" },
];

/** figmaforkankreg.html account menu list */
export default function NativeMenuList({
  navigation,
  items = DEFAULT_ITEMS,
  onSignOut,
  signingOut = false,
}) {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;

  const rowBorder = figmaRowBorder(isDark);

  return (
    <View style={[figmaCardShell(isDark), styles.shell]}>
      {items.map((item, index) => (
        <Pressable
          key={item.key}
          onPress={() => item.route && navigation.navigate(item.route)}
          style={({ pressed }) => [
            styles.row,
            index < items.length - 1 && [styles.rowBorder, rowBorder],
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name={item.icon} size={17} color={isDark ? FIGMA.goldBright : FIGMA.gold} />
          <Text style={[styles.label, figmaTextPrimary(isDark)]}>{item.label}</Text>
          <Text style={[styles.chevron, figmaTextMuted(isDark)]}>›</Text>
        </Pressable>
      ))}
      {onSignOut ? (
        <Pressable
          onPress={onSignOut}
          disabled={signingOut}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="log-out-outline" size={17} color={FIGMA.danger || "#a8442f"} />
          <Text style={[styles.label, styles.signOut]}>{signingOut ? "Signing out…" : "Sign out"}</Text>
          <Text style={[styles.chevron, figmaTextMuted(isDark)]}>›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: FIGMA.radiusCard,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  signOut: {
    color: FIGMA.danger || "#a8442f",
  },
  chevron: {
    fontSize: 16,
  },
});

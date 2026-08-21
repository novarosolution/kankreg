import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { routeMatchesNav } from "./kankregNav";

const NAV_ICONS = {
  Home: "home-outline",
  Shop: "storefront-outline",
  About: "leaf-outline",
  Rewards: "gift-outline",
  Account: "person-circle-outline",
  Admin: "shield-checkmark-outline",
  Delivery: "bicycle-outline",
};

/** kankreg.html `.mobile-nav` */
export default function KankregMobileNav({ open, items, currentRouteName, onClose, isDark: isDarkProp }) {
  const { isDark: themeDark } = useTheme();
  const isDark = isDarkProp ?? themeDark;
  const { pageGutterClamp } = useKankregLayout();

  if (!open) return null;

  return (
    <View
      style={[
        styles.shell,
        isDark && styles.shellDark,
        { paddingHorizontal: pageGutterClamp },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {items.map((item) => {
          const active = routeMatchesNav(item.key, currentRouteName);
          const iconName = NAV_ICONS[item.key] || "chevron-forward-outline";
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                item.onPress();
                onClose?.();
              }}
              style={({ pressed, hovered }) => [
                styles.row,
                isDark && styles.rowDark,
                active && (isDark ? styles.rowActiveDark : styles.rowActive),
                (pressed || hovered) && !active ? (isDark ? styles.rowHoverDark : styles.rowHover) : null,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <View style={[styles.iconBadge, isDark && styles.iconBadgeDark, active && (isDark ? styles.iconBadgeActiveDark : styles.iconBadgeActive)]}>
                <Ionicons
                  name={iconName}
                  size={17}
                  color={
                    active
                      ? isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold
                      : isDark ? "rgba(245, 239, 228, 0.7)" : KANKREG_PALETTE.inkSoft
                  }
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isDark && styles.labelDark,
                  active && (isDark ? styles.labelActiveDark : styles.labelActive),
                ]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={isDark ? "rgba(245, 239, 228, 0.28)" : "rgba(60, 45, 20, 0.22)"}
                style={styles.chevron}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: KANKREG_PALETTE.card,
    borderBottomWidth: 1,
    borderBottomColor: KANKREG_PALETTE.lineSoft,
    paddingVertical: 10,
    paddingBottom: 18,
    maxHeight: Platform.OS === "web" ? "min(70vh, 420px)" : 420,
    ...Platform.select({
      web: { boxShadow: "0 18px 40px -22px rgba(25, 20, 15, 0.22)" },
      default: {},
    }),
  },
  shellDark: {
    backgroundColor: "#181513",
    borderBottomColor: "#3f3933",
    ...Platform.select({
      web: { boxShadow: "0 18px 40px -22px rgba(0, 0, 0, 0.5)" },
      default: {},
    }),
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 4,
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  rowActive: {
    backgroundColor: "rgba(214, 173, 91, 0.1)",
  },
  rowActiveDark: {
    backgroundColor: "rgba(214, 173, 91, 0.12)",
  },
  rowHover: {
    backgroundColor: "rgba(60, 45, 20, 0.04)",
  },
  rowHoverDark: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(60, 45, 20, 0.05)",
  },
  iconBadgeDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  iconBadgeActive: {
    backgroundColor: "rgba(214, 173, 91, 0.16)",
  },
  iconBadgeActiveDark: {
    backgroundColor: "rgba(214, 173, 91, 0.18)",
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  labelDark: {
    color: "rgba(245, 239, 228, 0.78)",
  },
  labelActive: {
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
  },
  labelActiveDark: {
    color: "#f5efe4",
    fontFamily: fonts.semibold,
  },
  chevron: {
    marginLeft: 4,
  },
});

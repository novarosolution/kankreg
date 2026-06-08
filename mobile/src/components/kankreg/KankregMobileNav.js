import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { routeMatchesNav } from "./kankregNav";

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
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                item.onPress();
                onClose?.();
              }}
              style={({ pressed }) => [
                styles.row,
                isDark && styles.rowDark,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  styles.label,
                  isDark && styles.labelDark,
                  active && (isDark ? styles.labelActiveDark : styles.labelActive),
                ]}
              >
                {item.label}
              </Text>
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
  },
  shellDark: {
    backgroundColor: "#181513",
    borderBottomColor: "#3f3933",
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  row: {
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: KANKREG_PALETTE.lineSoft,
  },
  rowDark: {
    borderBottomColor: "#3f3933",
  },
  label: {
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
    borderLeftWidth: 3,
    borderLeftColor: KANKREG_PALETTE.gold,
    paddingLeft: 5,
  },
  labelActiveDark: {
    color: "#f5efe4",
    fontFamily: fonts.semibold,
    borderLeftWidth: 3,
    borderLeftColor: KANKREG_PALETTE.goldBright,
    paddingLeft: 5,
  },
});

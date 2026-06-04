import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { routeMatchesNav } from "./kankregNav";

/** kankreg.html `.mobile-nav` */
export default function KankregMobileNav({ open, items, currentRouteName, onClose }) {
  const { pageGutterClamp } = useKankregLayout();

  if (!open) return null;

  return (
    <View style={[styles.shell, { paddingHorizontal: pageGutterClamp }]}>
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
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
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
  label: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  labelActive: {
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
    borderLeftWidth: 3,
    borderLeftColor: KANKREG_PALETTE.gold,
    paddingLeft: 5,
  },
});

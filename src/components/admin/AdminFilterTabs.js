import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

export default function AdminFilterTabs({ items, value, onChange, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => {
        const key = item.key ?? item.value ?? item.label;
        const on = value === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.tab, on && styles.tabOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Text style={[styles.tabText, on && styles.tabTextOn]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
  },
  tabOn: {
    backgroundColor: KANKREG_PALETTE.ink,
    borderColor: KANKREG_PALETTE.ink,
  },
  tabText: {
    fontSize: 12,
    color: KANKREG_PALETTE.inkSoft,
    fontFamily: fonts.medium,
  },
  tabTextOn: {
    color: KANKREG_PALETTE.paper,
    fontFamily: fonts.semibold,
  },
});

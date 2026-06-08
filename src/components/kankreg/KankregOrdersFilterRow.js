import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { MY_ORDERS_UI } from "../../content/appContent";
import { FIGMA } from "../../theme/figmaApp";
import { fonts } from "../../theme/tokens";

const FILTER_KEYS = ["all", "active", "delivered", "cancelled"];

function filterLabel(key, counts) {
  const base = MY_ORDERS_UI.filters[key] || key;
  const count = counts[key];
  return count > 0 ? `${base} · ${count}` : base;
}

/** Shared order filters — app pills + web chips */
export default function KankregOrdersFilterRow({ selected, onSelect, counts = {} }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTER_KEYS.map((key) => {
        const active = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            style={({ pressed, hovered }) => [
              styles.chip,
              active ? styles.chipOn : styles.chipOff,
              Platform.OS === "web" && hovered && !active && styles.chipHover,
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.chipText, active && styles.chipTextOn]}>
              {filterLabel(key, counts)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: FIGMA.gutter,
    paddingBottom: 10,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipOn: {
    backgroundColor: FIGMA.ink,
  },
  chipOff: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    backgroundColor: FIGMA.card,
  },
  chipHover: {
    borderColor: FIGMA.gold,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: FIGMA.inkSoft,
  },
  chipTextOn: {
    color: "#fff",
  },
});

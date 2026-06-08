import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { MY_ORDERS_UI } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
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
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

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

function createStyles(isDark) {
  return StyleSheet.create({
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
      backgroundColor: isDark ? FIGMA.goldDeep : FIGMA.ink,
    },
    chipOff: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "#3f3933" : FIGMA.line,
      backgroundColor: isDark ? "#181513" : FIGMA.card,
    },
    chipHover: {
      borderColor: isDark ? FIGMA.goldBright : FIGMA.gold,
    },
    chipText: {
      fontFamily: fonts.semibold,
      fontSize: 10,
      color: isDark ? "rgba(245, 239, 228, 0.72)" : FIGMA.inkSoft,
    },
    chipTextOn: {
      color: "#fff",
    },
  });
}

import React, { memo, useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MY_ORDERS_UI } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { ALCHEMY } from "../../theme/customerAlchemy";
import { FIGMA } from "../../theme/figmaApp";
import { fonts } from "../../theme/tokens";

const FILTER_KEYS = ["all", "active", "delivered", "cancelled"];

function filterLabel(key, counts) {
  const base = MY_ORDERS_UI.filters[key] || key;
  const count = counts[key];
  return count > 0 ? `${base} · ${count}` : base;
}

function KankregOrdersFilterRowBase({ selected, onSelect, counts = {} }) {
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {FILTER_KEYS.map((key) => {
          const active = selected === key;
          const icon = MY_ORDERS_UI.filterIcons[key];
          return (
            <Pressable
              key={key}
              onPress={() => onSelect(key)}
              style={({ pressed, hovered }) => [
                styles.chip,
                active ? styles.chipOn : styles.chipOff,
                Platform.OS === "web" && hovered && !active && styles.chipHover,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={icon}
                size={14}
                color={active ? "#fff" : isDark ? "rgba(245,239,228,0.65)" : FIGMA.inkSoft}
              />
              <Text style={[styles.chipText, active && styles.chipTextOn]}>{filterLabel(key, counts)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const KankregOrdersFilterRow = memo(KankregOrdersFilterRowBase);
export default KankregOrdersFilterRow;

function createStyles(isDark) {
  return StyleSheet.create({
    wrap: {
      marginBottom: 10,
      ...Platform.select({
        web: {
          position: "sticky",
          top: 72,
          zIndex: 8,
          paddingVertical: 4,
          backgroundColor: isDark ? "rgba(24,21,19,0.92)" : "rgba(255,253,248,0.92)",
          backdropFilter: "saturate(140%) blur(10px)",
        },
        default: {},
      }),
    },
    row: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: FIGMA.gutter,
      paddingBottom: 2,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 13,
      paddingVertical: 8,
      borderRadius: 999,
    },
    chipOn: {
      backgroundColor: isDark ? FIGMA.goldDeep : FIGMA.ink,
      ...Platform.select({
        ios: { shadowColor: "#19140f", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 },
        android: { elevation: 2 },
        default: {},
      }),
    },
    chipOff: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "#3f3933" : FIGMA.line,
      backgroundColor: isDark ? "#181513" : FIGMA.card,
    },
    chipHover: {
      borderColor: isDark ? FIGMA.goldBright : ALCHEMY.gold,
    },
    chipText: {
      fontFamily: fonts.semibold,
      fontSize: 11,
      letterSpacing: 0.1,
      color: isDark ? "rgba(245, 239, 228, 0.72)" : FIGMA.inkSoft,
    },
    chipTextOn: {
      color: "#fff",
    },
  });
}

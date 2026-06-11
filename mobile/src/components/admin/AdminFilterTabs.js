import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { fonts } from "../../theme/tokens";

export default function AdminFilterTabs({ items, value, onChange, style }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

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

function createStyles(chrome) {
  return StyleSheet.create({
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
      borderColor: chrome.line,
      backgroundColor: chrome.card,
    },
    tabOn: {
      backgroundColor: chrome.tabOnBg,
      borderColor: chrome.tabOnBorder,
    },
    tabText: {
      fontSize: 12,
      color: chrome.inkSoft,
      fontFamily: fonts.medium,
    },
    tabTextOn: {
      color: chrome.tabOnText,
      fontFamily: fonts.semibold,
    },
  });
}

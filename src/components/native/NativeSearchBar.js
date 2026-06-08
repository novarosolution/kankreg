import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { SEARCH_PLACEHOLDER } from "../../content/appContent";
import { spacing } from "../../theme/tokens";

export default function NativeSearchBar({ onPress, onFilterPress, placeholder = "Search essentials" }) {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.search, { backgroundColor: isDark ? "#181513" : FIGMA.card, borderColor: FIGMA.line }]}
        onPress={onPress}
      >
        <Ionicons name="search-outline" size={14} color={FIGMA.inkFaint} />
        <Text style={styles.placeholder} numberOfLines={1}>
          {placeholder || SEARCH_PLACEHOLDER}
        </Text>
      </Pressable>
      {onFilterPress ? (
        <Pressable
          style={[styles.filterBtn, { backgroundColor: isDark ? "#181513" : FIGMA.card, borderColor: FIGMA.line }]}
          onPress={onFilterPress}
          accessibilityLabel="Filters"
        >
          <Ionicons name="options-outline" size={16} color={FIGMA.inkSoft} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: FIGMA.gutter,
    marginTop: spacing.sm + 2,
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: FIGMA.radiusControl,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minHeight: 40,
  },
  placeholder: {
    flex: 1,
    fontSize: 12,
    color: FIGMA.inkFaint,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: FIGMA.radiusControl,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});

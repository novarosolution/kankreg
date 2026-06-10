import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getShopTheme } from "../../theme/shopTheme";
import { fonts, spacing } from "../../theme/tokens";

/** Mobile shop filters when sidebar is hidden */
export default function KankregFilterChips({
  title,
  options,
  selected,
  onToggle,
  multi = true,
  compact = false,
  wrap = false,
}) {
  const { isDark } = useTheme();
  const t = getShopTheme(isDark);

  const chipNodes = options.map((opt) => {
    const on = multi ? Array.isArray(selected) && selected.includes(opt) : selected === opt;
    return (
      <Pressable
        key={opt}
        onPress={() => onToggle(opt)}
        style={({ pressed }) => [
          styles.chip,
          compact && styles.chipCompact,
          {
            backgroundColor: on ? t.chipOnBg : t.surfaceChip,
            borderColor: on ? t.chipOnBorder : t.border,
          },
          pressed && styles.chipPressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
      >
        <Text
          style={[
            styles.chipText,
            compact && styles.chipTextCompact,
            { color: on ? t.chipOnText : t.textMuted },
          ]}
        >
          {opt}
        </Text>
      </Pressable>
    );
  });

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {title ? (
        <Text style={[styles.title, { color: t.sectionIcon }]}>{title}</Text>
      ) : null}
      {wrap ? (
        <View style={styles.wrapRow}>{chipNodes}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          keyboardShouldPersistTaps="handled"
        >
          {chipNodes}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  wrapCompact: { marginBottom: 0 },
  title: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  row: { gap: 8, paddingRight: spacing.md },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipCompact: {
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  chipPressed: { opacity: 0.88 },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
  },
  chipTextCompact: {
    fontSize: 12,
  },
});

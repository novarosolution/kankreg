import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useTheme } from "../../context/ThemeContext";
import { fonts, spacing } from "../../theme/tokens";

/** Mobile shop filters when sidebar is hidden */
export default function KankregFilterChips({
  title,
  options,
  selected,
  onToggle,
  multi = true,
  compact = false,
}) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {title ? (
        <Text style={[styles.title, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {title}
        </Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {options.map((opt) => {
          const on = multi
            ? Array.isArray(selected) && selected.includes(opt)
            : selected === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : KANKREG_PALETTE.paper2,
                  borderColor: isDark ? "rgba(232, 200, 90, 0.22)" : KANKREG_PALETTE.line,
                },
                on && styles.chipOn,
                on && isDark && styles.chipOnDark,
                pressed && styles.chipPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isDark ? "rgba(245, 239, 228, 0.78)" : KANKREG_PALETTE.inkSoft },
                  on && styles.chipTextOn,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  wrapCompact: { marginBottom: spacing.sm + 2 },
  title: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  row: { gap: 8, paddingRight: spacing.md },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipOn: {
    backgroundColor: KANKREG_PALETTE.ink,
    borderColor: KANKREG_PALETTE.ink,
  },
  chipOnDark: {
    backgroundColor: KANKREG_PALETTE.goldDeep,
    borderColor: KANKREG_PALETTE.gold,
  },
  chipPressed: { opacity: 0.88 },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
  },
  chipTextOn: { color: KANKREG_PALETTE.paper },
});

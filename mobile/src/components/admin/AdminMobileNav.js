import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, spacing } from "../../theme/tokens";

/** Horizontal admin nav for phone / narrow layouts (kankreg.html mobile admin strip). */
export default function AdminMobileNav({ links, current, onNavigate }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
      contentContainerStyle={styles.row}
    >
      {links.map((link) => {
        const on = current === link.key;
        return (
          <Pressable
            key={link.key}
            onPress={() => onNavigate(link.key)}
            style={[styles.chip, on && styles.chipOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Ionicons
              name={link.icon}
              size={14}
              color={on ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.inkFaint}
            />
            <Text style={[styles.label, on && styles.labelOn]}>{link.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
    marginHorizontal: -4,
  },
  row: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
  },
  chipOn: {
    backgroundColor: "rgba(214,173,91,0.14)",
    borderColor: "rgba(214,173,91,0.35)",
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  labelOn: {
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
  },
});

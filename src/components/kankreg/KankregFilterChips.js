import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

/** Mobile shop filters when sidebar is hidden */
export default function KankregFilterChips({ title, options, selected, onToggle, multi = true }) {
  return (
    <View style={styles.wrap}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((opt) => {
          const on = multi
            ? Array.isArray(selected) && selected.includes(opt)
            : selected === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{opt}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  title: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.ink,
    marginBottom: 8,
  },
  row: { gap: 8, paddingRight: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: KANKREG_PALETTE.paper2,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
  },
  chipOn: {
    backgroundColor: KANKREG_PALETTE.ink,
    borderColor: KANKREG_PALETTE.ink,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  chipTextOn: { color: KANKREG_PALETTE.paper },
});

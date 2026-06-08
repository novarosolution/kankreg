import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { fonts, radius, spacing, typography } from "../../theme/tokens";

export default function PremiumSwitch({ label, hint, value, onChange }) {
  const { colors: c, isDark } = useTheme();
  return (
    <Pressable
      onPress={() => onChange?.(!value)}
      style={({ pressed }) => [styles.row, { borderColor: c.border, backgroundColor: c.surface }, pressed && styles.pressed]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.textCol}>
        <Text style={[styles.label, { color: c.textPrimary }]}>{label}</Text>
        {hint ? <Text style={[styles.hint, { color: c.textSecondary }]}>{hint}</Text> : null}
      </View>
      <View style={[styles.track, { backgroundColor: value ? c.primary : c.surfaceMuted, borderColor: value ? c.primaryBorder : c.border }]}>
        <View style={[styles.thumb, { backgroundColor: isDark ? c.onPrimary : "#FFFFFF", transform: [{ translateX: value ? 18 : 0 }] }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    ...Platform.select({
      web: { transition: "transform .18s ease, box-shadow .18s ease" },
      default: {},
    }),
  },
  pressed: {
    opacity: 0.9,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall,
  },
  hint: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: typography.caption,
  },
  track: {
    width: 46,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

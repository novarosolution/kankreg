import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { spacing } from "../../theme/tokens";

/** Back link to admin dashboard — used in mobile admin shell header. */
export default function AdminBackLink({ navigation, label = "Dashboard", target = "AdminDashboard", style }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, style, pressed ? styles.pressed : null]}
      onPress={() => navigation.navigate(target)}
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
    >
      <Ionicons name="chevron-back" size={18} color={KANKREG_PALETTE.inkSoft} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
  },
  pressed: { opacity: 0.85 },
  text: {
    fontSize: 13,
    fontWeight: "700",
    color: KANKREG_PALETTE.ink,
  },
});

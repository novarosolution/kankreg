import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA } from "../../theme/figmaApp";
import { fonts, spacing } from "../../theme/tokens";

/** Small trust strip under cart header */
export default function KankregCartBagNote() {
  const items = [
    { icon: "leaf-outline", label: "Organic" },
    { icon: "shield-checkmark-outline", label: "Secure" },
    { icon: "flame-outline", label: "Pure" },
  ];

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <View key={item.label} style={styles.cell}>
          <Ionicons name={item.icon} size={12} color={FIGMA.gold} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: FIGMA.gutter,
    marginBottom: spacing.sm,
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: FIGMA.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: FIGMA.inkSoft,
  },
});

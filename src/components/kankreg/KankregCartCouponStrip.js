import React from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FIGMA } from "../../theme/figmaApp";
import { fonts, spacing } from "../../theme/tokens";

/** figmaforkankreg.html dashed coupon row */
export default function KankregCartCouponStrip({
  value,
  onChangeText,
  onApply,
  appliedLabel,
  placeholder = "Add coupon code",
}) {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={FIGMA.inkFaint}
        autoCapitalize="characters"
        returnKeyType="done"
        onSubmitEditing={onApply}
        style={styles.input}
      />
      <Pressable
        onPress={onApply}
        style={({ pressed, hovered }) => [
          styles.applyBtn,
          Platform.OS === "web" && hovered && styles.applyBtnHover,
          pressed && styles.applyBtnPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Apply coupon"
      >
        <Text style={styles.applyText}>Apply</Text>
      </Pressable>
      {appliedLabel ? <Text style={styles.applied}>{appliedLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: FIGMA.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: FIGMA.ink,
    backgroundColor: FIGMA.card,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    backgroundColor: FIGMA.card,
  },
  applyBtnHover: {
    borderColor: FIGMA.gold,
  },
  applyBtnPressed: {
    opacity: 0.88,
  },
  applyText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: FIGMA.inkSoft,
  },
  applied: {
    width: "100%",
    fontFamily: fonts.medium,
    fontSize: 10,
    color: FIGMA.green,
    marginTop: spacing.xs,
  },
});

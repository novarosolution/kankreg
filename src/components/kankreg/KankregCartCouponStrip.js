import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
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
  const { colors: c, isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark, c), [isDark, c]);

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholderColor}
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

function createStyles(isDark, c) {
  const bg = isDark ? c.surface : FIGMA.card;
  const border = isDark ? c.border : FIGMA.line;
  const text = isDark ? c.textPrimary : FIGMA.ink;
  const textSoft = isDark ? c.textSecondary : FIGMA.inkSoft;
  const placeholderColor = isDark ? c.textMuted : FIGMA.inkFaint;

  return {
    ...StyleSheet.create({
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
        borderColor: border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: fonts.regular,
        fontSize: 11,
        color: text,
        backgroundColor: bg,
      },
      applyBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: border,
        backgroundColor: bg,
      },
      applyBtnHover: {
        borderColor: isDark ? c.primary : FIGMA.gold,
      },
      applyBtnPressed: {
        opacity: 0.88,
      },
      applyText: {
        fontFamily: fonts.semibold,
        fontSize: 11,
        color: textSoft,
      },
      applied: {
        width: "100%",
        fontFamily: fonts.medium,
        fontSize: 10,
        color: isDark ? c.secondaryBright : FIGMA.green,
        marginTop: spacing.xs,
      },
    }),
    placeholderColor,
  };
}

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FIGMA, figmaTextMuted, figmaTextPrimary } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { fonts } from "../../theme/tokens";

const STEPS = ["Bag", "Address", "Pay", "Done"];

/** figmaforkankreg.html checkout step indicator — app + web */
export default function KankregCheckoutSteps({ active = 1, style }) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.row, style]}>
      {STEPS.map((label, index) => {
        const done = index < active;
        const current = index === active;
        const bg = done ? FIGMA.green : current ? FIGMA.gold : isDark ? "#24201d" : FIGMA.paper2;
        const color = done || current ? "#fff" : isDark ? "rgba(245,239,228,0.55)" : FIGMA.inkFaint;
        return (
          <View key={label} style={styles.step}>
            <View style={[styles.dot, { backgroundColor: bg }]}>
              <Text style={[styles.dotText, { color }]}>{done ? "✓" : index + 1}</Text>
            </View>
            <Text
              style={[
                styles.label,
                done || current ? figmaTextPrimary(isDark) : figmaTextMuted(isDark),
                (done || current) && styles.labelOn,
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: FIGMA.gutter,
    marginTop: 12,
    marginBottom: 8,
  },
  step: {
    flex: 1,
    alignItems: "center",
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 8,
    marginTop: 4,
  },
  labelOn: {
    fontFamily: fonts.semibold,
  },
});

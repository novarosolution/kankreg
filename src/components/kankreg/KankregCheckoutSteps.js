import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FIGMA } from "../../theme/figmaApp";
import { fonts } from "../../theme/tokens";

const STEPS = ["Bag", "Address", "Pay", "Done"];

/** figmaforkankreg.html checkout step indicator — app + web */
export default function KankregCheckoutSteps({ active = 1, style }) {
  return (
    <View style={[styles.row, style]}>
      {STEPS.map((label, index) => {
        const done = index < active;
        const current = index === active;
        const bg = done ? FIGMA.green : current ? FIGMA.gold : FIGMA.paper2;
        const color = done || current ? "#fff" : FIGMA.inkFaint;
        return (
          <View key={label} style={styles.step}>
            <View style={[styles.dot, { backgroundColor: bg }]}>
              <Text style={[styles.dotText, { color }]}>{done ? "✓" : index + 1}</Text>
            </View>
            <Text style={[styles.label, (done || current) && styles.labelOn]}>{label}</Text>
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
    color: FIGMA.inkFaint,
    marginTop: 4,
  },
  labelOn: {
    color: FIGMA.ink,
    fontFamily: fonts.semibold,
  },
});

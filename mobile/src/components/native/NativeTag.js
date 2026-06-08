import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { FIGMA } from "../../theme/figmaApp";
import { fonts } from "../../theme/tokens";

/** figmaforkankreg.html .tag */
export default function NativeTag({ label, tone = "gold" }) {
  if (Platform.OS === "web") return null;

  const isGreen = tone === "green";

  return (
    <View style={[styles.tag, isGreen ? styles.tagGreen : styles.tagGold]}>
      <Text style={[styles.text, isGreen ? styles.textGreen : styles.textGold]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagGold: {
    backgroundColor: "rgba(169,119,46,0.14)",
  },
  tagGreen: {
    backgroundColor: "rgba(60,98,72,0.14)",
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  textGold: {
    color: FIGMA.goldDeep,
  },
  textGreen: {
    color: FIGMA.green,
  },
});

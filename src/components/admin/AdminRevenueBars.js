import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

export default function AdminRevenueBars({ labels = [], values = [], height = 160 }) {
  const nums = values.map((v) => Math.max(0, Number(v) || 0));
  const max = Math.max(...nums, 1);

  return (
    <View style={[styles.chart, { height: height + 24 }]}>
      {nums.map((v, i) => {
        const h = Math.max(6, Math.round((v / max) * height));
        return (
          <View key={`${labels[i] || i}`} style={styles.col}>
            <LinearGradient
              colors={["#d9b463", "#9c6b27"]}
              style={[styles.bar, { height: h }]}
            />
            <Text style={styles.label} numberOfLines={1}>
              {labels[i] || ""}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 11,
    paddingTop: 8,
  },
  col: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 6,
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    color: KANKREG_PALETTE.inkFaint,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
});

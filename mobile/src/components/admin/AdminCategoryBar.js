import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

export default function AdminCategoryBar({ name, percent }) {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={["#cba24e", "#9c6b27"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${pct}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 11 },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 12,
    color: KANKREG_PALETTE.inkSoft,
    fontFamily: fonts.medium,
  },
  pct: {
    fontSize: 12,
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: KANKREG_PALETTE.paper2,
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
});

import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

export default function AdminToggleRow({ title, subtitle, value, onValueChange, isLast }) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: KANKREG_PALETTE.paper2, true: KANKREG_PALETTE.gold }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: KANKREG_PALETTE.line,
  },
  rowLast: { borderBottomWidth: 0 },
  textCol: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.ink,
  },
  sub: {
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

/** HTML `.field` — uppercase micro-label + child input */
export default function AdminFormField({ label, children, style }) {
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: {
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.inkFaint,
    fontFamily: fonts.semibold,
    marginBottom: 6,
  },
});

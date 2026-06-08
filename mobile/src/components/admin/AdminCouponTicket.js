import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import AdminStatusPill from "./AdminStatusPill";

export default function AdminCouponTicket({
  code,
  description,
  usageText,
  status,
  active,
  onToggle,
  onPress,
}) {
  const tone = status === "Active" ? "ok" : status === "Expired" ? "cancel" : "pend";
  const Wrap = onPress ? Pressable : View;
  const wrapProps = onPress ? { onPress, accessibilityRole: "button" } : {};

  return (
    <Wrap style={styles.ticket} {...wrapProps}>
      <View style={styles.top}>
        <Text style={styles.code}>{code}</Text>
        <Switch
          value={active}
          onValueChange={onToggle}
          trackColor={{ false: KANKREG_PALETTE.paper2, true: KANKREG_PALETTE.gold }}
          thumbColor="#fff"
        />
      </View>
      <Text style={styles.desc}>{description}</Text>
      <View style={styles.foot}>
        <Text style={styles.usage}>{usageText}</Text>
        <AdminStatusPill label={status} tone={tone} />
      </View>
    </Wrap>
  );
}

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: KANKREG_PALETTE.card,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    borderRadius: 14,
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  code: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: KANKREG_PALETTE.ink,
  },
  desc: {
    fontSize: 12.5,
    color: KANKREG_PALETTE.inkSoft,
    marginVertical: 8,
    lineHeight: 18,
  },
  foot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: KANKREG_PALETTE.line,
    paddingTop: 10,
    marginTop: 4,
  },
  usage: {
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
    flex: 1,
    marginRight: 8,
  },
});

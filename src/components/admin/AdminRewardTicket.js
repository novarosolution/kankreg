import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";
import AdminStatusPill from "./AdminStatusPill";

export default function AdminRewardTicket({
  title,
  description,
  pointsCost,
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
        <Text style={styles.title}>{title}</Text>
        <Switch
          value={active}
          onValueChange={onToggle}
          trackColor={{ false: KANKREG_PALETTE.paper2, true: KANKREG_PALETTE.gold }}
          thumbColor="#fff"
        />
      </View>
      <Text style={styles.points}>{pointsCost} pts</Text>
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
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: FONT_DISPLAY,
    fontSize: 16,
    fontWeight: "600",
    color: KANKREG_PALETTE.ink,
  },
  points: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: KANKREG_PALETTE.goldDeep,
    letterSpacing: 0.6,
    marginTop: 6,
    textTransform: "uppercase",
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
  },
  usage: {
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
    flex: 1,
    marginRight: 8,
  },
});

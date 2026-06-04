import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getActiveProgressStep, getOrderStatusLabel } from "../../utils/orderStatus";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

const STEPS = ["Placed", "Packed", "On the way", "Delivered"];

function stepIndexForStatus(status) {
  const step = getActiveProgressStep(status);
  if (step >= 5) return 3;
  if (step >= 3) return 2;
  if (step >= 1) return 1;
  return 0;
}

/** kankreg.html `.track` stepper */
export default function KankregOrderTrack({ status }) {
  const active = stepIndexForStatus(status);
  const statusLabel = getOrderStatusLabel(status);

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {STEPS.map((label, i) => {
          const done = i < active;
          const on = i === active;
          return (
            <React.Fragment key={label}>
              {i > 0 ? <View style={[styles.line, (done || on) && styles.lineDone]} /> : null}
              <View style={styles.nodeCol}>
                <View style={[styles.dot, done && styles.dotDone, on && styles.dotOn]}>
                  <Text style={styles.dotText}>{done ? "✓" : on ? "●" : ""}</Text>
                </View>
                <Text style={[styles.stepLabel, (done || on) && styles.stepLabelOn]}>{label}</Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
      {statusLabel ? (
        <Text style={[styles.statusHint, { color: KANKREG_PALETTE.gold }]}>
          {statusLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 14 },
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nodeCol: { alignItems: "center", flex: 1 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: KANKREG_PALETTE.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: KANKREG_PALETTE.card,
  },
  dotDone: { backgroundColor: KANKREG_PALETTE.green, borderColor: KANKREG_PALETTE.green },
  dotOn: { backgroundColor: KANKREG_PALETTE.gold, borderColor: KANKREG_PALETTE.gold },
  dotText: { fontSize: 12, color: "#fff", fontFamily: fonts.bold },
  stepLabel: {
    marginTop: 6,
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
  stepLabelOn: { color: KANKREG_PALETTE.ink, fontFamily: fonts.semibold },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: KANKREG_PALETTE.line,
    marginTop: 14,
    marginHorizontal: 4,
  },
  lineDone: { backgroundColor: KANKREG_PALETTE.green },
  statusHint: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
});

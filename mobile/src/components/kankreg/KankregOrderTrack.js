import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MY_ORDERS_UI } from "../../content/appContent";
import { getActiveProgressStep, getOrderStatusLabel } from "../../utils/orderStatus";
import { useTheme } from "../../context/ThemeContext";
import { figmaTextMuted, figmaTextPrimary } from "../../theme/figmaApp";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

function stepIndexForStatus(status) {
  const step = getActiveProgressStep(status);
  if (step >= 5) return 3;
  if (step >= 3) return 2;
  if (step >= 1) return 1;
  return 0;
}

/** kankreg.html `.track` stepper — app + web */
export default function KankregOrderTrack({
  status,
  compact = false,
  showStatusHint = true,
}) {
  const { isDark } = useTheme();
  const steps = MY_ORDERS_UI.trackSteps;
  const active = stepIndexForStatus(status);
  const statusLabel = getOrderStatusLabel(status);

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.bar}>
        {steps.map((label, i) => {
          const done = i < active;
          const on = i === active;
          return (
            <React.Fragment key={label}>
              {i > 0 ? (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: isDark ? "#3f3933" : KANKREG_PALETTE.line },
                    (done || on) && styles.lineDone,
                  ]}
                />
              ) : null}
              <View style={styles.nodeCol}>
                <View
                  style={[
                    styles.dot,
                    compact && styles.dotCompact,
                    {
                      borderColor: isDark ? "#3f3933" : KANKREG_PALETTE.line,
                      backgroundColor: isDark ? "#181513" : KANKREG_PALETTE.card,
                    },
                    done && styles.dotDone,
                    on && styles.dotOn,
                  ]}
                >
                  <Text style={[styles.dotText, compact && styles.dotTextCompact]}>
                    {done ? "✓" : on ? "●" : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    compact && styles.stepLabelCompact,
                    done || on ? figmaTextPrimary(isDark) : figmaTextMuted(isDark),
                    (done || on) && styles.stepLabelOn,
                  ]}
                >
                  {label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
      {showStatusHint && statusLabel ? (
        <Text style={[styles.statusHint, { color: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold }]}>
          {statusLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 14 },
  wrapCompact: { marginVertical: 10 },
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
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: KANKREG_PALETTE.green, borderColor: KANKREG_PALETTE.green },
  dotOn: { backgroundColor: KANKREG_PALETTE.gold, borderColor: KANKREG_PALETTE.gold },
  dotCompact: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dotText: { fontSize: 12, color: "#fff", fontFamily: fonts.bold },
  dotTextCompact: { fontSize: 10 },
  stepLabel: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
  stepLabelOn: { fontFamily: fonts.semibold },
  stepLabelCompact: {
    marginTop: 4,
    fontSize: 8,
  },
  line: {
    flex: 1,
    height: 2,
    marginTop: 14,
    marginHorizontal: 4,
  },
  lineDone: { backgroundColor: KANKREG_PALETTE.green },
  statusHint: {
    marginTop: 10,
    fontFamily: fonts.semibold,
    fontSize: 12,
    textAlign: "center",
  },
});

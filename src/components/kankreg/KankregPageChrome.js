import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { createKankregEyebrowStyle, kankregSectionIndex } from "../../theme/kankregScreenStyles";
import { fonts, spacing, typography } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";
import GoldHairline from "../ui/GoldHairline";

/** `.section-head` from kankreg.html */
export function KankregSectionHead({ index, eyebrow, title, right }) {
  const { isDark } = useTheme();
  const { isMd, isSm } = useKankregLayout();
  const titleSize =
    Platform.OS === "web"
      ? isMd
        ? 42
        : isSm
          ? 32
          : 28
      : isSm
        ? 26
        : 22;
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionLeft}>
        {index != null ? (
          <Text style={[styles.ix, { color: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold }]}>
            {kankregSectionIndex(index)} {eyebrow ? eyebrow.split("—").pop()?.trim() || eyebrow : ""}
          </Text>
        ) : eyebrow ? (
          <Text style={createKankregEyebrowStyle(isDark)}>{eyebrow}</Text>
        ) : null}
        {eyebrow && index != null ? (
          <Text style={createKankregEyebrowStyle(isDark)}>{eyebrow}</Text>
        ) : null}
        <Text
          style={[
            styles.title,
            { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink, fontSize: titleSize, lineHeight: titleSize + 2 },
          ]}
        >
          {title}
        </Text>
        <GoldHairline marginVertical={spacing.sm} short />
      </View>
      {right ? <View style={styles.sectionRight}>{right}</View> : null}
    </View>
  );
}

export function KankregPageWrap({ children, style }) {
  const { pageGutterClamp } = useKankregLayout();
  return (
    <View style={[styles.wrap, { paddingHorizontal: pageGutterClamp }, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

export function KankregCheckoutSteps({ active = 2 }) {
  const { isXs } = useKankregLayout();
  const hideLabels = isXs;
  const steps = ["Bag", "Address", "Payment", "Confirm"];
  return (
    <View style={styles.steps}>
      {steps.map((label, i) => {
        const done = i < active;
        const on = i === active;
        return (
          <View
            key={label}
            style={[
              styles.step,
              { borderBottomColor: done ? KANKREG_PALETTE.green : on ? KANKREG_PALETTE.gold : KANKREG_PALETTE.line },
            ]}
          >
            <View
              style={[
                styles.stepNum,
                done && styles.stepNumDone,
                on && styles.stepNumOn,
              ]}
            >
              <Text style={[styles.stepNumText, (done || on) && styles.stepNumTextOn]}>
                {done ? "✓" : String(i + 1)}
              </Text>
            </View>
            {hideLabels ? null : (
              <Text style={[styles.stepLabel, (done || on) && styles.stepLabelOn]}>{label}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

export function KankregGrainOverlay() {
  if (Platform.OS !== "web") return null;
  return <View style={styles.grain} />;
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  inner: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: Platform.select({ web: spacing.lg + 6, default: spacing.md }),
    flexWrap: "wrap",
    gap: spacing.md,
  },
  sectionLeft: { flex: 1, minWidth: 200 },
  sectionRight: { flexShrink: 0 },
  ix: {
    fontFamily: FONT_DISPLAY,
    fontSize: 13,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: Platform.OS === "web" ? 42 : typography.h2 + 6,
    fontWeight: "400",
    lineHeight: Platform.OS === "web" ? 44 : typography.h2 + 8,
    letterSpacing: -0.5,
  },
  steps: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.sm + 2,
    borderBottomWidth: 2,
    gap: 6,
  },
  stepNum: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: KANKREG_PALETTE.paper2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumDone: { backgroundColor: KANKREG_PALETTE.green },
  stepNumOn: { backgroundColor: KANKREG_PALETTE.gold },
  stepNumText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.inkFaint,
  },
  stepNumTextOn: { color: "#fff" },
  stepLabel: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.inkFaint,
  },
  stepLabelOn: { color: KANKREG_PALETTE.ink },
  grain: {
    ...Platform.select({
      web: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.045,
        zIndex: 200,
        pointerEvents: "none",
      },
      default: { display: "none" },
    }),
  },
});

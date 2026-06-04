import { Platform, StyleSheet } from "react-native";
import { KANKREG_PALETTE, KANKREG_RADIUS } from "./kankregWeb";
import { FONT_DISPLAY } from "./customerAlchemy";
import { fonts, typography } from "./tokens";

/** Section index label like kankreg.html `.ix` */
export function kankregSectionIndex(index) {
  const n = String(index).padStart(2, "0");
  return `${n} —`;
}

export function createKankregEyebrowStyle(isDark) {
  return {
    fontFamily: fonts.semibold,
    fontSize: typography.overline,
    letterSpacing: 3.6,
    textTransform: "uppercase",
    color: isDark ? "#e8c878" : KANKREG_PALETTE.gold,
  };
}

export function createKankregCardShell(isDark) {
  return {
    backgroundColor: isDark ? "#181513" : KANKREG_PALETTE.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? "#3f3933" : KANKREG_PALETTE.line,
    borderRadius: KANKREG_RADIUS.card,
    ...Platform.select({
      web: {
        boxShadow: isDark
          ? "0 14px 38px -20px rgba(0,0,0,0.45)"
          : "0 1px 2px rgba(25,20,15,.04), 0 14px 38px -20px rgba(25,20,15,.28)",
      },
      default: {},
    }),
  };
}

export function createKankregDisplayTitle(size = typography.h2) {
  return {
    fontFamily: FONT_DISPLAY,
    fontSize: size,
    letterSpacing: -0.5,
    lineHeight: size * 1.05,
    color: KANKREG_PALETTE.ink,
  };
}

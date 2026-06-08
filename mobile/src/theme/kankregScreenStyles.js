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

export function createKankregDisplayTitle(size = typography.h2, isDark = false) {
  return {
    fontFamily: FONT_DISPLAY,
    fontSize: size,
    letterSpacing: -0.5,
    lineHeight: size * 1.05,
    color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink,
  };
}

/** Result count line on shop / list pages */
export function createKankregResultMeta(isDark) {
  return {
    fontSize: 13,
    lineHeight: 18,
    color: isDark ? "rgba(245, 239, 228, 0.72)" : KANKREG_PALETTE.inkFaint,
  };
}

export function createKankregResultBold(isDark) {
  return {
    color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
  };
}

/** Shared page block spacing inside KankregPageWrap */
export const KANKREG_PAGE_SECTION_GAP = 18;

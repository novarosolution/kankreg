import { Platform } from "react-native";
import { KANKREG_PALETTE } from "./kankregWeb";
import { ALCHEMY } from "./customerAlchemy";

/** Shared shop page + filter tokens — light & dark. */
export function getShopTheme(isDark = false) {
  return {
    pageBg: isDark ? "transparent" : "transparent",
    surface: isDark ? "rgba(255,255,255,0.045)" : KANKREG_PALETTE.card,
    surfaceMuted: isDark ? "rgba(255,255,255,0.03)" : ALCHEMY.creamAlt,
    surfaceChip: isDark ? "rgba(255,255,255,0.07)" : KANKREG_PALETTE.paper2,
    border: isDark ? "rgba(232, 200, 90, 0.2)" : KANKREG_PALETTE.line,
    borderStrong: isDark ? "rgba(232, 200, 90, 0.32)" : ALCHEMY.lineStrong,
    borderTopAccent: isDark ? "rgba(232, 200, 90, 0.55)" : ALCHEMY.gold,
    text: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink,
    textMuted: isDark ? "rgba(245, 239, 228, 0.76)" : KANKREG_PALETTE.inkSoft,
    textFaint: isDark ? "rgba(245, 239, 228, 0.55)" : KANKREG_PALETTE.inkFaint,
    accent: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.goldDeep,
    accentSoft: isDark ? "rgba(232, 200, 90, 0.14)" : "rgba(201, 162, 39, 0.12)",
    chipOnBg: isDark ? KANKREG_PALETTE.goldDeep : KANKREG_PALETTE.ink,
    chipOnBorder: isDark ? KANKREG_PALETTE.gold : KANKREG_PALETTE.ink,
    chipOnText: KANKREG_PALETTE.paper,
    sectionIcon: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.goldDeep,
    track: isDark ? "rgba(255,255,255,0.1)" : KANKREG_PALETTE.paper2,
    trackFill: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold,
    knob: isDark ? "#1a1714" : KANKREG_PALETTE.card,
    knobBorder: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.goldDeep,
    checkOn: isDark ? KANKREG_PALETTE.goldDeep : KANKREG_PALETTE.ink,
    checkBorder: isDark ? "rgba(232, 200, 90, 0.3)" : KANKREG_PALETTE.line,
    panelGradient: isDark
      ? undefined
      : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,253,250,0.98))",
    panelShadow: isDark
      ? "0 22px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)"
      : "0 18px 40px rgba(61, 42, 18, 0.09), inset 0 1px 0 rgba(255,255,255,0.92)",
    cardShadow: Platform.select({
      web: {
        boxShadow: isDark
          ? "0 14px 36px -12px rgba(0,0,0,0.45)"
          : "0 12px 32px -16px rgba(61, 42, 18, 0.14)",
      },
      default: {},
    }),
  };
}

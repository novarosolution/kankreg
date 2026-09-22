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
    border: isDark ? "rgba(228, 197, 106, 0.2)" : KANKREG_PALETTE.line,
    borderStrong: isDark ? "rgba(228, 197, 106, 0.32)" : ALCHEMY.lineStrong,
    borderTopAccent: isDark ? KANKREG_PALETTE.gold : KANKREG_PALETTE.green,
    text: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink,
    textMuted: isDark ? "rgba(245, 239, 228, 0.76)" : KANKREG_PALETTE.inkSoft,
    textFaint: isDark ? "rgba(245, 239, 228, 0.55)" : KANKREG_PALETTE.inkFaint,
    accent: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.green,
    accentSoft: isDark ? "rgba(228, 197, 106, 0.14)" : "rgba(26, 92, 72, 0.1)",
    chipOnBg: isDark ? KANKREG_PALETTE.goldDeep : KANKREG_PALETTE.green,
    chipOnBorder: isDark ? KANKREG_PALETTE.gold : KANKREG_PALETTE.green,
    chipOnText: KANKREG_PALETTE.card,
    sectionIcon: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.green,
    track: isDark ? "rgba(255,255,255,0.1)" : KANKREG_PALETTE.paper2,
    trackFill: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.green,
    knob: isDark ? "#1a1714" : KANKREG_PALETTE.card,
    knobBorder: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.greenDeep,
    checkOn: isDark ? KANKREG_PALETTE.goldDeep : KANKREG_PALETTE.green,
    checkBorder: isDark ? "rgba(228, 197, 106, 0.3)" : KANKREG_PALETTE.line,
    panelGradient: isDark
      ? undefined
      : "none",
    panelShadow: isDark
      ? "0 22px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)"
      : "0 8px 24px rgba(26, 92, 72, 0.06)",
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

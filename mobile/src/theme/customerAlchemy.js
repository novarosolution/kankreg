/**
 * Shared heritage palette and display font names (kankreg.html / Fraunces).
 * Loaded in App.js — see FONT_DISPLAY_*.
 */

import { KANKREG_PALETTE } from "./kankregWeb";

export const FONT_DISPLAY = "Fraunces_700Bold";
export const FONT_DISPLAY_SEMI = "Fraunces_600SemiBold";
export const FONT_DISPLAY_ITALIC = "Fraunces_400Regular_Italic";

export const ALCHEMY = {
  cream: KANKREG_PALETTE.paper,
  creamDeep: KANKREG_PALETTE.paper2,
  creamAlt: KANKREG_PALETTE.card,
  creamAltDeep: "#f8f2e8",
  creamHighlight: KANKREG_PALETTE.card,
  ivory: "#ffffff",
  pearl: KANKREG_PALETTE.paper2,
  brown: KANKREG_PALETTE.inkSoft,
  brownMuted: KANKREG_PALETTE.inkFaint,
  brownInk: KANKREG_PALETTE.ink,
  gold: KANKREG_PALETTE.gold,
  goldDeep: KANKREG_PALETTE.goldDeep,
  goldBright: KANKREG_PALETTE.goldBright,
  goldSoft: "rgba(169, 119, 46, 0.13)",
  goldMist: "rgba(214, 173, 91, 0.22)",
  pillInactive: KANKREG_PALETTE.lineSoft,
  cardBeige: KANKREG_PALETTE.paper,
  cardBg: KANKREG_PALETTE.card,
  line: "rgba(169, 119, 46, 0.35)",
  lineStrong: "rgba(138, 95, 34, 0.45)",
  veil: "rgba(255, 253, 248, 0.85)",
  green: KANKREG_PALETTE.green,
  danger: KANKREG_PALETTE.danger,
};

/**
 * Background gradient for CustomerScreenShell.
 */
export function getCustomerShellGradient(isDark, themeColors) {
  const c = themeColors;
  if (isDark) {
    return ["#050403", "#0B0806", "#17120F", c.backgroundGradientEnd];
  }
  return [KANKREG_PALETTE.card, KANKREG_PALETTE.paper, KANKREG_PALETTE.paper2, "#e8e3d8"];
}

export function getAlchemyPalette(themeColors, isDark) {
  const c = themeColors;
  return {
    card: isDark ? c.surfaceElevated || c.surface : ALCHEMY.cardBg,
    cardBorder: isDark ? c.border : KANKREG_PALETTE.line,
    line: isDark ? c.dividerSoft || c.border : ALCHEMY.line,
    lineStrong: isDark ? c.borderStrong : ALCHEMY.lineStrong,
    goldSoft: isDark ? c.primarySoft : ALCHEMY.goldSoft,
    goldRing: isDark ? c.primaryBorder : ALCHEMY.gold,
    glowPrimary: c.heroGlow || (isDark ? "rgba(214, 173, 91, 0.16)" : "rgba(214, 173, 91, 0.12)"),
    glowSecondary:
      c.heroGlowSecondary || (isDark ? "rgba(60, 98, 72, 0.1)" : "rgba(60, 98, 72, 0.06)"),
  };
}

export const CUSTOMER_SHELL_GRADIENT_LOCATIONS = [0, 0.28, 0.6, 1];

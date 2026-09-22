/**
 * Shared heritage palette + shell helpers (no platform font names).
 * Imported by `customerAlchemy.js` (native) and `customerAlchemy.web.js` (web).
 */
import { KANKREG_PALETTE } from "./kankregWeb";

export const ALCHEMY = {
  cream: KANKREG_PALETTE.paper,
  creamDeep: KANKREG_PALETTE.paper2,
  creamAlt: KANKREG_PALETTE.card,
  creamAltDeep: "#F5F6F5",
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
  line: "rgba(26, 92, 72, 0.22)",
  lineStrong: "rgba(26, 92, 72, 0.38)",
  veil: "rgba(255, 255, 255, 0.88)",
  green: KANKREG_PALETTE.green,
  danger: KANKREG_PALETTE.danger,
};

/** Background gradient for CustomerScreenShell. */
export function getCustomerShellGradient(isDark, themeColors) {
  const c = themeColors;
  if (isDark) {
    return ["#050403", "#0B0806", "#17120F", c.backgroundGradientEnd];
  }
  return ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
}

export function getAlchemyPalette(themeColors, isDark) {
  const c = themeColors;
  return {
    card: isDark ? c.surfaceElevated || c.surface : ALCHEMY.cardBg,
    cardBorder: isDark ? c.border : KANKREG_PALETTE.line,
    line: isDark ? c.dividerSoft || c.border : ALCHEMY.line,
    lineStrong: isDark ? c.borderStrong : ALCHEMY.lineStrong,
    goldSoft: isDark ? c.primarySoft : "rgba(26, 92, 72, 0.1)",
    goldRing: isDark ? c.primaryBorder : KANKREG_PALETTE.green,
    glowPrimary: c.heroGlow || (isDark ? "rgba(228, 197, 106, 0.16)" : "rgba(26, 92, 72, 0.08)"),
    glowSecondary:
      c.heroGlowSecondary || (isDark ? "rgba(26, 92, 72, 0.12)" : "rgba(26, 92, 72, 0.05)"),
  };
}

export const CUSTOMER_SHELL_GRADIENT_LOCATIONS = [0, 0.28, 0.6, 1];

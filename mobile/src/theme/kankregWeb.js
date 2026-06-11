/**
 * Maps kankreg.html CSS variables to React Native theme tokens.
 * @see kankreg.html :root
 */

export const KANKREG_PALETTE = {
  ink: "#19140f",
  inkSoft: "#574d42",
  inkFaint: "#6B5E50",
  paper: "#f5efe4",
  paper2: "#ece3d2",
  card: "#fffdf8",
  line: "#e3d8c4",
  lineSoft: "#eee5d5",
  gold: "#a9772e",
  goldBright: "#d6ad5b",
  goldDeep: "#8a5f22",
  green: "#3c6248",
  danger: "#a8442f",
};

/** Web chrome — matches kankreg homepage screenshot (announce, header, trust band, CTAs). */
export const KANKREG_CHROME = {
  /** Top announce strip — dark forest green */
  announceBg: "#1B3022",
  /** Nav topbar + trust band — warm off-white cream */
  cream: "#FDF9F0",
  topbarBg: "#FDF9F0",
  buttonAccent: "#A67C37",
  buttonAccentHover: "#B88A45",
  onAccent: "#FFFFFF",
};

/** Display radius from HTML --r */
export const KANKREG_RADIUS = {
  card: 20,
  control: 13,
};

/**
 * Theme-aware surface tokens — use with `useTheme()` colors in customer UI.
 * @param {boolean} isDark
 * @param {import("./tokens").typeof lightColors} c
 */
export function getKankregSurfaces(isDark, c) {
  return {
    background: isDark ? c.background : KANKREG_PALETTE.paper,
    card: isDark ? c.surface : KANKREG_PALETTE.card,
    cardMuted: isDark ? c.surfaceMuted : KANKREG_PALETTE.paper2,
    text: isDark ? c.textPrimary : KANKREG_PALETTE.ink,
    textSoft: isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft,
    textMuted: isDark ? c.textMuted : KANKREG_PALETTE.inkFaint,
    border: isDark ? c.border : KANKREG_PALETTE.line,
    borderSubtle: isDark ? "rgba(232, 200, 90, 0.18)" : KANKREG_PALETTE.lineSoft,
    inkBar: isDark ? c.surfaceMuted : KANKREG_PALETTE.ink,
    pillInactive: isDark ? "rgba(255,255,255,0.06)" : KANKREG_PALETTE.paper2,
    gold: isDark ? c.primary : KANKREG_PALETTE.gold,
    goldBright: isDark ? c.primaryBright : KANKREG_PALETTE.goldBright,
    goldDeep: isDark ? c.primaryDark : KANKREG_PALETTE.goldDeep,
    cardShadow: isDark
      ? "0 14px 38px -20px rgba(0,0,0,0.45)"
      : "0 1px 2px rgba(25,20,15,.04), 0 14px 38px -20px rgba(25,20,15,.28)",
  };
}

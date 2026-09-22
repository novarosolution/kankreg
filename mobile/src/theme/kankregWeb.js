/**
 * Maps kankreg.html CSS variables to React Native theme tokens.
 * @see kankreg.html :root
 */

export const KANKREG_PALETTE = {
  ink: "#1A2B22",
  inkSoft: "#4A5C53",
  inkFaint: "#6B7A72",
  paper: "#FFFFFF",
  paper2: "#F5F6F5",
  card: "#FFFFFF",
  line: "rgba(26, 92, 72, 0.14)",
  lineSoft: "rgba(26, 92, 72, 0.08)",
  gold: "#E4C56A",
  goldBright: "#EED77A",
  goldDeep: "#C4A24A",
  green: "#1A5C48",
  greenDeep: "#154C3C",
  danger: "#A8442F",
};

/** Web chrome — matches kankreg homepage screenshot (announce, header, trust band, CTAs). */
export const KANKREG_CHROME = {
  /** Top announce strip — forest green storefront bar */
  announceBg: "#1A5C48",
  /** Full-bleed storefront footer */
  footerBg: "#1A5C48",
  footerGold: "#E4C56A",
  footerOnGreen: "#F3EEE4",
  /** Nav topbar — white like a retail storefront */
  cream: "#FFFFFF",
  topbarBg: "#FFFFFF",
  navInk: "#2F3F36",
  navAccent: "#2F8F4E",
  buttonAccent: "#A67C37",
  buttonAccentHover: "#B88A45",
  onAccent: "#FFFFFF",
  /** Home "chapter" section tints — gives adjacent editorial sections a soft
   *  distinct wash instead of every section reading as the same flat cream card. */
  sectionGoldWash: "#FBF2DE",
  sectionGoldWashDark: "rgba(30, 24, 16, 0.78)",
  sectionGreenWash: "#F0F4EA",
  sectionGreenWashDark: "rgba(18, 23, 19, 0.78)",
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
    borderSubtle: isDark ? "rgba(26, 92, 72, 0.28)" : KANKREG_PALETTE.lineSoft,
    inkBar: isDark ? c.surfaceMuted : KANKREG_PALETTE.ink,
    pillInactive: isDark ? "rgba(255,255,255,0.06)" : KANKREG_PALETTE.paper2,
    gold: isDark ? c.primary : KANKREG_PALETTE.green,
    goldBright: isDark ? c.primaryBright : KANKREG_CHROME.footerGold,
    goldDeep: isDark ? c.primaryDark : KANKREG_PALETTE.greenDeep,
    cardShadow: isDark
      ? "0 14px 38px -20px rgba(0,0,0,0.45)"
      : "0 1px 2px rgba(25,20,15,.04), 0 14px 38px -20px rgba(25,20,15,.28)",
  };
}

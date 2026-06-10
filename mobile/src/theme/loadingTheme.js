import { KANKREG_PALETTE } from "./kankregWeb";

/** Loading states — aligned with `reference/loading-states.html` tokens. */
export const LOADING_THEME = {
  shimmerLight: ["#ece3d2", "#f5eedd", "#ece3d2"],
  shimmerDark: ["rgba(255,255,255,0.05)", "rgba(232,200,90,0.24)", "rgba(255,255,255,0.05)"],
  skeletonBaseLight: "#ece3d2",
  skeletonBaseDark: "rgba(255,255,255,0.09)",
  skeletonBorderDark: "rgba(232,200,90,0.14)",
  paper2: KANKREG_PALETTE.paper2,
  gold: KANKREG_PALETTE.gold,
  goldBright: KANKREG_PALETTE.goldBright,
  goldDeep: KANKREG_PALETTE.goldDeep,
  splashRadialLight: ["#ead9b2", "#b6985c", "#2a241e"],
  splashRadialDark: ["#2a241e", "#1a1714", "#050403"],
  shimmerDurationMs: 1500,
  ringDurationMs: 1000,
  dotsDurationMs: 1200,
  progressDurationMs: 1400,
};

/** Theme-aware palette for skeletons, dots, rings, and progress bars. */
export function getLoadingPalette(isDark, colors) {
  return {
    skeletonBase: isDark ? LOADING_THEME.skeletonBaseDark : LOADING_THEME.skeletonBaseLight,
    skeletonShimmer: isDark ? LOADING_THEME.shimmerDark : LOADING_THEME.shimmerLight,
    skeletonBorder: isDark ? LOADING_THEME.skeletonBorderDark : "rgba(116, 79, 28, 0.08)",
    dot: isDark ? LOADING_THEME.goldBright : LOADING_THEME.gold,
    ring: isDark ? LOADING_THEME.goldBright : LOADING_THEME.goldDeep,
    track: isDark ? "rgba(255,255,255,0.1)" : LOADING_THEME.paper2,
    fill: isDark ? LOADING_THEME.goldBright : LOADING_THEME.gold,
    shellBg: isDark ? colors?.background || "#050403" : KANKREG_PALETTE.paper,
    panelBg: isDark ? colors?.surface || "#181513" : KANKREG_PALETTE.card,
    panelBorder: isDark ? colors?.border || "#3F3933" : KANKREG_PALETTE.line,
    caption: isDark ? "rgba(245,239,228,0.88)" : "rgba(255,255,255,0.85)",
    footnote: isDark ? "rgba(245,239,228,0.72)" : "rgba(255,255,255,0.7)",
  };
}

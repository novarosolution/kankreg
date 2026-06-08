import { Platform } from "react-native";

/**
 * Brand: gold primary, green secondary. Customer UI uses `useTheme()` for light/dark.
 */

/** @type {const} 8px-based spacing */
export const spacing = {
  xxs: 4,
  xxxs: 2,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

/** Hanken Grotesk (loaded in App.js) — matches kankreg.html --body */
export const fonts = {
  regular: "HankenGrotesk_400Regular",
  medium: "HankenGrotesk_500Medium",
  semibold: "HankenGrotesk_600SemiBold",
  bold: "HankenGrotesk_700Bold",
  extrabold: "HankenGrotesk_800ExtraBold",
};

export const typography = {
  h1: 32,
  h2: 28,
  h3: 23,
  body: 16,
  bodySmall: 14,
  caption: 13,
  overline: 11,
};

/** Optional line heights — pair with `typography.*` for consistent vertical rhythm. */
export const lineHeight = {
  h1: 40,
  h2: 36,
  h3: 30,
  body: 24,
  bodySmall: 21,
  caption: 18,
  overline: 15,
};

export const radius = {
  xs: 8,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 20,
  pill: 999,
};

export const semanticRadius = {
  control: radius.md,
  card: radius.xxl,
  panel: radius.xxl,
  full: radius.pill,
};

/**
 * Ionicons / MaterialCommunityIcons sizes — use instead of magic numbers
 * so tap targets and visual rhythm stay consistent across customer + admin UI.
 */
export const icon = {
  micro: 12,
  tiny: 13,
  xs: 15,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24,
  xxl: 28,
  /** Native bottom tab bar — slightly larger for legibility */
  tabBar: 22,
  /** Web sticky header nav icons */
  webNav: 22,
  /** Home top bar (menu, cart) */
  nav: 26,
  /** Empty states, large placeholders */
  display: 36,
  displayLg: 40,
  displayXl: 44,
  /** Empty states, cart hero */
  promo: 30,
};

/** Light — kankreg.html palette */
export const lightColors = {
  background: "#f5efe4",
  backgroundGradientEnd: "#ece3d2",
  surface: "#fffdf8",
  surfaceMuted: "#ece3d2",
  surfaceGlass: "rgba(255,253,248,0.94)",
  border: "#e3d8c4",
  borderStrong: "#d4c9b4",
  textPrimary: "#19140f",
  textSecondary: "#574d42",
  textMuted: "#938778",
  primary: "#a9772e",
  primaryBright: "#d6ad5b",
  primaryDark: "#8a5f22",
  primarySoft: "rgba(169, 119, 46, 0.13)",
  primaryBorder: "rgba(169, 119, 46, 0.35)",
  secondary: "#3c6248",
  secondaryBright: "#4d7a5c",
  secondaryDark: "#2f4d39",
  secondarySoft: "rgba(60, 98, 72, 0.13)",
  secondaryBorder: "rgba(60, 98, 72, 0.35)",
  accentGold: "#d6ad5b",
  accentGoldSoft: "rgba(169, 119, 46, 0.13)",
  navy: "#19140f",
  onPrimary: "#f5efe4",
  onPrimaryMuted: "#ece3d2",
  heroBackground: "#19140f",
  heroForeground: "#f5efe4",
  heroAccent: "#d6ad5b",
  success: "#3c6248",
  danger: "#a8442f",
  accentGreen: "#3c6248",
  brandYellow: "#d6ad5b",
  brandYellowSoft: "rgba(169, 119, 46, 0.13)",
  shadow: "#19140f",
  searchBarFill: "#fffdf8",
  searchBarBorder: "#e3d8c4",
  onSecondary: "#fffdf8",
  surfaceElevated: "#fffdf8",
  surfaceOverlay: "rgba(255,253,248,0.88)",
  focusRing: "rgba(169, 119, 46, 0.36)",
  heroGlow: "rgba(214, 173, 91, 0.12)",
  heroGlowSecondary: "rgba(60, 98, 72, 0.06)",
  dividerSoft: "rgba(147, 135, 120, 0.2)",
};

/** Dark — warm gold on dark, mint green accents */
export const darkColors = {
  background: "#050403",
  backgroundGradientEnd: "#14110F",
  surface: "#181513",
  surfaceMuted: "#24201D",
  surfaceGlass: "rgba(28,25,23,0.97)",
  border: "#3F3933",
  borderStrong: "#595149",
  textPrimary: "#FAFAF9",
  textSecondary: "#CEC7BF",
  textMuted: "#B2A89E",
  primary: "#d6ad5b",
  primaryBright: "#e8c878",
  primaryDark: "#a9772e",
  primarySoft: "rgba(212,175,55,0.12)",
  primaryBorder: "rgba(232,200,90,0.35)",
  secondary: "#34D399",
  secondaryBright: "#6EE7B7",
  secondaryDark: "#10B981",
  secondarySoft: "rgba(16,185,129,0.12)",
  secondaryBorder: "rgba(52,211,153,0.35)",
  accentGold: "#E2BA5A",
  accentGoldSoft: "rgba(212,175,55,0.12)",
  navy: "#FAFAF9",
  onPrimary: "#FFFCF8",
  onPrimaryMuted: "#F5F0E1",
  heroBackground: "#0C0A09",
  heroForeground: "#FFFBF0",
  heroAccent: "#C79A3A",
  success: "#34D399",
  danger: "#F87171",
  accentGreen: "#4ADE80",
  brandYellow: "#E8C547",
  brandYellowSoft: "rgba(212,175,55,0.12)",
  shadow: "#000000",
  searchBarFill: "#292524",
  searchBarBorder: "#44403C",
  onSecondary: "#FFFFFF",
  surfaceElevated: "#1A1612",
  surfaceOverlay: "rgba(18,16,14,0.9)",
  focusRing: "rgba(232, 200, 90, 0.42)",
  heroGlow: "rgba(232, 200, 90, 0.16)",
  heroGlowSecondary: "rgba(52, 211, 153, 0.1)",
  dividerSoft: "rgba(255,255,255,0.08)",
};

export const colors = lightColors;

export const layout = {
  maxContentWidth: Platform.select({ web: 1180, default: 1000 }),
};

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const container = {
  compact: 720,
  content: layout.maxContentWidth,
  expanded: 1320,
  gutter: {
    mobile: spacing.md,
    tablet: spacing.lg,
    desktop: spacing.xxl + 4,
  },
};

export const elevation = {
  flat: 0,
  raised: 1,
  floating: 2,
  overlay: 3,
};

function webShadowLift(isDark) {
  return {
    boxShadow: isDark
      ? "0 22px 58px rgba(0,0,0,0.54), 0 8px 22px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)"
      : "0 18px 46px rgba(61, 42, 18, 0.1), 0 8px 20px rgba(28, 25, 23, 0.055), 0 0 0 1px rgba(199, 154, 58, 0.08), inset 0 1px 0 rgba(255, 253, 251, 0.98)",
  };
}

function webShadowPremium(isDark) {
  return {
    boxShadow: isDark
      ? "0 44px 110px rgba(0,0,0,0.68), 0 20px 46px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 36px 88px rgba(61, 42, 18, 0.13), 0 16px 38px rgba(28, 25, 23, 0.07), 0 2px 9px rgba(116, 79, 28, 0.08), 0 0 0 1px rgba(199, 154, 58, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.92)",
  };
}

export function getShadow(isDark) {
  return Platform.select({
    ios: {
      shadowColor: isDark ? "#000000" : "#1C1917",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.34 : 0.075,
      shadowRadius: 18,
    },
    android: { elevation: isDark ? 3 : 2 },
    web: {
      boxShadow: isDark
        ? "0 8px 28px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15)"
        : "0 10px 30px rgba(61, 42, 18, 0.08), 0 3px 12px rgba(28, 25, 23, 0.05), inset 0 1px 0 rgba(255,255,255,0.75)",
    },
  });
}

export function getShadowLift(isDark) {
  return Platform.select({
    ios: {
      shadowColor: isDark ? "#000000" : "#1C1917",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: isDark ? 0.42 : 0.085,
      shadowRadius: 32,
    },
    android: { elevation: isDark ? 6 : 4 },
    web: webShadowLift(isDark),
  });
}

export function getShadowPremium(isDark) {
  return Platform.select({
    ios: {
      shadowColor: isDark ? "#000000" : "#2A1F12",
      shadowOffset: { width: 0, height: 22 },
      shadowOpacity: isDark ? 0.48 : 0.13,
      shadowRadius: 52,
    },
    android: { elevation: isDark ? 8 : 5 },
    web: webShadowPremium(isDark),
  });
}

export const semanticText = {
  display: {
    fontSize: typography.h1,
    lineHeight: lineHeight.h1,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: typography.h2,
    lineHeight: lineHeight.h2,
    letterSpacing: -0.3,
  },
  section: {
    fontSize: typography.h3,
    lineHeight: lineHeight.h3,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: typography.body,
    lineHeight: lineHeight.body,
    letterSpacing: 0,
  },
  bodyCompact: {
    fontSize: typography.bodySmall,
    lineHeight: lineHeight.bodySmall,
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: typography.caption,
    lineHeight: lineHeight.caption,
    letterSpacing: 0.15,
  },
  overline: {
    fontSize: typography.overline,
    lineHeight: lineHeight.overline,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
};

export function getSemanticColors(c) {
  return {
    bg: {
      page: c.background,
      pageGradientEnd: c.backgroundGradientEnd,
      surface: c.surface,
      muted: c.surfaceMuted,
      glass: c.surfaceGlass,
      elevated: c.surfaceElevated ?? c.surface,
      overlay: c.surfaceOverlay ?? c.surfaceGlass,
    },
    text: {
      primary: c.textPrimary,
      secondary: c.textSecondary,
      muted: c.textMuted,
      onPrimary: c.onPrimary,
      onSecondary: c.onSecondary,
    },
    border: {
      subtle: c.border,
      divider: c.dividerSoft ?? c.border,
      strong: c.borderStrong,
      accent: c.primaryBorder,
      focus: c.focusRing ?? c.primaryBorder,
    },
    accent: {
      primary: c.primary,
      primaryStrong: c.primaryDark,
      secondary: c.secondary,
      success: c.success,
      danger: c.danger,
      heroGlow: c.heroGlow ?? c.primarySoft,
      heroGlowSecondary: c.heroGlowSecondary ?? c.secondarySoft,
    },
  };
}

export const shadow = getShadow(false);
export const shadowLift = getShadowLift(false);
export const shadowPremium = getShadowPremium(false);

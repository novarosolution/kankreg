import { Platform, StyleSheet } from "react-native";
import { ALCHEMY } from "./customerAlchemy";
import { darkColors, getSemanticColors, layout, semanticRadius, spacing } from "./tokens";

function themeIsDark(c) {
  return c?.textPrimary === darkColors.textPrimary;
}

/**
 * Shared “premium” panel for admin screens — warm editorial card in light mode (aligned with customer panels).
 * @param {boolean} [isDark] omit to infer from `c.textPrimary` vs theme dark palette
 */
export function adminPanel(c, shadowPremium, isDark) {
  const dark = typeof isDark === "boolean" ? isDark : themeIsDark(c);
  const semantic = getSemanticColors(c);
  const base = {
    backgroundColor: dark ? semantic.bg.surface : ALCHEMY.cardBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: dark ? semantic.border.subtle : ALCHEMY.line,
    borderRadius: semanticRadius.panel,
    borderTopWidth: 3,
    borderTopColor: dark ? semantic.border.accent : ALCHEMY.gold,
    padding: spacing.lg + 10,
    ...shadowPremium,
  };
  if (Platform.OS !== "web" || !shadowPremium?.boxShadow) {
    return base;
  }
  const inset = dark
    ? "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)"
    : "inset 0 0 0 1px rgba(255,253,249,0.72), inset 0 1px 0 rgba(255,253,251,0.92)";
  return {
    ...base,
    boxShadow: `${shadowPremium.boxShadow}, ${inset}`,
    ...(Platform.OS === "web"
      ? {
          transition: "box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease",
        }
      : {}),
  };
}

/**
 * Grouped “module” on the admin dashboard (and similar stacked tools).
 * Light: warm card; dark: slightly lifted surface.
 */
export function adminModuleSection(isDark, c) {
  const semantic = getSemanticColors(c);
  return {
    marginBottom: spacing.lg,
    borderRadius: semanticRadius.card,
    padding: spacing.md + 6,
    paddingTop: spacing.sm,
    backgroundColor: isDark ? semantic.bg.muted : ALCHEMY.creamAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? semantic.border.subtle : ALCHEMY.pillInactive,
    borderLeftWidth: 3,
    borderLeftColor: c.primary,
    ...Platform.select({
      ios: {
        shadowColor: isDark ? "#000" : "#3D2A12",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.22 : 0.06,
        shadowRadius: 10,
      },
      android: { elevation: isDark ? 2 : 1 },
      web: {
        boxShadow: isDark
          ? "0 14px 36px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 14px 36px rgba(61, 42, 18, 0.09), 0 4px 12px rgba(28, 25, 23, 0.045), inset 0 1px 0 rgba(255,253,251,0.88), inset 0 0 0 1px rgba(255,253,249,0.5)",
        transition: "box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
      },
      default: {},
    }),
  };
}

/** Root view for admin screens — centered column on web. */
export function adminScreenRoot(c) {
  return {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    maxWidth: Platform.select({ web: layout.maxContentWidth + 72, default: "100%" }),
    backgroundColor: c?.background ?? "transparent",
  };
}

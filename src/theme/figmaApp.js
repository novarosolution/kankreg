/**
 * Native app design tokens from figmaforkankreg.html
 * @see /figmaforkankreg.html :root + screen specs
 */
import { Platform, StyleSheet } from "react-native";
import { KANKREG_PALETTE } from "./kankregWeb";
import { FONT_DISPLAY } from "./customerAlchemy";
import { fonts, spacing } from "./tokens";

export const FIGMA = {
  ...KANKREG_PALETTE,
  tabBarHeight: 66,
  radiusCard: 16,
  radiusControl: 11,
  radiusHero: 20,
  radiusSheet: 26,
  gutter: 16,
  productTileGradients: [
    ["#f3e7cc", "#e3cfa6"],
    ["#e7eee6", "#cdddcf"],
    ["#f1e3d6", "#dcc3ad"],
    ["#f4e6d2", "#e0b98f"],
    ["#e8e9ee", "#cdd2dc"],
  ],
};

export function figmaEyebrow(isDark = false) {
  return {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 2.6,
    textTransform: "uppercase",
    color: isDark ? FIGMA.goldBright : FIGMA.gold,
  };
}

export function figmaDisplayTitle(size = 22, isDark = false) {
  return {
    fontFamily: FONT_DISPLAY,
    fontSize: size,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: size * 1.08,
    color: isDark ? FIGMA.paper : FIGMA.ink,
  };
}

export function figmaBody(size = 12.5, isDark = false) {
  return {
    fontFamily: fonts.regular,
    fontSize: size,
    lineHeight: size * 1.45,
    color: isDark ? "rgba(245, 239, 228, 0.85)" : FIGMA.inkSoft,
  };
}

export function figmaCardShell(isDark = false) {
  return {
    backgroundColor: isDark ? "#181513" : FIGMA.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? "#3f3933" : FIGMA.line,
    borderRadius: FIGMA.radiusCard,
    overflow: "hidden",
  };
}

export function figmaPill(active, isDark = false) {
  return {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: active ? FIGMA.ink : isDark ? "#181513" : FIGMA.card,
    borderWidth: active ? 0 : StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
  };
}

export function figmaPillText(active, isDark = false) {
  return {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: active ? FIGMA.paper : isDark ? FIGMA.inkFaint : FIGMA.inkSoft,
  };
}

export function figmaIconCircle(isDark = false) {
  return {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    backgroundColor: isDark ? "#181513" : FIGMA.card,
    alignItems: "center",
    justifyContent: "center",
  };
}

export function figmaStickyFooter(isDark = false) {
  return {
    backgroundColor: isDark ? "rgba(15,12,10,0.97)" : "rgba(255,253,248,0.97)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: FIGMA.line,
    paddingHorizontal: FIGMA.gutter + 2,
    paddingTop: spacing.md,
  };
}

export function figmaNativeShell() {
  return Platform.OS !== "web"
    ? { flex: 1, width: "100%", backgroundColor: FIGMA.paper }
    : {};
}

export function figmaPrice(isDark = false) {
  return {
    fontFamily: FONT_DISPLAY,
    fontSize: 14,
    fontWeight: "600",
    color: isDark ? FIGMA.paper : FIGMA.ink,
  };
}

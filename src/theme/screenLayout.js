import { Platform, StyleSheet } from "react-native";
import { adminPanel } from "./adminLayout";
import { ALCHEMY } from "./customerAlchemy";
import { platformElevation, sectionStackGap } from "./platformStyles";
import { container, layout, semanticRadius, spacing } from "./tokens";
import { getKankregChromeTop } from "../components/kankreg/KankregSiteHeader";
import { WEB_CHROME_TOP } from "./web";

/**
 * Customer-facing panels: warm card in light mode, theme surface in dark — aligned with Home catalog cards.
 * @param {boolean} isDark from `useTheme()`
 */
export function customerPanel(c, shadowPremium, isDark) {
  const admin = adminPanel(c, shadowPremium, isDark);
  return {
    ...admin,
    borderRadius: semanticRadius.panel,
    borderTopWidth: 3,
    padding: Platform.select({
      web: spacing.lg + 10,
      default: spacing.md + 2,
    }),
    ...(isDark
      ? {
          backgroundColor: c.surface,
          borderColor: c.border,
          borderTopColor: "rgba(232, 200, 90, 0.5)",
        }
      : {
          backgroundColor: ALCHEMY.ivory,
          borderColor: ALCHEMY.lineStrong,
          borderTopColor: ALCHEMY.gold,
        }),
    ...Platform.select({
      web: {
        backgroundImage: isDark
          ? undefined
          : "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,253,250,0.96))",
        boxShadow: isDark
          ? "0 22px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 18px 40px rgba(61, 42, 18, 0.09), inset 0 1px 0 rgba(255,255,255,0.92)",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
      },
      default: {},
    }),
  };
}

export function customerPanelVariant(c, shadowPremium, isDark, variant = "default") {
  const base = customerPanel(c, shadowPremium, isDark);
  if (variant === "soft") {
    return {
      ...base,
      borderTopWidth: 1,
      backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt,
    };
  }
  if (variant === "danger") {
    return {
      ...base,
      borderTopColor: isDark ? "rgba(248, 113, 113, 0.55)" : "rgba(220, 38, 38, 0.4)",
      borderColor: isDark ? "rgba(248, 113, 113, 0.32)" : "rgba(220, 38, 38, 0.2)",
      backgroundColor: isDark ? "rgba(127, 29, 29, 0.12)" : "rgba(220, 38, 38, 0.05)",
    };
  }
  if (variant === "interactive") {
    return {
      ...base,
      ...Platform.select({
        web: {
          ...(base.boxShadow ? { boxShadow: base.boxShadow } : {}),
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
        default: {},
      }),
    };
  }
  return base;
}

/**
 * Login / Register card — softer than customerPanel (no heavy gold top bar; clipped shadow on native).
 */
export function authPanel(c, shadowPremium, isDark, opts = {}) {
  const { compact = false } = opts;
  const radius = 20;
  const padH = compact ? spacing.md + 2 : spacing.xl;
  const padV = compact ? spacing.md + 4 : spacing.xl;
  const base = {
    borderRadius: radius,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: padH,
    paddingVertical: padV,
    ...(isDark
      ? {
          backgroundColor: c.surface,
          borderColor: c.border,
        }
      : {
          backgroundColor: ALCHEMY.ivory,
          borderColor: ALCHEMY.lineStrong,
        }),
    ...platformElevation({
      web: {
        boxShadow: isDark
          ? "0 16px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 12px 32px rgba(61, 42, 18, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
      },
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.22 : 0.08,
        shadowRadius: 18,
      },
      android: { elevation: 3 },
    }),
    ...Platform.select({
      web: {
        backgroundImage: isDark
          ? undefined
          : "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,253,250,0.98))",
      },
      default: {},
    }),
  };
  return base;
}

/**
 * Shared width constraint for customer screens (matches `ScrollView` content + headers).
 * Merge with `padding`, `paddingTop`, and `paddingBottom` as needed per screen.
 *
 * Premium UI baseline: inner pages use {@link customerInnerPageScrollContent} with `ScreenPageHeader`;
 * Home uses {@link customerPageScrollBase}; auth uses {@link authScrollContent}.
 */
export const customerContentWidth = {
  width: "100%",
  alignSelf: "center",
  maxWidth: Platform.select({ web: 1280, default: "100%" }),
};

/** Inner height of floating `BottomNavBar` row (paddingVertical 10×2 + min tab ~44). */
export const CUSTOMER_BOTTOM_NAV_BAR_HEIGHT = 64;

/**
 * Bottom padding for scroll content: clears floating bottom nav + home indicator + breathing room.
 * @param {{ bottom?: number }} [insets] from `useSafeAreaInsets()` (native only)
 */
export function customerScrollPaddingBottom(insets = {}) {
  if (Platform.OS === "web") {
    return spacing.xl;
  }
  const safeBottom = insets?.bottom ?? 0;
  const dockFromBottom = Math.max(spacing.md, safeBottom + 6);
  return dockFromBottom + CUSTOMER_BOTTOM_NAV_BAR_HEIGHT + spacing.md;
}

/** Distance from screen bottom for fixed/sticky UI (e.g. Product CTA) so it clears the floating bottom nav. */
export function customerFloatingNavOffset(insets = {}) {
  if (Platform.OS === "web") {
    return Math.max(insets?.bottom ?? 0, spacing.md);
  }
  const safeBottom = insets?.bottom ?? 0;
  const dockFromBottom = Math.max(spacing.md, safeBottom + 6);
  return dockFromBottom + CUSTOMER_BOTTOM_NAV_BAR_HEIGHT + spacing.sm;
}

/** Admin / auth flows without floating customer bottom nav — home indicator + comfortable end padding. */
export function adminScrollPaddingBottom(insets = {}) {
  if (Platform.OS === "web") {
    return spacing.xl;
  }
  return (insets?.bottom ?? 0) + spacing.xl + spacing.md;
}

/**
 * Safe top inset for scroll content under status bar / web chrome.
 * @param {{ top?: number }} insets from `useSafeAreaInsets()`
 * @param {{ nativeMin?: number; webMin?: number }} [opts] override minimum padding below status bar
 */
export function customerScrollPaddingTop(insets, opts = {}) {
  const { nativeMin = spacing.md, webMin = spacing.md } = opts;
  if (Platform.OS === "web") {
    return getKankregChromeTop(insets) + Math.max(insets?.top ?? 0, webMin);
  }
  /** Native: `KankregSiteHeader` is in-flow and already applies safe-area top. */
  return nativeMin;
}

/** Shared sticky-top offset for panels pinned below the fixed web header. */
export function customerWebStickyTop(insets, extra = 0) {
  if (Platform.OS !== "web") return 0;
  return getKankregChromeTop(insets) + 12 + Math.max(0, extra);
}

/**
 * Standard `ScrollView` content for customer pages (width cap + horizontal padding + bottom inset).
 * Merge with `{ paddingTop: … }` and optional `{ paddingBottom: … }` when a screen needs extra room.
 */
export const customerPageScrollBase = {
  /** Balanced gutters: generous on web for an editorial, premium layout. */
  paddingHorizontal: Platform.select({
    web: "clamp(14px, 4vw, 40px)",
    default: spacing.md + 2,
  }),
  width: "100%",
  alignSelf: "center",
  maxWidth: Platform.select({ web: 1280, default: "100%" }),
};

/** Vertical rhythm between major blocks on inner pages (pairs with `ScreenPageHeader` flush bottom margin). */
export const CUSTOMER_INNER_PAGE_GAP = spacing.lg;

/**
 * Standard `MotionScrollView` / `ScrollView` content for logged-in inner pages: gutters, safe padding,
 * and consistent gaps between header, panels, and footer. Pass `extra` to override (e.g. custom paddingBottom).
 * @param {{ top?: number; bottom?: number }} insets from `useSafeAreaInsets()`
 * @param {object} [extra] merged last (e.g. `{ paddingBottom: … }`, `{ gap: 0 }`)
 */
export function customerInnerPageScrollContent(insets, extra = {}) {
  return [
    customerPageScrollBase,
    {
      paddingTop: customerScrollPaddingTop(insets),
      paddingBottom: customerScrollPaddingBottom(insets),
      gap: Platform.select({ web: sectionStackGap, default: CUSTOMER_INNER_PAGE_GAP }),
      ...Platform.select({
        web: { flexGrow: 1 },
        default: {},
      }),
      ...extra,
    },
  ];
}

/** Admin tool screens: same gutters + gap as customer inner pages, but bottom padding clears home indicator only (no floating nav). */
export function adminInnerPageScrollContent(insets, extra = {}) {
  return [
    customerPageScrollBase,
    {
      paddingTop: customerScrollPaddingTop(insets),
      paddingBottom: adminScrollPaddingBottom(insets),
      gap: CUSTOMER_INNER_PAGE_GAP,
      ...Platform.select({
        web: { flexGrow: 1 },
        default: {},
      }),
      ...extra,
    },
  ];
}

/**
 * Scroll content for Login / Register: centered column on web with vertical breathing room below header.
 */
/** Auth scroll padding — pass `pageGutter` from `useKankregLayout().pageGutterClamp` on native. */
export function getAuthScrollContent(pageGutter = spacing.md + 2) {
  return {
    alignItems: "center",
    width: "100%",
    ...Platform.select({
      web: {
        maxWidth: layout.maxContentWidth + 72,
        alignSelf: "center",
        paddingHorizontal: container.gutter.desktop,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl + 4,
        flexGrow: 1,
        minHeight: `calc(100dvh - ${WEB_CHROME_TOP}px)`,
        justifyContent: "center",
      },
      default: {
        paddingHorizontal: pageGutter,
        paddingTop: spacing.sm + 4,
        paddingBottom: spacing.xl,
      },
    }),
  };
}

/** @deprecated Use getAuthScrollContent(pageGutter) */
export const authScrollContent = getAuthScrollContent();

/** Removes default browser focus ring on web inputs (custom borders remain). */
export const inputOutlineWeb = Platform.select({
  web: { outlineStyle: "none", outlineWidth: 0 },
  default: {},
});

/** ScrollView / KeyboardAvoidingView on top of `CustomerScreenShell` (no flat background). */
export const customerScrollFill = {
  flex: 1,
  width: "100%",
};

export { sectionStackGap };

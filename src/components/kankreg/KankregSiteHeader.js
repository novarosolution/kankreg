import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { platformElevation } from "../../theme/platformStyles";
import { fonts, spacing } from "../../theme/tokens";
import {
  WEB_ANNOUNCE_HEIGHT,
  WEB_CHROME_TOP,
  WEB_HEADER_HEIGHT,
  WEB_Z_INDEX,
} from "../../theme/web";
import KankregAnnounceBar from "./KankregAnnounceBar";
import KankregBrandMark from "./KankregBrandMark";
import KankregMobileNav from "./KankregMobileNav";
import { buildKankregNavItems, routeMatchesNav } from "./kankregNav";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_HEADER } from "../../content/appContent";
export const KANKREG_HEADER_BODY_HEIGHT = WEB_HEADER_HEIGHT;
export const KANKREG_ANNOUNCE_HEIGHT = WEB_ANNOUNCE_HEIGHT;

/** Total chrome height for scroll padding (web: fixed; native: safe area + bar). */
export function getKankregChromeTop(insets) {
  if (Platform.OS === "web") return WEB_CHROME_TOP;
  return (insets?.top || 0) + WEB_HEADER_HEIGHT;
}

/**
 * kankreg.html `.announce` + `.topbar` — all platforms.
 */
export default function KankregSiteHeader({ navigationRef, navReady = false }) {
  const insets = useSafeAreaInsets();
  const { showDesktopNav, compactHeader, pageGutterClamp } = useKankregLayout();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRouteName, setCurrentRouteName] = useState(null);

  useEffect(() => {
    if (!navReady || !navigationRef?.addListener || !navigationRef?.isReady?.()) {
      return undefined;
    }

    const sync = () => {
      if (!navigationRef.isReady()) return;
      setCurrentRouteName(navigationRef.getCurrentRoute()?.name ?? null);
    };

    sync();
    const unsub = navigationRef.addListener("state", sync);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [navigationRef, navReady]);

  const go = React.useCallback(
    (name, requiresAuth = false, params) => {
      const dest = requiresAuth && !isAuthenticated ? "Login" : name;
      if (navigationRef?.isReady?.()) {
        navigationRef.navigate(dest, params);
      }
      setMobileOpen(false);
    },
    [isAuthenticated, navigationRef]
  );

  const goProduct = React.useCallback(() => {
    if (typeof globalThis.sessionStorage !== "undefined") {
      const id = globalThis.sessionStorage.getItem("kankreg:lastProductId");
      if (id) {
        go("Product", false, { productId: id });
        return;
      }
    }
    /** No last-viewed product: open the Product screen and let it resolve a default (first catalog item). */
    go("Product");
  }, [go]);

  const items = useMemo(
    () => buildKankregNavItems({ go, goProduct, user }),
    [go, goProduct, user]
  );

  const shellHeight =
    Platform.OS === "web"
      ? WEB_CHROME_TOP
      : insets.top + WEB_HEADER_HEIGHT;

  const topbarStyle = [
    styles.topbar,
    {
      backgroundColor: isDark ? "rgba(20, 17, 15, 0.92)" : "rgba(245, 239, 228, 0.85)",
      borderBottomColor: KANKREG_PALETTE.line,
      paddingTop: Platform.OS === "web" ? 0 : insets.top,
    },
  ];

  return (
    <View
      style={[
        styles.shell,
        Platform.OS === "web"
          ? { height: WEB_CHROME_TOP, position: "fixed", zIndex: WEB_Z_INDEX.header }
          : { minHeight: shellHeight, zIndex: WEB_Z_INDEX.header },
        Platform.OS === "web" ? { backdropFilter: "blur(16px)" } : null,
      ]}
      accessibilityRole="header"
    >
      {Platform.OS === "web" ? <KankregAnnounceBar onPressSeason={() => go("Shop")} /> : null}
      <View style={topbarStyle}>
        <View
          style={[
            styles.wrap,
            compactHeader && styles.wrapCompact,
            { paddingHorizontal: pageGutterClamp },
          ]}
        >
          <KankregBrandMark onPress={() => go("Home")} compact={compactHeader} />

          {showDesktopNav ? (
            <View style={styles.nav}>
              {items.map((item) => {
                const active = routeMatchesNav(item.key, currentRouteName);
                return (
                  <Pressable
                    key={item.key}
                    onPress={item.onPress}
                    style={({ hovered }) => [
                      styles.navBtn,
                      active && styles.navBtnActive,
                      hovered && !active && styles.navBtnHover,
                    ]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.navBtnText, active && styles.navBtnTextActive]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={() => go("Shop")}
              style={({ hovered }) => [styles.iconBtn, hovered && styles.iconBtnHover]}
              accessibilityLabel={KANKREG_HEADER.searchA11y}
            >
              <Ionicons name="search-outline" size={18} color={KANKREG_PALETTE.inkSoft} />
            </Pressable>
            <Pressable
              onPress={() => go("Cart", true)}
              style={({ hovered }) => [styles.iconBtn, hovered && styles.iconBtnHover]}
              accessibilityLabel={KANKREG_HEADER.cartA11y}
            >
              <Ionicons name="bag-outline" size={18} color={KANKREG_PALETTE.inkSoft} />
              {totalItems > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems > 9 ? "9+" : String(totalItems)}</Text>
                </View>
              ) : null}
            </Pressable>
            {!compactHeader ? (
              <Pressable
                onPress={() => (isAuthenticated ? go("Profile", true) : go("Login"))}
                style={({ hovered, pressed }) => [
                  styles.signIn,
                  hovered && styles.signInHover,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.signInText}>
                  {isAuthenticated ? KANKREG_HEADER.accountLabel : KANKREG_HEADER.signInLabel}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => (isAuthenticated ? go("Profile", true) : go("Login"))}
                style={styles.iconBtn}
                accessibilityLabel={
                  isAuthenticated ? KANKREG_HEADER.accountLabel : KANKREG_HEADER.signInLabel
                }
              >
                <Ionicons name="person-outline" size={18} color={KANKREG_PALETTE.inkSoft} />
              </Pressable>
            )}
            {!showDesktopNav ? (
              <Pressable
                onPress={() => setMobileOpen((v) => !v)}
                style={styles.hamb}
                accessibilityLabel={mobileOpen ? KANKREG_HEADER.menuCloseA11y : KANKREG_HEADER.menuOpenA11y}
              >
                <View style={styles.hambBar} />
                <View style={styles.hambBar} />
                <View style={styles.hambBar} />
              </Pressable>
            ) : null}
          </View>
        </View>
        {!showDesktopNav ? (
          <KankregMobileNav
            open={mobileOpen}
            items={items}
            currentRouteName={currentRouteName}
            onClose={() => setMobileOpen(false)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  topbar: {
    borderBottomWidth: 1,
    minHeight: WEB_HEADER_HEIGHT,
    justifyContent: "center",
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 26,
    minHeight: WEB_HEADER_HEIGHT,
    height: WEB_HEADER_HEIGHT,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: Platform.OS === "web" ? "clamp(18px, 4vw, 40px)" : spacing.lg,
  },
  wrapCompact: {
    gap: 10,
    paddingHorizontal: spacing.md,
  },
  nav: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 2,
    marginLeft: 6,
    justifyContent: "center",
    ...Platform.select({ web: { overflow: "hidden" }, default: {} }),
  },
  navBtn: {
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 999,
    flexShrink: 0,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  navBtnActive: {
    backgroundColor: KANKREG_PALETTE.card,
    ...platformElevation({
      web: { boxShadow: "0 1px 2px rgba(25, 20, 15, 0.04), 0 4px 14px -6px rgba(25, 20, 15, 0.12)" },
      ios: {
        shadowColor: "#19140f",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  navBtnHover: {
    backgroundColor: "rgba(169, 119, 46, 0.1)",
  },
  navBtnText: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  navBtnTextActive: {
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
  },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  iconBtnHover: {
    borderColor: KANKREG_PALETTE.gold,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: KANKREG_PALETTE.gold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: "#fff",
  },
  signIn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: KANKREG_PALETTE.gold,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  signInHover: { opacity: 0.92 },
  signInText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.ink,
  },
  hamb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  hambBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: KANKREG_PALETTE.ink,
  },
});

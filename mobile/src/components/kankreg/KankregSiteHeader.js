import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { platformElevation } from "../../theme/platformStyles";
import { fonts, spacing } from "../../theme/tokens";
import {
  NATIVE_HEADER_HEIGHT,
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
export { getKankregChromeTop } from "../../theme/kankregChrome";

/**
 * kankreg.html `.announce` + `.topbar` — all platforms.
 */
export default function KankregSiteHeader({ navigationRef, navReady = false }) {
  const insets = useSafeAreaInsets();
  const { showDesktopNav, compactHeader, pageGutterClamp } = useKankregLayout();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { colors: c, isDark } = useTheme();
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

  const isNative = Platform.OS !== "web";

  /** Native app uses per-screen chrome + bottom tab bar (figmaforkankreg.html). */
  if (isNative) {
    return null;
  }

  const nativeHeaderHeight = NATIVE_HEADER_HEIGHT;

  const shellHeight =
    Platform.OS === "web"
      ? WEB_CHROME_TOP
      : insets.top + nativeHeaderHeight;

  const topbarStyle = [
    styles.topbar,
    isNative && styles.topbarNative,
    {
      backgroundColor: isDark ? "rgba(20, 17, 15, 0.92)" : KANKREG_CHROME.topbarBg,
      borderBottomColor: isDark ? c.border : KANKREG_PALETTE.lineSoft,
      paddingTop: Platform.OS === "web" ? 0 : insets.top,
      minHeight: isNative ? nativeHeaderHeight : WEB_HEADER_HEIGHT,
    },
  ];

  return (
    <View
      style={[
        styles.shell,
        Platform.OS === "web"
          ? { height: WEB_CHROME_TOP, position: "fixed", zIndex: WEB_Z_INDEX.header }
          : { minHeight: shellHeight, zIndex: WEB_Z_INDEX.header },
        !isDark && Platform.OS === "web" ? styles.shellLightWeb : null,
        Platform.OS === "web" && isDark ? { backdropFilter: "blur(16px)" } : null,
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
                      active && (isDark ? styles.navBtnActiveDark : styles.navBtnActive),
                      hovered && !active && (isDark ? styles.navBtnHoverDark : styles.navBtnHover),
                    ]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                  >
                    <Text
                      style={[
                        styles.navBtnText,
                        isDark && styles.navBtnTextDark,
                        active && (isDark ? styles.navBtnTextActiveDark : styles.navBtnTextActive),
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={() => go("Shop")}
              style={({ hovered }) => [
                styles.iconBtn,
                isDark && styles.iconBtnDark,
                hovered && (isDark ? styles.iconBtnHoverDark : styles.iconBtnHover),
              ]}
              accessibilityLabel={KANKREG_HEADER.searchA11y}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft}
              />
            </Pressable>
            <Pressable
              onPress={() => go("Cart", true)}
              style={({ hovered }) => [
                styles.iconBtn,
                isDark && styles.iconBtnDark,
                hovered && (isDark ? styles.iconBtnHoverDark : styles.iconBtnHover),
              ]}
              accessibilityLabel={KANKREG_HEADER.cartA11y}
            >
              <Ionicons
                name="bag-outline"
                size={18}
                color={isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft}
              />
              {totalItems > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems > 9 ? "9+" : String(totalItems)}</Text>
                </View>
              ) : null}
            </Pressable>
            {isNative ? null : !compactHeader ? (
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
                style={[styles.iconBtn, isDark && styles.iconBtnDark]}
                accessibilityLabel={
                  isAuthenticated ? KANKREG_HEADER.accountLabel : KANKREG_HEADER.signInLabel
                }
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft}
                />
              </Pressable>
            )}
            {!showDesktopNav && !isNative ? (
              <Pressable
                onPress={() => setMobileOpen((v) => !v)}
                style={[styles.hamb, isDark && styles.hambDark]}
                accessibilityLabel={mobileOpen ? KANKREG_HEADER.menuCloseA11y : KANKREG_HEADER.menuOpenA11y}
              >
                <View style={[styles.hambBar, isDark && styles.hambBarDark]} />
                <View style={[styles.hambBar, isDark && styles.hambBarDark]} />
                <View style={[styles.hambBar, isDark && styles.hambBarDark]} />
              </Pressable>
            ) : null}
          </View>
        </View>
        {!showDesktopNav && !isNative ? (
          <KankregMobileNav
            open={mobileOpen}
            items={items}
            currentRouteName={currentRouteName}
            onClose={() => setMobileOpen(false)}
            isDark={isDark}
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
  shellLightWeb: {
    backgroundColor: KANKREG_CHROME.topbarBg,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 0 rgba(227, 216, 196, 0.65)",
      },
      default: {},
    }),
  },
  topbar: {
    borderBottomWidth: 1,
    minHeight: WEB_HEADER_HEIGHT,
    justifyContent: "center",
    ...Platform.select({
      web: { backgroundColor: KANKREG_CHROME.topbarBg },
      default: {},
    }),
  },
  topbarNative: {
    minHeight: NATIVE_HEADER_HEIGHT,
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 26,
    minHeight: Platform.OS === "web" ? WEB_HEADER_HEIGHT : NATIVE_HEADER_HEIGHT,
    height: Platform.OS === "web" ? WEB_HEADER_HEIGHT : NATIVE_HEADER_HEIGHT,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: Platform.OS === "web" ? "clamp(18px, 4vw, 40px)" : spacing.lg,
  },
  wrapCompact: {
    gap: 8,
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
    backgroundColor: KANKREG_CHROME.onAccent,
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
  navBtnActiveDark: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navBtnHover: {
    backgroundColor: "rgba(169, 119, 46, 0.1)",
  },
  navBtnHoverDark: {
    backgroundColor: "rgba(232, 200, 90, 0.1)",
  },
  navBtnText: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.inkSoft,
  },
  navBtnTextDark: {
    color: "rgba(245, 239, 228, 0.78)",
  },
  navBtnTextActive: {
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
  },
  navBtnTextActiveDark: {
    color: "#f5efe4",
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
  iconBtnDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  iconBtnHover: {
    borderColor: KANKREG_PALETTE.gold,
  },
  iconBtnHoverDark: {
    borderColor: KANKREG_PALETTE.goldBright,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: KANKREG_CHROME.buttonAccent,
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
    backgroundColor: KANKREG_CHROME.buttonAccent,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  signInHover: { backgroundColor: KANKREG_CHROME.buttonAccentHover },
  signInText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: KANKREG_CHROME.onAccent,
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
  hambDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  hambBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: KANKREG_PALETTE.ink,
  },
  hambBarDark: {
    backgroundColor: "#f5efe4",
  },
});

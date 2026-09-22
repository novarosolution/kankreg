import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";
import {
  WEB_ANNOUNCE_HEIGHT,
  WEB_CHROME_TOP,
  WEB_HEADER_HEIGHT,
  WEB_Z_INDEX,
} from "../../theme/web";
import KankregAnnounceBar from "./KankregAnnounceBar";
import KankregBrandMark from "./KankregBrandMark";
import KankregHeaderNav from "./KankregHeaderNav";
import KankregMobileNav from "./KankregMobileNav";
import { buildKankregNavItems, flattenNavItems } from "./kankregNav";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_HEADER } from "../../content/appContent";
import { safeNavigate } from "../../navigation/navigationRef";

export const KANKREG_HEADER_BODY_HEIGHT = WEB_HEADER_HEIGHT;
export const KANKREG_ANNOUNCE_HEIGHT = WEB_ANNOUNCE_HEIGHT;
export { getKankregChromeTop } from "../../theme/kankregChrome";

const ICON_COLOR = KANKREG_CHROME.announceBg;

/**
 * Storefront header — promo bar + logo / text nav / search-account-cart icons.
 */
export default function KankregSiteHeader({ navigationRef, navReady = false }) {
  const { showDesktopNav, compactHeader, pageGutterClamp } = useKankregLayout();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRouteName, setCurrentRouteName] = useState(null);
  const [currentRouteParams, setCurrentRouteParams] = useState(null);

  useEffect(() => {
    if (!navReady || !navigationRef?.addListener || !navigationRef?.isReady?.()) {
      return undefined;
    }

    const sync = () => {
      if (!navigationRef.isReady()) return;
      const route = navigationRef.getCurrentRoute();
      setCurrentRouteName(route?.name ?? null);
      setCurrentRouteParams(route?.params ?? null);
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
      safeNavigate(dest, params);
      setMobileOpen(false);
    },
    [isAuthenticated]
  );

  const openShopSearch = React.useCallback(() => {
    go("Shop", false, { focusSearch: true });
  }, [go]);

  const items = useMemo(() => buildKankregNavItems({ go, user }), [go, user]);
  const mobileItems = useMemo(
    () =>
      flattenNavItems(items).filter(
        (item, index, list) =>
          item.route && list.findIndex((other) => other.key === item.key && other.label === item.label) === index
      ),
    [items]
  );

  const isNative = Platform.OS !== "web";

  /** Native app uses per-screen chrome + bottom tab bar. */
  if (isNative) {
    return null;
  }

  const iconTint = isDark ? "#D8E8DE" : ICON_COLOR;

  return (
    <View
      style={[
        styles.shell,
        { height: WEB_CHROME_TOP, position: "fixed", zIndex: WEB_Z_INDEX.header },
        isDark ? styles.shellDark : styles.shellLight,
      ]}
      accessibilityRole="header"
    >
      <KankregAnnounceBar onPressSeason={() => go("Shop", false, { pill: "On sale" })} />
      <View
        style={[
          styles.topbar,
          {
            backgroundColor: isDark ? "#141816" : KANKREG_CHROME.topbarBg,
            borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(26, 92, 72, 0.1)",
          },
        ]}
      >
        <View
          style={[
            styles.wrap,
            compactHeader && styles.wrapCompact,
            { paddingHorizontal: pageGutterClamp },
          ]}
        >
          <KankregBrandMark onPress={() => go("Home")} compact={compactHeader} />

          {showDesktopNav ? (
            <KankregHeaderNav
              items={items}
              currentRouteName={currentRouteName}
              currentRouteParams={currentRouteParams}
            />
          ) : (
            <View style={styles.navSpacer} />
          )}

          <View style={[styles.actions, compactHeader && styles.actionsCompact]}>
            <Pressable
              onPress={openShopSearch}
              style={({ hovered }) => [
                styles.iconBtn,
                compactHeader && styles.iconBtnCompact,
                hovered && styles.iconBtnHover,
              ]}
              accessibilityLabel={KANKREG_HEADER.searchA11y}
            >
              <Ionicons name="search-outline" size={compactHeader ? 20 : 22} color={iconTint} />
            </Pressable>
            <Pressable
              onPress={() => (isAuthenticated ? go("Profile", true) : go("Login"))}
              style={({ hovered }) => [
                styles.iconBtn,
                compactHeader && styles.iconBtnCompact,
                hovered && styles.iconBtnHover,
              ]}
              accessibilityLabel={
                isAuthenticated ? KANKREG_HEADER.accountLabel : KANKREG_HEADER.signInLabel
              }
            >
              <Ionicons name="person-outline" size={compactHeader ? 20 : 22} color={iconTint} />
            </Pressable>
            <Pressable
              onPress={() => go("Cart", true)}
              style={({ hovered }) => [
                styles.iconBtn,
                compactHeader && styles.iconBtnCompact,
                hovered && styles.iconBtnHover,
              ]}
              accessibilityLabel={KANKREG_HEADER.cartA11y}
            >
              <Ionicons name="cart-outline" size={compactHeader ? 20 : 22} color={iconTint} />
              {totalItems > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems > 9 ? "9+" : String(totalItems)}</Text>
                </View>
              ) : null}
            </Pressable>
            {!showDesktopNav ? (
              <Pressable
                onPress={() => setMobileOpen((v) => !v)}
                style={[styles.hamb, compactHeader && styles.iconBtnCompact]}
                accessibilityLabel={mobileOpen ? KANKREG_HEADER.menuCloseA11y : KANKREG_HEADER.menuOpenA11y}
              >
                <View style={[styles.hambBar, isDark && styles.hambBarDark]} />
                <View style={[styles.hambBar, isDark && styles.hambBarDark]} />
                <View style={[styles.hambBar, isDark && styles.hambBarDark]} />
              </Pressable>
            ) : null}
          </View>
        </View>
        {!showDesktopNav ? (
          <KankregMobileNav
            open={mobileOpen}
            items={mobileItems}
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
  shellLight: {
    backgroundColor: KANKREG_CHROME.topbarBg,
  },
  shellDark: {
    backgroundColor: "#141816",
  },
  topbar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: WEB_HEADER_HEIGHT,
    justifyContent: "center",
    overflow: "visible",
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    minHeight: WEB_HEADER_HEIGHT,
    height: WEB_HEADER_HEIGHT,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    overflow: "visible",
  },
  wrapCompact: {
    gap: 8,
  },
  navSpacer: {
    flex: 1,
  },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionsCompact: {
    gap: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  iconBtnCompact: {
    width: 36,
    height: 36,
  },
  iconBtnHover: {
    opacity: 0.72,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: KANKREG_CHROME.announceBg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: "#fff",
  },
  hamb: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  hambBar: {
    width: 18,
    height: 1.5,
    backgroundColor: KANKREG_CHROME.announceBg,
  },
  hambBarDark: {
    backgroundColor: "#D8E8DE",
  },
});

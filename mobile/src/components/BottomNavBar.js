import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA } from "../theme/figmaApp";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, getSemanticColors, icon as glyphSize, typography } from "../theme/tokens";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useKankregLayout } from "../theme/kankregBreakpoints";

const useNativeDriver = Platform.OS !== "web";

const PROFILE_TAB_ROUTES = new Set([
  "Profile",
  "EditProfile",
  "Settings",
  "ManageAddress",
  "Notifications",
  "Support",
  "MyOrders",
]);

function isTabActive(tabKey, routeName) {
  if (!routeName) return false;
  if (tabKey === routeName) return true;
  if (tabKey === "Cart" && routeName === "Checkout") return true;
  if (tabKey === "Profile" && PROFILE_TAB_ROUTES.has(routeName)) return true;
  return false;
}

function TabItem({ label, icon, iconActive, active, onPress, badge, colors, compact, isDark }) {
  const inactiveColor = isDark ? colors.textSecondary : FIGMA.inkFaint;
  const activeColor = isDark ? colors.primary : FIGMA.goldDeep;
  const scale = useRef(new Animated.Value(active ? 1.06 : 1)).current;
  const lift = useRef(new Animated.Value(active ? -2 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: active ? 1.06 : 1,
        useNativeDriver,
        tension: 145,
        friction: 14,
      }),
      Animated.spring(lift, {
        toValue: active ? -2 : 0,
        useNativeDriver,
        tension: 145,
        friction: 14,
      }),
    ]).start();
  }, [active, lift, scale]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver,
      tension: 180,
      friction: 14,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: active ? 1.06 : 1,
      useNativeDriver,
      tension: 145,
      friction: 14,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: lift }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tabItem, active ? styles.tabItemActive : null]}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name={active && iconActive ? iconActive : icon}
            size={glyphSize.tabBar}
            color={active ? activeColor : inactiveColor}
          />
          {badge ? (
            <View style={[styles.badge, { backgroundColor: FIGMA.gold }]}>
              <Text style={[styles.badgeText, { color: colors.onPrimary, fontFamily: fonts.extrabold }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {compact ? null : (
          <Text
            style={[
              styles.tabLabel,
              {
                color: active ? activeColor : inactiveColor,
                fontFamily: active ? fonts.bold : fonts.semibold,
              },
            ]}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function BottomNavBar() {
  const { colors, isDark } = useTheme();
  const semantic = getSemanticColors(colors);
  const navigation = useNavigation();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const currentRouteName = useNavigationState((state) => state.routes[state.index]?.name);
  const insets = useSafeAreaInsets();
  const { width } = useKankregLayout();

  const navigateTab = useCallback(
    (targetRoute, requiresAuth = false) => {
      const destination = requiresAuth && !isAuthenticated ? "Login" : targetRoute;
      if (currentRouteName === destination) {
        return;
      }
      navigation.navigate(destination);
    },
    [navigation, currentRouteName, isAuthenticated]
  );

  const tabs = useMemo(
    () => [
      {
        key: "Home",
        label: "Home",
        icon: "home-outline",
        iconActive: "home",
        onPress: () => navigateTab("Home"),
      },
      {
        key: "Shop",
        label: "Shop",
        icon: "storefront-outline",
        iconActive: "storefront",
        onPress: () => navigateTab("Shop"),
      },
      {
        key: "Cart",
        label: "Cart",
        icon: "bag-outline",
        iconActive: "bag",
        onPress: () => navigateTab("Cart", true),
        badge: totalItems > 0 ? String(totalItems) : "",
      },
      {
        key: "RedeemRewards",
        label: "Rewards",
        icon: "gift-outline",
        iconActive: "gift",
        onPress: () => navigateTab("RedeemRewards", true),
      },
      {
        key: "Profile",
        label: "Account",
        icon: "person-outline",
        iconActive: "person",
        onPress: () => navigateTab("Profile", true),
      },
    ],
    [navigateTab, totalItems]
  );

  const showLabels = width >= 360;

  if (Platform.OS === "web") {
    return null;
  }

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: Math.max(6, (insets.bottom || 0) + 4),
          backgroundColor: isDark ? "rgba(20,17,15,0.96)" : "rgba(255,253,248,0.96)",
          borderTopColor: isDark ? semantic.border.subtle : FIGMA.line,
        },
      ]}
    >
      {tabs.map((tab) => (
        <TabItem
          key={tab.key}
          label={tab.label}
          icon={tab.icon}
          iconActive={tab.iconActive}
          onPress={tab.onPress}
          active={isTabActive(tab.key, currentRouteName)}
          badge={tab.badge}
          colors={colors}
          compact={!showLabels}
          isDark={isDark}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: FIGMA.tabBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 100,
  },
  tabBarWebMobile: {
    position: "fixed",
    zIndex: 900,
    ...Platform.select({
      web: {
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      },
      default: {},
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    minHeight: 44,
    paddingHorizontal: 2,
    paddingVertical: 4,
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  iconWrap: {
    position: "relative",
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 0.1,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: typography.overline,
  },
  peNone: {
    pointerEvents: "none",
  },
});


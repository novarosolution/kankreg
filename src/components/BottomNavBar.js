import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, getSemanticColors, icon as glyphSize, semanticRadius, spacing, typography } from "../theme/tokens";
import { platformShadow } from "../theme/shadowPlatform";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ALCHEMY } from "../theme/customerAlchemy";
import { useKankregLayout } from "../theme/kankregBreakpoints";

const useNativeDriver = Platform.OS !== "web";

function TabItem({ label, icon, iconActive, active, onPress, badge, colors, compact }) {
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
            color={active ? ALCHEMY.gold : colors.textSecondary}
          />
          {badge ? (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.onPrimary, fontFamily: fonts.extrabold }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {compact ? null : (
          <Text
            style={[
              styles.tabLabel,
              {
                color: active ? ALCHEMY.brownInk : colors.textSecondary,
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
  const { isXs, pageGutter } = useKankregLayout();
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

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
        key: "Profile",
        label: "Account",
        icon: "person-outline",
        iconActive: "person",
        onPress: () => navigateTab("Profile", true),
      },
    ],
    [navigateTab, totalItems]
  );

  const activeIndex = useMemo(() => {
    const foundIndex = tabs.findIndex((tab) => tab.key === currentRouteName);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [tabs, currentRouteName]);
  const tabWidth = barWidth > 0 ? (barWidth - spacing.sm * 2) / tabs.length : 0;
  const indicatorWidth = tabWidth > 0 ? Math.max(0, tabWidth - 12) : 0;

  useEffect(() => {
    if (!tabWidth) return;
    Animated.spring(indicatorX, {
      toValue: activeIndex * tabWidth + 6,
      useNativeDriver,
      tension: 140,
      friction: 14,
    }).start();
  }, [activeIndex, tabWidth, indicatorX]);

  const barSurface = useMemo(
    () =>
      StyleSheet.create({
        mobileBar: {
          flexDirection: "row",
          borderRadius: semanticRadius.full,
          borderWidth: StyleSheet.hairlineWidth,
          borderTopWidth: 3,
          borderTopColor: isDark ? semantic.border.accent : ALCHEMY.gold,
          borderColor: isDark ? semantic.border.subtle : ALCHEMY.lineStrong,
          backgroundColor: isDark ? colors.surfaceOverlay : "rgba(255,253,249,0.94)",
          paddingVertical: 10,
          paddingHorizontal: spacing.sm,
          justifyContent: "space-around",
          overflow: "hidden",
          ...platformShadow({
            web: { boxShadow: "0 22px 48px rgba(61, 42, 18, 0.13), 0 8px 20px rgba(28, 25, 23, 0.07), inset 0 1px 0 rgba(255,253,251,0.65)" },
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: isDark ? 0.45 : 0.1,
              shadowRadius: 24,
            },
            android: { elevation: 12 },
          }),
        },
        activeIndicator: {
          position: "absolute",
          top: 7,
          bottom: 7,
          left: spacing.sm,
          borderRadius: semanticRadius.control,
          backgroundColor: isDark ? colors.primarySoft : "rgba(231, 200, 90, 0.22)",
          borderWidth: 1,
          borderColor: isDark ? semantic.border.accent : ALCHEMY.lineStrong,
        },
      }),
    [colors, isDark, semantic.border.accent, semantic.border.subtle]
  );

  if (Platform.OS === "web") {
    return null;
  }

  return (
    <View
      style={[
        styles.mobileContainer,
        {
          bottom: Math.max(spacing.md, (insets.bottom || 0) + 6),
          paddingHorizontal: pageGutter,
        },
      ]}
    >
      <BlurView
        intensity={isDark ? 62 : 92}
        tint={isDark ? "dark" : "light"}
        style={barSurface.mobileBar}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        <View style={[styles.glassShine, isDark && { backgroundColor: "rgba(255,255,255,0.06)" }]} />
        <LinearGradient
          colors={
            isDark
              ? ["rgba(232, 200, 90, 0.16)", "transparent", "transparent"]
              : ["rgba(231, 200, 90, 0.28)", "transparent", "transparent"]
          }
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.topGlow,
            { borderTopLeftRadius: semanticRadius.full, borderTopRightRadius: semanticRadius.full },
            styles.peNone,
          ]}
        />
        {indicatorWidth > 0 ? (
          <Animated.View
            style={[
              barSurface.activeIndicator,
              {
                width: indicatorWidth,
                pointerEvents: "none",
                transform: [{ translateX: indicatorX }],
              },
            ]}
          />
        ) : null}
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            iconActive={tab.iconActive}
            onPress={tab.onPress}
            active={currentRouteName === tab.key || (tab.key === "Cart" && currentRouteName === "Checkout")}
            badge={tab.badge}
            colors={colors}
            compact={isXs}
          />
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  glassShine: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 4,
    height: 16,
    borderRadius: semanticRadius.full,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    opacity: 0.85,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 62,
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: semanticRadius.control,
  },
  tabItemActive: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  iconWrap: {
    position: "relative",
  },
  tabLabel: {
    marginTop: 1,
    fontSize: typography.overline + 1,
    letterSpacing: 0.12,
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

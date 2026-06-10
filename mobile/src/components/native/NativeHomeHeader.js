import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FIGMA, figmaEyebrow, figmaIconCircle, figmaIconMuted, figmaIconSoft } from "../../theme/figmaApp";
import { fonts, spacing } from "../../theme/tokens";
import { formatSavedAddressLabel } from "../../utils/deliveryLocationLabel";
import BrandLogo from "../BrandLogo";
import { APP_DISPLAY_NAME, BRAND_LOGO_SIZE } from "../../constants/brand";

/** figmaforkankreg.html Home — DELIVER TO + search + notifications */
export default function NativeHomeHeader({
  navigation,
  hasNotifications = false,
  locationLabel: locationLabelProp,
  onRefreshLocation,
}) {
  const { user } = useAuth();
  const { colors: c, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const circle = useMemo(() => figmaIconCircle(isDark), [isDark]);
  if (Platform.OS === "web") return null;

  const fallbackLabel = formatSavedAddressLabel(user?.defaultAddress || user?.addresses?.[0])
    || "Set delivery location";
  const locationLabel = locationLabelProp || fallbackLabel;

  return (
    <View
      style={[
        styles.shell,
        {
          paddingTop: Math.max(insets.top, spacing.xs),
          backgroundColor: isDark ? c.background : FIGMA.paper,
          borderBottomColor: isDark ? c.border : FIGMA.line,
        },
      ]}
    >
      <Pressable
        style={styles.brandRow}
        onPress={() => navigation.navigate("Home")}
        accessibilityRole="button"
        accessibilityLabel={`${APP_DISPLAY_NAME} home`}
      >
        <BrandLogo height={BRAND_LOGO_SIZE.homeTopBar} />
      </Pressable>
      <View style={styles.row}>
        <Pressable
          style={styles.locationCol}
          onPress={() => navigation.navigate(user ? "ManageAddress" : "Login")}
          onLongPress={() => {
            if (typeof onRefreshLocation === "function") onRefreshLocation();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Deliver to ${locationLabel}`}
        >
          <Text style={[figmaEyebrow(isDark), styles.deliverEyebrow]}>DELIVER TO</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={isDark ? FIGMA.goldBright : FIGMA.gold} />
            <Text
              style={[styles.location, { color: isDark ? FIGMA.paper : FIGMA.ink }]}
              numberOfLines={1}
            >
              {locationLabel}
            </Text>
            <Ionicons name="chevron-down" size={12} color={figmaIconMuted(isDark)} />
          </View>
        </Pressable>
        <Pressable
          style={circle}
          onPress={() => navigation.navigate("Shop")}
          accessibilityLabel="Search shop"
        >
          <Ionicons name="search-outline" size={16} color={figmaIconSoft(isDark)} />
        </Pressable>
        <Pressable
          style={[circle, styles.bellWrap]}
          onPress={() => navigation.navigate(user ? "Notifications" : "Login")}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={16} color={figmaIconSoft(isDark)} />
          {hasNotifications ? (
            <View style={[styles.bellDot, { borderColor: isDark ? c.surface : FIGMA.card }]} />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: spacing.sm + 2,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: FIGMA.gutter,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: FIGMA.gutter,
  },
  locationCol: {
    flex: 1,
    minWidth: 0,
  },
  deliverEyebrow: {
    fontSize: 9,
    letterSpacing: 2.2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 3,
  },
  location: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    minWidth: 0,
  },
  bellWrap: {
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 5,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: FIGMA.gold,
    borderWidth: 1.5,
  },
});

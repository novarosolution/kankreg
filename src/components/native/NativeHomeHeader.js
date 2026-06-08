import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FIGMA, figmaEyebrow, figmaIconCircle } from "../../theme/figmaApp";
import { fonts, spacing } from "../../theme/tokens";
import { formatSavedAddressLabel } from "../../utils/deliveryLocationLabel";

/** figmaforkankreg.html Home — DELIVER TO + search + notifications */
export default function NativeHomeHeader({
  navigation,
  hasNotifications = false,
  locationLabel: locationLabelProp,
  onRefreshLocation,
}) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const circle = useMemo(() => figmaIconCircle(isDark), [isDark]);
  if (Platform.OS === "web") return null;

  const fallbackLabel = formatSavedAddressLabel(user?.defaultAddress || user?.addresses?.[0])
    || "Set delivery location";
  const locationLabel = locationLabelProp || fallbackLabel;

  return (
    <View style={[styles.shell, { paddingTop: Math.max(insets.top, spacing.xs) }]}>
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
          <Text style={figmaEyebrow(isDark)}>DELIVER TO</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={FIGMA.gold} />
            <Text
              style={[styles.location, { color: isDark ? FIGMA.paper : FIGMA.ink }]}
              numberOfLines={1}
            >
              {locationLabel}
            </Text>
            <Ionicons name="chevron-down" size={12} color={FIGMA.inkFaint} />
          </View>
        </Pressable>
        <Pressable
          style={circle}
          onPress={() => navigation.navigate("Shop")}
          accessibilityLabel="Search shop"
        >
          <Ionicons name="search-outline" size={16} color={FIGMA.inkSoft} />
        </Pressable>
        <Pressable
          style={[circle, styles.bellWrap]}
          onPress={() => navigation.navigate(user ? "Notifications" : "Login")}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={16} color={FIGMA.inkSoft} />
          {hasNotifications ? <View style={styles.bellDot} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: FIGMA.paper,
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: FIGMA.line,
    paddingBottom: spacing.sm + 2,
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
    borderColor: FIGMA.card,
  },
});

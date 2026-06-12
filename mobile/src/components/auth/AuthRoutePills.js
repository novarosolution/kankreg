import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { platformElevation } from "../../theme/platformStyles";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, radius, spacing, typography } from "../../theme/tokens";

const pillOnElevated = platformElevation({
  web: { boxShadow: "0 2px 6px rgba(25, 20, 15, 0.08)" },
  ios: {
    shadowColor: "#19140f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  android: { elevation: 2 },
});

/** kankreg.html `.auth-toggle` — navigates between Login and Register routes. */
export default function AuthRoutePills({ navigation, activeRoute = "Login", wide = false }) {
  const { isDark } = useTheme();
  const { isXs, useAuthSplit } = useKankregLayout();
  const isLogin = activeRoute === "Login";
  const fullWidth = wide || isXs || (Platform.OS === "web" && useAuthSplit);

  const go = (name) => {
    if (name === activeRoute) return;
    navigation.replace(name);
  };

  return (
    <View
      style={[
        styles.track,
        fullWidth && styles.trackFull,
        {
          backgroundColor: isDark ? "rgba(255,255,255,0.06)" : KANKREG_PALETTE.paper2,
        },
      ]}
    >
      <Pressable
        onPress={() => go("Login")}
        style={[
          styles.pill,
          fullWidth && styles.pillFlex,
          isLogin && (isDark ? styles.pillOnDark : styles.pillOn),
          isLogin && pillOnElevated,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isLogin }}
      >
        <Text
          style={[
            styles.pillText,
            isDark && styles.pillTextDark,
            isLogin && (isDark ? styles.pillTextOnDark : styles.pillTextOn),
          ]}
        >
          Sign in
        </Text>
      </Pressable>
      <Pressable
        onPress={() => go("Register")}
        style={[
          styles.pill,
          fullWidth && styles.pillFlex,
          !isLogin && (isDark ? styles.pillOnDark : styles.pillOn),
          !isLogin && pillOnElevated,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: !isLogin }}
      >
        <Text
          style={[
            styles.pillText,
            isDark && styles.pillTextDark,
            !isLogin && (isDark ? styles.pillTextOnDark : styles.pillTextOn),
          ]}
        >
          Create account
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    padding: 4,
    marginVertical: spacing.md,
  },
  trackFull: {
    alignSelf: "stretch",
    width: "100%",
  },
  pill: {
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  pillFlex: {
    flex: 1,
    alignItems: "center",
  },
  pillOn: {
    backgroundColor: KANKREG_PALETTE.card,
  },
  pillOnDark: {
    backgroundColor: "#181513",
  },
  pillText: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.inkFaint,
  },
  pillTextDark: {
    color: "rgba(245, 239, 228, 0.68)",
  },
  pillTextOn: {
    color: KANKREG_PALETTE.ink,
  },
  pillTextOnDark: {
    color: "#f5efe4",
  },
});

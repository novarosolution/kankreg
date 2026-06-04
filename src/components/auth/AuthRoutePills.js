import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { platformElevation } from "../../theme/platformStyles";
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
export default function AuthRoutePills({ navigation, activeRoute = "Login" }) {
  const { isDark } = useTheme();
  const isLogin = activeRoute === "Login";

  const go = (name) => {
    if (name === activeRoute) return;
    navigation.replace(name);
  };

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: isDark ? "rgba(255,255,255,0.06)" : KANKREG_PALETTE.paper2,
        },
      ]}
    >
      <Pressable
        onPress={() => go("Login")}
        style={[styles.pill, isLogin && styles.pillOn, isLogin && pillOnElevated]}
        accessibilityRole="button"
        accessibilityState={{ selected: isLogin }}
      >
        <Text style={[styles.pillText, isLogin && styles.pillTextOn]}>Sign in</Text>
      </Pressable>
      <Pressable
        onPress={() => go("Register")}
        style={[styles.pill, !isLogin && styles.pillOn, !isLogin && pillOnElevated]}
        accessibilityRole="button"
        accessibilityState={{ selected: !isLogin }}
      >
        <Text style={[styles.pillText, !isLogin && styles.pillTextOn]}>Create account</Text>
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
  pill: {
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  pillOn: {
    backgroundColor: KANKREG_PALETTE.card,
  },
  pillText: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold,
    color: KANKREG_PALETTE.inkFaint,
  },
  pillTextOn: {
    color: KANKREG_PALETTE.ink,
  },
});

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { FIGMA, figmaDisplayTitle, figmaEyebrow, figmaBody } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const cardShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
  android: { elevation: 8 },
});

/**
 * figmaforkankreg.html auth — gradient hero top + sheet form sliding up.
 */
export default function AuthMobileShell({ children, artTitle, artSubtitle, eyebrow, mode = "login" }) {
  const { isXs } = useKankregLayout();
  const isLogin = mode === "login";

  if (Platform.OS === "web") {
    return <View style={styles.webFallback}>{children}</View>;
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#ead9b2", "#b6985c", "#2a241e"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
        style={styles.heroGrad}
      />
      <View style={styles.heroIcon} pointerEvents="none">
        <Ionicons
          name={isLogin ? "flame-outline" : "leaf-outline"}
          size={isXs ? 56 : 72}
          color="rgba(255,255,255,0.28)"
        />
      </View>
      <View style={[styles.sheet, cardShadow]}>
        <Text style={figmaEyebrow()}>{eyebrow || (isLogin ? "Welcome back" : "Join kankreg")}</Text>
        <Text style={[figmaDisplayTitle(26), styles.sheetTitle]}>
          {artTitle || (isLogin ? "Sign in" : "Create account")}
        </Text>
        {artSubtitle ? <Text style={[figmaBody(11.5), styles.sheetSub]}>{artSubtitle}</Text> : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    width: "100%",
  },
  root: {
    flex: 1,
    width: "100%",
  },
  heroGrad: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  heroIcon: {
    position: "absolute",
    top: "12%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "30%",
  },
  sheet: {
    flex: 1,
    marginTop: "34%",
    backgroundColor: FIGMA.paper,
    borderTopLeftRadius: FIGMA.radiusSheet,
    borderTopRightRadius: FIGMA.radiusSheet,
    paddingHorizontal: 22,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    zIndex: 2,
  },
  sheetTitle: {
    marginTop: 4,
    marginBottom: 4,
    fontWeight: "400",
  },
  sheetSub: {
    marginBottom: spacing.md,
    color: FIGMA.inkFaint,
  },
});

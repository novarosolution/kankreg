import React, { useCallback, useEffect, useState } from "react";
import { InteractionManager, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuth } from "../context/AuthContext";
import { useDeliveryLocation } from "../context/DeliveryLocationContext";
import NativeFindLocationScene from "../components/native/NativeFindLocationScene";
import { FIGMA } from "../theme/figmaApp";
import { fonts, spacing } from "../theme/tokens";

/**
 * Full-screen native location discovery — radar animation, result card, confirm CTA.
 * Skips to Home when delivery location was confirmed recently.
 */
export default function FindLocationScreen({ navigation, route }) {
  const { user } = useAuth();
  const forceReveal = route?.params?.force === true;
  const {
    bootstrapped,
    needsFindScreen,
    snippet,
    detect,
    confirmLocation,
    savedLabel,
  } = useDeliveryLocation();
  const [phase, setPhase] = useState("searching");

  useEffect(() => {
    if (Platform.OS === "web") {
      navigation.replace("Home");
    }
  }, [navigation]);

  useEffect(() => {
    if (!bootstrapped || Platform.OS === "web" || forceReveal) return;
    if (!needsFindScreen) {
      const task = InteractionManager.runAfterInteractions(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      });
      return () => task.cancel();
    }
    return undefined;
  }, [bootstrapped, forceReveal, needsFindScreen, navigation]);

  const runDetect = useCallback(async () => {
    setPhase("searching");
    const result = await detect({ force: true });
    if (result?.label || savedLabel) {
      setPhase("found");
      return;
    }
    setPhase("error");
  }, [detect, savedLabel]);

  useFocusEffect(
    useCallback(() => {
      if (!bootstrapped) return;
      if (!needsFindScreen && !forceReveal) return;
      runDetect();
    }, [bootstrapped, forceReveal, needsFindScreen, runDetect])
  );

  const displaySnippet = snippet?.label
    ? snippet
    : savedLabel
      ? { label: savedLabel }
      : null;

  const handleConfirm = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // optional haptic
    }
    await confirmLocation(displaySnippet || snippet);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  if (Platform.OS === "web" || !bootstrapped) {
    return <View style={styles.boot} />;
  }

  if (!needsFindScreen && !forceReveal) {
    return <View style={styles.boot} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#f8f2e8", FIGMA.paper, "#f3ead8"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.topMark}>
        <View style={styles.brandDot} />
        <Text style={styles.brand}>kankreg</Text>
      </View>

      <View style={styles.body}>
        <NativeFindLocationScene
          phase={phase}
          snippet={displaySnippet}
        />
      </View>

      <View style={styles.footer}>
        {phase === "found" && displaySnippet ? (
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel="Confirm delivery location"
          >
            <LinearGradient
              colors={["#2a241e", "#1a1612"]}
              style={styles.primaryGrad}
            >
              <Text style={styles.primaryText}>Confirm location</Text>
            </LinearGradient>
          </Pressable>
        ) : phase === "error" ? (
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            onPress={runDetect}
            accessibilityRole="button"
          >
            <LinearGradient colors={["#2a241e", "#1a1612"]} style={styles.primaryGrad}>
              <Text style={styles.primaryText}>Try again</Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <View style={styles.searchingBtn}>
            <Text style={styles.searchingText}>Locating you…</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
          onPress={() => navigation.navigate(user ? "ManageAddress" : "Login")}
        >
          <Text style={styles.secondaryText}>Enter address manually</Text>
        </Pressable>

        {phase === "found" ? (
          <Pressable onPress={runDetect} style={styles.linkBtn}>
            <Text style={styles.linkText}>Search again</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: FIGMA.paper,
  },
  boot: {
    flex: 1,
    backgroundColor: FIGMA.paper,
  },
  topMark: {
    alignItems: "center",
    paddingTop: spacing.md,
    gap: 8,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: FIGMA.gold,
  },
  brand: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: FIGMA.inkSoft,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: FIGMA.gutter,
  },
  footer: {
    paddingHorizontal: FIGMA.gutter,
    paddingBottom: spacing.lg,
    gap: 10,
  },
  primaryBtn: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#3d2a12",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
  },
  primaryGrad: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#fff",
    letterSpacing: 0.2,
  },
  searchingBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FIGMA.line,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingVertical: 15,
    alignItems: "center",
  },
  searchingText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: FIGMA.inkSoft,
  },
  secondaryBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FIGMA.line,
    backgroundColor: FIGMA.card,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: FIGMA.ink,
  },
  linkBtn: {
    alignItems: "center",
    paddingVertical: 6,
  },
  linkText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: FIGMA.gold,
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});

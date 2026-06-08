import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FIGMA, figmaDisplayTitle, figmaEyebrow } from "../../theme/figmaApp";
import { fonts } from "../../theme/tokens";

/** figmaforkankreg.html rewards dark balance card */
export default function NativeRewardsBalance({ points = 0, tierHint }) {
  if (Platform.OS === "web") return null;

  const pts = Math.max(0, Number(points) || 0);
  const tierProgress = Math.min(100, Math.round((pts % 3000) / 30));

  return (
    <LinearGradient
      colors={["#221d17", "#3b332a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.left}>
        <Text style={[figmaEyebrow(true), styles.balanceEyebrow]}>Balance</Text>
        <Text style={styles.points}>{pts.toLocaleString("en-IN")}</Text>
        {tierHint ? <Text style={styles.hint}>{tierHint}</Text> : null}
      </View>
      <View style={styles.ringOuter}>
        <View style={styles.ringInner}>
          <Text style={styles.ringText}>
            {tierProgress}%
            {"\n"}Gold
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 14,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  balanceEyebrow: {
    color: FIGMA.goldBright,
  },
  points: {
    fontFamily: figmaDisplayTitle(34).fontFamily,
    fontSize: 34,
    fontWeight: "500",
    color: FIGMA.goldBright,
    lineHeight: 36,
    marginTop: 2,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  ringOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 6,
    borderColor: FIGMA.goldBright,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    opacity: 0.95,
  },
  ringInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2a241e",
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: "#fff",
    textAlign: "center",
    lineHeight: 14,
  },
});

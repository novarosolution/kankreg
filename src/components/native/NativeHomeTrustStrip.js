import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HOME_TRUST_STRIP } from "../../content/appContent";
import { FIGMA } from "../../theme/figmaApp";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const cardShadow = platformShadow({
  ios: {
    shadowColor: "#19140f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  android: { elevation: 3 },
});

/** Premium trust row — ink bar with gold icons (native home) */
export default function NativeHomeTrustStrip() {
  if (Platform.OS === "web") return null;

  return (
    <View style={[styles.wrap, cardShadow]}>
      {HOME_TRUST_STRIP.map((item, idx) => (
        <React.Fragment key={item.key}>
          {idx > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.cell}>
            <Ionicons name={item.icon} size={14} color={FIGMA.goldBright} />
            <Text style={styles.label} numberOfLines={2}>
              {item.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: FIGMA.ink,
    borderRadius: 16,
    marginHorizontal: FIGMA.gutter,
    marginTop: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 4,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 8.5,
    color: "rgba(245,239,228,0.92)",
    letterSpacing: 0.15,
    maxWidth: 72,
  },
});

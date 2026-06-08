import React, { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { spacing } from "../../theme/tokens";
import { ALCHEMY } from "../../theme/customerAlchemy";
import { useTheme } from "../../context/ThemeContext";

/**
 * Gradient hairline divider (gold -> transparent + small anchor dot). Used
 * between cart sections, profile groups, settings groups, etc.
 */
function GoldHairlineBase({ marginVertical = spacing.md, withDot = true, style }) {
  const { isDark } = useTheme();
  const mv =
    Platform.OS !== "web" && marginVertical >= spacing.sm
      ? Math.max(spacing.xs, marginVertical - spacing.sm)
      : marginVertical;
  return (
    <View style={[styles.wrap, { marginVertical: mv }, style, styles.peNone]}>
      <LinearGradient
        colors={
          isDark
            ? ["rgba(232, 200, 90, 0)", "rgba(232, 200, 90, 0.5)", "rgba(232, 200, 90, 0)"]
            : ["rgba(201, 162, 39, 0)", "rgba(201, 162, 39, 0.5)", "rgba(201, 162, 39, 0)"]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.line}
      />
      {withDot ? (
        <View
          style={[
            styles.dot,
            { backgroundColor: isDark ? ALCHEMY.goldBright : ALCHEMY.gold },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.85,
  },
  peNone: {
    pointerEvents: "none",
  },
});

const GoldHairline = memo(GoldHairlineBase);

export default GoldHairline;

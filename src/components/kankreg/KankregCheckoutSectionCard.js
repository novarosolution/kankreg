import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FIGMA, figmaCardShell, figmaDisplayTitle } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { fonts } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const cardShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
  web: { boxShadow: "0 6px 18px rgba(61, 42, 18, 0.06)" },
});

/** Figma checkout section shell — delivery, payment, etc. */
export default function KankregCheckoutSectionCard({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  children,
  style,
}) {
  const { isDark } = useTheme();

  return (
    <View style={[figmaCardShell(isDark), styles.card, cardShadow, style]}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={[figmaDisplayTitle(14, isDark), styles.title]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {actionLabel && onActionPress ? (
          <Pressable
            onPress={onActionPress}
            hitSlop={8}
            style={({ pressed, hovered }) => [
              styles.actionHit,
              Platform.OS === "web" && hovered && styles.actionHover,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    marginHorizontal: FIGMA.gutter,
  },
  head: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  headText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: "500",
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: FIGMA.inkFaint,
    marginTop: 4,
    lineHeight: 14,
  },
  actionHit: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  actionHover: {
    opacity: 0.9,
  },
  action: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: FIGMA.goldDeep,
  },
});

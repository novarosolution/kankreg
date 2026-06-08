import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PremiumCard from "./PremiumCard";
import { useTheme } from "../../context/ThemeContext";
import { fonts, icon, spacing, typography } from "../../theme/tokens";

export default function InteractiveListRow({ iconName, title, subtitle, onPress, tone = "normal", rightSlot }) {
  const { colors: c } = useTheme();
  const isDanger = tone === "danger";
  return (
    <PremiumCard onPress={onPress} variant={isDanger ? "danger" : "list"} padding="md" contentStyle={styles.content}>
      <View style={[styles.iconWrap, { backgroundColor: isDanger ? "rgba(220,38,38,0.08)" : c.secondarySoft, borderColor: isDanger ? c.danger : c.secondaryBorder }]}>
        <Ionicons name={iconName} size={icon.sm} color={isDanger ? c.danger : c.secondaryDark} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: isDanger ? c.danger : c.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: c.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightSlot || <Ionicons name="chevron-forward" size={icon.xs} color={c.textMuted} style={styles.chevron} />}
    </PremiumCard>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    minHeight: 50,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.bold,
  },
  subtitle: {
    marginTop: 2,
    fontSize: typography.caption,
    fontFamily: fonts.regular,
  },
  chevron: {
    marginTop: Platform.OS === "web" ? 2 : 0,
  },
});

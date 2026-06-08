import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { fonts, spacing, typography } from "../../theme/tokens";

export default function CollapsibleSection({ title, subtitle, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const { colors: c } = useTheme();
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.head}>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: c.textMuted }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: c.textSecondary }]}>{subtitle}</Text> : null}
        </View>
        <Ionicons name={open ? "chevron-up-outline" : "chevron-down-outline"} size={18} color={c.textMuted} />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: typography.overline,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 1.05,
  },
  subtitle: {
    marginTop: 2,
    fontSize: typography.caption,
    fontFamily: fonts.regular,
  },
  body: {
    marginTop: spacing.sm,
  },
});

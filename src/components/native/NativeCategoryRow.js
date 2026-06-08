import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA, figmaCardShell } from "../../theme/figmaApp";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const DEFAULT_CATS = [
  { key: "home", label: "Home", icon: "home-outline", colors: ["#f3e7cc", "#e3cfa6"], accent: "#a9772e" },
  { key: "wellness", label: "Wellness", icon: "leaf-outline", colors: ["#e7eee6", "#cdddcf"], accent: "#3c6248" },
  { key: "lifestyle", label: "Lifestyle", icon: "sparkles-outline", colors: ["#f1e3d6", "#dcc3ad"], accent: "#8a5f22" },
  { key: "kitchen", label: "Kitchen", icon: "cafe-outline", colors: ["#f4e6d2", "#e0b98f"], accent: "#a9772e" },
];

const tileShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 3 },
});

const stripShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  android: { elevation: 1 },
});

export default function NativeCategoryRow({ categories = DEFAULT_CATS, onPress }) {
  if (Platform.OS === "web") return null;

  return (
    <View style={[styles.strip, figmaCardShell(), stripShadow]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => onPress?.(cat.label)}
          >
            <View style={[styles.tile, tileShadow]}>
              <LinearGradient
                colors={cat.colors}
                start={{ x: 0.32, y: 0.18 }}
                end={{ x: 0.72, y: 0.88 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={[styles.iconRing, { borderColor: `${cat.accent}33` }]}>
                <Ionicons name={cat.icon} size={26} color={cat.accent} />
              </View>
            </View>
            <Text style={styles.label}>{cat.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    marginHorizontal: FIGMA.gutter,
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: spacing.xs,
    backgroundColor: FIGMA.card,
  },
  content: {
    paddingHorizontal: 14,
    gap: 12,
  },
  item: {
    width: 80,
    alignItems: "center",
  },
  itemPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  tile: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: FIGMA.card,
  },
  iconRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "rgba(255,253,248,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 8,
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: FIGMA.ink,
    textAlign: "center",
    letterSpacing: 0.1,
  },
});

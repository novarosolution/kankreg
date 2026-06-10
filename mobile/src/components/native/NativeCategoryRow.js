import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA, figmaCardShell, figmaTextPrimary } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const DEFAULT_CATS = [
  {
    key: "home",
    label: "Home",
    icon: "home-outline",
    colors: ["#f3e7cc", "#e3cfa6"],
    colorsDark: ["#2e2820", "#1e1a16"],
    accent: "#a9772e",
  },
  {
    key: "wellness",
    label: "Wellness",
    icon: "leaf-outline",
    colors: ["#e7eee6", "#cdddcf"],
    colorsDark: ["#1e2a22", "#121816"],
    accent: "#3c6248",
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    icon: "sparkles-outline",
    colors: ["#f1e3d6", "#dcc3ad"],
    colorsDark: ["#2a221c", "#181412"],
    accent: "#8a5f22",
  },
  {
    key: "kitchen",
    label: "Kitchen",
    icon: "cafe-outline",
    colors: ["#f4e6d2", "#e0b98f"],
    colorsDark: ["#2c2618", "#1a1610"],
    accent: "#a9772e",
  },
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

export default function NativeCategoryRow({ categories, products, onPress }) {
  const { isDark, colors: c } = useTheme();
  const { isMobileWeb } = useKankregLayout();
  const safeProducts = Array.isArray(products) ? products : [];
  const tiles = useMemo(() => {
    if (Array.isArray(categories) && categories.length) return categories;
    const labels = [
      ...new Set(
        safeProducts
          .map((p) => String(p.category || p.productType || "").trim())
          .filter(Boolean)
      ),
    ].slice(0, 6);
    if (!labels.length) return DEFAULT_CATS;
    return labels.map((label, i) => {
      const seed = DEFAULT_CATS[i % DEFAULT_CATS.length];
      return {
        ...seed,
        key: `${seed.key}-${label}`,
        label,
      };
    });
  }, [categories, safeProducts]);

  if (Platform.OS === "web" && !isMobileWeb) return null;

  return (
    <View
      style={[
        styles.strip,
        isMobileWeb && styles.stripMobileWeb,
        figmaCardShell(isDark),
        stripShadow,
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tiles.map((cat) => {
          const tileColors = isDark && cat.colorsDark ? cat.colorsDark : cat.colors;
          return (
            <Pressable
              key={cat.key}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              onPress={() => onPress?.(cat.label)}
            >
              <View
                style={[
                  styles.tile,
                  tileShadow,
                  isDark && { borderColor: c.primaryBorder, backgroundColor: c.surface },
                ]}
              >
                <LinearGradient
                  colors={tileColors}
                  start={{ x: 0.32, y: 0.18 }}
                  end={{ x: 0.72, y: 0.88 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View
                  style={[
                    styles.iconRing,
                    {
                      borderColor: `${cat.accent}${isDark ? "55" : "33"}`,
                      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,253,248,0.55)",
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={26}
                    color={isDark ? (cat.accent === "#3c6248" ? "#6ee7b7" : "#e8c878") : cat.accent}
                  />
                </View>
              </View>
              <Text style={[styles.label, figmaTextPrimary(isDark)]}>{cat.label}</Text>
            </Pressable>
          );
        })}
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
  },
  stripMobileWeb: {
    marginHorizontal: 0,
    width: "100%",
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
  tileDark: {
    borderColor: "rgba(232, 200, 90, 0.18)",
    backgroundColor: "#181513",
  },
  iconRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 8,
    fontFamily: fonts.semibold,
    fontSize: 10,
    textAlign: "center",
    letterSpacing: 0.1,
  },
});

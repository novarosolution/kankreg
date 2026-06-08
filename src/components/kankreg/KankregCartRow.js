import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  FIGMA,
  figmaCardShell,
  figmaDisplayTitle,
  figmaIconMuted,
  figmaIconSoft,
  figmaPrice,
  figmaRowBorder,
  figmaTextMuted,
  figmaTextPrimary,
} from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { formatINR } from "../../utils/currency";
import { getImageUriCandidates } from "../../utils/image";
import { fonts } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const rowShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  web: { boxShadow: "0 4px 14px rgba(61, 42, 18, 0.06)" },
});

/** figmaforkankreg.html cart row — app + web */
export default function KankregCartRow({
  item,
  index = 0,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const { isDark } = useTheme();
  const grad = FIGMA.productTileGradients[index % FIGMA.productTileGradients.length];
  const imageUri = getImageUriCandidates(item?.image || "")[0] || "";
  const lineTotal = (Number(item?.price) || 0) * (Number(item?.quantity) || 1);
  const variant = item?.variantLabel || item?.unit || "";
  const qty = Number(item?.quantity) || 1;

  return (
    <View style={[figmaCardShell(isDark), styles.row, rowShadow]}>
      <View style={styles.thumbWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.thumbImage} contentFit="cover" />
        ) : (
          <LinearGradient colors={grad} style={styles.thumbGrad} />
        )}
      </View>
      <View style={styles.body}>
        <Text style={[figmaDisplayTitle(13, isDark), styles.name]} numberOfLines={2}>
          {item?.name}
        </Text>
        {variant ? (
          <Text style={[styles.variant, figmaTextMuted(isDark)]}>
            {variant}
            {qty > 1 ? ` · Qty ${qty}` : ""}
          </Text>
        ) : qty > 1 ? (
          <Text style={[styles.variant, figmaTextMuted(isDark)]}>Qty {qty}</Text>
        ) : null}
        <View style={styles.qtyRow}>
          <View style={[styles.qtyPill, figmaRowBorder(isDark)]}>
            <Pressable onPress={onDecrease} style={styles.qtyHit} hitSlop={6} accessibilityLabel="Decrease quantity">
              <Ionicons name="remove" size={14} color={figmaIconSoft(isDark)} />
            </Pressable>
            <Text style={[styles.qtyNum, figmaTextPrimary(isDark)]}>{item?.quantity || 1}</Text>
            <Pressable onPress={onIncrease} style={styles.qtyHit} hitSlop={6} accessibilityLabel="Increase quantity">
              <Ionicons name="add" size={14} color={figmaIconSoft(isDark)} />
            </Pressable>
          </View>
          {onRemove ? (
            <Pressable onPress={onRemove} hitSlop={8} accessibilityLabel="Remove item">
              <Ionicons name="trash-outline" size={15} color={figmaIconMuted(isDark)} />
            </Pressable>
          ) : null}
        </View>
      </View>
      <Text style={[figmaPrice(isDark), styles.price]}>{formatINR(lineTotal)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    marginBottom: 10,
    borderRadius: 14,
  },
  thumbWrap: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    flexShrink: 0,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  thumbGrad: {
    flex: 1,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: "500",
    lineHeight: 16,
  },
  variant: {
    fontFamily: fonts.regular,
    fontSize: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  qtyHit: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    width: 22,
    textAlign: "center",
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
  price: {
    flexShrink: 0,
    fontSize: 14,
  },
});

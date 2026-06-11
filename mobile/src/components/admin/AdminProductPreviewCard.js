import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import PremiumChip from "../ui/PremiumChip";
import ComingSoonProductOverlay from "../product/ComingSoonProductOverlay";
import { getComingSoonImageBlurStyle } from "../../utils/comingSoonImageStyle";
import { COMING_SOON_RED } from "../../theme/comingSoonTheme";
import { SHOP_SCREEN_UI } from "../../content/appContent";
import { fonts, radius, spacing } from "../../theme/tokens";
import { formatINR } from "../../utils/currency";

export default function AdminProductPreviewCard({
  name,
  price,
  mrp,
  category,
  primaryImage,
  ImageComponent,
  isPublished,
  comingSoon,
  comingSoonNote = "",
  showOnHome,
  compact,
  hint = "Live preview · switch tabs to edit listing & page",
}) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome, compact), [chrome, compact]);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {primaryImage && ImageComponent ? (
          <ImageComponent
            sourceUri={primaryImage}
            style={[styles.image, comingSoon && getComingSoonImageBlurStyle()]}
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="image-outline" size={compact ? 24 : 32} color={c.textMuted} />
          </View>
        )}
        {comingSoon ? (
          <ComingSoonProductOverlay
            note={comingSoonNote}
            compact={compact}
            isDark={isDark}
          />
        ) : null}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name?.trim() || "Product name"}
      </Text>
      <Text style={styles.price}>
        {formatINR(Number(price) || 0)}
        {mrp && Number(mrp) > Number(price) ? <Text style={styles.mrp}> {formatINR(Number(mrp))}</Text> : null}
      </Text>
      {category ? <Text style={styles.meta}>{category}</Text> : null}
      <View style={styles.chips}>
        <PremiumChip
          label={isPublished ? "Published" : "Draft"}
          tone={isPublished ? "green" : "gold"}
          size="xs"
          selected={isPublished}
        />
        {comingSoon ? (
          <PremiumChip label={SHOP_SCREEN_UI.card.comingSoon} tone="gold" size="xs" selected />
        ) : null}
        {showOnHome ? <PremiumChip label="On home" tone="green" size="xs" selected /> : null}
      </View>
      {comingSoon ? (
        <Text style={styles.comingSoonHint}>
          {comingSoonNote?.trim() || SHOP_SCREEN_UI.card.comingSoonNoteFallback}
        </Text>
      ) : null}
      {!compact ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

function createStyles(chrome, compact) {
  return StyleSheet.create({
    card: {
      gap: spacing.xs,
    },
    imageWrap: {
      position: "relative",
      borderRadius: radius.lg,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: chrome.line,
    },
    image: {
      width: "100%",
      height: compact ? 120 : 180,
      borderRadius: radius.lg,
      backgroundColor: chrome.paper,
    },
    placeholder: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: chrome.line,
      borderStyle: "dashed",
    },
    name: {
      fontSize: compact ? 15 : 16,
      fontFamily: fonts.semibold,
      color: chrome.ink,
      marginTop: spacing.xs,
    },
    price: {
      fontSize: compact ? 14 : 15,
      fontFamily: fonts.bold,
      color: chrome.goldDeep,
    },
    mrp: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: chrome.inkFaint,
      textDecorationLine: "line-through",
    },
    meta: {
      fontSize: 12,
      color: chrome.inkFaint,
      fontFamily: fonts.regular,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
      marginTop: 2,
    },
    comingSoonHint: {
      fontSize: 11,
      color: COMING_SOON_RED.mid,
      fontFamily: fonts.medium,
      marginTop: 2,
    },
    hint: {
      fontSize: 11,
      color: chrome.inkFaint,
      fontFamily: fonts.regular,
      marginTop: spacing.xs,
    },
  });
}

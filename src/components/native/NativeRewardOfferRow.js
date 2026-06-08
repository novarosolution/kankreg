import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA, figmaCardShell, figmaDisplayTitle } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { fonts } from "../../theme/tokens";

/** figmaforkankreg.html rewards redeem row */
export default function NativeRewardOfferRow({
  title,
  subtitle,
  pointsCost,
  onRedeem,
  busy = false,
  disabled = false,
}) {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;

  return (
    <View style={[figmaCardShell(isDark), styles.row]}>
      <View style={styles.iconWrap}>
        <Ionicons name="star-outline" size={18} color={FIGMA.gold} />
      </View>
      <View style={styles.body}>
        <Text style={[figmaDisplayTitle(14, isDark), styles.title]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        <Text style={styles.pts}>{pointsCost} pts</Text>
        <Pressable
          onPress={onRedeem}
          disabled={disabled || busy}
          style={({ pressed }) => [pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.redeem}>{busy ? "…" : "Redeem"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "rgba(169,119,46,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  body: {
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
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  pts: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: FIGMA.gold,
  },
  redeem: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: FIGMA.goldDeep,
    marginTop: 2,
    textTransform: "uppercase",
  },
});

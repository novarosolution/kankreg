import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA, figmaCardShell, figmaDisplayTitle } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { formatINR } from "../../utils/currency";
import { fonts } from "../../theme/tokens";
import NativeTag from "./NativeTag";

/** figmaforkankreg.html order / tracking card header */
export default function NativeOrderCard({
  orderId,
  status,
  statusLabel,
  total,
  itemCount,
  dateLabel,
  onPress,
  children,
}) {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return children || null;

  const tone = status === "delivered" ? "green" : "gold";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [figmaCardShell(isDark), styles.card, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.kicker}>ORDER #{orderId}</Text>
          <Text style={[figmaDisplayTitle(14, isDark), styles.title]} numberOfLines={1}>
            {itemCount} item{itemCount === 1 ? "" : "s"} · {formatINR(total)}
          </Text>
          {dateLabel ? <Text style={styles.date}>{dateLabel}</Text> : null}
        </View>
        {statusLabel ? <NativeTag label={statusLabel} tone={tone} /> : null}
      </View>
      {children}
      <View style={styles.chevronRow}>
        <Ionicons name="chevron-down" size={16} color={FIGMA.inkFaint} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: FIGMA.gutter,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: FIGMA.inkFaint,
    letterSpacing: 0.6,
  },
  title: {
    fontWeight: "500",
    marginTop: 4,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: FIGMA.inkFaint,
    marginTop: 2,
  },
  chevronRow: {
    alignItems: "center",
    marginTop: 8,
  },
});

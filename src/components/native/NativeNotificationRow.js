import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA, figmaCardShell, figmaTextMuted, figmaTextPrimary } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { fonts } from "../../theme/tokens";

function formatRelativeTime(value) {
  if (!value) return "";
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return "";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

/** figmaforkankreg.html notification row */
export default function NativeNotificationRow({ item, onPress }) {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;
  const unread = !item?.isRead;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        figmaCardShell(isDark),
        styles.card,
        unread && styles.unread,
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="notifications-outline" size={16} color={FIGMA.gold} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, figmaTextPrimary(isDark)]} numberOfLines={1}>
          {item?.title}
        </Text>
        <Text style={[styles.message, figmaTextMuted(isDark)]} numberOfLines={2}>
          {item?.message}
        </Text>
      </View>
      <Text style={[styles.time, figmaTextMuted(isDark)]}>{formatRelativeTime(item?.createdAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: FIGMA.gold,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    fontFamily: fonts.semibold,
    fontSize: 12.5,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 9,
    flexShrink: 0,
  },
});

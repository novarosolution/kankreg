import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIGMA } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { SEARCH_PLACEHOLDER } from "../../content/appContent";
import { fonts, spacing } from "../../theme/tokens";

export default function NativeSearchBar({
  onPress,
  onFilterPress,
  placeholder = "Search essentials",
  filterBadgeCount = 0,
  value,
  onChangeText,
  inputRef,
  autoFocus = false,
  onClear,
}) {
  const { colors: c, isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark, c), [isDark, c]);
  const editable = typeof onChangeText === "function";
  if (Platform.OS === "web") return null;

  const searchBody = (
    <>
      <Ionicons name="search-outline" size={14} color={styles.iconColor} />
      {editable ? (
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || SEARCH_PLACEHOLDER}
          placeholderTextColor={styles.iconColor}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={autoFocus}
          clearButtonMode={Platform.OS === "ios" ? "while-editing" : "never"}
        />
      ) : (
        <Text style={styles.placeholder} numberOfLines={1}>
          {placeholder || SEARCH_PLACEHOLDER}
        </Text>
      )}
      {editable && value?.trim() && onClear ? (
        <Pressable onPress={onClear} hitSlop={8} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={14} color={styles.iconColorActive} />
        </Pressable>
      ) : null}
    </>
  );

  return (
    <View style={styles.row}>
      {editable ? (
        <View style={styles.search}>{searchBody}</View>
      ) : (
        <Pressable style={styles.search} onPress={onPress} accessibilityRole="button" accessibilityLabel="Search shop">
          {searchBody}
        </Pressable>
      )}
      {onFilterPress ? (
        <Pressable style={styles.filterBtn} onPress={onFilterPress} accessibilityLabel="Filters">
          <Ionicons name="options-outline" size={16} color={styles.iconColorActive} />
          {filterBadgeCount > 0 ? (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filterBadgeCount > 9 ? "9+" : filterBadgeCount}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(isDark, c) {
  const bg = isDark ? c.surface : FIGMA.card;
  const border = isDark ? c.border : FIGMA.line;
  const iconColor = isDark ? c.textMuted : FIGMA.inkFaint;
  const iconColorActive = isDark ? c.textSecondary : FIGMA.inkSoft;

  return {
    ...StyleSheet.create({
      row: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: FIGMA.gutter,
        marginTop: spacing.sm + 2,
      },
      search: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: FIGMA.radiusControl,
        paddingHorizontal: 12,
        paddingVertical: 9,
        minHeight: 40,
        backgroundColor: bg,
        borderColor: border,
      },
      placeholder: {
        flex: 1,
        fontSize: 12,
        color: iconColor,
      },
      input: {
        flex: 1,
        fontSize: 12,
        fontFamily: fonts.regular,
        color: isDark ? c.textPrimary : FIGMA.ink,
        paddingVertical: 0,
        minHeight: 20,
      },
      filterBtn: {
        width: 40,
        height: 40,
        borderRadius: FIGMA.radiusControl,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        borderColor: border,
        position: "relative",
      },
      filterBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        minWidth: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: FIGMA.goldDeep,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
      },
      filterBadgeText: {
        fontSize: 8,
        fontWeight: "800",
        color: "#fff",
      },
    }),
    iconColor,
    iconColorActive,
  };
}

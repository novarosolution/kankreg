import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { FIGMA, figmaPill, figmaPillText } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";

export default function NativePillRow({ options, selected, onSelect }) {
  if (Platform.OS === "web") return null;

  const normalized = options.map((opt) =>
    typeof opt === "string" ? { key: opt, label: opt } : opt
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {normalized.map((opt) => {
        const active = selected === opt.key;
        return (
          <Pressable key={opt.key} style={figmaPill(active)} onPress={() => onSelect(opt.key)}>
            <Text style={figmaPillText(active)}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: FIGMA.gutter,
    gap: 7,
    paddingTop: spacing.sm + 2,
    paddingBottom: 2,
  },
});

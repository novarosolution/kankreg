import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

const BG_CLASSES = ["#f3e7cc", "#e7eee6", "#f1e3d6", "#e8e9ee", "#f4e6d2"];

export default function AdminProductCell({ name, imageUri, index = 0 }) {
  const bg = BG_CLASSES[index % BG_CLASSES.length];
  return (
    <View style={styles.row}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, { backgroundColor: bg }]}>
          <Text style={styles.glyph}>∷</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  thumb: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    color: "#5a4326",
    fontSize: 14,
  },
  name: {
    flex: 1,
    color: KANKREG_PALETTE.ink,
    fontFamily: fonts.semibold,
    fontSize: 12.5,
  },
});

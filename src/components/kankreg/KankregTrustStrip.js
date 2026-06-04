import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HOME_TRUST_STRIP } from "../../content/appContent";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, icon, layout, radius, spacing, typography } from "../../theme/tokens";

/** kankreg.html `.trust` ink bar */
export default function KankregTrustStrip() {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.wrap}>
      <View style={styles.strip}>
        {HOME_TRUST_STRIP.map((item, idx) => (
          <React.Fragment key={item.key}>
            {idx > 0 ? <View style={styles.divider} /> : null}
            <View style={styles.cell}>
              <Ionicons name={item.icon} size={icon.sm} color={KANKREG_PALETTE.goldBright} />
              <Text style={styles.label} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

function createStyles() {
  return StyleSheet.create({
    wrap: {
      width: "100%",
      marginBottom: spacing.xl,
    },
    strip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: KANKREG_PALETTE.ink,
      borderRadius: radius.xl,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      maxWidth: layout.maxContentWidth,
      alignSelf: "center",
      width: "100%",
    },
    cell: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 4,
    },
    divider: {
      width: StyleSheet.hairlineWidth,
      height: 28,
      backgroundColor: "rgba(255,255,255,0.12)",
    },
    label: {
      fontSize: typography.caption,
      fontFamily: fonts.semibold,
      color: KANKREG_PALETTE.paper,
      flexShrink: 1,
    },
  });
}

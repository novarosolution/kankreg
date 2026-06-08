import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HOME_SCREEN_UI, HOME_TRUST_STRIP } from "../../content/appContent";
import { createKankregEyebrowStyle } from "../../theme/kankregScreenStyles";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, icon, layout, radius, spacing, typography } from "../../theme/tokens";

/** kankreg.html `.trust` ink bar */
export default function KankregTrustStrip() {
  const { isDark } = useTheme();
  const { isXs, isMobileWeb } = useKankregLayout();
  const stackCells = isXs && !isMobileWeb;
  const styles = useMemo(() => createStyles(stackCells), [stackCells]);
  const overline = HOME_SCREEN_UI.trust?.overline;

  return (
    <View style={styles.wrap}>
      {overline ? <Text style={[createKankregEyebrowStyle(isDark), styles.overline]}>{overline}</Text> : null}
      <View style={[styles.strip, stackCells && styles.stripStack]}>
        {HOME_TRUST_STRIP.map((item, idx) => (
          <React.Fragment key={item.key}>
            {idx > 0 && !stackCells ? <View style={styles.divider} /> : null}
            <View style={[styles.cell, stackCells && styles.cellStack]}>
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

function createStyles(stacked) {
  return StyleSheet.create({
    wrap: {
      width: "100%",
      marginBottom: stacked ? spacing.lg : spacing.xl,
    },
    overline: {
      textAlign: "center",
      marginBottom: spacing.sm,
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
    stripStack: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: spacing.sm,
      paddingVertical: spacing.md + 2,
    },
    cell: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 4,
    },
    cellStack: {
      flex: 0,
      justifyContent: "flex-start",
      paddingVertical: 2,
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

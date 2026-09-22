import React, { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HOME_TRUST_STRIP } from "../../content/appContent";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";

const GREEN = KANKREG_CHROME.announceBg;
const GOLD = "#C4A24A";
const MINT = "#F3F8F4";

/** Premium promise band under home categories. */
export default function HomePromiseStrip() {
  const { isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const stacked = isMobileWeb || Platform.OS !== "web" || width < 760;
  const items = HOME_TRUST_STRIP;
  if (!items.length) return null;

  const fullBleed = useMemo(() => {
    if (Platform.OS !== "web") return { width: "100%" };
    if (isMobileWeb) return { width: "100%", alignSelf: "stretch" };
    return {
      width: "100vw",
      maxWidth: "100vw",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
      alignSelf: "center",
    };
  }, [isMobileWeb]);

  return (
    <View style={[styles.shell, fullBleed]} accessibilityRole="summary">
      <View style={styles.goldRule} pointerEvents="none" />
      <View
        style={[
          styles.inner,
          { paddingHorizontal: pageGutterClamp },
          stacked && styles.innerStacked,
        ]}
      >
        {items.map((item) => (
          <View key={item.key} style={[styles.cell, stacked && styles.cellStacked]}>
            <View style={[styles.card, stacked && styles.cardStacked]}>
              <View style={styles.iconWell}>
                <Ionicons name={item.icon} size={stacked ? 16 : 18} color={GREEN} />
              </View>
              <Text style={[styles.label, stacked && styles.labelStacked]} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    backgroundColor: MINT,
    borderTopWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(26, 92, 72, 0.08)",
    position: "relative",
  },
  goldRule: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -24,
    width: 48,
    height: 2,
    borderRadius: 1,
    backgroundColor: GOLD,
    opacity: 0.85,
  },
  inner: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingTop: 22,
    paddingBottom: 20,
    gap: 12,
  },
  innerStacked: {
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 10,
    paddingTop: 20,
    paddingBottom: 18,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
  cellStacked: {
    flexBasis: "47%",
    flexGrow: 1,
    maxWidth: "48%",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(26, 92, 72, 0.08)",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 20px -16px rgba(26, 40, 32, 0.28)",
      },
      default: {},
    }),
  },
  cardStacked: {
    justifyContent: "flex-start",
    paddingVertical: 11,
    paddingHorizontal: 12,
    minHeight: 52,
  },
  iconWell: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(196, 162, 74, 0.35)",
    flexShrink: 0,
  },
  label: {
    flexShrink: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 0.15,
    color: GREEN,
  },
  labelStacked: {
    fontSize: 12,
    lineHeight: 16,
  },
});

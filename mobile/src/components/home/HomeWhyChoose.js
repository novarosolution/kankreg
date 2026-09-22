import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { HOME_WHY_CHOOSE } from "../../content/appContent";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { WEB_DISPLAY_FONT_STACK } from "../../theme/webFonts";

const GREEN = KANKREG_CHROME.announceBg;

function WhyIcon({ name }) {
  if (name === "tree") {
    return (
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Path d="M28 48 V30" stroke={GREEN} strokeWidth="3.2" strokeLinecap="round" />
        <Path
          d="M28 10 C18 12 12 20 14 28 C8 30 8 38 16 40 C18 46 24 48 28 42 C32 48 38 46 40 40 C48 38 48 30 42 28 C44 20 38 12 28 10 Z"
          fill={GREEN}
        />
      </Svg>
    );
  }
  if (name === "churn") {
    return (
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Path d="M28 8 V20" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <Path d="M20 8 H36" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <Path d="M18 22 H38 L36 44 H20 Z" fill={GREEN} />
        <Rect x="16" y="44" width="24" height="4" rx="1.5" fill={GREEN} />
      </Svg>
    );
  }
  if (name === "clipboard") {
    return (
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Rect x="14" y="12" width="28" height="36" rx="4" fill={GREEN} />
        <Rect x="21" y="8" width="14" height="8" rx="2" fill={GREEN} />
        <Circle cx="36" cy="38" r="10" fill="#FFFFFF" />
        <Circle cx="36" cy="38" r="8" fill={GREEN} />
        <Path d="M32 38 L35 41 L41 34" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </Svg>
    );
  }
  return (
    <Svg width={56} height={56} viewBox="0 0 56 56">
      <Circle cx="16" cy="40" r="8" fill={GREEN} />
      <Circle cx="40" cy="42" r="6" fill={GREEN} />
      <Path d="M12 32 H34 L42 24 H48 V36 H44" fill={GREEN} />
      <Rect x="20" y="18" width="16" height="10" rx="2" fill={GREEN} />
    </Svg>
  );
}

export default function HomeWhyChoose() {
  const { isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const stacked = isMobileWeb || Platform.OS !== "web" || width < 720;
  const copy = HOME_WHY_CHOOSE;

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
    <View style={[styles.shell, fullBleed]} accessibilityRole="region" accessibilityLabel={copy.title}>
      <View style={[styles.inner, { paddingHorizontal: pageGutterClamp }]}>
        <Text style={styles.title}>{copy.title}</Text>
        <View style={[styles.row, stacked && styles.rowStacked]}>
          {copy.items.map((item) => (
            <View key={item.key} style={[styles.cell, stacked && styles.cellStacked]}>
              <WhyIcon name={item.icon} />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemBody}>{item.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    backgroundColor: "#FAFBF9",
    paddingTop: 64,
    paddingBottom: 72,
  },
  inner: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    gap: 40,
  },
  title: {
    textAlign: "center",
    color: GREEN,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: fonts.bold,
    ...Platform.select({
      web: {
        fontFamily: `Georgia, "Iowan Old Style", Palatino, ${WEB_DISPLAY_FONT_STACK}`,
        fontSize: 34,
        lineHeight: 40,
        letterSpacing: 0.2,
      },
      default: {},
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 28,
  },
  rowStacked: {
    flexDirection: "column",
    alignItems: "center",
    gap: 36,
  },
  cell: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 12,
  },
  cellStacked: {
    width: "100%",
    maxWidth: 360,
  },
  itemTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: GREEN,
    textAlign: "center",
    marginTop: 4,
  },
  itemBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(26, 43, 34, 0.68)",
    textAlign: "center",
    maxWidth: 230,
  },
});

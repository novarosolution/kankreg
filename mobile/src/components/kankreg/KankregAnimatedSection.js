import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import SectionReveal from "../motion/SectionReveal";
import GoldHairline from "../ui/GoldHairline";
import { useTheme } from "../../context/ThemeContext";
import { customerPanel, customerPanelVariant } from "../../theme/screenLayout";
import { spacing } from "../../theme/tokens";

/**
 * Standard animated page block: SectionReveal + optional customer panel + optional gold rule.
 */
export default function KankregAnimatedSection({
  children,
  index,
  delay,
  preset = "fade-up",
  panel = false,
  panelVariant = "default",
  hairline = false,
  hairlineShort = true,
  style,
  contentStyle,
  pointerEvents,
}) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const panelStyle = useMemo(() => {
    if (!panel) return null;
    if (panelVariant === "default") {
      return customerPanel(c, shadowPremium, isDark);
    }
    return customerPanelVariant(c, shadowPremium, isDark, panelVariant);
  }, [panel, panelVariant, c, shadowPremium, isDark]);

  return (
    <SectionReveal
      index={index}
      delay={delay}
      preset={preset}
      style={style}
      pointerEvents={pointerEvents}
    >
      <View style={[panel && styles.panelWrap, panelStyle, contentStyle]}>
        {hairline ? <GoldHairline marginVertical={spacing.sm} short={hairlineShort} /> : null}
        {children}
      </View>
    </SectionReveal>
  );
}

const styles = StyleSheet.create({
  panelWrap: {
    width: "100%",
  },
});

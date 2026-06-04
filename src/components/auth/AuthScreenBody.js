import React from "react";
import { Platform, View } from "react-native";
import AuthSplitLayout from "./AuthSplitLayout";
import AuthMobileShell from "./AuthMobileShell";
import SectionReveal from "../motion/SectionReveal";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { authPanel } from "../../theme/screenLayout";
/**
 * Shared Login / Register layout: split panel on wide web, unified mobile card on phone.
 */
export default function AuthScreenBody({ artSubtitle, form, styles: screenStyles }) {
  const { useAuthSplit, isXs } = useKankregLayout();
  const { colors: c, shadowPremium, isDark } = useTheme();
  const useSplit = useAuthSplit && Platform.OS === "web";
  const useMobileShell = !useSplit;

  if (useMobileShell) {
    return (
      <SectionReveal index={0} preset="fade-up" style={screenStyles.revealFill}>
        <AuthMobileShell artSubtitle={artSubtitle}>{form}</AuthMobileShell>
      </SectionReveal>
    );
  }

  return (
    <AuthSplitLayout artSubtitle={artSubtitle}>
      <SectionReveal index={1} preset="fade-up" style={screenStyles.revealFill}>
        <View
          style={[
            screenStyles.card,
            screenStyles.cardWebInline,
            isXs && screenStyles.cardWebStack,
            authPanel(c, shadowPremium, isDark, { compact: isXs }),
          ]}
        >
          {form}
        </View>
      </SectionReveal>
    </AuthSplitLayout>
  );
}

import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getLoadingPalette } from "../../theme/loadingTheme";
import { radius } from "../../theme/tokens";

/** Shared themed shell for page-level skeleton layouts. */
export default function useLoadingShell() {
  const { colors: c, isDark } = useTheme();
  const palette = useMemo(() => getLoadingPalette(isDark, c), [isDark, c]);

  return useMemo(() => {
    const styles = StyleSheet.create({
      wrap: {
        width: "100%",
        backgroundColor: palette.shellBg,
      },
      panel: {
        backgroundColor: palette.panelBg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.panelBorder,
        borderRadius: radius.lg,
        padding: 12,
      },
    });

    return {
      ...styles,
      palette,
      isDark,
      colors: c,
    };
  }, [palette, isDark, c]);
}

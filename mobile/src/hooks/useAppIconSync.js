import { useEffect } from "react";
import { Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";
import {
  applyAppIcon,
  getAppIconPreference,
  isDynamicAppIconAvailable,
} from "../services/appIconService";

/** Keeps launcher icon aligned with theme preference (auto/light/dark). */
export default function useAppIconSync() {
  const { isDark, hydrated } = useTheme();

  useEffect(() => {
    if (Platform.OS === "web" || !hydrated || !isDynamicAppIconAvailable()) return undefined;
    let cancelled = false;

    (async () => {
      const pref = await getAppIconPreference();
      if (cancelled) return;
      await applyAppIcon(pref, isDark);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, isDark]);
}

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { useTheme } from "./ThemeContext";
import useReducedMotion from "../hooks/useReducedMotion";
import { fonts, icon, radius, spacing, typography } from "../theme/tokens";
import { platformShadow } from "../theme/shadowPlatform";
import { getKankregChromeTop } from "../theme/kankregChrome";

const ToastContext = createContext(undefined);

const TOAST_TOKENS = {
  success: { iconName: "checkmark-circle", colorKey: "secondary" },
  error: { iconName: "alert-circle", colorKey: "danger" },
  warning: { iconName: "warning", colorKey: "primary" },
  info: { iconName: "information-circle", colorKey: "primary" },
};

const DEFAULT_DURATION = 2800;
const MAX_VISIBLE = 3;
let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (input) => {
      const opts = typeof input === "string" ? { message: input } : input || {};
      const id = ++toastSeq;
      const duration = opts.duration ?? DEFAULT_DURATION;
      const toast = {
        id,
        message: String(opts.message ?? ""),
        title: opts.title ? String(opts.title) : "",
        type: TOAST_TOKENS[opts.type] ? opts.type : "info",
      };
      setToasts((current) => {
        const next = [...current, toast];
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
      });
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      dismissToast: dismiss,
      toastSuccess: (message, opts) => showToast({ ...opts, message, type: "success" }),
      toastError: (message, opts) => showToast({ ...opts, message, type: "error" }),
      toastInfo: (message, opts) => showToast({ ...opts, message, type: "info" }),
    }),
    [showToast, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastHost({ toasts, onDismiss }) {
  const insets = useSafeAreaInsets();
  if (toasts.length === 0) return null;
  const topOffset =
    Platform.OS === "web"
      ? getKankregChromeTop(insets) + 12
      : Math.max(insets.top, spacing.sm) + spacing.xs;

  return (
    <View style={[styles.host, { paddingTop: topOffset }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { colors: c, isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const tok = TOAST_TOKENS[toast.type] || TOAST_TOKENS.info;
  const accent = c[tok.colorKey] || c.primary;
  const styles2 = useMemo(() => createToastStyles(c, isDark, accent), [c, isDark, accent]);

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.springify().damping(18).mass(0.7)}
      exiting={reducedMotion ? undefined : FadeOutUp.duration(200)}
      layout={reducedMotion ? undefined : LinearTransition.springify().damping(18)}
      style={styles2.wrap}
      accessibilityLiveRegion="polite"
      accessibilityRole={toast.type === "error" ? "alert" : undefined}
    >
      <Pressable
        onPress={() => onDismiss(toast.id)}
        style={styles2.press}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
      >
        <View style={styles2.iconBubble}>
          <Ionicons name={tok.iconName} size={icon.sm} color={accent} />
        </View>
        <View style={styles2.body}>
          {toast.title ? (
            <Text style={styles2.title} numberOfLines={1}>
              {toast.title}
            </Text>
          ) : null}
          {toast.message ? (
            <Text style={styles2.message} numberOfLines={3}>
              {toast.message}
            </Text>
          ) : null}
        </View>
        <Ionicons name="close" size={icon.xs} color={c.textMuted} style={styles2.close} />
      </Pressable>
    </Animated.View>
  );
}

function createToastStyles(c, isDark, accent) {
  const wrapShadow = platformShadow({
    web: {
      boxShadow: isDark
        ? "0 18px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
        : "0 18px 40px rgba(28, 25, 23, 0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
    },
    ios: {
      shadowColor: "#1a1208",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.4 : 0.16,
      shadowRadius: 18,
    },
    android: { elevation: 6 },
  });

  return StyleSheet.create({
    wrap: {
      width: "100%",
      maxWidth: 440,
      alignSelf: "center",
      marginBottom: spacing.xs + 2,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: accent + "40",
      borderTopWidth: 2,
      borderTopColor: accent + "AA",
      backgroundColor: isDark ? "rgba(28, 25, 23, 0.97)" : "rgba(255, 253, 249, 0.98)",
      overflow: "hidden",
      ...wrapShadow,
    },
    press: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md - 2,
      ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
    },
    iconBubble: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: accent + "1F",
    },
    body: { flex: 1, minWidth: 0, gap: 2 },
    title: {
      fontFamily: fonts.bold,
      fontSize: typography.bodySmall,
      color: c.textPrimary,
    },
    message: {
      fontFamily: fonts.medium,
      fontSize: typography.caption,
      lineHeight: 18,
      color: c.textSecondary,
    },
    close: {
      opacity: 0.8,
    },
  });
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: spacing.md,
    alignItems: "stretch",
    justifyContent: "flex-start",
    zIndex: 9999,
    ...Platform.select({
      web: { position: "fixed" },
      default: {},
    }),
  },
});

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return ctx;
}

/** Safe variant: returns a no-op API if no provider is mounted (e.g. early boot). */
export function useToastSafe() {
  const ctx = useContext(ToastContext);
  return ctx || NOOP_TOAST;
}

const NOOP_TOAST = {
  showToast: () => 0,
  dismissToast: () => {},
  toastSuccess: () => 0,
  toastError: () => 0,
  toastInfo: () => 0,
};

import React, { useEffect } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import PremiumButton from "../ui/PremiumButton";
import useReducedMotion from "../../hooks/useReducedMotion";
import { ORDER_CELEBRATION_UI, formatOrderReference } from "../../content/appContent";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, radius, spacing, typography } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

function PulseRing({ color, delay = 0 }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) }),
        -1,
        false
      )
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: (1 - progress.value) * 0.42,
    transform: [{ scale: 0.72 + progress.value * 0.55 }],
  }));

  return <Animated.View style={[styles.pulseRing, { borderColor: color }, style]} />;
}

function CelebrationIcon({ type }) {
  const bounce = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const isDelivered = type === "delivered";
  const iconName = isDelivered ? "gift" : "checkmark-circle";
  const colors = isDelivered ? ["#d9b463", "#9c6b27"] : ["#3c6248", "#2a4a36"];

  useEffect(() => {
    if (reducedMotion) return;
    bounce.value = withSequence(
      withSpring(1.12, { damping: 8, stiffness: 220 }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );
  }, [bounce, reducedMotion, type]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reducedMotion ? 1 : bounce.value }],
  }));

  return (
    <View style={styles.iconStage}>
      {!reducedMotion ? (
        <>
          <PulseRing color={isDelivered ? KANKREG_PALETTE.goldBright : "#7ecf9a"} delay={0} />
          <PulseRing color={isDelivered ? KANKREG_PALETTE.gold : "#4ade80"} delay={280} />
        </>
      ) : null}
      <Animated.View style={iconStyle}>
        <LinearGradient colors={colors} style={styles.iconDisc}>
          <Ionicons name={iconName} size={42} color="#fff" />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

/**
 * Full-screen celebration when an order is confirmed or delivered.
 */
export default function OrderCelebrationOverlay({
  visible,
  type = "confirmed",
  order,
  onDismiss,
  onTrackOrder,
  onContinue,
}) {
  const reducedMotion = useReducedMotion();
  const copy = type === "delivered" ? ORDER_CELEBRATION_UI.delivered : ORDER_CELEBRATION_UI.confirmed;
  const orderRef = formatOrderReference(order);

  useEffect(() => {
    if (!visible || Platform.OS === "web") return;
    Haptics.notificationAsync(
      type === "delivered"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Success
    ).catch(() => {});
  }, [type, visible]);

  if (!visible) return null;

  const entering = reducedMotion ? undefined : ZoomIn.springify().damping(16).stiffness(240);
  const backdropEntering = reducedMotion ? undefined : FadeIn.duration(220);
  const backdropExiting = reducedMotion ? undefined : FadeOut.duration(180);

  return (
    <Modal visible transparent animationType="none" onRequestClose={onDismiss} statusBarTranslucent>
      <Animated.View entering={backdropEntering} exiting={backdropExiting} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} accessibilityLabel="Dismiss" />
        <Animated.View entering={entering} style={styles.card}>
          <LinearGradient
            colors={["#fffdf8", "#f8f0e4", "#fffdf8"]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <CelebrationIcon type={type} />
          {orderRef ? <Text style={styles.orderRef}>{orderRef}</Text> : null}
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
          <View style={styles.actions}>
            <PremiumButton label={copy.ctaPrimary} variant="primary" onPress={onTrackOrder} />
            <PremiumButton label={copy.ctaSecondary} variant="ghost" onPress={onContinue} />
          </View>
          <Pressable onPress={onDismiss} style={styles.dismissLink} accessibilityRole="button">
            <Text style={styles.dismissText}>Dismiss</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const cardShadow = platformShadow({
  web: { boxShadow: "0 28px 70px -24px rgba(25,20,15,.45)" },
  ios: {
    shadowColor: "#19140f",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
  },
  android: { elevation: 10 },
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(25, 20, 15, 0.52)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: radius.xl + 4,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    paddingHorizontal: spacing.lg + 4,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.lg,
    alignItems: "center",
    overflow: "hidden",
    ...cardShadow,
  },
  iconStage: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  pulseRing: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
  },
  iconDisc: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  orderRef: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.goldDeep,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h2 + 2,
    lineHeight: typography.h2 + 6,
    color: KANKREG_PALETTE.ink,
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.sm,
    fontFamily: fonts.medium,
    fontSize: typography.bodySmall,
    lineHeight: 22,
    color: KANKREG_PALETTE.inkSoft,
    textAlign: "center",
    maxWidth: 300,
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.lg + 4,
  },
  dismissLink: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  dismissText: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    color: KANKREG_PALETTE.inkFaint,
  },
});

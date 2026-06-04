import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { AUTH_UI } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, typography } from "../../theme/tokens";
import PremiumButton from "../ui/PremiumButton";
import PremiumErrorBanner from "../ui/PremiumErrorBanner";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  isAppleSignInConfigured,
  isGoogleSignInConfigured,
  signInWithAppleNative,
} from "../../services/oauthSignIn";

function DisabledSocialButton({ label, iconLeft, style }) {
  return (
    <PremiumButton
      label={label}
      variant="outline"
      size="md"
      fullWidth
      iconLeft={iconLeft}
      disabled
      accessibilityHint={AUTH_UI.socialDisabledHint}
      style={style}
    />
  );
}

/** Google / Apple sign-in — live when configured, disabled placeholders otherwise. */
export default function AuthSocialButtons({ onSuccess }) {
  const { loginWithApple } = useAuth();
  const { isDark } = useTheme();
  const { isXs } = useKankregLayout();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const googleLive = isGoogleSignInConfigured();
  const appleLive = isAppleSignInConfigured();
  const showAppleSlot = Platform.OS === "ios" || Platform.OS === "web";
  const btnStyle = isXs ? styles.btnStack : styles.btn;

  const runApple = async () => {
    if (!appleLive) return;
    try {
      setBusy("apple");
      setError("");
      const { identityToken, fullName } = await signInWithAppleNative();
      await loginWithApple({ identityToken, fullName });
      onSuccess?.();
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") return;
      setError(e.message || "Apple sign-in failed.");
    } finally {
      setBusy("");
    }
  };

  return (
    <View style={styles.wrap}>
      {error ? <PremiumErrorBanner severity="error" message={error} compact /> : null}
      <View style={[styles.row, isXs && styles.rowStack]}>
        {googleLive ? (
          <GoogleSignInButton
            onSuccess={onSuccess}
            busy={busy}
            setBusy={setBusy}
            setError={setError}
            style={btnStyle}
          />
        ) : (
          <DisabledSocialButton
            label={`${AUTH_UI.googleLabel} · ${AUTH_UI.socialComingSoon}`}
            iconLeft="logo-google"
            style={btnStyle}
          />
        )}
        {showAppleSlot ? (
          appleLive ? (
            <PremiumButton
              label={AUTH_UI.appleLabel}
              variant="outline"
              size="md"
              fullWidth
              iconLeft="logo-apple"
              loading={busy === "apple"}
              disabled={Boolean(busy)}
              onPress={runApple}
              style={btnStyle}
            />
          ) : (
            <DisabledSocialButton
              label={`${AUTH_UI.appleLabel} · ${AUTH_UI.socialComingSoon}`}
              iconLeft="logo-apple"
              style={btnStyle}
            />
          )
        ) : null}
      </View>
      {!googleLive && !appleLive ? (
        <Text style={[styles.hint, { color: isDark ? "#9a8f82" : KANKREG_PALETTE.inkFaint }]}>
          {AUTH_UI.socialDisabledHint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  row: { flexDirection: "row", gap: 12 },
  rowStack: { flexDirection: "column", gap: 10 },
  btn: { flex: 1 },
  btnStack: { width: "100%" },
  hint: {
    marginTop: 10,
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    textAlign: "center",
    lineHeight: 18,
  },
});

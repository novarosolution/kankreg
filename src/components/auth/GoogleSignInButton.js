import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { AUTH_UI } from "../../content/appContent";
import PremiumButton from "../ui/PremiumButton";
import {
  isGoogleSignInConfigured,
  useGoogleIdTokenAuthRequest,
} from "../../services/oauthSignIn";

function GoogleSignInButtonInner({ onSuccess, busy, setBusy, setError, style }) {
  const { loginWithGoogle } = useAuth();
  const [request, response, promptGoogle] = useGoogleIdTokenAuthRequest();

  useEffect(() => {
    if (response?.type !== "success") return;
    const idToken = response.params?.id_token;
    if (!idToken) return;
    (async () => {
      try {
        setBusy("google");
        setError("");
        await loginWithGoogle({ idToken });
        onSuccess?.();
      } catch (e) {
        setError(e.message || "Google sign-in failed.");
      } finally {
        setBusy("");
      }
    })();
  }, [response, loginWithGoogle, onSuccess, setBusy, setError]);

  return (
    <PremiumButton
      label={AUTH_UI.googleLabel}
      variant="ghost"
      size="md"
      fullWidth
      iconLeft="logo-google"
      loading={busy === "google"}
      disabled={Boolean(busy) || !request}
      onPress={() => promptGoogle()}
      style={[styles.btn, style]}
    />
  );
}

/** Renders only when Google OAuth client IDs exist for this platform. */
export default function GoogleSignInButton(props) {
  if (!isGoogleSignInConfigured()) {
    return null;
  }
  return <GoogleSignInButtonInner {...props} />;
}

const styles = StyleSheet.create({
  btn: { flex: 1 },
});

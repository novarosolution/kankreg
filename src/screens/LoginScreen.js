import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import CustomerScreenShell from "../components/CustomerScreenShell";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
// AuthSplitLayout wraps form on web ≥900px
import AuthFormShell from "../components/auth/AuthFormShell";
import AuthCompactHero from "../components/auth/AuthCompactHero";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { AUTH_UI } from "../content/appContent";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { adminScrollPaddingBottom, authPanel, customerScrollFill } from "../theme/screenLayout";
import { spacing } from "../theme/tokens";
import { normalizeEmail, validateLoginEmail, validateLoginPassword } from "../utils/authValidation";
import PremiumButton from "../components/ui/PremiumButton";
import PremiumInput from "../components/ui/PremiumInput";
import PremiumErrorBanner from "../components/ui/PremiumErrorBanner";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithCredentials } = useAuth();
  const { colors: c, shadowPremium: sp, isDark } = useTheme();
  const { useAuthSplit } = useKankregLayout();
  const styles = useMemo(() => createLoginStyles(c, sp, isDark), [c, sp, isDark]);
  const insets = useSafeAreaInsets();
  const showSubtitle = Platform.OS !== "web" || !useAuthSplit;

  const handleLogin = async () => {
    const emailErr = validateLoginEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    const passErr = validateLoginPassword(password);
    if (passErr) {
      setError(passErr);
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      await loginWithCredentials({ email: normalizeEmail(email), password });
      navigation.navigate("Home");
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formBody = (
    <AuthFormShell
      navigation={navigation}
      activeRoute="Login"
      title={AUTH_UI.loginTitle}
      subtitle={showSubtitle ? AUTH_UI.loginSubtitle : undefined}
      showForgotPassword
      onForgotPassword={() => Alert.alert(AUTH_UI.forgotPassword, AUTH_UI.forgotPasswordStub)}
      socialSlot={<AuthSocialButtons onSuccess={() => navigation.navigate("Home")} />}
      footerSlot={
        <PremiumButton
          label={AUTH_UI.continueGuest}
          variant="outline"
          size="md"
          fullWidth
          iconLeft="storefront-outline"
          onPress={() => navigation.navigate("Home")}
        />
      }
    >
      <PremiumInput
        label="Email"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          if (error) setError("");
        }}
        iconLeft="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <PremiumInput
        label="Password"
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          if (error) setError("");
        }}
        iconLeft="lock-closed-outline"
        secureTextEntry
        passwordToggle
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      {error ? (
        <View style={styles.errorWrap}>
          <PremiumErrorBanner severity="error" message={error} compact />
        </View>
      ) : null}
      <PremiumButton
        label={isSubmitting ? "Please wait..." : "Sign in →"}
        onPress={handleLogin}
        iconLeft="sparkles-outline"
        loading={isSubmitting}
        disabled={isSubmitting}
        size="lg"
        fullWidth
        style={styles.primaryCta}
      />
    </AuthFormShell>
  );

  return (
    <CustomerScreenShell style={styles.screen}>
      <KeyboardAvoidingView style={customerScrollFill} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <KankregScrollPage
          scrollVariant="auth"
          showFooter={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContentExtra,
            Platform.OS !== "web" ? { paddingBottom: adminScrollPaddingBottom(insets) } : null,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {Platform.OS === "web" ? null : <AuthCompactHero compact />}
          <AuthSplitLayout artSubtitle={AUTH_UI.loginSubtitle}>
            <View style={[styles.card, Platform.OS === "web" ? styles.cardWebInline : null]}>{formBody}</View>
          </AuthSplitLayout>
        </KankregScrollPage>
      </KeyboardAvoidingView>
    </CustomerScreenShell>
  );
}

function createLoginStyles(c, shadowPremium, isDark) {
  return StyleSheet.create({
    screen: { flex: 1 },
    scrollContentExtra: { width: "100%" },
    cardWebInline: {
      maxWidth: "100%",
      borderWidth: 0,
      backgroundColor: "transparent",
      paddingHorizontal: 0,
      paddingVertical: 0,
      ...Platform.select({ web: { boxShadow: "none" }, default: {} }),
    },
    card: {
      width: "100%",
      maxWidth: 468,
      ...authPanel(c, shadowPremium, isDark),
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
      alignSelf: "center",
    },
    errorWrap: { marginTop: spacing.sm },
    primaryCta: { marginTop: spacing.md },
  });
}

import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import CustomerScreenShell from "../components/CustomerScreenShell";
import AuthSplitLayout from "../components/auth/AuthSplitLayout";
import AuthFormShell from "../components/auth/AuthFormShell";
import AuthCompactHero from "../components/auth/AuthCompactHero";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { AUTH_UI } from "../content/appContent";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { adminScrollPaddingBottom, authPanel, customerScrollFill } from "../theme/screenLayout";
import { spacing } from "../theme/tokens";
import {
  isValidEmail,
  normalizeEmail,
  validateRegisterName,
  validateRegisterPassword,
} from "../utils/authValidation";
import PremiumButton from "../components/ui/PremiumButton";
import PremiumInput from "../components/ui/PremiumInput";
import PremiumErrorBanner from "../components/ui/PremiumErrorBanner";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerWithCredentials } = useAuth();
  const { colors: c, shadowPremium: sp, isDark } = useTheme();
  const { useAuthSplit } = useKankregLayout();
  const styles = useMemo(() => createRegisterStyles(c, sp, isDark), [c, sp, isDark]);
  const insets = useSafeAreaInsets();
  const showSubtitle = Platform.OS !== "web" || !useAuthSplit;

  const handleRegister = async () => {
    const nameErr = validateRegisterName(name);
    if (nameErr) {
      setError(nameErr);
      return;
    }
    const em = normalizeEmail(email);
    if (!em) {
      setError("Please enter your email.");
      return;
    }
    if (!isValidEmail(em)) {
      setError("Please enter a valid email address.");
      return;
    }
    const passErr = validateRegisterPassword(password);
    if (passErr) {
      setError(passErr);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      await registerWithCredentials({
        name: name.trim().replace(/\s+/g, " "),
        email: em,
        password,
      });
      navigation.navigate("Home");
    } catch (err) {
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formBody = (
    <AuthFormShell
      navigation={navigation}
      activeRoute="Register"
      title={AUTH_UI.registerTitle}
      subtitle={showSubtitle ? AUTH_UI.registerSubtitle : undefined}
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
        label="Full name"
        value={name}
        onChangeText={(t) => {
          setName(t);
          if (error) setError("");
        }}
        iconLeft="person-outline"
        autoCapitalize="words"
      />
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
        autoComplete="email"
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
      />
      <PremiumInput
        label="Confirm password"
        value={confirmPassword}
        onChangeText={(t) => {
          setConfirmPassword(t);
          if (error) setError("");
        }}
        iconLeft="lock-closed-outline"
        secureTextEntry
        passwordToggle
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />
      {error ? (
        <View style={styles.errorWrap}>
          <PremiumErrorBanner severity="error" message={error} compact />
        </View>
      ) : null}
      <PremiumButton
        label={isSubmitting ? "Please wait..." : "Create account →"}
        onPress={handleRegister}
        iconLeft="person-add-outline"
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
          <AuthSplitLayout
            artTitle={"Join kankreg\nrewards & perks"}
            artSubtitle={AUTH_UI.registerSubtitle}
          >
            <View style={[styles.card, Platform.OS === "web" ? styles.cardWebInline : null]}>{formBody}</View>
          </AuthSplitLayout>
        </KankregScrollPage>
      </KeyboardAvoidingView>
    </CustomerScreenShell>
  );
}

function createRegisterStyles(c, shadowPremium, isDark) {
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

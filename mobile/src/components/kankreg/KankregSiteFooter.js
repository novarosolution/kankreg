import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  APP_ENGINEER_URL,
  KANKREG_FOOTER_COLUMNS,
  KANKREG_FOOTER_COMPANY,
  KANKREG_FOOTER_COPYRIGHT,
  KANKREG_FOOTER_HELP,
  KANKREG_FOOTER_NEWSLETTER,
  SUPPORT_EMAIL_DISPLAY,
} from "../../content/appContent";
import { useAuth } from "../../context/AuthContext";
import { subscribeNewsletter } from "../../services/userService";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { fonts, spacing } from "../../theme/tokens";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { isValidEmail } from "../../utils/authValidation";
import FooterPastureArt from "./FooterPastureArt";
import KankregBrandMark from "./KankregBrandMark";

const GREEN = KANKREG_CHROME.footerBg;
const GOLD = KANKREG_CHROME.footerGold;
const CREAM = KANKREG_CHROME.footerOnGreen;

export default function KankregSiteFooter() {
  const navigation = useNavigation();
  const { isXs, stackFooterNewsletter, pageGutterClamp } = useKankregLayout();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const stacked = isXs || stackFooterNewsletter;

  const handleLink = (link) => {
    if (link?.mailto) {
      Linking.openURL(`mailto:${link.mailto}`);
      return;
    }
    if (link?.url) {
      Linking.openURL(link.url);
      return;
    }
    if (!link?.route) return;
    if (link.requiresAuth && !isAuthenticated) {
      navigation.navigate("Login");
      return;
    }
    navigation.navigate(link.route, link.params);
  };

  const handleSubscribe = async () => {
    const nextEmail = String(email).trim();
    if (!isValidEmail(nextEmail)) {
      setSubscribeError("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    setSubscribeError("");
    try {
      await subscribeNewsletter(nextEmail);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setSubscribeError(err?.message || "Could not subscribe. Try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const openContact = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL_DISPLAY}`);
  };

  const openSocial = (item) => {
    if (item.mailto) {
      Linking.openURL(`mailto:${item.mailto}`);
      return;
    }
    if (item.url) Linking.openURL(item.url);
  };

  return (
    <View style={styles.shell} accessibilityRole="contentinfo">
      <FooterPastureArt />
      <View style={[styles.inner, { paddingHorizontal: pageGutterClamp }]}>
        <View style={[styles.grid, stacked && styles.gridStack]}>
          <View style={[styles.brandCol, stacked && styles.colFull]}>
            <KankregBrandMark tone="onDark" onPress={() => navigation.navigate("Home")} />
            <Text style={styles.office}>{KANKREG_FOOTER_COMPANY.corporate}</Text>
            <Text style={styles.office}>{KANKREG_FOOTER_COMPANY.registered}</Text>
            <Pressable
              onPress={() => Linking.openURL(`mailto:${KANKREG_FOOTER_COMPANY.grievanceMailto}`)}
              style={styles.grievance}
            >
              <Text style={styles.grievanceLabel}>{KANKREG_FOOTER_COMPANY.grievanceLabel} </Text>
              <Text style={styles.grievanceName}>{KANKREG_FOOTER_COMPANY.grievanceName}</Text>
            </Pressable>

            <Text style={styles.newsTitle}>{KANKREG_FOOTER_NEWSLETTER.title}</Text>
            {subscribed ? (
              <Text style={styles.newsSuccess}>{KANKREG_FOOTER_NEWSLETTER.successMessage}</Text>
            ) : (
              <View style={styles.newsForm}>
                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (subscribeError) setSubscribeError("");
                  }}
                  placeholder={KANKREG_FOOTER_NEWSLETTER.placeholder}
                  placeholderTextColor="rgba(26, 92, 72, 0.45)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.newsInput}
                  onSubmitEditing={handleSubscribe}
                  editable={!subscribing}
                />
                <Pressable
                  onPress={handleSubscribe}
                  disabled={subscribing}
                  style={({ hovered, pressed }) => [
                    styles.newsSubmit,
                    hovered && styles.newsSubmitHover,
                    pressed && { opacity: 0.9 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={KANKREG_FOOTER_NEWSLETTER.cta}
                >
                  <Ionicons name="chevron-down" size={18} color={GREEN} />
                </Pressable>
              </View>
            )}
            {subscribeError ? <Text style={styles.newsError}>{subscribeError}</Text> : null}
            <Text style={styles.copyright}>{KANKREG_FOOTER_COPYRIGHT}</Text>
          </View>

          <View style={[styles.linksBlock, stacked && styles.colFull]}>
            {KANKREG_FOOTER_COLUMNS.map((column) => (
              <View key={column.title} style={styles.linkCol}>
                <Text style={styles.colTitle}>{column.title}</Text>
                {column.links.map((link) => (
                  <Pressable
                    key={link.label}
                    onPress={() => handleLink(link)}
                    style={({ hovered, pressed }) => [
                      styles.link,
                      hovered && styles.linkHover,
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text style={styles.linkText}>{link.label}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

          <View style={[styles.helpCol, stacked && styles.colFull]}>
            <Text style={styles.colTitle}>{KANKREG_FOOTER_HELP.title}</Text>
            <Pressable
              onPress={openContact}
              style={({ hovered, pressed }) => [
                styles.contactBtn,
                hovered && styles.contactBtnHover,
                pressed && { opacity: 0.92 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={KANKREG_FOOTER_HELP.contactLabel}
            >
              <Text style={styles.contactBtnText}>{KANKREG_FOOTER_HELP.contactLabel}</Text>
            </Pressable>
            <View style={styles.socialRow}>
              {KANKREG_FOOTER_HELP.social.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => openSocial(item)}
                  style={({ hovered }) => [styles.socialBtn, hovered && styles.socialBtnHover]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Ionicons name={item.icon} size={18} color={GOLD} />
                </Pressable>
              ))}
            </View>
            <Text style={styles.downloadTitle}>{KANKREG_FOOTER_HELP.downloadTitle}</Text>
            <View style={styles.storeRow}>
              <StoreBadge
                icon="logo-google-playstore"
                top="GET IT ON"
                bottom="Google Play"
              />
              <StoreBadge icon="logo-apple" top="Download on the" bottom="App Store" />
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => Linking.openURL(APP_ENGINEER_URL)}
          style={styles.creditLink}
          accessibilityRole="link"
          accessibilityLabel="Visit NovaRo Solution"
        >
          <Text style={styles.creditText}>Created by NovaRo Solution</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StoreBadge({ icon, top, bottom }) {
  return (
    <View style={styles.storeBadge} accessibilityRole="text">
      <Ionicons name={icon} size={18} color="#FFFFFF" />
      <View>
        <Text style={styles.storeTop}>{top}</Text>
        <Text style={styles.storeBottom}>{bottom}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: GREEN,
    marginTop: 0,
    paddingTop: Platform.OS === "web" ? 56 : 44,
    paddingBottom: 28,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  inner: {
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    zIndex: 1,
    paddingHorizontal: Platform.OS === "web" ? "clamp(18px, 4vw, 40px)" : spacing.lg,
  },
  grid: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 36,
    flexWrap: "wrap",
  },
  gridStack: {
    flexDirection: "column",
  },
  colFull: {
    width: "100%",
    maxWidth: "100%",
  },
  brandCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 280,
    maxWidth: 420,
    gap: 8,
  },
  office: {
    color: "rgba(243, 238, 228, 0.88)",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  grievance: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 18,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  grievanceLabel: {
    color: "rgba(243, 238, 228, 0.8)",
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  grievanceName: {
    color: CREAM,
    fontSize: 13,
    fontFamily: fonts.semibold,
    textDecorationLine: "underline",
  },
  newsTitle: {
    marginTop: 8,
    marginBottom: 10,
    color: CREAM,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontFamily: fonts.bold,
  },
  newsForm: {
    flexDirection: "row",
    alignItems: "stretch",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    overflow: "hidden",
  },
  newsInput: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    color: "#1A2B22",
    fontSize: 14,
    fontFamily: fonts.medium,
    ...Platform.select({ web: { outlineStyle: "none" }, default: {} }),
  },
  newsSubmit: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  newsSubmitHover: {
    backgroundColor: "rgba(26, 92, 72, 0.06)",
  },
  newsSuccess: {
    color: GOLD,
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  newsError: {
    marginTop: 8,
    color: "#F3D2C6",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  copyright: {
    marginTop: 28,
    color: "rgba(243, 238, 228, 0.62)",
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  linksBlock: {
    flexDirection: "row",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 280,
    gap: 48,
  },
  linkCol: {
    minWidth: 140,
    flex: 1,
  },
  colTitle: {
    color: GOLD,
    fontSize: 13,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontFamily: fonts.bold,
    marginBottom: 16,
  },
  link: {
    paddingVertical: 5,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  linkHover: {
    opacity: 0.78,
  },
  linkText: {
    color: CREAM,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fonts.medium,
  },
  helpCol: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 280,
    minWidth: 260,
    maxWidth: 340,
  },
  contactBtn: {
    backgroundColor: GOLD,
    borderRadius: 999,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    marginBottom: 16,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  contactBtnHover: {
    backgroundColor: "#EED77A",
  },
  contactBtnText: {
    color: GREEN,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  socialBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  socialBtnHover: {
    backgroundColor: "rgba(228, 197, 106, 0.14)",
  },
  downloadTitle: {
    color: GOLD,
    fontSize: 13,
    fontFamily: fonts.semibold,
    marginBottom: 10,
  },
  storeRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
  },
  storeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111111",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    minWidth: 128,
  },
  storeTop: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 8,
    letterSpacing: 0.4,
    fontFamily: fonts.medium,
  },
  storeBottom: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: fonts.semibold,
    marginTop: -1,
  },
  creditLink: {
    marginTop: 22,
    alignSelf: "flex-start",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  creditText: {
    color: "rgba(243, 238, 228, 0.55)",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});

import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  KANKREG_FOOTER_COLUMNS,
  KANKREG_FOOTER_COPYRIGHT,
  KANKREG_FOOTER_NEWSLETTER,
  KANKREG_FOOTER_PAYMENTS_LINE,
  KANKREG_FOOTER_TAGLINE,
} from "../../content/appContent";
import { useAuth } from "../../context/AuthContext";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, spacing } from "../../theme/tokens";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import PremiumButton from "../ui/PremiumButton";
import PremiumInput from "../ui/PremiumInput";
/** kankreg.html `.foot` */
export default function KankregSiteFooter() {
  const navigation = useNavigation();
  const { footerCols, isXs, stackFooterNewsletter, pageGutterClamp } = useKankregLayout();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const brandColWidth = footerCols >= 4 ? "42%" : "100%";

  const handleLink = (link) => {
    if (!link.route) return;
    if (link.requiresAuth && !isAuthenticated) {
      navigation.navigate("Login");
      return;
    }
    navigation.navigate(link.route, link.params);
  };

  const handleSubscribe = () => {
    if (!String(email).trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  const showNewsletter = Platform.OS !== "web" || KANKREG_FOOTER_NEWSLETTER.showOnWeb === true;

  return (
    <View style={styles.shell}>
      <View style={[styles.inner, { paddingHorizontal: pageGutterClamp }]}>
        {showNewsletter ? (
        <View style={[styles.news, stackFooterNewsletter && styles.newsStack]}>
          <View style={styles.newsCopy}>
            <Text style={styles.newsTitle}>{KANKREG_FOOTER_NEWSLETTER.title}</Text>
            <Text style={styles.newsBody}>{KANKREG_FOOTER_NEWSLETTER.body}</Text>
            {subscribed ? (
              <Text style={styles.newsSuccess}>{KANKREG_FOOTER_NEWSLETTER.successMessage}</Text>
            ) : null}
          </View>
          {!subscribed ? (
            <View style={[styles.newsForm, stackFooterNewsletter && styles.newsFormStack]}>
              <View style={styles.newsInputWrap}>
                <PremiumInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={KANKREG_FOOTER_NEWSLETTER.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  label=""
                />
              </View>
              <PremiumButton
                label={KANKREG_FOOTER_NEWSLETTER.cta}
                variant="gold"
                size="sm"
                onPress={handleSubscribe}
              />
            </View>
          ) : null}
        </View>
        ) : null}

        <View
          style={[
            styles.cols,
            {
              flexDirection: footerCols === 1 ? "column" : "row",
              flexWrap: "wrap",
            },
          ]}
        >
          <View style={[styles.brandCol, { width: brandColWidth, minWidth: 200 }]}>
            <View style={styles.brandRow}>
              <LinearGradient
                colors={["#d9b463", "#9c6b27"]}
                style={styles.dot}
              />
              <Text style={styles.brandText}>kankreg</Text>
            </View>
            <Text style={styles.tagline}>{KANKREG_FOOTER_TAGLINE}</Text>
          </View>
          {KANKREG_FOOTER_COLUMNS.map((column) => (
            <View
              key={column.title}
              style={[styles.col, { minWidth: footerCols === 1 ? "100%" : isXs ? "46%" : 140 }]}
            >
              <Text style={styles.colTitle}>{column.title}</Text>
              {column.links.map((link) => (
                <Pressable
                  key={link.label}
                  onPress={() => handleLink(link)}
                  disabled={!link.route}
                  style={({ pressed }) => [styles.link, pressed && link.route && { opacity: 0.7 }]}
                >
                  <Text style={[styles.linkText, !link.route && styles.linkMuted]}>{link.label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <View style={[styles.bottom, isXs && styles.bottomStack]}>
          <Text style={styles.bottomText}>{KANKREG_FOOTER_COPYRIGHT}</Text>
          <Text style={styles.bottomText}>{KANKREG_FOOTER_PAYMENTS_LINE}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: KANKREG_PALETTE.ink,
    marginTop: 46,
    paddingTop: Platform.OS === "web" ? "clamp(44px, 6vw, 64px)" : 44,
    paddingBottom: 32,
    width: "100%",
  },
  inner: {
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: Platform.OS === "web" ? "clamp(18px, 4vw, 40px)" : spacing.lg,
  },
  news: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    backgroundColor: "rgba(214, 173, 91, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.25)",
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  newsCopy: { flex: 1, minWidth: 200 },
  newsTitle: {
    fontFamily: FONT_HEADING,
    fontSize: 22,
    fontWeight: "500",
    color: KANKREG_PALETTE.paper,
    marginBottom: 4,
  },
  newsBody: {
    fontSize: 13.5,
    color: "#c8bdaf",
    maxWidth: 400,
  },
  newsSuccess: {
    marginTop: 8,
    fontSize: 13,
    color: KANKREG_PALETTE.goldBright,
    fontFamily: fonts.semibold,
  },
  newsStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  newsForm: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    flexWrap: "wrap",
  },
  newsFormStack: {
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
  },
  newsInputWrap: { minWidth: 200, flex: 1 },
  cols: {
    marginTop: 48,
    gap: 36,
  },
  brandCol: {},
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  brandText: {
    fontFamily: FONT_HEADING,
    fontSize: 26,
    color: KANKREG_PALETTE.paper,
    textTransform: "lowercase",
  },
  tagline: {
    fontSize: 14,
    color: "#c8bdaf",
    maxWidth: 280,
    lineHeight: 20,
  },
  col: {
    flex: 1,
  },
  colTitle: {
    fontSize: 11.5,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.goldBright,
    marginBottom: 15,
    fontFamily: fonts.semibold,
  },
  link: { marginVertical: 9 },
  linkText: {
    fontSize: 14,
    color: "#c8bdaf",
    fontFamily: fonts.medium,
  },
  linkMuted: { opacity: 0.55 },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginTop: 42,
    paddingTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  bottomStack: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  bottomText: {
    fontSize: 12.5,
    color: "#8a8076",
  },
});

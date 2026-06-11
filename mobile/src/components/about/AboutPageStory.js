import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { FONT_HEADING, FONT_HEADING_ITALIC } from "../../theme/typographyRoles";
import { getKankregSurfaces, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { createKankregEyebrowStyle } from "../../theme/kankregScreenStyles";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { HOME_SPACE } from "../../theme/homeEditorial";
import { fonts, icon, radius, spacing, typography } from "../../theme/tokens";
import StoryImageFrame from "../home/StoryImageFrame";
import GoldHairline from "../ui/GoldHairline";
import { platformShadow } from "../../theme/shadowPlatform";

const panelShadow = platformShadow({
  web: { boxShadow: "0 1px 2px rgba(25,20,15,.04), 0 14px 38px -20px rgba(25,20,15,.22)" },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
  },
  android: { elevation: 3 },
});

function StoryBlock({ eyebrow, title, body, isDark, surfaces, iconName }) {
  if (!body && !title) return null;
  return (
    <View
      style={[
        styles.block,
        { backgroundColor: surfaces.card, borderColor: surfaces.border },
        panelShadow,
      ]}
    >
      {iconName ? (
        <View style={[styles.blockIcon, isDark && styles.blockIconDark]}>
          <Ionicons name={iconName} size={icon.md} color={KANKREG_PALETTE.goldBright} />
        </View>
      ) : null}
      {eyebrow ? <Text style={createKankregEyebrowStyle(isDark)}>{eyebrow}</Text> : null}
      {title ? <Text style={[styles.blockTitle, { color: surfaces.text }]}>{title}</Text> : null}
      <GoldHairline marginVertical={spacing.sm} short />
      {body ? <Text style={[styles.blockBody, { color: surfaces.textSoft }]}>{body}</Text> : null}
    </View>
  );
}

function ValuesGrid({ values, isDark, surfaces, isMd }) {
  if (!values?.length) return null;
  return (
    <View style={styles.valuesWrap}>
      <Text style={createKankregEyebrowStyle(isDark)}>Our values</Text>
      <Text style={[styles.valuesHeading, { color: surfaces.text }]}>What guides every jar</Text>
      <View style={[styles.valuesGrid, isMd && styles.valuesGridWide]}>
        {values.map((item) => (
          <View
            key={item.title}
            style={[
              styles.valueCard,
              { backgroundColor: surfaces.card, borderColor: surfaces.border },
              panelShadow,
              isMd && styles.valueCardHalf,
            ]}
          >
            <Text style={[styles.valueTitle, { color: surfaces.text }]}>{item.title}</Text>
            <Text style={[styles.valueBody, { color: surfaces.textSoft }]}>{item.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PhotoGallery({ photos, isDark, isMd }) {
  if (!photos?.length) return null;
  return (
    <View style={styles.galleryWrap}>
      <Text style={createKankregEyebrowStyle(isDark)}>Behind the craft</Text>
      <Text style={[styles.galleryHeading, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
        From pasture to pantry
      </Text>
      <View style={[styles.galleryGrid, isMd && styles.galleryGridWide]}>
        {photos.map((photo, idx) => (
          <View
            key={`${photo.url}-${idx}`}
            style={[styles.galleryCell, isMd && photos.length > 1 && styles.galleryCellHalf]}
          >
            <StoryImageFrame
              source={photo.url}
              caption={photo.caption}
              aspectRatio={idx === 0 && photos.length === 1 ? 16 / 9 : 4 / 5}
              isDark={isDark}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

/** About page story — rich text + photos only (no video). */
export default function AboutPageStory({ about }) {
  const { isDark, colors: c } = useTheme();
  const surfaces = getKankregSurfaces(isDark, c);
  const { isMd } = useKankregLayout();

  if (!about) return null;

  return (
    <View style={styles.root}>
      {about.pullQuote ? (
        <View style={[styles.pullQuote, isDark && styles.pullQuoteDark]}>
          <View style={styles.pullQuoteRule} />
          <Text style={[styles.pullQuoteText, { color: surfaces.text }]}>{about.pullQuote}</Text>
        </View>
      ) : null}

      {(about.body || about.bodyContinued) ? (
        <View style={styles.leadWrap}>
          {about.body ? (
            <Text style={[styles.lead, { color: surfaces.text }]}>{about.body}</Text>
          ) : null}
          {about.bodyContinued ? (
            <Text style={[styles.leadContinued, { color: surfaces.textSoft }]}>{about.bodyContinued}</Text>
          ) : null}
        </View>
      ) : null}

      <PhotoGallery photos={about.photos} isDark={isDark} isMd={isMd} />

      <StoryBlock
        eyebrow={about.heritage?.eyebrow}
        title={about.heritage?.title}
        body={about.heritage?.body}
        isDark={isDark}
        surfaces={surfaces}
        iconName="paw-outline"
      />

      <StoryBlock
        eyebrow={about.bilona?.eyebrow}
        title={about.bilona?.title}
        body={about.bilona?.body}
        isDark={isDark}
        surfaces={surfaces}
        iconName="flame-outline"
      />

      <StoryBlock
        eyebrow={about.origin?.eyebrow}
        title={about.origin?.title}
        body={about.origin?.body}
        isDark={isDark}
        surfaces={surfaces}
        iconName="home-outline"
      />

      <ValuesGrid values={about.values} isDark={isDark} surfaces={surfaces} isMd={isMd} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    gap: HOME_SPACE.lg,
  },
  pullQuote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: "rgba(201, 146, 30, 0.06)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.2)",
  },
  pullQuoteDark: {
    backgroundColor: "rgba(201, 146, 30, 0.1)",
    borderColor: "rgba(169, 119, 46, 0.28)",
  },
  pullQuoteRule: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: 2,
    backgroundColor: KANKREG_PALETTE.gold,
    opacity: 0.8,
  },
  pullQuoteText: {
    flex: 1,
    fontFamily: FONT_HEADING_ITALIC,
    fontStyle: "italic",
    fontSize: 22,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  leadWrap: {
    gap: spacing.md,
  },
  lead: {
    fontFamily: FONT_HEADING,
    fontSize: Platform.OS === "web" ? 22 : 20,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  leadContinued: {
    fontFamily: fonts.regular,
    fontSize: typography.body + 1,
    lineHeight: 28,
  },
  block: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  blockIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(169,119,46,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  blockIconDark: {
    backgroundColor: "rgba(201,162,39,0.14)",
  },
  blockTitle: {
    fontFamily: FONT_HEADING,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "400",
    marginTop: spacing.xs,
  },
  blockBody: {
    fontFamily: fonts.regular,
    fontSize: typography.body,
    lineHeight: typography.body * 1.65,
  },
  valuesWrap: {
    gap: spacing.sm,
  },
  valuesHeading: {
    fontFamily: FONT_HEADING,
    fontSize: 24,
    marginTop: spacing.xs,
  },
  valuesGrid: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  valuesGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  valueCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  valueCardHalf: {
    width: "48%",
    minWidth: 200,
    flexGrow: 1,
  },
  valueTitle: {
    fontFamily: fonts.semibold,
    fontSize: typography.body + 1,
  },
  valueBody: {
    fontFamily: fonts.regular,
    fontSize: typography.caption,
    lineHeight: 20,
  },
  galleryWrap: {
    gap: spacing.sm,
  },
  galleryHeading: {
    fontFamily: FONT_HEADING,
    fontSize: 24,
    marginTop: spacing.xs,
  },
  galleryGrid: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  galleryGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  galleryCell: {
    width: "100%",
  },
  galleryCellHalf: {
    width: "48%",
    flexGrow: 1,
    minWidth: 240,
  },
});

import React from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollFadeUp } from "./editorial";
import { resolveCommunityDisplay } from "../../utils/homeViewMedia";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import {
  HOME_SPACE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { fonts, icon, radius } from "../../theme/tokens";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { resolveImageSource } from "../../utils/mediaSource";

const POST_CARD_WIDTH = 264;
const POST_MEDIA_HEIGHT = 330;
const POST_GAP = 20;
const CUSTOMER_TAG_BG = "rgba(35, 90, 64, 0.55)";
const CUSTOMER_DOT = "#9ee0b8";

function CommunityTag({ label, variant, isDark }) {
  const isCustomer = variant === "customer";
  return (
    <View
      style={[
        styles.tag,
        isCustomer && styles.tagCustomer,
        isDark && !isCustomer && styles.tagDark,
      ]}
    >
      <View style={[styles.tagDot, isCustomer && styles.tagDotCustomer]} />
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function CommunityPostCard({ post, isDark }) {
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const isReel = post.type === "reel" || post.type === "recipe";
  const isCustomer = post.type === "customer";
  const imageSource = resolveImageSource(post.image);

  return (
    <View style={[styles.post, isDark && styles.postDark]}>
      <View style={styles.media}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.mediaImage}
            contentFit="cover"
            contentPosition="center"
            transition={260}
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
          />
        ) : null}
        <LinearGradient
          colors={[
            "rgba(25, 15, 5, 0.18)",
            "transparent",
            "transparent",
            "rgba(25, 15, 5, 0.5)",
          ]}
          locations={[0, 0.38, 0.6, 1]}
          style={styles.mediaScrim}
          pointerEvents="none"
        />
        <CommunityTag label={post.tag} variant={post.type} isDark={isDark} />
        {isReel ? (
          <>
            <View style={styles.playBtn} pointerEvents="none">
              <Ionicons name="play" size={19} color={KANKREG_PALETTE.ink} style={styles.playIcon} />
            </View>
            {post.views ? (
              <View style={styles.views} pointerEvents="none">
                <Ionicons name="eye-outline" size={13} color="#F8EFDC" />
                <Text style={styles.viewsText}>{post.views}</Text>
              </View>
            ) : null}
          </>
        ) : null}
        {isCustomer && post.quote ? (
          <Text style={styles.quote} numberOfLines={4}>
            “{post.quote}”
          </Text>
        ) : null}
      </View>
      <View style={styles.pfoot}>
        <LinearGradient
          colors={
            post.author.brand ? ["#D8B36A", "#A0741A"] : ["#7FB89A", "#235A40"]
          }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{post.author.avatar}</Text>
        </LinearGradient>
        <View style={styles.pfootCopy}>
          <Text style={[styles.pfootName, { color: ink }]} numberOfLines={1}>
            {post.author.name}
          </Text>
          <Text style={[styles.pfootSub, { color: muted }]} numberOfLines={1}>
            {post.author.subtitle}
          </Text>
        </View>
        {post.likes ? (
          <View style={styles.likeRow}>
            <Ionicons name="heart-outline" size={14} color={KANKREG_PALETTE.inkSoft} />
            <Text style={[styles.likeText, { color: KANKREG_PALETTE.inkSoft }]}>{post.likes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Instagram-style community rail — reels + customer stories.
 * Copy and posts in `communityHomeContent.js`.
 */
export default function HomeCommunitySection({ communitySection }) {
  const { isDark } = useTheme();
  const { width, isMobileWeb } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const content = resolveCommunityDisplay(communitySection);
  const stackHeader = width < 900;

  if (Platform.OS !== "web" || !content) return null;

  const { eyebrow, title, instagram, posts } = content;

  const openInstagram = () => {
    const url = instagram.url || `https://instagram.com/${instagram.handle}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScrollFadeUp index={2}>
      <View nativeID="home-community" style={styles.section}>
        <View style={[styles.head, stackHeader && styles.headStack]}>
          <View style={[styles.headCopy, stackHeader && styles.headCopyStack]}>
            <Text style={[styles.eyebrow, { color: muted }]}>{eyebrow}</Text>
            <Text style={[styles.title, { color: ink }, stackHeader && styles.titleStack]}>{title}</Text>
          </View>
          <View style={[styles.handle, stackHeader && styles.handleStack]}>
            <View style={styles.handleCopy}>
              <Text style={[styles.handleName, { color: ink }]}>{instagram.displayHandle}</Text>
              <Text style={[styles.handleFollowers, { color: muted }]}>{instagram.followersLabel}</Text>
            </View>
            <Pressable
              onPress={openInstagram}
              accessibilityRole="link"
              accessibilityLabel={`Follow ${instagram.displayHandle} on Instagram`}
              style={({ hovered, pressed }) => [
                styles.followBtn,
                hovered && Platform.OS === "web" ? styles.followBtnHover : null,
                pressed && styles.followBtnPressed,
              ]}
            >
              <LinearGradient
                colors={["#C9971F", "#A0741A"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.followGradient}
              >
                <Text style={styles.followLabel}>{instagram.followLabel}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
          snapToInterval={POST_CARD_WIDTH + POST_GAP}
          snapToAlignment="start"
          disableIntervalMomentum
          contentContainerStyle={[
            styles.rowContent,
            isMobileWeb && styles.rowContentMobile,
          ]}
          style={styles.row}
        >
          {posts.map((post, idx) => (
            <View
              key={post.id}
              style={[
                styles.postWrap,
                idx === posts.length - 1 && styles.postWrapLast,
              ]}
            >
              <CommunityPostCard post={post} isDark={isDark} />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollFadeUp>
  );
}

const postShadow = Platform.select({
  web: {
    boxShadow:
      "0 1px 2px rgba(60, 40, 15, 0.05), 0 22px 48px rgba(70, 48, 18, 0.1)",
  },
  default: {},
});

const followShadow = Platform.select({
  web: { boxShadow: "0 8px 18px rgba(160, 116, 22, 0.3)" },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: HOME_SPACE.lg,
  },
  head: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: HOME_SPACE.lg,
    flexWrap: "wrap",
    marginBottom: HOME_SPACE.lg + 4,
  },
  headStack: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: HOME_SPACE.md,
  },
  headCopy: {
    flex: 1,
    minWidth: 0,
    gap: HOME_SPACE.sm,
  },
  headCopyStack: {
    flex: undefined,
    width: "100%",
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: -1,
    fontWeight: "600",
    maxWidth: 560,
  },
  titleStack: {
    fontSize: 34,
    lineHeight: 36,
    maxWidth: "100%",
  },
  handle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexShrink: 0,
  },
  handleStack: {
    width: "100%",
    justifyContent: "space-between",
  },
  handleCopy: {
    gap: 2,
  },
  handleName: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
  },
  handleFollowers: {
    fontFamily: fonts.medium,
    fontSize: 12.5,
    lineHeight: 16,
  },
  followBtn: {
    borderRadius: 13,
    overflow: "hidden",
    ...followShadow,
    ...Platform.select({
      web: { cursor: "pointer", transition: "transform 0.18s ease" },
      default: {},
    }),
  },
  followBtnHover: {
    ...Platform.select({
      web: { transform: [{ scale: 1.02 }] },
      default: {},
    }),
  },
  followBtnPressed: {
    opacity: 0.92,
  },
  followGradient: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  followLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: "#FFF9EC",
  },
  row: {
    width: "100%",
    marginHorizontal: -HOME_SPACE.xs,
  },
  rowContent: {
    paddingHorizontal: HOME_SPACE.xs,
    paddingBottom: HOME_SPACE.md,
    paddingTop: 6,
  },
  rowContentMobile: {
    paddingBottom: HOME_SPACE.md + 2,
  },
  postWrap: {
    width: POST_CARD_WIDTH,
    marginRight: POST_GAP,
  },
  postWrapLast: {
    marginRight: HOME_SPACE.lg,
  },
  post: {
    width: POST_CARD_WIDTH,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.lineSoft,
    backgroundColor: KANKREG_PALETTE.card,
    ...postShadow,
  },
  postDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  media: {
    height: POST_MEDIA_HEIGHT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#3F2C15",
  },
  mediaImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  mediaScrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: "rgba(28, 18, 8, 0.5)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.12)",
    ...Platform.select({
      web: { backdropFilter: "blur(6px)" },
      default: {},
    }),
  },
  tagCustomer: {
    backgroundColor: CUSTOMER_TAG_BG,
  },
  tagDark: {
    backgroundColor: "rgba(18, 12, 6, 0.62)",
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: KANKREG_PALETTE.gold,
  },
  tagDotCustomer: {
    backgroundColor: CUSTOMER_DOT,
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#F3E7CE",
  },
  playBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 3,
    width: 52,
    height: 52,
    marginTop: -26,
    marginLeft: -26,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 250, 240, 0.92)",
    ...Platform.select({
      web: { boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)" },
      default: {},
    }),
  },
  playIcon: {
    marginLeft: 3,
  },
  views: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  viewsText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: "#F8EFDC",
    ...Platform.select({
      web: { textShadow: "0 1px 6px rgba(0, 0, 0, 0.5)" },
      default: {},
    }),
  },
  quote: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    zIndex: 3,
    fontFamily: FONT_DISPLAY,
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 20,
    fontStyle: "italic",
    color: "#FBF4E4",
    ...Platform.select({
      web: { textShadow: "0 2px 12px rgba(0, 0, 0, 0.5)" },
      default: {},
    }),
  },
  pfoot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: FONT_DISPLAY,
    fontWeight: "700",
    fontSize: 12,
    color: "#FFF9EC",
  },
  pfootCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  pfootName: {
    fontFamily: fonts.bold,
    fontSize: 12.5,
    lineHeight: 14,
  },
  pfootSub: {
    fontFamily: fonts.medium,
    fontSize: 10.5,
    lineHeight: 13,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: "auto",
    flexShrink: 0,
  },
  likeText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
});

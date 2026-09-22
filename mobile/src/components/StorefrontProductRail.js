import React, { useMemo, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { HOME_SCREEN_UI, SHOP_SCREEN_UI, STOREFRONT_COLLECTION_TITLES } from "../content/appContent";
import { useKankregLayout, KANKREG_BP } from "../theme/kankregBreakpoints";
import { KANKREG_CHROME } from "../theme/kankregWeb";
import { fonts } from "../theme/tokens";
import { WEB_DISPLAY_FONT_STACK } from "../theme/webFonts";
import { getProductCardFlags } from "../utils/productAvailability";
import StorefrontProductCard from "./StorefrontProductCard";

const GREEN = KANKREG_CHROME.announceBg;
const CARD_WIDTH = 236;
const CARD_GAP = 16;
const CARD_GAP_COMPACT = 10;
const STEP = CARD_WIDTH + CARD_GAP;

export function collectionTitleFor(category) {
  const key = String(category || "").trim();
  return STOREFRONT_COLLECTION_TITLES[key] || key || "Our products";
}

export function groupProductsByCategory(products = []) {
  const groups = [];
  const index = new Map();
  products.forEach((product) => {
    const key = String(product?.category || "").trim() || "Featured";
    if (!index.has(key)) {
      index.set(key, groups.length);
      groups.push({ category: key, title: collectionTitleFor(key), products: [] });
    }
    groups[index.get(key)].products.push(product);
  });
  const order = ["Ghee", "Oils", "Oil", "Atta", "Wellness", "Combo", "Featured"];
  groups.sort((a, b) => {
    const da = order.indexOf(a.category);
    const db = order.indexOf(b.category);
    return (da === -1 ? 99 : da) - (db === -1 ? 99 : db);
  });
  return groups;
}

export default function StorefrontProductRail({
  title,
  products = [],
  navigation,
  onAddToCart,
  category,
  layout = "grid",
}) {
  const scrollRef = useRef(null);
  const offsetRef = useRef(0);
  const { catalogCardCompact, width } = useKankregLayout();
  const items = Array.isArray(products) ? products : [];
  const isGrid = layout !== "rail";
  const compact = catalogCardCompact;
  const gap = compact ? CARD_GAP_COMPACT : CARD_GAP;
  const singleCol = width < KANKREG_BP.catalogSingleCol;

  const canScroll = !isGrid && items.length > 3;

  const scrollBy = (dir) => {
    const next = Math.max(0, offsetRef.current + dir * STEP * 2);
    offsetRef.current = next;
    scrollRef.current?.scrollTo?.({ x: next, animated: true });
  };

  if (!items.length) return null;

  const gridStyle = [
    styles.grid,
    compact && styles.gridCompact,
    Platform.OS === "web"
      ? {
          display: "grid",
          gridTemplateColumns: singleCol
            ? "minmax(0, 1fr)"
            : compact
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fill, minmax(220px, 1fr))",
          gap,
          width: "100%",
        }
      : { gap },
  ];

  return (
    <View style={[styles.section, compact && styles.sectionCompact]} nativeID="home-catalog">
      <View style={styles.titleRow}>
        <View style={styles.titleCol}>
          {!compact ? (
            <Text style={styles.eyebrow}>{HOME_SCREEN_UI.bestsellers.webEyebrow}</Text>
          ) : null}
          {title ? (
            <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
          ) : null}
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate({
              name: "Shop",
              params: category ? { category } : { clearCategory: true, pill: "All" },
              merge: true,
            })
          }
          style={({ hovered }) => [styles.viewAll, hovered && { opacity: 0.75 }]}
          accessibilityRole="link"
          accessibilityLabel={HOME_SCREEN_UI.bestsellers.webAction}
        >
          <Text style={[styles.viewAllText, compact && styles.viewAllTextCompact]}>
            {compact ? "View all" : HOME_SCREEN_UI.bestsellers.webAction}
          </Text>
          <Ionicons name="arrow-forward" size={compact ? 13 : 14} color={GREEN} />
        </Pressable>
      </View>
      <View style={[styles.goldRule, compact && styles.goldRuleCompact]} />
      {isGrid ? (
        <View style={gridStyle} accessibilityRole="list">
          {items.map((item) => {
            const flags = getProductCardFlags(item, SHOP_SCREEN_UI.card.comingSoonNoteFallback);
            return (
              <View
                key={item.id}
                style={[
                  styles.gridItem,
                  Platform.OS !== "web" && (singleCol ? styles.gridItemFull : styles.gridItemHalf),
                ]}
              >
                <StorefrontProductCard
                  product={item}
                  compact={compact}
                  isOutOfStock={flags.isOutOfStock}
                  isComingSoon={flags.isComingSoon}
                  comingSoonNote={flags.comingSoonNote}
                  onPress={() => navigation.navigate("Product", { productId: item.id })}
                  onAddToCart={() => onAddToCart?.(item)}
                />
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.railWrap}>
          {canScroll ? (
            <Pressable
              onPress={() => scrollBy(-1)}
              style={[styles.arrow, styles.arrowLeft]}
              accessibilityRole="button"
              accessibilityLabel="See previous products"
            >
              <Ionicons name="chevron-back" size={20} color={GREEN} />
            </Pressable>
          ) : null}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
            onScroll={(event) => {
              offsetRef.current = event.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
          >
            {items.map((item) => {
              const flags = getProductCardFlags(item, SHOP_SCREEN_UI.card.comingSoonNoteFallback);
              return (
                <StorefrontProductCard
                  key={item.id}
                  product={item}
                  width={CARD_WIDTH}
                  compact={compact}
                  isOutOfStock={flags.isOutOfStock}
                  isComingSoon={flags.isComingSoon}
                  comingSoonNote={flags.comingSoonNote}
                  onPress={() => navigation.navigate("Product", { productId: item.id })}
                  onAddToCart={() => onAddToCart?.(item)}
                />
              );
            })}
          </ScrollView>
          {canScroll ? (
            <Pressable
              onPress={() => scrollBy(1)}
              style={styles.arrow}
              accessibilityRole="button"
              accessibilityLabel="See more products"
            >
              <Ionicons name="chevron-forward" size={22} color={GREEN} />
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

export function StorefrontProductRails({ products, navigation, onAddToCart }) {
  const groups = useMemo(() => groupProductsByCategory(products), [products]);
  const { catalogCardCompact } = useKankregLayout();
  if (!groups.length) return null;
  return (
    <View style={[styles.stack, catalogCardCompact && styles.stackCompact]}>
      {groups.map((group) => (
        <StorefrontProductRail
          key={group.category}
          title={group.title}
          category={group.category === "Featured" ? undefined : group.category}
          products={group.products}
          navigation={navigation}
          onAddToCart={onAddToCart}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: "100%",
    gap: 40,
  },
  stackCompact: {
    gap: 28,
  },
  section: {
    width: "100%",
    gap: 12,
  },
  sectionCompact: {
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: GREEN,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: "#1A2B22",
    ...Platform.select({
      web: {
        fontFamily: `Georgia, "Iowan Old Style", Palatino, ${WEB_DISPLAY_FONT_STACK}`,
      },
      default: { fontFamily: fonts.semibold },
    }),
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 26,
  },
  goldRule: {
    width: 48,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(196, 162, 74, 0.85)",
    marginBottom: 4,
  },
  goldRuleCompact: {
    width: 36,
    marginBottom: 2,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingBottom: 4,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  viewAllText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: GREEN,
  },
  viewAllTextCompact: {
    fontSize: 12,
  },
  railWrap: {
    position: "relative",
  },
  rail: {
    gap: CARD_GAP,
    paddingLeft: 8,
    paddingRight: 48,
    paddingBottom: 12,
  },
  grid: Platform.select({
    web: {
      width: "100%",
    },
    default: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
    },
  }),
  gridCompact: {},
  gridItem: Platform.select({
    web: {
      minWidth: 0,
      width: "100%",
    },
    default: {
      flexGrow: 0,
      flexShrink: 0,
    },
  }),
  gridItemHalf: {
    width: "48%",
    maxWidth: "48%",
  },
  gridItemFull: {
    width: "100%",
    maxWidth: "100%",
  },
  arrow: {
    position: "absolute",
    right: 0,
    top: "42%",
    width: 40,
    height: 64,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(26, 92, 72, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    ...Platform.select({
      web: {
        cursor: "pointer",
        boxShadow: "-6px 0 18px -10px rgba(20, 40, 30, 0.28)",
      },
      default: {},
    }),
  },
  arrowLeft: {
    left: 0,
    right: undefined,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: "6px 0 18px -10px rgba(20, 40, 30, 0.28)",
      },
      default: {},
    }),
  },
});

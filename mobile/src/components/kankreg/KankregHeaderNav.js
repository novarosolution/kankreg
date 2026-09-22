import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";
import { WEB_Z_INDEX } from "../../theme/web";
import { routeMatchesNav } from "./kankregNav";

function NavLabel({ item, active, hovered }) {
  const color = active || hovered ? KANKREG_CHROME.announceBg : KANKREG_CHROME.navInk;
  if (item.accentPrefix) {
    const rest = String(item.label || "").replace(item.accentPrefix, "").trim();
    return (
      <Text style={styles.linkText}>
        <Text style={[styles.linkText, styles.accent]}>{item.accentPrefix}</Text>
        {rest ? <Text style={[styles.linkText, { color }]}> {rest}</Text> : null}
      </Text>
    );
  }
  return <Text style={[styles.linkText, { color }]}>{item.label}</Text>;
}

function HeaderDropdown({ item, open, onPressChild }) {
  if (!open || !item.children?.length) return null;
  return (
    <View style={styles.menu} accessibilityRole="menu">
      {item.children.map((child) => (
        <Pressable
          key={`${child.key}-${child.label}`}
          onPress={child.onPress || onPressChild}
          style={({ hovered }) => [styles.menuItem, hovered && styles.menuItemHover]}
          accessibilityRole="menuitem"
          accessibilityLabel={child.label}
        >
          <Text style={styles.menuText}>{child.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function KankregHeaderNav({ items, currentRouteName, currentRouteParams }) {
  const [openKey, setOpenKey] = useState(null);

  return (
    <View style={styles.nav} accessibilityRole="navigation">
      {items.map((item) => {
        const active = routeMatchesNav(item.key, currentRouteName, currentRouteParams);
        const hasMenu = Boolean(item.children?.length);
        const open = hasMenu && openKey === item.key;

        return (
          <View
            key={item.key}
            style={styles.item}
            onMouseEnter={Platform.OS === "web" ? () => hasMenu && setOpenKey(item.key) : undefined}
            onMouseLeave={Platform.OS === "web" ? () => setOpenKey((key) => (key === item.key ? null : key)) : undefined}
          >
            <Pressable
              onHoverIn={() => hasMenu && setOpenKey(item.key)}
              onHoverOut={() => {}}
              onPress={() => {
                if (hasMenu) {
                  if (Platform.OS !== "web") {
                    setOpenKey((key) => (key === item.key ? null : item.key));
                  }
                  return;
                }
                item.onPress?.();
              }}
              style={({ hovered }) => [styles.link, hovered && styles.linkHover]}
              accessibilityRole="link"
              accessibilityState={{ selected: active, expanded: hasMenu ? open : undefined }}
              accessibilityLabel={item.label}
            >
              <NavLabel item={item} active={active} hovered={open} />
              {hasMenu ? (
                <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={11}
                  color={active || open ? KANKREG_CHROME.announceBg : KANKREG_CHROME.navInk}
                />
              ) : null}
            </Pressable>
            <HeaderDropdown item={item} open={open} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: 4,
    minWidth: 0,
    ...Platform.select({ web: { overflow: "visible" }, default: {} }),
  },
  item: {
    position: "relative",
    flexShrink: 0,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 40,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  linkHover: {
    opacity: 0.88,
  },
  linkText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: KANKREG_CHROME.navInk,
  },
  accent: {
    color: KANKREG_CHROME.navAccent,
    fontFamily: fonts.semibold,
  },
  menu: {
    position: "absolute",
    top: 44,
    left: 0,
    minWidth: 196,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26, 92, 72, 0.12)",
    zIndex: WEB_Z_INDEX.dropdown,
    ...Platform.select({
      web: {
        boxShadow: "0 12px 32px -16px rgba(26, 40, 32, 0.28)",
      },
      default: {},
    }),
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  menuItemHover: {
    backgroundColor: "rgba(26, 92, 72, 0.06)",
  },
  menuText: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
    color: KANKREG_CHROME.navInk,
  },
});

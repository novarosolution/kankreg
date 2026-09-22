/** Shared nav keys / route matching for KankregSiteHeader + KankregMobileNav */

import { KANKREG_ROLE_NAV_ITEMS, KANKREG_WEB_NAV_ITEMS } from "../../content/appContent";

export const ADMIN_ROUTES = new Set([
  "AdminDashboard",
  "AdminProducts",
  "AdminInventory",
  "AdminAddProduct",
  "AdminOrders",
  "AdminOrderDetail",
  "AdminUsers",
  "AdminNotifications",
  "AdminAnalytics",
  "AdminCoupons",
  "AdminRewards",
  "AdminSupport",
  "AdminHomeView",
]);

const ROUTE_GROUPS = {
  Home: ["Home"],
  Shop: ["Shop"],
  ShopAll: ["Shop"],
  ShopMenu: ["Shop"],
  Ghee: ["Shop"],
  Oils: ["Shop"],
  Atta: ["Shop"],
  Deals: ["Shop"],
  Combo: ["Shop"],
  About: ["About", "Privacy", "Terms"],
  Blogs: ["About", "Privacy", "Terms"],
  Product: ["Product"],
  Cart: ["Cart"],
  Checkout: ["Checkout"],
  Orders: ["MyOrders"],
  Rewards: ["RedeemRewards"],
  Account: ["Profile", "EditProfile", "ManageAddress", "Settings", "Notifications", "Support"],
  Admin: [...ADMIN_ROUTES],
  Delivery: ["DeliveryDashboard"],
  Auth: ["Login", "Register"],
};

function bindItem(item, go) {
  const children = Array.isArray(item.children)
    ? item.children.map((child) => bindItem(child, go))
    : undefined;
  return {
    ...item,
    children,
    onPress: () => {
      if (item.route) {
        go(item.route, Boolean(item.requiresAuth), item.params);
      }
    },
  };
}

export function routeMatchesNav(navKey, routeName, routeParams) {
  if (!routeName) return false;
  if (navKey === routeName) return true;
  if (!(ROUTE_GROUPS[navKey] || []).includes(routeName)) return false;

  const category = String(routeParams?.category || "").trim().toLowerCase();
  const pill = String(routeParams?.pill || "").trim();
  const query = String(routeParams?.q || "").trim().toLowerCase();

  if (navKey === "Ghee") return category.includes("ghee");
  if (navKey === "Oils") return category.includes("oil");
  if (navKey === "Atta") return category.includes("atta");
  if (navKey === "Deals") return pill === "On sale";
  if (navKey === "Combo") return query.includes("combo") || category.includes("combo");
  if (navKey === "ShopAll") {
    return routeName === "Shop" && !category && pill !== "On sale" && !query.includes("combo");
  }
  if (navKey === "ShopMenu") return routeName === "Shop";
  return true;
}

export function flattenNavItems(items = []) {
  return items.flatMap((item) => (item.children?.length ? [item, ...item.children] : [item]));
}

export function buildKankregNavItems({ go, user }) {
  const roleItems = [];
  if (user?.isAdmin) {
    const { key, label } = KANKREG_ROLE_NAV_ITEMS.admin;
    roleItems.push({
      key,
      label,
      route: "AdminDashboard",
      requiresAuth: true,
      onPress: () => go("AdminDashboard", true),
    });
  }
  if (user?.isDeliveryPartner) {
    const { key, label } = KANKREG_ROLE_NAV_ITEMS.delivery;
    roleItems.push({
      key,
      label,
      route: "DeliveryDashboard",
      requiresAuth: true,
      onPress: () => go("DeliveryDashboard", true),
    });
  }
  return [...KANKREG_WEB_NAV_ITEMS.map((item) => bindItem(item, go)), ...roleItems];
}

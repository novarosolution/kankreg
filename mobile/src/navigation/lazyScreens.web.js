import React from "react";
import { Platform } from "react-native";
import AppStartupScreen from "../components/AppStartupScreen";
import ScreenErrorBoundary from "../components/ui/ScreenErrorBoundary";
import ScreenLoadError from "../components/ui/ScreenLoadError";
import * as CustomerScreens from "./screenRegistryCustomer";
import * as HeavyScreens from "./screenRegistryHeavy";

function reloadApp() {
  if (Platform.OS === "web" && typeof globalThis.location?.reload === "function") {
    globalThis.location.reload();
  }
}

function wrapRoute(Component, screenName, { suspense = false } = {}) {
  return function RouteScreen(props) {
    const body = <Component {...props} />;
    return (
      <ScreenErrorBoundary
        screenName={screenName}
        onRetry={() => props.navigation?.replace?.(props.route?.name)}
      >
        {suspense ? (
          <React.Suspense
            fallback={<AppStartupScreen useAppFonts={false} footnote={`Loading ${screenName}…`} />}
          >
            {body}
          </React.Suspense>
        ) : (
          body
        )}
      </ScreenErrorBoundary>
    );
  };
}

/**
 * Web route loader. Metro dev cannot resolve async chunk module IDs — eager require in __DEV__.
 * Production export:web keeps React.lazy + dynamic import() for code splitting.
 */
function lazyRoute(importFactory, screenName, EagerComponent) {
  if (__DEV__) {
    return wrapRoute(EagerComponent, screenName);
  }

  const Lazy = React.lazy(() =>
    importFactory().catch((error) => ({
      default: function LazyImportFailedScreen() {
        return (
          <ScreenLoadError
            screenName={screenName}
            error={error}
            onRetry={reloadApp}
            details={error?.message || String(error)}
          />
        );
      },
    }))
  );

  return wrapRoute(Lazy, screenName, { suspense: true });
}

export const ShopScreen = lazyRoute(
  () => import("../screens/ShopScreen"),
  "Shop",
  CustomerScreens.ShopScreen
);
export const ProductScreen = lazyRoute(
  () => import("../screens/ProductScreen"),
  "Product",
  CustomerScreens.ProductScreen
);
export const CheckoutScreen = lazyRoute(
  () => import("../screens/CheckoutScreen"),
  "Checkout",
  CustomerScreens.CheckoutScreen
);
export const CartScreen = lazyRoute(
  () => import("../screens/CartScreen"),
  "Cart",
  CustomerScreens.CartScreen
);
export const ProfileScreen = lazyRoute(
  () => import("../screens/ProfileScreen"),
  "Profile",
  CustomerScreens.ProfileScreen
);
export const EditProfileScreen = lazyRoute(
  () => import("../screens/EditProfileScreen"),
  "Edit profile",
  CustomerScreens.EditProfileScreen
);
export const OrderConfirmedScreen = lazyRoute(
  () => import("../screens/OrderConfirmedScreen"),
  "Order confirmed",
  CustomerScreens.OrderConfirmedScreen
);
export const NotificationsScreen = lazyRoute(
  () => import("../screens/NotificationsScreen"),
  "Notifications",
  CustomerScreens.NotificationsScreen
);
export const SettingsScreen = lazyRoute(
  () => import("../screens/SettingsScreen"),
  "Settings",
  CustomerScreens.SettingsScreen
);
export const RedeemRewardsScreen = lazyRoute(
  () => import("../screens/RedeemRewardsScreen"),
  "Rewards",
  CustomerScreens.RedeemRewardsScreen
);
export const ManageAddressScreen = lazyRoute(
  () => import("../screens/ManageAddressScreen"),
  "Manage address",
  CustomerScreens.ManageAddressScreen
);
export const SupportScreen = lazyRoute(
  () => import("../screens/SupportScreen"),
  "Support",
  CustomerScreens.SupportScreen
);
export const AboutScreen = lazyRoute(
  () => import("../screens/AboutScreen"),
  "About",
  CustomerScreens.AboutScreen
);
export const LegalDocumentScreen = lazyRoute(
  () => import("../screens/LegalDocumentScreen"),
  "Legal",
  CustomerScreens.LegalDocumentScreen
);
export const MyOrdersScreen = lazyRoute(
  () => import("../screens/MyOrdersScreen"),
  "My orders",
  HeavyScreens.MyOrdersScreen
);
export const DeliveryDashboardScreen = lazyRoute(
  () => import("../screens/DeliveryDashboardScreen"),
  "Delivery dashboard",
  HeavyScreens.DeliveryDashboardScreen
);
export const AdminDashboardScreen = lazyRoute(
  () => import("../screens/admin/AdminDashboardScreen"),
  "Admin dashboard",
  HeavyScreens.AdminDashboardScreen
);
export const AdminProductsScreen = lazyRoute(
  () => import("../screens/admin/AdminProductsScreen"),
  "Admin products",
  HeavyScreens.AdminProductsScreen
);
export const AdminAddProductScreen = lazyRoute(
  () => import("../screens/admin/AdminAddProductScreen"),
  "Add product",
  HeavyScreens.AdminAddProductScreen
);
export const AdminOrdersScreen = lazyRoute(
  () => import("../screens/admin/AdminOrdersScreen"),
  "Admin orders",
  HeavyScreens.AdminOrdersScreen
);
export const AdminOrderDetailScreen = lazyRoute(
  () => import("../screens/admin/AdminOrderDetailScreen"),
  "Manage order",
  HeavyScreens.AdminOrderDetailScreen
);
export const AdminUsersScreen = lazyRoute(
  () => import("../screens/admin/AdminUsersScreen"),
  "Admin users",
  HeavyScreens.AdminUsersScreen
);
export const AdminNotificationsScreen = lazyRoute(
  () => import("../screens/admin/AdminNotificationsScreen"),
  "Admin notifications",
  HeavyScreens.AdminNotificationsScreen
);
export const AdminAnalyticsScreen = lazyRoute(
  () => import("../screens/admin/AdminAnalyticsScreen"),
  "Admin analytics",
  HeavyScreens.AdminAnalyticsScreen
);
export const AdminCouponsScreen = lazyRoute(
  () => import("../screens/admin/AdminCouponsScreen"),
  "Admin coupons",
  HeavyScreens.AdminCouponsScreen
);
export const AdminRewardsScreen = lazyRoute(
  () => import("../screens/admin/AdminRewardsScreen"),
  "Admin rewards",
  HeavyScreens.AdminRewardsScreen
);
export const AdminSupportScreen = lazyRoute(
  () => import("../screens/admin/AdminSupportScreen"),
  "Admin support",
  HeavyScreens.AdminSupportScreen
);
export const AdminHomeViewScreen = lazyRoute(
  () => import("../screens/admin/AdminHomeViewScreen"),
  "Admin home view",
  HeavyScreens.AdminHomeViewScreen
);
export const AdminInventoryScreen = lazyRoute(
  () => import("../screens/admin/AdminInventoryScreen"),
  "Admin inventory",
  HeavyScreens.AdminInventoryScreen
);

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import CustomerScreenShell from "../components/CustomerScreenShell";
import KankregUnifiedPageHeader from "../components/kankreg/KankregUnifiedPageHeader";
import CheckoutInfoCard from "../components/checkout/CheckoutInfoCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  createOrderRequest,
  fetchAvailableCouponsRequest,
  validateCouponRequest} from "../services/orderService";
import { getCurrentAddressFromGPS } from "../services/locationService";
import { useTheme } from "../context/ThemeContext";
import {
  customerFloatingNavOffset,
  customerPanel,
  customerScrollFill} from "../theme/screenLayout";
import { fonts, icon, layout, radius, semanticRadius, spacing, typography } from "../theme/tokens";
import { formatINR } from "../utils/currency";
import { getImageUriCandidates } from "../utils/image";
import { HOME_CATALOG_ALL, matchesShelfProduct } from "../utils/shelfMatch";
import { getProducts } from "../services/productService";
import { BRAND_LOGO_SIZE } from "../constants/brand";
import BrandLogo from "../components/BrandLogo";
import { ALCHEMY, FONT_DISPLAY } from "../theme/customerAlchemy";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import PremiumInput from "../components/ui/PremiumInput";
import PremiumErrorBanner from "../components/ui/PremiumErrorBanner";
import PremiumButton from "../components/ui/PremiumButton";
import PremiumSectionHeader from "../components/ui/PremiumSectionHeader";
import PremiumCard from "../components/ui/PremiumCard";
import GoldHairline from "../components/ui/GoldHairline";
import SectionReveal from "../components/motion/SectionReveal";
import { staggerDelay } from "../theme/motion";
import { CART_ADDRESS, CART_UI } from "../content/appContent";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming} from "react-native-reanimated";
import useReducedMotion from "../hooks/useReducedMotion";
import PaymentMethodSelector from "../components/payments/PaymentMethodSelector";
import {
  KankregCheckoutSteps} from "../components/kankreg/KankregPageChrome";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import KankregSplitLayout from "../components/kankreg/KankregSplitLayout";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import { getKankregChromeTop } from "../components/kankreg/KankregSiteHeader";
import {
  getPublicRazorpayKeyId,
  loadRazorpayWebSdk,
  openRazorpayCheckout,
  verifyOrderPayment} from "../services/paymentService";

/** Same required fields as ManageAddressScreen save. */
function getProfileAddressCompletion(defaultAddress) {
  const a = defaultAddress && typeof defaultAddress === "object" ? defaultAddress : {};
  const line1 = String(a.line1 || "").trim();
  const city = String(a.city || "").trim();
  const state = String(a.state || "").trim();
  const postalCode = String(a.postalCode || "").trim();
  const country = String(a.country || "").trim();
  const complete = Boolean(line1 && city && state && postalCode && country);
  const any = Boolean(line1 || city || state || postalCode || country);
  return { complete, partial: any && !complete };
}

export default function CartScreen({ navigation, route }) {
  const { cartItems, totalAmount, totalItems, addToCart, removeFromCart, removeLineFromCart, clearCart } = useCart();
  const { isAuthenticated, token, user } = useAuth();
  const { toastSuccess } = useToast();
    const isCheckoutFlow = route?.name === "Checkout" || route?.params?.flow === "checkout";
  const { useSplitLayout, isXs } = useKankregLayout();
  const kankregWebSplit = useSplitLayout;
  const isCompact = isXs;
  const isDesktop = useSplitLayout;
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const nativeStickyPay = Platform.OS !== "web" && cartItems.length > 0;
  const checkoutPulse = useSharedValue(0);
  const checkoutPulseStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + checkoutPulse.value * 0.55,
    transform: [{ scale: 1 + checkoutPulse.value * 0.04 }]}));
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  /** `"Razorpay"` | `"Cash on Delivery"` — must match backend `Order.paymentMethod`. */
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) setCatalogProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setCatalogProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || cartItems.length === 0 || isPlacingOrder) {
      checkoutPulse.value = 0;
      return undefined;
    }
    checkoutPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.bezier(0.22, 1, 0.36, 1) }),
        withTiming(0, { duration: 1100, easing: Easing.bezier(0.65, 0, 0.35, 1) }),
      ),
      -1,
      false,
    );
  }, [reducedMotion, cartItems.length, isPlacingOrder, checkoutPulse]);

  useEffect(() => {
    setFullName(user?.name || "");
    setPhone(user?.phone || "");
    setLine1(user?.defaultAddress?.line1 || "");
    setCity(user?.defaultAddress?.city || "");
    setState(user?.defaultAddress?.state || "");
    setPostalCode(user?.defaultAddress?.postalCode || "");
    setCountry(user?.defaultAddress?.country || "");
    setLatitude(
      Number.isFinite(Number(user?.defaultAddress?.latitude))
        ? Number(user.defaultAddress.latitude)
        : null
    );
    setLongitude(
      Number.isFinite(Number(user?.defaultAddress?.longitude))
        ? Number(user.defaultAddress.longitude)
        : null
    );
  }, [user]);

  useEffect(() => {
    if (!appliedCoupon) return;
    const minSubtotal = Number(appliedCoupon.minSubtotal || 0);
    if (minSubtotal > 0 && totalAmount < minSubtotal) {
      setAppliedCoupon(null);
    }
  }, [appliedCoupon, totalAmount]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const data = await fetchAvailableCouponsRequest(token, totalAmount);
        if (!cancelled) {
          setAvailableCoupons(Array.isArray(data?.coupons) ? data.coupons : []);
        }
      } catch {
        if (!cancelled) {
          setAvailableCoupons([]);
        }
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isAuthenticated, token, totalAmount]);

  useFocusEffect(
    useCallback(() => {
      const raw = route?.params?.prefillCoupon;
      if (!raw || !isAuthenticated || !token) {
        return undefined;
      }
      const normalized = String(raw).trim().toUpperCase();
      let cancelled = false;
      (async () => {
        try {
          setError("");
          const result = await validateCouponRequest(token, normalized, totalAmount);
          if (cancelled) return;
          setAppliedCoupon(result.coupon || null);
          setCouponCode(normalized);
          toastSuccess(result.message || "Coupon applied.", { title: "Coupon applied" });
          setAvailableCoupons((current) => current.filter((coupon) => coupon.code !== normalized));
          navigation.setParams({ prefillCoupon: undefined });
        } catch (err) {
          if (!cancelled) {
            setCouponCode(normalized);
            setAppliedCoupon(null);
            setError(err.message || "Unable to apply coupon.");
            navigation.setParams({ prefillCoupon: undefined });
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [route?.params?.prefillCoupon, isAuthenticated, token, totalAmount, navigation, toastSuccess])
  );

  const { colors: c, shadowLift, shadowPremium, isDark } = useTheme();
  const styles = useMemo(() => createCartStyles(c, shadowLift, shadowPremium, isDark), [c, shadowLift, shadowPremium, isDark]);

  const cartIdSet = useMemo(() => new Set(cartItems.map((i) => i.id)), [cartItems]);
  const upsellProducts = useMemo(() => {
    return catalogProducts
      .filter((p) => matchesShelfProduct(p, HOME_CATALOG_ALL) && !cartIdSet.has(p.id) && p.inStock !== false)
      .slice(0, 2);
  }, [catalogProducts, cartIdSet]);

  const profileAddress = useMemo(() => getProfileAddressCompletion(user?.defaultAddress), [user?.defaultAddress]);

  if (!isAuthenticated) {
    return (
      <CustomerScreenShell style={styles.screen}>
        <KankregScrollPage scrollVariant="inner" style={customerScrollFill} showFooter={false}>
          <KankregUnifiedPageHeader
            navigation={navigation}
            eyebrow={CART_UI.pageEyebrow}
            title={CART_UI.pageTitle}
            showBack={false}
          />
          <View style={styles.loginCard}>
            <BrandLogo width={BRAND_LOGO_SIZE.footerCompact} height={BRAND_LOGO_SIZE.footerCompact} style={styles.loginBrandLogo} />
            <PremiumEmptyState
              iconName="bag-handle-outline"
              title="Sign in to continue"
              description="Sign in to use your cart."
              ctaLabel="Go to login"
              ctaIconLeft="log-in-outline"
              onCtaPress={() => navigation.navigate("Login")}
              secondaryCtaLabel="Browse store"
              onSecondaryCtaPress={() => navigation.navigate("Home")}
            />
          </View>
        </KankregScrollPage>
        <BottomNavBar />
      </CustomerScreenShell>
    );
  }

  const goBackOrHome = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate("Home");
    }
  };

  const renderCartItem = (item, index = 0) => {
    const lineTotal = item.price * item.quantity;
    const revealDelay = staggerDelay(index);
    return (
      <SectionReveal key={item.id} delay={revealDelay} style={styles.selectionCard}>
        <View style={[styles.selectionCardRow, isCompact ? styles.selectionCardRowStack : null]}>
          <RetryCartImage
            sourceUri={item.image || ""}
            style={[styles.selectionThumb, isCompact ? styles.selectionThumbStack : null]}
            placeholderStyle={styles.selectionImagePlaceholder}
            iconSize={icon.xxl}
            c={c}
          />
          <View style={[styles.selectionBody, isCompact ? styles.selectionBodyStack : null]}>
            <View style={styles.selectionTitleRow}>
            <Text style={styles.selectionName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.selectionPrice}>{formatINR(lineTotal)}</Text>
            </View>
            {String(item.description || "").trim() ? (
              <Text style={styles.selectionDesc} numberOfLines={2}>
                {String(item.description).trim()}
              </Text>
            ) : null}
            {item.unit ? (
              <View style={styles.sizeBadge}>
                <Text style={styles.sizeBadgeText}>{String(item.unit).toUpperCase()}</Text>
              </View>
            ) : null}
            <View style={styles.selectionActionsRow}>
              <View style={styles.qtyPillBar}>
                <TouchableOpacity
                  style={styles.qtyPillHit}
                  onPress={() => removeFromCart(item.id, item.variantLabel)}
                  accessibilityLabel="Decrease quantity"
                >
                  <Ionicons name="remove" size={icon.sm} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </TouchableOpacity>
                <Text style={styles.qtyPillNum}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyPillHit}
                  onPress={() => addToCart(item)}
                  accessibilityLabel="Increase quantity"
                >
                  <Ionicons name="add" size={icon.sm} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeRow}
                onPress={() => removeLineFromCart(item.id, item.variantLabel)}
                activeOpacity={0.75}
              >
                <Ionicons name="trash-outline" size={icon.xs} color={isDark ? c.textMuted : ALCHEMY.brownMuted} />
                <Text style={styles.removeRowText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SectionReveal>
    );
  };

  const validateAddress = () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !line1.trim() ||
      !city.trim() ||
      !state.trim() ||
      !postalCode.trim() ||
      !country.trim()
    ) {
      setError("Please complete delivery address details.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      return;
    }

    if (!validateAddress()) {
      return;
    }

    try {
      setIsPlacingOrder(true);
      setError("");

      const created = await createOrderRequest(token, {
        products: cartItems.map((item) => ({
          product: item.id,
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || "",
          quantity: item.quantity,
          variantLabel: item.variantLabel || ""})),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          line1: line1.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
          latitude,
          longitude,
          note: note.trim()},
        paymentMethod,
        couponCode: appliedCoupon?.code || ""});

      clearCart();

      if (paymentMethod === "Cash on Delivery") {
        toastSuccess("Order placed—track it in Profile.", { title: "Order confirmed" });
        navigation.navigate("Profile");
        return;
      }

      const orderId = created?._id || created?.id;
      const keyId = created?.razorpayKeyId || getPublicRazorpayKeyId();
      if (!orderId) {
        throw new Error("Order created but response was incomplete. Check My Orders.");
      }
      if (Platform.OS === "web") {
        await loadRazorpayWebSdk();
      }

      const checkout = await openRazorpayCheckout({
        order: created,
        razorpayKeyId: keyId,
        user,
        themeColor: c.primary});

      if (checkout.status === "success" && checkout.payload) {
        const p = checkout.payload;
        await verifyOrderPayment(token, orderId, {
          razorpay_order_id: p.razorpay_order_id,
          razorpay_payment_id: p.razorpay_payment_id,
          razorpay_signature: p.razorpay_signature});
        toastSuccess("Payment confirmed.", { title: "Order confirmed" });
        navigation.navigate("MyOrders");
        return;
      }

      if (checkout.status === "fallback") {
        toastSuccess("Finish payment on Razorpay—then check My Orders.", { title: "Almost done" });
      } else {
        toastSuccess("Resume payment from My Orders within 30 minutes.", { title: "Payment pending" });
      }
      navigation.navigate("MyOrders");
    } catch (err) {
      setError(err.message || "Unable to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      setError("");
      const normalized = String(couponCode || "").trim().toUpperCase();
      if (!normalized) {
        setError("Enter coupon code.");
        return;
      }
      const result = await validateCouponRequest(token, normalized, totalAmount);
      setAppliedCoupon(result.coupon || null);
      setCouponCode(normalized);
      toastSuccess(result.message || "Coupon applied.", { title: "Coupon applied" });
      setAvailableCoupons((current) => current.filter((coupon) => coupon.code !== normalized));
    } catch (err) {
      setAppliedCoupon(null);
      setError(err.message || "Unable to apply coupon.");
    }
  };

  const deliveryFee = 0;
  const platformFee = 1.2;
  const discountAmount = Number(appliedCoupon?.discountAmount || 0);
  const payableAmount = Math.max(0, totalAmount + deliveryFee + platformFee - discountAmount);
  const isRazorpayMethod = paymentMethod === "Razorpay";
  const primaryCtaLabel = kankregWebSplit && !isCheckoutFlow
    ? "Proceed to checkout →"
    : isRazorpayMethod
      ? `Pay ${formatINR(payableAmount)} securely`
      : "PLACE ORDER · COD";

  const handlePrimaryCta = () => {
    if (kankregWebSplit && !isCheckoutFlow) {
      navigation.navigate("Checkout");
      return;
    }
    handlePlaceOrder();
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsDetectingLocation(true);
      setError("");
      const address = await getCurrentAddressFromGPS();
      if (address.line1) setLine1(address.line1);
      if (address.city) setCity(address.city);
      if (address.state) setState(address.state);
      if (address.postalCode) setPostalCode(address.postalCode);
      if (address.country) setCountry(address.country);
      if (Number.isFinite(Number(address.latitude))) setLatitude(Number(address.latitude));
      if (Number.isFinite(Number(address.longitude))) setLongitude(Number(address.longitude));
      toastSuccess(CART_ADDRESS.gpsFillSuccess, { title: "Location added" });
    } catch (err) {
      setError(err.message || "Unable to get current location.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <CustomerScreenShell style={styles.screen}>
      <KankregScrollPage
        scrollVariant="inner"
        style={styles.scrollFill}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <KankregUnifiedPageHeader
          navigation={navigation}
          eyebrow={isCheckoutFlow ? CART_UI.checkoutEyebrow : CART_UI.pageEyebrow}
          title={isCheckoutFlow ? CART_UI.checkoutTitle : CART_UI.pageTitle}
          subtitle={
            cartItems.length === 0
              ? "Add items from the shop."
              : `${totalItems} item${totalItems === 1 ? "" : "s"}`
          }
          showBack={isCheckoutFlow}
          onBack={isCheckoutFlow ? () => navigation.navigate("Cart") : goBackOrHome}
          right={
            isCheckoutFlow && kankregWebSplit ? (
              <PremiumButton
                label={CART_UI.backToBag}
                variant="ghost"
                size="sm"
                iconLeft="arrow-back-outline"
                onPress={() => navigation.navigate("Cart")}
              />
            ) : undefined
          }
        />
        {isCheckoutFlow ? (
          <SectionReveal index={0} preset="fade-in">
            <KankregCheckoutSteps active={2} />
          </SectionReveal>
        ) : null}

        <KankregSplitLayout
          asideStyle={isDesktop ? styles.cartRightCol : undefined}
          main={
        <>

        {(!kankregWebSplit || !isCheckoutFlow) && cartItems.length === 0 ? (
          <SectionReveal index={0} preset="scale-in">
          <View style={styles.emptyCard}>
            <BrandLogo width={BRAND_LOGO_SIZE.footerCompact} height={BRAND_LOGO_SIZE.footerCompact} style={styles.emptyBrandLogo} />
            <PremiumEmptyState
              iconName="cart-outline"
              title={CART_UI.emptyTitle}
              description={CART_UI.emptyDescription}
              ctaLabel={CART_UI.browseCta}
              ctaIconLeft="storefront-outline"
              onCtaPress={() => navigation.navigate(Platform.OS === "web" ? "Shop" : "Home")}
            />
          </View>
          </SectionReveal>
        ) : (!kankregWebSplit || !isCheckoutFlow) ? (
          <>
            {!kankregWebSplit ? (
              <PremiumSectionHeader
                compact
                overline={CART_UI.itemsOverline}
                title={CART_UI.itemsTitle}
              />
            ) : null}
            <View style={styles.listSection}>{cartItems.map((item, idx) => renderCartItem(item, idx))}</View>
          </>
        ) : null}

        {!kankregWebSplit && cartItems.length > 0 && upsellProducts.length > 0 ? (
          <View style={styles.upsellSection}>
            <PremiumSectionHeader
              compact
              overline={CART_UI.pairOverline}
              title={CART_UI.pairTitle}
            />
            {upsellProducts.map((p) => {
              return (
                <View key={p.id} style={styles.upsellRow}>
                  <RetryCartImage
                    sourceUri={p.image || ""}
                    style={styles.upsellThumb}
                    placeholderStyle={styles.selectionImagePlaceholder}
                    iconSize={icon.md}
                    c={c}
                  />
                  <View style={styles.upsellMeta}>
                    <Text style={styles.upsellName} numberOfLines={2}>
                      {p.name}
                    </Text>
                    <Text style={styles.upsellPrice}>{formatINR(p.price)}</Text>
                    <TouchableOpacity onPress={() => addToCart(p)} style={styles.upsellAdd} activeOpacity={0.85}>
                      <Text style={styles.upsellAddText}>ADD TO CART</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {cartItems.length > 0 && (!kankregWebSplit || isCheckoutFlow) ? <GoldHairline marginVertical={spacing.md} /> : null}

        {(!kankregWebSplit || (kankregWebSplit && isCheckoutFlow)) ? (
        <View style={styles.couponBox}>
          <PremiumSectionHeader compact overline={CART_UI.couponOverline} title={CART_UI.couponTitle} />
          {availableCoupons.length > 0 ? (
            <View style={styles.availableCouponsWrap}>
              {availableCoupons.slice(0, 6).map((coupon) => (
                <TouchableOpacity
                  key={coupon.code}
                  style={styles.availableCouponChip}
                  onPress={() => setCouponCode(coupon.code)}
                >
                  <Text style={styles.availableCouponCode}>{coupon.code}</Text>
                  <Text style={styles.availableCouponMeta}>
                    Save {formatINR(coupon.estimatedDiscount || 0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noCouponText}>No eligible coupons for current cart.</Text>
          )}
          <View style={styles.couponRow}>
            <View style={styles.couponInputWrap}>
              <PremiumInput
                label="Coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
                iconLeft="pricetag-outline"
                returnKeyType="done"
                onSubmitEditing={handleApplyCoupon}
              />
            </View>
            <PremiumButton
              label="Apply"
              variant="subtle"
              size="sm"
              onPress={handleApplyCoupon}
              style={styles.applyCouponBtn}
            />
          </View>
          {appliedCoupon ? (
            <Text style={styles.couponSuccessText}>
              {appliedCoupon.code} applied. You saved {formatINR(appliedCoupon.discountAmount || 0)}.
            </Text>
          ) : null}
        </View>
        ) : null}

        {(!kankregWebSplit || isCheckoutFlow) && !profileAddress.complete ? (
          <TouchableOpacity
            style={styles.addressProfileBanner}
            onPress={() => navigation.navigate("ManageAddress")}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Open delivery address settings"
          >
            <View style={styles.addressProfileBannerIconWrap}>
              <Ionicons name="location-outline" size={icon.lg} color={c.secondary} />
            </View>
            <View style={styles.addressProfileBannerTextCol}>
              <Text style={styles.addressProfileBannerTitle}>
                {profileAddress.partial ? CART_ADDRESS.profileIncompleteTitle : CART_ADDRESS.profileEmptyTitle}
              </Text>
              <Text style={styles.addressProfileBannerSub}>
                {profileAddress.partial ? CART_ADDRESS.profileIncompleteSub : CART_ADDRESS.profileEmptySub}
              </Text>
            </View>
            <Text style={styles.addressProfileBannerCta}>Add</Text>
          </TouchableOpacity>
        ) : null}

        {cartItems.length > 0 && (!kankregWebSplit || isCheckoutFlow) ? <GoldHairline marginVertical={spacing.md} /> : null}

        {(!kankregWebSplit || isCheckoutFlow) ? (
        <CheckoutInfoCard title={CART_ADDRESS.panelTitle}>
        <View style={styles.addressBoxInner}>
          {error ? (
            <View style={styles.bannerSpacer}>
              <PremiumErrorBanner severity="error" message={error} onClose={() => setError("")} compact />
            </View>
          ) : null}
          <PremiumButton
            label={isDetectingLocation ? CART_ADDRESS.useGpsLoading : CART_ADDRESS.useGps}
            iconLeft="locate-outline"
            variant="ghost"
            size="sm"
            loading={isDetectingLocation}
            disabled={isDetectingLocation}
            onPress={handleUseCurrentLocation}
            style={styles.savedAddressBtn}
          />
          <View style={styles.addressFieldGap}>
            <PremiumInput
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              iconLeft="person-outline"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
          </View>
          <View style={styles.addressFieldGap}>
            <PremiumInput
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              iconLeft="call-outline"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
          </View>
          <View style={styles.addressFieldGap}>
            <PremiumInput
              label="Address line"
              value={line1}
              onChangeText={setLine1}
              iconLeft="home-outline"
              autoCapitalize="sentences"
              autoComplete="street-address"
              textContentType="streetAddressLine1"
            />
          </View>
          <View style={[styles.addressRow, isCompact ? styles.addressRowCompact : null]}>
            <View style={[styles.addressFieldGap, styles.halfField]}>
              <PremiumInput
                label="City"
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
                autoComplete="address-level2"
                textContentType="addressCity"
              />
            </View>
            <View style={[styles.addressFieldGap, styles.halfField]}>
              <PremiumInput
                label="State"
                value={state}
                onChangeText={setState}
                autoCapitalize="words"
                autoComplete="address-level1"
                textContentType="addressState"
              />
            </View>
          </View>
          <View style={[styles.addressRow, isCompact ? styles.addressRowCompact : null]}>
            <View style={[styles.addressFieldGap, styles.halfField]}>
              <PremiumInput
                label="Postal code"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="number-pad"
                autoComplete="postal-code"
                textContentType="postalCode"
              />
            </View>
            <View style={[styles.addressFieldGap, styles.halfField]}>
              <PremiumInput
                label="Country"
                value={country}
                onChangeText={setCountry}
                autoCapitalize="words"
                autoComplete="country"
                textContentType="countryName"
              />
            </View>
          </View>
          <View style={styles.addressFieldGap}>
            <PremiumInput
              label="Delivery note (optional)"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              iconLeft="chatbubbles-outline"
            />
          </View>

        </View>
        </CheckoutInfoCard>
        ) : null}

        {(!kankregWebSplit || isCheckoutFlow) && cartItems.length > 0 ? (
          <CheckoutInfoCard title="Payment method">
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              disabled={isPlacingOrder}
            />
          </CheckoutInfoCard>
        ) : null}

        </>
          }
          aside={
        <>
        <PremiumCard variant="muted" padding="md" style={styles.summaryCardWrap}>
          {kankregWebSplit ? (
            <Text style={styles.summarySerifTitle}>
              {isCheckoutFlow ? "Order total" : "Order summary"}
            </Text>
          ) : (
            <PremiumSectionHeader compact overline={CART_UI.summaryOverline} title={CART_UI.summaryTitle} />
          )}
          {isCheckoutFlow && totalItems > 0 ? (
            <Text style={[styles.summaryMetaLine, { color: c.textSecondary }]}>
              Items ({totalItems}) · {formatINR(totalAmount)}
            </Text>
          ) : null}
          {kankregWebSplit && !isCheckoutFlow ? (
            <View style={styles.couponRow}>
              <View style={styles.couponInputWrap}>
                <PremiumInput
                  label="Coupon code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                  iconLeft="pricetag-outline"
                  returnKeyType="done"
                  onSubmitEditing={handleApplyCoupon}
                />
              </View>
              <PremiumButton
                label="Apply"
                variant="ghost"
                size="sm"
                onPress={handleApplyCoupon}
                style={styles.applyCouponBtn}
              />
            </View>
          ) : null}
          <View style={styles.summaryInner}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatINR(totalAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.shippingFree}>FREE</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated taxes</Text>
              <Text style={styles.summaryValue}>{formatINR(platformFee)}</Text>
            </View>
            {discountAmount > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryDiscountValue}>- {formatINR(discountAmount)}</Text>
              </View>
            ) : null}
            <View style={[styles.summaryDivider, { backgroundColor: c.border }]} />
            <Text style={styles.totalAmountLabel}>Total</Text>
            <View style={styles.totalAmountRow}>
              <Text style={[styles.totalAmountSerif, { color: isDark ? c.textPrimary : ALCHEMY.brown }]}>{formatINR(payableAmount)}</Text>
              <View style={styles.inrBadge}>
                <Text style={styles.inrBadgeText}>INR</Text>
              </View>
            </View>
            <Text style={[styles.summaryPaymentHint, isRazorpayMethod ? styles.summaryPaymentHintOnline : styles.summaryPaymentHintCod]}>
              {isRazorpayMethod
                ? `Pay ${formatINR(payableAmount)} via Razorpay`
                : "Pay cash when your order arrives"}
            </Text>
            <View style={styles.summaryTrustRow}>
              <View style={styles.summaryTrustItem}>
                <Ionicons name="flame-outline" size={icon.micro} color={ALCHEMY.brownMuted} />
                <Text style={styles.summaryTrustText}>{CART_UI.trustPure}</Text>
              </View>
              <View style={styles.summaryTrustItem}>
                <Ionicons name="shield-checkmark-outline" size={icon.micro} color={ALCHEMY.brownMuted} />
                <Text style={styles.summaryTrustText}>{CART_UI.trustPay}</Text>
              </View>
              <View style={styles.summaryTrustItem}>
                <Ionicons name="leaf-outline" size={icon.micro} color={ALCHEMY.brownMuted} />
                <Text style={styles.summaryTrustText}>{CART_UI.trustOrganic}</Text>
              </View>
            </View>
          </View>
        </PremiumCard>

        {!nativeStickyPay ? (
        <View style={styles.cartCtaDock}>
          <View style={styles.checkoutCtaWrap}>
            {cartItems.length > 0 && !isPlacingOrder && !reducedMotion ? (
              <Animated.View style={[styles.checkoutPulseGlow, checkoutPulseStyle, styles.peNone]} />
            ) : null}
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={handlePrimaryCta}
              disabled={cartItems.length === 0 || isPlacingOrder}
              style={styles.checkoutGradientWrap}
              accessibilityRole="button"
              accessibilityLabel={primaryCtaLabel}
            >
              {cartItems.length === 0 || isPlacingOrder ? (
                <View style={[styles.checkoutGradientBtn, styles.checkoutGradientMuted]}>
                  <Text style={styles.checkoutGradientText}>
                    {cartItems.length === 0 ? "ADD ITEMS TO CONTINUE" : "PLACING ORDER…"}
                  </Text>
                </View>
              ) : (
                <LinearGradient
                  colors={["#cba24e", "#a9772e", "#8a5f22"]}
                  locations={[0, 0.45, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.checkoutGradientBtn}
                >
                  <View style={styles.checkoutCtaInner}>
                    <Text style={[styles.checkoutGradientText, styles.checkoutGradientTextShrink]}>{primaryCtaLabel}</Text>
                    <View style={styles.checkoutArrowCircle}>
                      <Ionicons name="arrow-forward" size={17} color="#5C3D12" />
                    </View>
                  </View>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={({ pressed, hovered }) => [
              styles.continueExploreWrap,
              styles.continueExploreInner,
              Platform.OS === "web" && hovered ? styles.continueExploreInnerHover : null,
              pressed ? styles.continueExploreWrapPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continue exploring the store"
          >
            <Ionicons name="chevron-back" size={15} color={isDark ? ALCHEMY.gold : ALCHEMY.brown} />
            <Text style={styles.continueExploreText}>CONTINUE EXPLORING</Text>
          </Pressable>
        </View>
        ) : null}
        </>
          }
        />
</KankregScrollPage>
      {nativeStickyPay ? (
        <View style={[styles.stickyPayBar, { bottom: customerFloatingNavOffset(insets) }]}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handlePrimaryCta}
            disabled={isPlacingOrder}
            style={styles.checkoutGradientWrap}
          >
            <LinearGradient
              colors={["#cba24e", "#a9772e", "#8a5f22"]}
              locations={[0, 0.45, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.checkoutGradientBtn}
            >
              <Text style={styles.checkoutGradientText}>{primaryCtaLabel}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : null}
      <BottomNavBar />
    </CustomerScreenShell>
  );
}

function createCartStyles(c, shadowLift, shadowPremium, isDark) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    maxWidth: Platform.select({ web: layout.maxContentWidth + 96, default: "100%" })},
  scrollFill: {
    flex: 1,
    width: "100%"},
  cartGridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xl + 4},
  cartLeftCol: {
    flex: 1,
    minWidth: 0},
  cartRightCol: {
    width: 360,
    flexShrink: 0,
    ...Platform.select({
      web: {
        position: "sticky",
        top: getKankregChromeTop() + spacing.xl + 2,
        alignSelf: "flex-start"},
      default: {}})},
  addressBoxInner: {
    gap: spacing.sm},
  summaryMetaLine: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.medium,
    marginBottom: spacing.sm},
  stickyPayBar: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    zIndex: 40,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: isDark ? "rgba(28, 25, 23, 0.94)" : "rgba(255, 252, 248, 0.96)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border,
    ...shadowPremium},
  selectionCard: {
    backgroundColor: isDark ? c.surface : ALCHEMY.cardBg,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? "rgba(232, 200, 90, 0.14)" : ALCHEMY.pillInactive,
    borderTopWidth: 3,
    borderTopColor: isDark ? c.primaryBorder : ALCHEMY.gold,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadowPremium,
    ...Platform.select({
      ios: {
        shadowColor: isDark ? "#E8C85A" : "#3D2A12",
        shadowOpacity: isDark ? 0.12 : 0.08,
        shadowRadius: isDark ? 16 : 14},
      android: { elevation: isDark ? 4 : 3 },
      default: {}})},
  selectionCardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md},
  selectionCardRowStack: {
    flexDirection: "column",
    gap: 0,
    padding: 0},
  selectionThumb: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    backgroundColor: isDark ? c.surfaceMuted : "#FFFFFF",
    overflow: "hidden"},
  selectionThumbStack: {
    width: "100%",
    height: 148,
    borderRadius: 0,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl},
  selectionImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center"},
  selectionBody: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
    paddingLeft: 0},
  selectionBodyStack: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm},
  selectionTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xs},
  selectionName: {
    flex: 1,
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h3,
    color: c.textPrimary,
    lineHeight: 26},
  selectionPrice: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h3,
    color: isDark ? c.textPrimary : ALCHEMY.brown,
    fontVariant: ["tabular-nums"]},
  selectionDesc: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: c.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm},
  sizeBadge: {
    alignSelf: "flex-start",
    backgroundColor: isDark ? c.surfaceMuted : "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border},
  sizeBadgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: c.textMuted,
    letterSpacing: 0.6},
  selectionActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"},
  qtyPillBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: isDark ? c.surfaceMuted : "#FFF",
    borderRadius: semanticRadius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border,
    paddingHorizontal: 4},
  qtyPillHit: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center"},
  qtyPillNum: {
    minWidth: 28,
    textAlign: "center",
    fontFamily: fonts.bold,
    fontSize: typography.body,
    color: c.textPrimary},
  removeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingLeft: 8},
  removeRowText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    color: isDark ? c.textMuted : ALCHEMY.brownMuted},
  upsellSection: {
    backgroundColor: isDark ? c.surface : ALCHEMY.cardBg,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : ALCHEMY.pillInactive,
    borderTopWidth: 2,
    borderTopColor: isDark ? c.primaryBorder : ALCHEMY.gold,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadowLift},
  upsellRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: isDark ? c.surfaceMuted : "#FFFFFF",
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : ALCHEMY.pillInactive},
  upsellThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: c.surfaceMuted},
  upsellMeta: {
    flex: 1,
    minWidth: 0},
  upsellName: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.bodySmall,
    color: c.textPrimary,
    lineHeight: 20},
  upsellPrice: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall,
    color: c.textPrimary},
  upsellAdd: {
    marginTop: spacing.sm,
    alignSelf: "flex-start"},
  upsellAddText: {
    fontSize: 11,
    fontFamily: fonts.extrabold,
    letterSpacing: 1,
    color: isDark ? c.primaryBright : ALCHEMY.brown,
    textDecorationLine: "underline"},
  summaryCardWrap: {
    marginBottom: spacing.lg,
    alignSelf: "stretch"},
  summarySerifTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    color: isDark ? c.textPrimary : ALCHEMY.brown,
    marginBottom: spacing.md},
  shippingFree: {
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall,
    color: isDark ? c.primaryBright : "#C9A227"},
  totalAmountLabel: {
    fontSize: 10,
    fontFamily: fonts.bold,
    letterSpacing: 1.2,
    color: c.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.xs},
  totalAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md},
  totalAmountSerif: {
    fontFamily: FONT_DISPLAY,
    fontSize: 28,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"]},
  inrBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border,
    backgroundColor: isDark ? c.surfaceMuted : "#FFF"},
  inrBadgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: c.textMuted,
    letterSpacing: 0.5},
  summaryPaymentHint: {
    marginTop: spacing.sm,
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    lineHeight: 18},
  summaryPaymentHintOnline: {
    color: c.primary},
  summaryPaymentHintCod: {
    color: c.secondaryDark},
  summaryTrustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.border},
  summaryTrustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4},
  summaryTrustText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
    color: c.textMuted},
  cartCtaDock: {
    marginTop: spacing.md,
    paddingTop: spacing.lg + 4,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xxl,
    overflow: "hidden",
    borderWidth: isDark ? StyleSheet.hairlineWidth : StyleSheet.hairlineWidth * 2,
    borderTopWidth: isDark ? StyleSheet.hairlineWidth : 3,
    borderColor: isDark ? "rgba(232, 200, 90, 0.18)" : "rgba(138, 90, 18, 0.18)",
    borderTopColor: isDark ? "rgba(232, 200, 90, 0.18)" : ALCHEMY.gold,
    backgroundColor: isDark ? "rgba(14, 12, 10, 0.88)" : "rgba(255, 251, 244, 0.96)",
    ...Platform.select({
      ios: {
        shadowColor: isDark ? "#000" : "#3D2A12",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: isDark ? 0.4 : 0.12,
        shadowRadius: 22},
      android: { elevation: isDark ? 10 : 6 },
      web: {
        boxShadow: isDark
          ? "0 24px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255, 230, 170, 0.08)"
          : "0 24px 48px rgba(61, 42, 18, 0.14), inset 0 1px 0 rgba(255, 253, 251, 0.9)"},
      default: {}}),
    gap: spacing.sm + 4},
  checkoutCtaWrap: {
    position: "relative",
    marginTop: 0},
  checkoutPulseGlow: {
    position: "absolute",
    top: -8,
    left: -4,
    right: -4,
    bottom: -8,
    borderRadius: semanticRadius.full,
    backgroundColor: isDark ? "rgba(232, 200, 90, 0.42)" : "rgba(199, 154, 58, 0.4)",
    ...Platform.select({
      web: { filter: "blur(22px)" },
      default: {}}),
    zIndex: -1},
  checkoutGradientWrap: {
    marginBottom: 0,
    borderRadius: semanticRadius.full,
    overflow: "hidden",
    ...Platform.select({
      web: {
        boxShadow: isDark
          ? "0 16px 36px rgba(0,0,0,0.55), 0 4px 12px rgba(232, 200, 90, 0.12)"
          : "0 14px 28px rgba(116, 79, 28, 0.22)"},
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: isDark ? 0.4 : 0.18,
        shadowRadius: 18},
      android: { elevation: isDark ? 8 : 6 },
      default: {}})},
  checkoutGradientBtn: {
    minHeight: 54,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg + 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: semanticRadius.full,
    borderWidth: 1,
    borderColor: isDark ? "rgba(255, 240, 200, 0.35)" : "rgba(255, 252, 248, 0.5)"},
  checkoutCtaInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    width: "100%",
    paddingHorizontal: 4},
  checkoutArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFCF8",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2},
      android: { elevation: 2 },
      default: {}})},
  checkoutGradientMuted: {
    backgroundColor: c.textMuted},
  checkoutGradientText: {
    color: "#FFFCF8",
    fontFamily: fonts.extrabold,
    fontSize: typography.bodySmall + 1,
    letterSpacing: 1.35},
  checkoutGradientTextShrink: {
    flexShrink: 1,
    textAlign: "center",
    fontSize: typography.bodySmall,
    letterSpacing: 0.8},
  continueExploreWrap: {
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 0,
    paddingVertical: 2},
  continueExploreWrapPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.992 }]},
  continueExploreInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    alignSelf: "stretch",
    borderRadius: semanticRadius.full,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: isDark ? "rgba(232, 200, 90, 0.62)" : "rgba(138, 90, 18, 0.5)",
    backgroundColor: isDark ? "rgba(232, 200, 90, 0.08)" : "rgba(255, 251, 244, 1)"},
  continueExploreInnerHover: Platform.select({
    web: {
      backgroundColor: isDark ? "rgba(232, 200, 90, 0.14)" : "rgba(255, 244, 224, 1)"},
    default: {}}),
  continueExploreText: {
    fontSize: 12,
    fontFamily: fonts.extrabold,
    letterSpacing: 1.35,
    color: isDark ? ALCHEMY.gold : ALCHEMY.brown,
    textDecorationLine: "none"},
  checkoutProgress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: c.border,
    borderTopWidth: 2,
    borderTopColor: c.primaryBorder,
    backgroundColor: c.surface,
    gap: spacing.xs,
    ...shadowLift},
  progressStep: {
    flex: 1,
    alignItems: "center",
    gap: 6},
  progressTrackSeg: {
    width: "100%",
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: c.border,
    maxWidth: 72},
  progressTrackSegActive: {
    backgroundColor: c.primary},
  progressLabel: {
    fontSize: 10,
    fontFamily: fonts.semibold,
    color: c.textMuted,
    textAlign: "center"},
  progressLabelActive: {
    color: c.primaryDark,
    fontFamily: fonts.bold},
  trustStrip: {
    marginBottom: spacing.md,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surfaceMuted,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm},
  trustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs},
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6},
  trustText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: c.textSecondary},
  loginCard: {
    ...customerPanel(c, shadowPremium, isDark),
    padding: spacing.xl,
    alignItems: "center"},
  loginBrandLogo: {
    marginBottom: spacing.sm},
  loginIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: c.primarySoft,
    borderWidth: 1,
    borderColor: c.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md},
  cartHeroIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.primaryBorder,
    alignItems: "center",
    justifyContent: "center"},
  cartHero: {
    ...customerPanel(c, shadowPremium, isDark),
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md},
  cartHeroTextBlock: {
    flex: 1},
  cartHeroEyebrow: {
    fontSize: typography.overline,
    fontFamily: fonts.semibold,
    color: c.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4},
  cartHeroTitle: {
    color: c.primaryDark,
    fontSize: typography.h3,
    fontFamily: fonts.extrabold},
  cartHeroAccent: {
    width: 44,
    height: 3,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
    marginBottom: spacing.xs},
  cartHeroSubtitle: {
    marginTop: 0,
    color: c.textSecondary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold,
    lineHeight: 20},
  itemsSectionLabel: {
    fontSize: typography.overline,
    fontFamily: fonts.bold,
    color: c.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: spacing.sm},
  listSection: {
    marginBottom: spacing.md},
  listContent: {
    gap: spacing.sm},
  cartItemCard: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderTopWidth: 3,
    borderTopColor: c.primaryBorder,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadowPremium},
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    gap: spacing.sm},
  info: {
    flex: 1},
  name: {
    fontSize: typography.body,
    fontFamily: fonts.semibold,
    color: c.textPrimary},
  meta: {
    marginTop: 5,
    fontSize: 13,
    color: c.textSecondary},
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8},
  smallButton: {
    backgroundColor: c.primarySoft,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center"},
  smallButtonText: {
    color: c.primary,
    fontSize: 18,
    fontFamily: fonts.bold,
    marginTop: -1},
  quantityPill: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: c.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.surfaceMuted},
  quantityPillText: {
    color: c.textPrimary,
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall},
  emptyCard: {
    ...customerPanel(c, shadowPremium, isDark),
    marginBottom: spacing.md,
    padding: spacing.xl,
    alignItems: "center"},
  emptyBrandLogo: {
    marginBottom: spacing.xs},
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: c.primarySoft,
    borderWidth: 1,
    borderColor: c.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm},
  emptyTitle: {
    fontSize: typography.h3,
    fontFamily: FONT_DISPLAY,
    color: c.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3},
  emptyText: {
    marginTop: spacing.sm,
    textAlign: "center",
    color: c.textSecondary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.regular,
    lineHeight: 22,
    maxWidth: 320},
  browseHomeBtn: {
    marginTop: spacing.lg,
    gap: 8,
    backgroundColor: c.secondary,
    borderColor: c.secondary},
  browseHomeBtnText: {
    color: c.onSecondary,
    fontFamily: fonts.bold,
    fontSize: typography.body},
  footer: {
    ...customerPanel(c, shadowPremium, isDark),
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"},
  footerEyebrow: {
    fontSize: typography.overline,
    fontFamily: fonts.semibold,
    color: c.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2},
  summaryBox: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: c.primaryBorder,
    borderTopWidth: 2,
    borderTopColor: c.primary,
    borderRadius: radius.xxl,
    backgroundColor: c.primarySoft,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadowPremium},
  summaryBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: c.primaryBorder},
  summaryBoxTitle: {
    fontSize: typography.body,
    fontFamily: fonts.extrabold,
    color: c.primaryDark},
  summaryInner: {
    marginTop: spacing.sm,
    gap: spacing.xs},
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2},
  summaryLabel: {
    color: c.textSecondary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.regular},
  summaryValue: {
    color: c.textPrimary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold,
    fontVariant: ["tabular-nums"]},
  summaryDiscountValue: {
    color: c.success,
    fontSize: typography.bodySmall,
    fontFamily: fonts.bold,
    fontVariant: ["tabular-nums"]},
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
    opacity: 0.85},
  summaryRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs},
  summaryFinalLabel: {
    color: c.textPrimary,
    fontSize: typography.body,
    fontFamily: fonts.bold},
  summaryFinalValue: {
    color: c.primary,
    fontSize: typography.h3,
    fontFamily: fonts.extrabold,
    fontVariant: ["tabular-nums"]},
  addressProfileBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.secondaryBorder,
    backgroundColor: c.secondarySoft},
  addressProfileBannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.secondaryBorder,
    alignItems: "center",
    justifyContent: "center"},
  addressProfileBannerTextCol: {
    flex: 1,
    minWidth: 0},
  addressProfileBannerTitle: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.bold,
    color: c.textPrimary},
  addressProfileBannerSub: {
    marginTop: 4,
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: c.textSecondary,
    lineHeight: 18},
  addressProfileBannerCta: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.extrabold,
    color: c.secondaryDark},
  addressBox: {
    ...customerPanel(c, shadowPremium, isDark),
    marginBottom: spacing.md},
  couponBox: {
    ...customerPanel(c, shadowPremium, isDark),
    marginBottom: spacing.md},
  couponRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm},
  couponInputWrap: {
    flex: 1,
    minWidth: 0},
  bannerSpacer: {
    marginBottom: spacing.sm},
  addressFieldGap: {
    marginBottom: spacing.sm},
  halfField: {
    flex: 1,
    minWidth: 0},
  availableCouponsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.sm},
  availableCouponChip: {
    borderWidth: 1,
    borderColor: c.primaryBorder,
    borderRadius: radius.md,
    backgroundColor: c.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8},
  availableCouponCode: {
    color: c.primary,
    fontSize: typography.caption,
    fontFamily: fonts.extrabold},
  availableCouponMeta: {
    marginTop: 1,
    color: c.textSecondary,
    fontSize: typography.overline,
    fontFamily: fonts.semibold},
  noCouponText: {
    color: c.textMuted,
    fontSize: 11,
    marginBottom: spacing.sm},
  couponInput: {
    flex: 1,
    marginBottom: 0},
  applyCouponBtn: {
    backgroundColor: c.secondary,
    borderColor: c.secondaryBorder},
  applyCouponBtnText: {
    color: c.onSecondary,
    fontFamily: fonts.bold,
    fontSize: typography.caption},
  couponSuccessText: {
    marginTop: spacing.xs,
    color: c.success,
    fontSize: typography.caption,
    fontFamily: fonts.bold},
  savedAddressBtn: {
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: c.primarySoft,
    borderColor: c.primaryBorder,
    marginBottom: spacing.sm},
  savedAddressBtnText: {
    color: c.primary,
    fontSize: typography.caption,
    fontFamily: fonts.bold},
  input: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    marginBottom: spacing.sm,
    backgroundColor: c.surface,
    fontSize: typography.bodySmall,
    fontFamily: fonts.regular,
    color: c.textPrimary,
    minHeight: 44},
  addressRow: {
    flexDirection: "row",
    gap: spacing.sm},
  addressRowCompact: {
    flexDirection: "column",
    gap: 0},
  halfInput: {
    flex: 1},
  noteInput: {
    minHeight: 70,
    textAlignVertical: "top"},
  errorText: {
    color: c.danger,
    marginBottom: spacing.sm,
    fontFamily: fonts.semibold,
    fontSize: typography.caption},
  successText: {
    color: c.success,
    marginBottom: spacing.sm,
    fontFamily: fonts.semibold,
    fontSize: typography.caption},
  totalLabel: {
    fontSize: typography.body,
    color: c.textPrimary,
    fontFamily: fonts.bold},
  totalValue: {
    fontSize: typography.h1,
    color: c.primaryDark,
    fontFamily: FONT_DISPLAY,
    letterSpacing: -0.4},
  checkoutButton: {
    marginBottom: spacing.lg},
  checkoutButtonDisabled: {
    backgroundColor: c.textMuted},
  checkoutButtonText: {
    color: c.onPrimary,
    fontFamily: fonts.bold,
    fontSize: typography.body},
  checkoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8},
  loginPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl},
  loginPromptTitle: {
    fontSize: typography.h2,
    fontFamily: FONT_DISPLAY,
    color: c.textPrimary,
    textAlign: "center",
    letterSpacing: -0.35},
  loginPromptText: {
    marginTop: spacing.sm,
    textAlign: "center",
    color: c.textSecondary,
    fontSize: typography.body,
    fontFamily: fonts.regular,
    lineHeight: 22,
    marginBottom: spacing.lg},
  peNone: {
    pointerEvents: "none"}});
}

function RetryCartImage({ sourceUri, style, placeholderStyle, iconSize, c }) {
  const candidates = useMemo(() => getImageUriCandidates(sourceUri), [sourceUri]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sourceUri]);

  const currentUri = candidates[index] || "";
  if (!currentUri) {
    return (
      <View style={[style, placeholderStyle]}>
        <Ionicons name="image-outline" size={iconSize} color={c.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: currentUri }}
      style={style}
      contentFit="cover"
      transition={200}
      recyclingKey={currentUri}
      onError={() => setIndex((prev) => prev + 1)}
    />
  );
}

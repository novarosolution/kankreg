import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_GATE, ADMIN_SCREEN_COPY } from "../../content/adminContent";
import { KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, View } from "react-native";
import KankregScrollPage from "../../components/kankreg/KankregScrollPage";
import AdminScreenShell from "../../components/admin/AdminScreenShell";
import KankregAdminShell from "../../components/kankreg/KankregAdminShell";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createAdminCoupon, fetchAdminCoupons, updateAdminCoupon } from "../../services/adminService";
import { adminPanel } from "../../theme/adminLayout";
import SectionReveal from "../../components/motion/SectionReveal";
import { customerScrollFill } from "../../theme/screenLayout";
import { layout, radius, spacing } from "../../theme/tokens";
import PremiumLoader from "../../components/ui/PremiumLoader";
import PremiumEmptyState from "../../components/ui/PremiumEmptyState";
import PremiumErrorBanner from "../../components/ui/PremiumErrorBanner";
import PremiumInput from "../../components/ui/PremiumInput";
import PremiumButton from "../../components/ui/PremiumButton";
import PremiumCard from "../../components/ui/PremiumCard";
import PremiumChip from "../../components/ui/PremiumChip";
import { navigateCustomerRoute } from "../../navigation/customerNavigate";

export default function AdminCouponsScreen({ navigation, route }) {
  const { colors: c, shadowPremium } = useTheme();
  const styles = useMemo(() => createAdminCouponsStyles(c, shadowPremium), [c, shadowPremium]);
    const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    title: "",
    type: "percent",
    value: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
    isVisibleToUsers: true,
    isOneTimePerUser: false});

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchAdminCoupons(token);
      setCoupons(list);
    } catch (err) {
      setError(err.message || "Unable to load coupons.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    loadCoupons();
  }, [user, loadCoupons]);

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await createAdminCoupon(token, {
        ...form,
        code: String(form.code || "").trim().toUpperCase(),
        value: Number(form.value || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscountAmount: form.maxDiscountAmount === "" ? null : Number(form.maxDiscountAmount),
        usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null});
      setSuccess("Coupon created successfully.");
      setForm({
        code: "",
        title: "",
        type: "percent",
        value: "",
        minOrderAmount: "",
        maxDiscountAmount: "",
        usageLimit: "",
        expiresAt: "",
        isActive: true,
        isVisibleToUsers: true,
        isOneTimePerUser: false});
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to create coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      setError("");
      await updateAdminCoupon(token, coupon._id, { isActive: !coupon.isActive });
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to update coupon.");
    }
  };

  const handleToggleVisibility = async (coupon) => {
    try {
      setError("");
      await updateAdminCoupon(token, coupon._id, { isVisibleToUsers: !coupon.isVisibleToUsers });
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to update coupon visibility.");
    }
  };

  const handleToggleOneTime = async (coupon) => {
    try {
      setError("");
      await updateAdminCoupon(token, coupon._id, { isOneTimePerUser: !coupon.isOneTimePerUser });
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to update one-time coupon setting.");
    }
  };

  if (user && !user.isAdmin) {
    return (
      <AdminScreenShell style={styles.screen}>
        <KankregScrollPage
        scrollVariant="inner"
        showFooter={false}
          style={customerScrollFill}
          showsVerticalScrollIndicator={false}
        >
          <SectionReveal delay={40} preset="fade-up">
            <View style={styles.panel}>
              <PremiumErrorBanner
                severity="warning"
                title={ADMIN_GATE.title}
                message="Sign in with an admin account to manage coupons."
              />
              <PremiumButton
                label={ADMIN_GATE.backHome}
                variant="primary"
                onPress={() => navigateCustomerRoute(navigation, "Home")}
                style={styles.gateCta}
              />
            </View>
          </SectionReveal>
        </KankregScrollPage>
      </AdminScreenShell>
    );
  }

  return (
    <AdminScreenShell style={styles.screen}>
      <KeyboardAvoidingView style={customerScrollFill} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <KankregScrollPage
        scrollVariant="admin"
        showFooter={false}
        style={customerScrollFill}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <KankregAdminShell navigation={navigation} route={route} title={ADMIN_SCREEN_COPY.coupons.title} subtitle={ADMIN_SCREEN_COPY.coupons.subtitle}>
        <View style={styles.panel}>
          <SectionReveal preset="fade-up" delay={0}>
          {error ? (
            <View style={styles.bannerSpacer}>
              <PremiumErrorBanner severity="error" message={error} onClose={() => setError("")} compact />
            </View>
          ) : null}
          {success ? (
            <View style={styles.bannerSpacer}>
              <PremiumErrorBanner severity="success" message={success} onClose={() => setSuccess("")} compact />
            </View>
          ) : null}

          <PremiumCard padding="lg" style={styles.formCard}>
            <Text style={[styles.formTitle, { color: c.textPrimary }]}>Create Coupon</Text>
            <View style={styles.fieldGap}>
              <PremiumInput
                label="Coupon code"
                value={form.code}
                onChangeText={(value) => setForm((current) => ({ ...current, code: value }))}
                placeholder="e.g. SAVE20"
                autoCapitalize="characters"
                iconLeft="pricetag-outline"
              />
            </View>
            <View style={styles.fieldGap}>
              <PremiumInput
                label="Title (optional)"
                value={form.title}
                onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
                iconLeft="text-outline"
              />
            </View>
            <View style={styles.typeRow}>
              <PremiumChip
                label="Percent"
                tone="gold"
                size="md"
                selected={form.type === "percent"}
                onPress={() => setForm((current) => ({ ...current, type: "percent" }))}
                style={styles.typeChipFlex}
              />
              <PremiumChip
                label="Flat"
                tone="gold"
                size="md"
                selected={form.type === "flat"}
                onPress={() => setForm((current) => ({ ...current, type: "flat" }))}
                style={styles.typeChipFlex}
              />
            </View>
            <View style={styles.fieldGap}>
              <PremiumInput
                label={form.type === "percent" ? "Discount %" : "Flat discount amount"}
                value={form.value}
                onChangeText={(value) => setForm((current) => ({ ...current, value }))}
                placeholder={form.type === "percent" ? "e.g. 20" : "Amount"}
                keyboardType="decimal-pad"
                iconLeft="calculator-outline"
              />
            </View>
            <View style={styles.fieldGap}>
              <PremiumInput
                label="Minimum order amount (optional)"
                value={form.minOrderAmount}
                onChangeText={(value) => setForm((current) => ({ ...current, minOrderAmount: value }))}
                keyboardType="decimal-pad"
                iconLeft="cart-outline"
              />
            </View>
            <View style={styles.fieldGap}>
              <PremiumInput
                label="Max discount amount (optional)"
                value={form.maxDiscountAmount}
                onChangeText={(value) => setForm((current) => ({ ...current, maxDiscountAmount: value }))}
                keyboardType="decimal-pad"
                iconLeft="trending-down-outline"
              />
            </View>
            <View style={styles.fieldGap}>
              <PremiumInput
                label="Usage limit (optional)"
                value={form.usageLimit}
                onChangeText={(value) => setForm((current) => ({ ...current, usageLimit: value }))}
                keyboardType="number-pad"
                iconLeft="people-outline"
              />
            </View>
            <View style={styles.fieldGap}>
              <PremiumInput
                label="Expiry (YYYY-MM-DD, optional)"
                value={form.expiresAt}
                onChangeText={(value) => setForm((current) => ({ ...current, expiresAt: value }))}
                placeholder="2026-12-31"
                autoCapitalize="none"
                iconLeft="calendar-outline"
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: c.textPrimary }]}>Active</Text>
              <Switch
                value={Boolean(form.isActive)}
                onValueChange={(value) => setForm((current) => ({ ...current, isActive: value }))}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: c.textPrimary }]}>Show to users at checkout</Text>
              <Switch
                value={Boolean(form.isVisibleToUsers)}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, isVisibleToUsers: value }))
                }
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: c.textPrimary }]}>One time per user</Text>
              <Switch
                value={Boolean(form.isOneTimePerUser)}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, isOneTimePerUser: value }))
                }
              />
            </View>
            <PremiumButton
              label={submitting ? "Creating..." : "Create Coupon"}
              variant="primary"
              size="md"
              onPress={handleCreate}
              disabled={submitting}
              loading={submitting}
              fullWidth
              style={styles.createBtnMargin}
            />
          </PremiumCard>
          </SectionReveal>

          <SectionReveal preset="fade-up" delay={60}>
          <Text style={[styles.listTitle, { color: c.textPrimary }]}>All Coupons</Text>
          {loading ? (
            <PremiumLoader size="sm" caption="Loading coupons…" />
          ) : coupons.length === 0 ? (
            <PremiumEmptyState
              iconName="pricetag-outline"
              title="No coupons yet"
              description="Create a coupon above to offer discounts at checkout."
              compact
            />
          ) : (
            coupons.map((coupon) => (
              <PremiumCard key={coupon._id} padding="md" style={styles.couponCard}>
                <View style={styles.couponTopRow}>
                  <Text style={[styles.couponCode, { color: c.textPrimary }]}>{coupon.code}</Text>
                  <PremiumChip
                    label={coupon.isActive ? "Active" : "Inactive"}
                    tone={coupon.isActive ? "green" : "neutral"}
                    size="xs"
                  />
                </View>
                <Text style={[styles.couponMeta, { color: c.textSecondary }]}>
                  {coupon.type === "percent" ? `${coupon.value}% off` : `${coupon.value} off`} • Min order: {coupon.minOrderAmount || 0}
                </Text>
                <Text style={[styles.couponMeta, { color: c.textSecondary }]}>
                  Used: {coupon.usedCount || 0}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                </Text>
                <Text style={[styles.couponMeta, { color: c.textSecondary }]}>
                  User visibility: {coupon.isVisibleToUsers ? "Shown" : "Hidden"} •
                  One-time per user: {coupon.isOneTimePerUser ? "Yes" : "No"}
                </Text>
                <Text style={[styles.couponMeta, { color: c.textSecondary }]}>
                  Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "No expiry"}
                </Text>
                <View style={styles.rowSwitches}>
                  <View style={styles.switchRow}>
                    <Text style={[styles.switchLabel, { color: c.textSecondary }]}>Active</Text>
                    <Switch
                      value={Boolean(coupon.isActive)}
                      onValueChange={() => handleToggleActive(coupon)}
                    />
                  </View>
                  <View style={styles.switchRow}>
                    <Text style={[styles.switchLabel, { color: c.textSecondary }]}>Visible</Text>
                    <Switch
                      value={Boolean(coupon.isVisibleToUsers)}
                      onValueChange={() => handleToggleVisibility(coupon)}
                    />
                  </View>
                  <View style={styles.switchRow}>
                    <Text style={[styles.switchLabel, { color: c.textSecondary }]}>One-Time</Text>
                    <Switch
                      value={Boolean(coupon.isOneTimePerUser)}
                      onValueChange={() => handleToggleOneTime(coupon)}
                    />
                  </View>
                </View>
              </PremiumCard>
            ))
          )}
          </SectionReveal>
        </View>
        </KankregAdminShell>
</KankregScrollPage>
      </KeyboardAvoidingView>
    </AdminScreenShell>
  );
}

function createAdminCouponsStyles(c, shadowPremium) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      width: "100%",
      alignSelf: "center",
      maxWidth: Platform.select({ web: layout.maxContentWidth + 72, default: "100%" })},
    panel: {
      ...adminPanel(c, shadowPremium)},
    gateCta: {
      marginTop: spacing.md,
      alignSelf: "flex-start"},
    formCard: {
      marginBottom: spacing.md},
    formTitle: {
      color: c.textPrimary,
      fontWeight: "800",
      fontSize: 14,
      marginBottom: spacing.sm},
    bannerSpacer: {
      marginBottom: spacing.sm},
    fieldGap: {
      marginBottom: spacing.sm},
    typeRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.sm},
    typeChipFlex: {
      flex: 1},
    createBtnMargin: {
      marginTop: spacing.sm},
    toggleRow: {
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.md,
      backgroundColor: c.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: 7,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"},
    toggleLabel: {
      color: c.textPrimary,
      fontSize: 12,
      fontWeight: "700"},
    listTitle: {
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      fontSize: 16,
      fontWeight: "800"},
    couponCard: {
      marginBottom: spacing.sm},
    couponTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm},
    couponCode: {
      fontSize: 14,
      fontWeight: "800"},
    couponMeta: {
      marginTop: 4,
      fontSize: 12},
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6},
    rowSwitches: {
      marginTop: spacing.xs,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm},
    switchLabel: {
      fontSize: 12,
      fontWeight: "600"}});
}

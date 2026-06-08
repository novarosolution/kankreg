import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_GATE, ADMIN_SCREEN_COPY } from "../../content/adminContent";
import { KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, View } from "react-native";
import KankregScrollPage from "../../components/kankreg/KankregScrollPage";
import AdminScreenShell from "../../components/admin/AdminScreenShell";
import KankregAdminShell from "../../components/kankreg/KankregAdminShell";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  createAdminReward,
  fetchAdminRewards,
  updateAdminReward} from "../../services/adminService";
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

export default function AdminRewardsScreen({ navigation, route }) {
  const { colors: c, shadowPremium } = useTheme();
  const styles = useMemo(() => createStyles(c, shadowPremium), [c, shadowPremium]);
    const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rewards, setRewards] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pointsCost: "",
    discountType: "percent",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    totalRedemptionLimit: "",
    perUserLimit: "1",
    issuedCouponValidDays: "90",
    expiresAt: "",
    isActive: true,
    isVisibleToUsers: true});

  const loadRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchAdminRewards(token);
      setRewards(list);
    } catch (err) {
      setError(err.message || "Unable to load rewards.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    loadRewards();
  }, [user, loadRewards]);

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await createAdminReward(token, {
        title: form.title,
        description: form.description,
        pointsCost: Number(form.pointsCost || 0),
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscountAmount: form.maxDiscountAmount === "" ? null : Number(form.maxDiscountAmount),
        totalRedemptionLimit: form.totalRedemptionLimit === "" ? null : Number(form.totalRedemptionLimit),
        perUserLimit: Number(form.perUserLimit || 1),
        issuedCouponValidDays: Number(form.issuedCouponValidDays || 90),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        isActive: form.isActive,
        isVisibleToUsers: form.isVisibleToUsers});
      setSuccess("Reward created. Customers can redeem it for points in the Rewards screen.");
      setForm({
        title: "",
        description: "",
        pointsCost: "",
        discountType: "percent",
        discountValue: "",
        minOrderAmount: "",
        maxDiscountAmount: "",
        totalRedemptionLimit: "",
        perUserLimit: "1",
        issuedCouponValidDays: "90",
        expiresAt: "",
        isActive: true,
        isVisibleToUsers: true});
      await loadRewards();
    } catch (err) {
      setError(err.message || "Unable to create reward.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (reward) => {
    try {
      setError("");
      await updateAdminReward(token, reward._id, { isActive: !reward.isActive });
      await loadRewards();
    } catch (err) {
      setError(err.message || "Unable to update reward.");
    }
  };

  const handleToggleVisibility = async (reward) => {
    try {
      setError("");
      await updateAdminReward(token, reward._id, { isVisibleToUsers: !reward.isVisibleToUsers });
      await loadRewards();
    } catch (err) {
      setError(err.message || "Unable to update visibility.");
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
                message="Sign in with an admin account to manage rewards."
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
          <KankregAdminShell navigation={navigation} route={route} title={ADMIN_SCREEN_COPY.rewards.title} subtitle={ADMIN_SCREEN_COPY.rewards.subtitle}>
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
                <Text style={[styles.formTitle, { color: c.textPrimary }]}>Create reward</Text>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Title"
                    value={form.title}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, title: value }))}
                    iconLeft="gift-outline"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Description"
                    value={form.description}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, description: value }))}
                    multiline
                    numberOfLines={3}
                    iconLeft="document-text-outline"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Points cost"
                    value={form.pointsCost}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, pointsCost: value }))}
                    keyboardType="number-pad"
                    iconLeft="star-outline"
                  />
                </View>
                <View style={styles.typeRow}>
                  <PremiumChip
                    label="Percent off"
                    tone="gold"
                    size="md"
                    selected={form.discountType === "percent"}
                    onPress={() => setForm((cur) => ({ ...cur, discountType: "percent" }))}
                    style={styles.typeChipFlex}
                  />
                  <PremiumChip
                    label="Flat ₹ off"
                    tone="gold"
                    size="md"
                    selected={form.discountType === "flat"}
                    onPress={() => setForm((cur) => ({ ...cur, discountType: "flat" }))}
                    style={styles.typeChipFlex}
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label={form.discountType === "percent" ? "Discount %" : "Discount amount (₹)"}
                    value={form.discountValue}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, discountValue: value }))}
                    keyboardType="decimal-pad"
                    iconLeft="pricetag-outline"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Minimum order amount"
                    value={form.minOrderAmount}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, minOrderAmount: value }))}
                    keyboardType="decimal-pad"
                    iconLeft="cart-outline"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Max discount (optional, for %)"
                    value={form.maxDiscountAmount}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, maxDiscountAmount: value }))}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Global redemption cap (optional)"
                    value={form.totalRedemptionLimit}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, totalRedemptionLimit: value }))}
                    keyboardType="number-pad"
                    helperText="Leave blank for unlimited total redeems"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Max redeems per customer"
                    value={form.perUserLimit}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, perUserLimit: value }))}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Issued coupon valid (days)"
                    value={form.issuedCouponValidDays}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, issuedCouponValidDays: value }))}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.fieldGap}>
                  <PremiumInput
                    label="Reward visible until (YYYY-MM-DD, optional)"
                    value={form.expiresAt}
                    onChangeText={(value) => setForm((cur) => ({ ...cur, expiresAt: value }))}
                    autoCapitalize="none"
                    iconLeft="calendar-outline"
                  />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={[styles.toggleLabel, { color: c.textPrimary }]}>Active</Text>
                  <Switch
                    value={Boolean(form.isActive)}
                    onValueChange={(value) => setForm((cur) => ({ ...cur, isActive: value }))}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={[styles.toggleLabel, { color: c.textPrimary }]}>Show in customer Rewards shop</Text>
                  <Switch
                    value={Boolean(form.isVisibleToUsers)}
                    onValueChange={(value) => setForm((cur) => ({ ...cur, isVisibleToUsers: value }))}
                  />
                </View>
                <PremiumButton
                  label={submitting ? "Creating…" : "Create reward"}
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
              <Text style={[styles.listTitle, { color: c.textPrimary }]}>All rewards</Text>
              {loading ? (
                <PremiumLoader size="sm" caption="Loading rewards…" />
              ) : rewards.length === 0 ? (
                <PremiumEmptyState
                  iconName="gift-outline"
                  title="No rewards yet"
                  description="Create catalog items customers can redeem with loyalty points."
                  compact
                />
              ) : (
                rewards.map((reward) => (
                  <PremiumCard key={reward._id} padding="md" style={styles.card}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.cardTitle, { color: c.textPrimary }]}>{reward.title}</Text>
                      <PremiumChip
                        label={reward.isActive ? "Active" : "Inactive"}
                        tone={reward.isActive ? "green" : "neutral"}
                        size="xs"
                      />
                    </View>
                    <Text style={[styles.meta, { color: c.textSecondary }]}>
                      {reward.pointsCost} pts •{" "}
                      {reward.discountType === "percent"
                        ? `${reward.discountValue}% off`
                        : `₹${reward.discountValue} off`}
                      {" • "}Min order ₹{reward.minOrderAmount || 0}
                    </Text>
                    <Text style={[styles.meta, { color: c.textSecondary }]}>
                      Redeemed: {reward.redemptionCount || 0}
                      {reward.totalRedemptionLimit != null ? ` / ${reward.totalRedemptionLimit}` : ""} • Per user:{" "}
                      {reward.perUserLimit || 1}
                    </Text>
                    <Text style={[styles.meta, { color: c.textSecondary }]}>
                      Shop visibility: {reward.isVisibleToUsers ? "Shown" : "Hidden"} • Coupon validity:{" "}
                      {reward.issuedCouponValidDays || 90} days after redeem
                    </Text>
                    <Text style={[styles.meta, { color: c.textSecondary }]}>
                      Offer ends:{" "}
                      {reward.expiresAt ? new Date(reward.expiresAt).toLocaleDateString() : "No end date"}
                    </Text>
                    <View style={styles.rowSwitches}>
                      <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: c.textSecondary }]}>Active</Text>
                        <Switch value={Boolean(reward.isActive)} onValueChange={() => handleToggleActive(reward)} />
                      </View>
                      <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: c.textSecondary }]}>Visible</Text>
                        <Switch
                          value={Boolean(reward.isVisibleToUsers)}
                          onValueChange={() => handleToggleVisibility(reward)}
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

function createStyles(c, shadowPremium) {
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
      fontSize: 12,
      fontWeight: "700"},
    listTitle: {
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      fontSize: 16,
      fontWeight: "800"},
    card: {
      marginBottom: spacing.sm},
    cardTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm},
    cardTitle: {
      fontSize: 14,
      fontWeight: "800",
      flex: 1},
    meta: {
      marginTop: 4,
      fontSize: 12},
    rowSwitches: {
      marginTop: spacing.xs,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md},
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6},
    switchLabel: {
      fontSize: 12,
      fontWeight: "600"}});
}

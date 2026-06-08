import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_GATE } from "../../content/adminContent";
import { Platform, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import KankregScrollPage from "../../components/kankreg/KankregScrollPage";
import AdminScreenShell from "../../components/admin/AdminScreenShell";
import KankregAdminShell from "../../components/kankreg/KankregAdminShell";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { deleteAdminProduct, fetchAdminProducts } from "../../services/adminService";
import { adminGatePanel, adminShellContent, adminToolbarPrimary, adminToolbarRow, useAdminCompactLayout } from "../../theme/adminLayout";
import AdminPanel from "../../components/admin/AdminPanel";
import AdminKpiCard, { AdminKpiGrid } from "../../components/admin/AdminKpiCard";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminProductCell from "../../components/admin/AdminProductCell";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import { customerScrollFill } from "../../theme/screenLayout";
import { layout, radius, spacing, typography } from "../../theme/tokens";
import { formatINR } from "../../utils/currency";
import PremiumInput from "../../components/ui/PremiumInput";
import PremiumErrorBanner from "../../components/ui/PremiumErrorBanner";
import PremiumEmptyState from "../../components/ui/PremiumEmptyState";
import PremiumButton from "../../components/ui/PremiumButton";
import PremiumCard from "../../components/ui/PremiumCard";
import PremiumChip from "../../components/ui/PremiumChip";
import SectionReveal from "../../components/motion/SectionReveal";
import SkeletonBlock from "../../components/ui/SkeletonBlock";
import { navigateCustomerRoute } from "../../navigation/customerNavigate";

const LOW_STOCK_MAX = 5;

function productStockChip(p) {
  const q = Math.max(0, Number(p.stockQty) || 0);
  if (p.inStock === false || q < 1) {
    return { label: "Out", tone: "red" };
  }
  if (q <= LOW_STOCK_MAX) {
    return { label: "Low", tone: "gold" };
  }
  return { label: "In stock", tone: "green" };
}

function catalogSummary(products) {
  let inStock = 0;
  let low = 0;
  let out = 0;
  for (const p of products) {
    const chip = productStockChip(p);
    if (chip.tone === "red") out += 1;
    else if (chip.tone === "gold") low += 1;
    else inStock += 1;
  }
  return { total: products.length, inStock, low, out };
}

function coverUri(p) {
  const imgs = Array.isArray(p.images) ? p.images : [];
  const first = imgs.find((u) => String(u || "").trim());
  if (first) return String(first).trim();
  if (p.image && String(p.image).trim()) return String(p.image).trim();
  return "";
}

export default function AdminProductsScreen({ navigation, route }) {
  const { colors: c, shadowPremium } = useTheme();
  const compact = useAdminCompactLayout();
  const styles = useMemo(() => createAdminProductsStyles(c, shadowPremium), [c, shadowPremium]);
    const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [renderCount, setRenderCount] = useState(40);

  const loadProducts = useCallback(async () => {
    try {
      setError("");
      const response = await fetchAdminProducts(token);
      setProducts(response);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setBootLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProducts();
    } finally {
      setRefreshing(false);
    }
  }, [loadProducts]);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!user.isAdmin) return;
    loadProducts();
  }, [user, loadProducts]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const searchText = search.toLowerCase();
    return products.filter((item) =>
      [item.name, item.category, item.homeSection, item.productType, item.showOnHome ? "show" : "hide"]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(searchText))
    );
  }, [products, search]);

  const stats = useMemo(() => catalogSummary(products), [products]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, renderCount),
    [filteredProducts, renderCount]
  );

  useEffect(() => {
    setRenderCount(40);
  }, [search]);

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
            <View style={styles.gatePanel}>
              <PremiumErrorBanner
                severity="warning"
                title={ADMIN_GATE.title}
                message={ADMIN_GATE.message}
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

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteAdminProduct(token, id);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    }
  };

  return (
    <AdminScreenShell style={styles.screen}>
      <KankregScrollPage
        scrollVariant="admin"
        showFooter={false}
        style={customerScrollFill}
        showsVerticalScrollIndicator={false}
        refreshControl={
          Platform.OS === "web" ? undefined : (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} colors={[c.primary]} />
          )
        }
      >
        <KankregAdminShell
          navigation={navigation}
          route={route}
          title="Products"
          subtitle={`${stats.total} products · ${stats.low} low stock`}
          headerRight={
            <PremiumButton
              label="+ Add product"
              variant="primary"
              size="sm"
              iconLeft="add"
              onPress={() => navigation.navigate("AdminAddProduct")}
            />
          }
        >
        <View style={styles.panel}>
          {error ? (
            <View style={styles.bannerSpacer}>
              <PremiumErrorBanner severity="error" message={error} onClose={() => setError("")} compact />
            </View>
          ) : null}

          <SectionReveal preset="fade-up" delay={0}>
            <AdminKpiGrid compact={compact}>
              <AdminKpiCard label="Total SKUs" value={String(stats.total)} />
              <AdminKpiCard label="Healthy" value={String(stats.inStock)} />
              <AdminKpiCard label="Low stock" value={String(stats.low)} deltaUp={false} />
              <AdminKpiCard label="Out" value={String(stats.out)} deltaUp={false} />
            </AdminKpiGrid>
          </SectionReveal>

          <View style={styles.actionsRow}>
            <View style={styles.searchInputWrap}>
              <PremiumInput
                label="Search catalog"
                value={search}
                onChangeText={setSearch}
                iconLeft="search-outline"
                iconRight={search ? "close-circle" : undefined}
                onIconRightPress={search ? () => setSearch("") : undefined}
                autoCapitalize="none"
              />
            </View>
            <PremiumButton label="Refresh" variant="secondary" size="md" onPress={loadProducts} />
          </View>

          <View style={styles.ctaRow}>
            <PremiumButton
              label="Inventory & stock"
              variant="secondary"
              iconLeft="layers-outline"
              onPress={() => navigation.navigate("AdminInventory")}
              style={styles.ctaFlex}
            />
            <PremiumButton
              label="Add product"
              variant="primary"
              iconLeft="add"
              onPress={() => navigation.navigate("AdminAddProduct")}
              style={styles.ctaFlex}
            />
          </View>

          <View style={styles.listContent}>
            {bootLoading ? (
              [0, 1, 2].map((i) => (
                <SkeletonBlock key={i} width="100%" height={96} rounded="lg" style={styles.productCard} />
              ))
            ) : null}
            {!bootLoading && filteredProducts.length > 0 && !compact ? (
              <AdminPanel noPadding style={styles.tablePanel}>
                <AdminDataTable
                  compact={false}
                  rows={visibleProducts}
                  keyExtractor={(row) => row._id}
                  onRowPress={(row) => navigation.navigate("AdminAddProduct", { product: row })}
                  columns={[
                    {
                      key: "name",
                      label: "Product",
                      flex: 1.6,
                      render: (row) => (
                        <AdminProductCell name={row.name} imageUri={coverUri(row)} />
                      ),
                    },
                    { key: "category", label: "Category", flex: 1, render: (row) => row.category || "—" },
                    {
                      key: "price",
                      label: "Price",
                      flex: 0.8,
                      strong: true,
                      render: (row) => formatINR(row.price),
                    },
                    {
                      key: "stock",
                      label: "Stock",
                      flex: 0.7,
                      render: (row) => `${Math.max(0, Number(row.stockQty) || 0)} units`,
                    },
                    {
                      key: "status",
                      label: "Status",
                      flex: 0.8,
                      render: (row) => {
                        const chip = productStockChip(row);
                        const tone = chip.tone === "green" ? "ok" : chip.tone === "red" ? "low" : "pend";
                        const label = chip.tone === "green" ? "Active" : chip.label;
                        return <AdminStatusPill label={label} tone={tone} />;
                      },
                    },
                    {
                      key: "edit",
                      label: "",
                      width: 56,
                      align: "right",
                      render: () => (
                        <Text style={styles.editLink}>Edit</Text>
                      ),
                    },
                  ]}
                />
              </AdminPanel>
            ) : null}
            {!bootLoading && filteredProducts.length === 0 ? (
              <PremiumEmptyState
                iconName="cube-outline"
                title={search.trim() ? "No matching products" : "No products in catalog"}
                description={search.trim() ? "Try another search term." : "Add a product to get started."}
                ctaLabel={search.trim() ? undefined : "Add product"}
                ctaIconLeft="add-outline"
                onCtaPress={search.trim() ? undefined : () => navigation.navigate("AdminAddProduct")}
                compact
              />
            ) : null}
            {!bootLoading && compact
              ? visibleProducts.map((item, idx) => {
              const chip = productStockChip(item);
              const uri = coverUri(item);
              const photoCount = (item.images || []).length || (item.image ? 1 : 0);
              return (
                <SectionReveal key={item._id} preset="fade-up" delay={Math.min(idx * 24, 120)}>
                  <PremiumCard padding="md" variant="elevated" style={styles.productCard}>
                    <View style={styles.cardTop}>
                      {uri ? (
                        <Image source={{ uri }} style={styles.thumb} contentFit="cover" transition={120} />
                      ) : (
                        <View style={[styles.thumb, styles.thumbPlaceholder, { borderColor: c.border }]}>
                          <Text style={[styles.thumbGlyph, { color: c.textMuted }]}>∷</Text>
                        </View>
                      )}
                      <View style={styles.cardHead}>
                        <View style={styles.cardTitleRow}>
                          <Text style={[styles.cardTitle, { color: c.textPrimary }]} numberOfLines={2}>
                            {item.name}
                          </Text>
                          <PremiumChip label={chip.label} tone={chip.tone} size="sm" />
                        </View>
                        <Text style={[styles.cardPrice, { color: c.primary }]}>{formatINR(item.price)}</Text>
                      </View>
                    </View>

                    <View style={styles.metaGrid}>
                      <Text style={[styles.metaCell, { color: c.textSecondary }]} numberOfLines={1}>
                        Section · {item.homeSection || "—"}
                      </Text>
                      <Text style={[styles.metaCell, { color: c.textSecondary }]} numberOfLines={1}>
                        Type · {item.productType || item.category || "—"}
                      </Text>
                      <Text style={[styles.metaCell, { color: c.textSecondary }]} numberOfLines={1}>
                        Home · {item.showOnHome === false ? "Hidden" : "Visible"}
                      </Text>
                      <Text style={[styles.metaCell, { color: c.textSecondary }]} numberOfLines={1}>
                        Sort · {Number.isFinite(Number(item.homeOrder)) ? Number(item.homeOrder) : 0}
                      </Text>
                      <Text style={[styles.metaCell, { color: c.textSecondary }]} numberOfLines={1}>
                        Qty · {Math.max(0, Number(item.stockQty) || 0)}
                      </Text>
                      <Text style={[styles.metaCell, { color: c.textSecondary }]} numberOfLines={1}>
                        Photos · {photoCount}
                      </Text>
                    </View>
                    {item.brand || item.sku ? (
                      <Text style={[styles.brandSku, { color: c.textMuted }]} numberOfLines={1}>
                        {[item.brand, item.sku].filter(Boolean).join(" · ")}
                      </Text>
                    ) : null}

                    <View style={styles.cardActions}>
                      <PremiumButton
                        label="Edit"
                        variant="ghost"
                        size="sm"
                        onPress={() => navigation.navigate("AdminAddProduct", { product: item })}
                      />
                      <PremiumButton label="Delete" variant="danger" size="sm" onPress={() => handleDelete(item._id)} />
                    </View>
                  </PremiumCard>
                </SectionReveal>
              );
            })
              : null}
            {!bootLoading && visibleProducts.length < filteredProducts.length ? (
              <PremiumButton
                label={`Load more (${filteredProducts.length - visibleProducts.length} remaining)`}
                variant="subtle"
                size="md"
                onPress={() => setRenderCount((prev) => prev + 40)}
                fullWidth
              />
            ) : null}
          </View>
        </View>
        </KankregAdminShell>
</KankregScrollPage>
    </AdminScreenShell>
  );
}

function createAdminProductsStyles(c, shadowPremium) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      width: "100%",
      alignSelf: "center",
      maxWidth: Platform.select({ web: layout.maxContentWidth + 72, default: "100%" })},
    panel: adminShellContent(),
    gatePanel: adminGatePanel(c, shadowPremium),
    gateCta: {
      marginTop: spacing.md,
      alignSelf: "flex-start"},
    bannerSpacer: {
      marginBottom: spacing.sm},
    summaryCard: {
      marginBottom: spacing.md},
    summaryEyebrow: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: spacing.sm},
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md},
    summaryCell: {
      flexGrow: 1,
      flexBasis: "40%",
      minWidth: 120},
    summaryValue: {
      fontSize: typography.h3,
      fontWeight: "800"},
    summaryLabel: {
      marginTop: 2,
      fontSize: typography.caption},
    actionsRow: {
      ...adminToolbarRow,
      marginBottom: spacing.sm},
    searchInputWrap: {
      ...adminToolbarPrimary},
    ctaRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
    ctaFlex: { flex: 1, minWidth: 140 },
    listContent: {
      gap: spacing.sm,
      paddingBottom: spacing.xl},
    tablePanel: {
      marginBottom: spacing.md,
      paddingHorizontal: 0,
      paddingBottom: 4,
    },
    editLink: {
      color: "#8a5f22",
      fontWeight: "600",
      fontSize: 12.5,
    },
    productCard: {
      width: "100%",
      ...Platform.select({
        web: shadowPremium,
        default: {}})},
    cardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm},
    thumb: {
      width: 56,
      height: 56,
      borderRadius: radius.md,
      backgroundColor: c.surfaceMuted},
    thumbPlaceholder: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth},
    thumbGlyph: {
      fontSize: 20},
    cardHead: {
      flex: 1,
      minWidth: 0},
    cardTitleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.sm},
    cardTitle: {
      fontWeight: "800",
      flex: 1,
      minWidth: 0,
      fontSize: typography.body},
    cardPrice: {
      marginTop: spacing.xs,
      fontSize: typography.bodySmall,
      fontWeight: "800"},
    metaGrid: {
      marginTop: spacing.sm,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm},
    metaCell: {
      flexGrow: 1,
      flexBasis: "45%",
      minWidth: 128,
      fontSize: 12},
    brandSku: {
      marginTop: spacing.xs,
      fontSize: typography.caption},
    cardActions: {
      marginTop: spacing.sm,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      alignItems: "center"}});
}

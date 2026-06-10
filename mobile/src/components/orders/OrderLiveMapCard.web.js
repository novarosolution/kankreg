import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import L from "leaflet";
import "../../styles/leafletWeb.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { useTheme } from "../../context/ThemeContext";
import { ORDER_LIVE_TRACKING } from "../../content/appContent";
import { fetchOrderDrivingRoute } from "../../services/userService";
import useOrderLiveLocation from "../../hooks/useOrderLiveLocation";
import { decodeGooglePolyline } from "../../utils/polylineRoute";
import { formatLiveLocationUpdatedLine } from "../../utils/formatLiveLocationUpdated";
import { fonts, icon, radius, semanticRadius, spacing, typography } from "../../theme/tokens";
import PremiumCard from "../ui/PremiumCard";
import PremiumButton from "../ui/PremiumButton";
import PremiumSectionHeader from "../ui/PremiumSectionHeader";
import { collectOrderMapPoints, computeMapRegionFromPoints } from "../../utils/orderMapBounds";
import { openMapsDirections, STALE_MS } from "./orderLiveMapShared";

function hasDestinationSummary(dest) {
  if (!dest || typeof dest !== "object") return false;
  return Boolean(
    String(dest.fullName || "").trim() ||
      String(dest.line1 || "").trim() ||
      String(dest.city || "").trim() ||
      String(dest.phone || "").trim()
  );
}

function formatDestinationSubtitle(dest) {
  if (!dest || typeof dest !== "object") return "";
  const cityState = [dest.city, dest.state].filter((x) => String(x || "").trim()).join(", ");
  const parts = [String(dest.line1 || "").trim(), cityState, String(dest.postalCode || "").trim()].filter(
    Boolean
  );
  return parts.join(" · ");
}

const leafletChromeStyles = StyleSheet.create({
  leafletWrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: "hidden",
    borderRadius: semanticRadius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 2,
  },
  osmAttrib: {
    fontSize: 10,
    color: "#6E6254",
    marginTop: 6,
    paddingHorizontal: spacing.xs,
  },
  googleAttrib: {
    fontSize: 10,
    color: "#6E6254",
    marginTop: 4,
    paddingHorizontal: spacing.xs,
  },
});

function MapViewSync({ mapPoints }) {
  const map = useMap();
  useEffect(() => {
    if (!mapPoints?.length) return;
    if (mapPoints.length === 1) {
      const p = mapPoints[0];
      map.setView([p.latitude, p.longitude], 14, { animate: false });
      return;
    }
    const bounds = L.latLngBounds(mapPoints.map((p) => L.latLng(p.latitude, p.longitude)));
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
  }, [map, mapPoints]);
  return null;
}

function LiveLeafletMap({
  plat,
  plng,
  slat,
  slng,
  dlat,
  dlng,
  hasPartner,
  hasShop,
  hasDest,
  partnerLabel,
  shopLabel,
  isDark,
  routeColor,
  routePositions,
  mapPoints,
}) {
  const center = useMemo(() => {
    const region = computeMapRegionFromPoints(mapPoints);
    return [region.latitude, region.longitude];
  }, [mapPoints]);

  const partnerBikeIcon = useMemo(() => {
    const bg = isDark ? "rgba(28,25,23,0.96)" : "#FFFCF8";
    const border = isDark ? "#E8C85A" : "#C9A227";
    const shadow = isDark ? "0 4px 14px rgba(0,0,0,0.38)" : "0 3px 10px rgba(61,42,18,0.14)";
    const html = `<div style="width:42px;height:42px;border-radius:21px;background:${bg};border:2px solid ${border};box-shadow:${shadow};display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;">🚴</div>`;
    return L.divIcon({
      className: "order-live-map-partner-bike",
      html,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });
  }, [isDark]);

  const destIcon = useMemo(
    () =>
      L.divIcon({
        className: "order-live-map-dest-icon",
        html: `<div style="width:30px;height:30px;border-radius:50%;background:#16a34a;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.22);font-size:14px;line-height:1;">🏠</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),
    []
  );

  const shopIcon = useMemo(() => {
    const border = isDark ? "#E8C85A" : "#C9A227";
    const bg = isDark ? "rgba(28,25,23,0.96)" : "#FFFCF8";
    return L.divIcon({
      className: "order-live-map-shop-icon",
      html: `<div style="width:34px;height:34px;border-radius:17px;background:${bg};border:2px solid ${border};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.18);font-size:15px;line-height:1;">🏪</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });
  }, [isDark]);

  const tile = isDark
    ? {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    : {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };

  return (
    <View
      style={[
        leafletChromeStyles.leafletWrap,
        {
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(116, 79, 28, 0.15)",
          borderTopColor: isDark ? "rgba(232, 200, 90, 0.42)" : "rgba(201, 162, 39, 0.45)",
        },
      ]}
    >
      <MapContainer
        key={isDark ? "dark" : "light"}
        center={center}
        zoom={hasPartner && hasDest ? 12 : 14}
        style={{ height: 256, width: "100%", borderRadius: semanticRadius.card }}
        scrollWheelZoom={false}
        attributionControl
      >
        <TileLayer attribution={tile.attribution} url={tile.url} />
        <MapViewSync mapPoints={mapPoints} />
        {hasPartner && hasDest ? (
          <Polyline
            positions={
              routePositions && routePositions.length >= 2
                ? routePositions
                : [
                    [plat, plng],
                    [dlat, dlng],
                  ]
            }
            pathOptions={{ color: routeColor, weight: 3, opacity: 0.88 }}
          />
        ) : null}
        {hasShop ? (
          <Marker position={[slat, slng]} icon={shopIcon}>
            <Popup>{shopLabel}</Popup>
          </Marker>
        ) : null}
        {hasPartner ? (
          <Marker position={[plat, plng]} icon={partnerBikeIcon}>
            <Popup>{partnerLabel}</Popup>
          </Marker>
        ) : null}
        {hasDest ? (
          <Marker position={[dlat, dlng]} icon={destIcon}>
            <Popup>{ORDER_LIVE_TRACKING.markerDestination}</Popup>
          </Marker>
        ) : null}
      </MapContainer>
      <Text style={leafletChromeStyles.osmAttrib} accessibilityRole="text">
        {isDark ? ORDER_LIVE_TRACKING.osmAttribDark : ORDER_LIVE_TRACKING.osmAttrib}
      </Text>
      {routePositions && routePositions.length > 2 ? (
        <Text style={leafletChromeStyles.googleAttrib} accessibilityRole="text">
          {ORDER_LIVE_TRACKING.googleRouteAttrib}
        </Text>
      ) : null}
    </View>
  );
}

/** Web: Leaflet + OSM / Carto dark (no react-native-maps). */
export default function OrderLiveMapCard({ orderId }) {
  const { colors: c, isDark } = useTheme();
  const { data, error, loading } = useOrderLiveLocation(orderId);
  const [routeCoords, setRouteCoords] = useState(null);
  const lastDrivingFetchRef = useRef(0);

  const cardStyles = useMemo(() => createWebStyles(c, isDark), [c, isDark]);

  const partnerLabel = data?.partner?.name?.trim() || ORDER_LIVE_TRACKING.partnerFallback;
  const trackable = Boolean(data?.trackable);
  const plat = Number(data?.latitude);
  const plng = Number(data?.longitude);
  const shop = data?.shop && typeof data.shop === "object" ? data.shop : {};
  const shopLabel = String(shop.name || "").trim() || ORDER_LIVE_TRACKING.markerShop;
  const slat = Number(shop.latitude);
  const slng = Number(shop.longitude);
  const hasShop = Number.isFinite(slat) && Number.isFinite(slng);

  const dest = data?.destination && typeof data.destination === "object" ? data.destination : {};
  const dlat = Number(dest.latitude);
  const dlng = Number(dest.longitude);
  const hasDest = Number.isFinite(dlat) && Number.isFinite(dlng);
  const hasPartner = Number.isFinite(plat) && Number.isFinite(plng);

  const mapPoints = collectOrderMapPoints({
    shop: hasShop ? { latitude: slat, longitude: slng } : null,
    partner: hasPartner ? { latitude: plat, longitude: plng } : null,
    destination: hasDest ? { latitude: dlat, longitude: dlng } : null,
  });
  const routeColor = isDark ? "#E8C547" : "#8A5A12";

  useEffect(() => {
    lastDrivingFetchRef.current = 0;
    setRouteCoords(null);
  }, [orderId]);

  useEffect(() => {
    if (!trackable || !hasPartner || !hasDest || !orderId) {
      setRouteCoords(null);
      return;
    }
    const now = Date.now();
    const throttleMs = 40000;
    if (lastDrivingFetchRef.current !== 0 && now - lastDrivingFetchRef.current < throttleMs) {
      return;
    }
    lastDrivingFetchRef.current = now;

    let cancelled = false;
    fetchOrderDrivingRoute(orderId)
      .then((res) => {
        if (cancelled) return;
        const enc = res?.encodedPolyline;
        if (!enc || typeof enc !== "string") {
          setRouteCoords(null);
          return;
        }
        const decoded = decodeGooglePolyline(enc);
        setRouteCoords(decoded && decoded.length >= 2 ? decoded : null);
      })
      .catch(() => {
        if (!cancelled) setRouteCoords(null);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, trackable, hasPartner, hasDest, plat, plng, dlat, dlng, data?.updatedAt]);

  const routePositions = useMemo(() => {
    if (routeCoords && routeCoords.length >= 2) {
      return routeCoords.map((p) => [p.latitude, p.longitude]);
    }
    return null;
  }, [routeCoords]);

  let stale = false;
  if (data?.updatedAt) {
    const t = new Date(data.updatedAt).getTime();
    if (Number.isFinite(t) && Date.now() - t > STALE_MS) stale = true;
  }

  const showMap = hasPartner || hasDest || hasShop;
  const destSummary = hasDestinationSummary(dest);
  const destTitle =
    String(dest.fullName || "").trim() || String(dest.line1 || "").trim() || ORDER_LIVE_TRACKING.markerDestination;
  const destSubtitle = formatDestinationSubtitle(dest);
  const destPhone = String(dest.phone || "").trim();

  if (loading && !data) {
    return (
      <PremiumCard variant="muted" padding="md" style={cardStyles.wrap}>
        <View style={cardStyles.loadingRow}>
          <ActivityIndicator color={c.primary} />
          <Text style={[cardStyles.body, { color: c.textSecondary }]}>{ORDER_LIVE_TRACKING.loading}</Text>
        </View>
      </PremiumCard>
    );
  }

  if (error && !data) {
    return (
      <PremiumCard variant="muted" padding="md" style={cardStyles.wrap}>
        <Text style={[cardStyles.title, { color: c.textPrimary }]}>{ORDER_LIVE_TRACKING.errorTitle}</Text>
        <Text style={[cardStyles.body, { color: c.danger }]}>{error}</Text>
      </PremiumCard>
    );
  }

  const partnerSubtitle = [partnerLabel, data?.partner?.phone?.trim()].filter(Boolean).join(" · ");

  return (
    <PremiumCard goldAccent padding="none" style={cardStyles.wrap}>
      <View style={cardStyles.sectionHeaderPad}>
        <PremiumSectionHeader
          compact
          overline={ORDER_LIVE_TRACKING.overline}
          title={ORDER_LIVE_TRACKING.title}
          subtitle={partnerSubtitle}
        />
      </View>

      {destSummary ? (
        <View
          style={[
            cardStyles.destStrip,
            { borderColor: c.border, backgroundColor: isDark ? c.surfaceMuted : c.surface },
          ]}
        >
          <View style={cardStyles.destStripIcon}>
            <Ionicons name="home-outline" size={icon.md} color={c.secondary} />
          </View>
          <View style={cardStyles.destStripText}>
            <Text style={[cardStyles.destEyebrow, { color: c.textMuted }]}>{ORDER_LIVE_TRACKING.deliverToEyebrow}</Text>
            <Text style={[cardStyles.destTitle, { color: c.textPrimary }]} numberOfLines={2}>
              {destTitle}
            </Text>
            {destSubtitle ? (
              <Text style={[cardStyles.destSub, { color: c.textSecondary }]} numberOfLines={2}>
                {destSubtitle}
              </Text>
            ) : null}
            {destPhone ? (
              <Pressable
                onPress={() => Linking.openURL(`tel:${destPhone.replace(/\s/g, "")}`)}
                accessibilityRole="button"
                accessibilityLabel={ORDER_LIVE_TRACKING.deliverPhoneA11y}
                style={cardStyles.destPhoneRow}
              >
                <Ionicons name="call-outline" size={icon.sm} color={c.secondary} />
                <Text style={[cardStyles.destPhone, { color: c.secondary }]}>{destPhone}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}

      {stale && trackable ? (
        <View style={cardStyles.staleBanner}>
          <Ionicons name="warning-outline" size={icon.sm} color={c.primary} />
          <Text style={cardStyles.staleText}>{ORDER_LIVE_TRACKING.staleBanner}</Text>
        </View>
      ) : null}

      {!trackable ? (
        <Text style={[cardStyles.body, { color: c.textSecondary, padding: spacing.md }]}>
          {data?.message || ORDER_LIVE_TRACKING.waitingDefault}
        </Text>
      ) : null}

      {!hasShop ? (
        <Text style={[cardStyles.shopHint, { color: c.textMuted }]}>{ORDER_LIVE_TRACKING.shopNotConfigured}</Text>
      ) : null}

      {showMap ? (
        <LiveLeafletMap
          plat={plat}
          plng={plng}
          slat={slat}
          slng={slng}
          dlat={dlat}
          dlng={dlng}
          hasPartner={hasPartner}
          hasShop={hasShop}
          hasDest={hasDest}
          partnerLabel={partnerLabel}
          shopLabel={shopLabel}
          isDark={isDark}
          routeColor={routeColor}
          routePositions={routePositions}
          mapPoints={mapPoints}
        />
      ) : null}

      {trackable ? (
        <Text style={[cardStyles.updated, { color: c.textMuted }]}>
          {data?.updatedAt ? formatLiveLocationUpdatedLine(data.updatedAt) : ""}
        </Text>
      ) : null}

      <View style={cardStyles.actions}>
        <PremiumButton
          label={ORDER_LIVE_TRACKING.openMapsCta}
          iconLeft="map-outline"
          variant="secondary"
          size="sm"
          fullWidth
          onPress={() =>
            openMapsDirections(
              hasPartner ? { latitude: plat, longitude: plng } : hasShop ? { latitude: slat, longitude: slng } : null,
              hasDest ? { latitude: dlat, longitude: dlng } : null
            )
          }
          disabled={!hasPartner && !hasDest && !hasShop}
        />
      </View>
    </PremiumCard>
  );
}

function createWebStyles(c, isDark) {
  return StyleSheet.create({
    wrap: {
      marginTop: spacing.md,
      overflow: "hidden",
    },
    sectionHeaderPad: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    destStrip: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
    },
    destStripIcon: {
      paddingTop: 2,
    },
    destStripText: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    destEyebrow: {
      fontFamily: fonts.extrabold,
      fontSize: typography.overline,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    destTitle: {
      fontFamily: fonts.semibold,
      fontSize: typography.bodySmall,
      lineHeight: 20,
    },
    destSub: {
      fontFamily: fonts.regular,
      fontSize: typography.caption,
      lineHeight: 18,
      marginTop: 2,
    },
    destPhoneRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: spacing.xs,
    },
    destPhone: {
      fontFamily: fonts.semibold,
      fontSize: typography.caption,
    },
    title: {
      fontFamily: fonts.extrabold,
      fontSize: typography.body,
    },
    body: {
      fontSize: typography.caption,
      fontFamily: fonts.regular,
      marginTop: 2,
    },
    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    staleBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      padding: spacing.sm,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.primaryBorder,
      backgroundColor: isDark ? c.brandYellowSoft : c.primarySoft,
    },
    staleText: {
      flex: 1,
      fontSize: typography.caption,
      fontFamily: fonts.medium,
      color: isDark ? c.brandYellow : c.primaryDark,
    },
    shopHint: {
      fontSize: typography.caption,
      fontFamily: fonts.regular,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xs,
    },
    updated: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      fontSize: typography.caption,
      fontFamily: fonts.regular,
    },
    actions: {
      padding: spacing.md,
      paddingTop: spacing.sm,
    },
  });
}

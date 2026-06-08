import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchOrderLiveLocation } from "../services/userService";
import { useLiveSocket } from "../context/LiveSocketContext";
import { ORDER_LIVE_TRACKING } from "../content/appContent";
import { POLL_MS } from "../components/orders/orderLiveMapShared";

function mergeLiveLocationPatch(prev, patch) {
  if (!patch) return prev;
  if (!prev) {
    return {
      trackable: Boolean(patch.trackable),
      latitude: patch.latitude ?? null,
      longitude: patch.longitude ?? null,
      updatedAt: patch.updatedAt ?? null,
      accuracyMeters: patch.accuracyMeters ?? null,
      partner: patch.partner || { name: "", phone: "" },
      shop: patch.shop || null,
      destination: patch.destination || null,
    };
  }
  return {
    ...prev,
    trackable: patch.trackable ?? prev.trackable,
    latitude: patch.latitude ?? prev.latitude,
    longitude: patch.longitude ?? prev.longitude,
    updatedAt: patch.updatedAt ?? prev.updatedAt,
    accuracyMeters: patch.accuracyMeters ?? prev.accuracyMeters,
    partner: patch.partner ? { ...prev.partner, ...patch.partner } : prev.partner,
  };
}

/**
 * Order map location — initial REST load, live WebSocket patches, slow poll fallback.
 */
export default function useOrderLiveLocation(orderId) {
  const { connected, subscribeOrder, unsubscribeOrder, on } = useLiveSocket();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const orderIdRef = useRef(orderId);

  useEffect(() => {
    orderIdRef.current = orderId;
  }, [orderId]);

  const loadOnce = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetchOrderLiveLocation(orderId);
      if (String(orderIdRef.current) !== String(orderId)) return;
      setData(res);
      setError("");
    } catch (err) {
      if (String(orderIdRef.current) !== String(orderId)) return;
      setError(err.message || ORDER_LIVE_TRACKING.loadFailed);
      setData(null);
    } finally {
      if (String(orderIdRef.current) === String(orderId)) {
        setLoading(false);
      }
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      if (!orderId) return undefined;
      let cancelled = false;
      setLoading(true);
      loadOnce();

      const pollMs = connected ? POLL_MS * 4 : POLL_MS;
      const timer = setInterval(() => {
        if (cancelled) return;
        fetchOrderLiveLocation(orderId)
          .then((res) => {
            if (!cancelled) {
              setData(res);
              setError("");
            }
          })
          .catch((err) => {
            if (!cancelled) setError(err.message || ORDER_LIVE_TRACKING.loadFailed);
          });
      }, pollMs);

      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }, [orderId, connected, loadOnce])
  );

  useEffect(() => {
    if (!orderId) return undefined;
    subscribeOrder(orderId);
    const off = on("orders:live-location", (payload) => {
      if (String(payload?.orderId) !== String(orderId)) return;
      setData((prev) => mergeLiveLocationPatch(prev, payload));
      setError("");
    });
    return () => {
      off();
      unsubscribeOrder(orderId);
    };
  }, [orderId, subscribeOrder, unsubscribeOrder, on]);

  return { data, error, loading, reload: loadOnce, liveConnected: connected };
}

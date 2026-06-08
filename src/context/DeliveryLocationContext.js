import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { useAuth } from "./AuthContext";
import { getCurrentAddressFromGPS } from "../services/locationService";
import {
  DELIVERY_CONFIRM_TTL_MS,
  isDeliveryLocationConfirmed,
  loadCachedDeliverySnippet,
  loadDeliveryConfirmedAt,
  saveCachedDeliverySnippet,
  saveDeliveryConfirmedAt,
} from "../services/deliveryLocationCache";
import { formatDeliveryLocationLabel, formatSavedAddressLabel } from "../utils/deliveryLocationLabel";

const DETECT_COOLDOWN_MS = 90 * 1000;

const defaultDeliveryLocationValue = {
  bootstrapped: Platform.OS === "web",
  status: "idle",
  snippet: null,
  detect: async () => null,
  confirmLocation: async () => {},
  clearConfirmation: async () => {},
  needsFindScreen: false,
  isFinding: false,
  displayLabel: "Set delivery location",
  savedLabel: "",
  confirmedAt: null,
  confirmTtlMs: DELIVERY_CONFIRM_TTL_MS,
};

const DeliveryLocationContext = createContext(defaultDeliveryLocationValue);

export function DeliveryLocationProvider({ children }) {
  const { user } = useAuth();
  const [bootstrapped, setBootstrapped] = useState(Platform.OS === "web");
  const [status, setStatus] = useState("idle");
  const [snippet, setSnippet] = useState(null);
  const [confirmedAt, setConfirmedAt] = useState(null);
  const snippetRef = useRef(null);
  const lastDetectAtRef = useRef(0);
  const detectInFlightRef = useRef(false);

  const savedLabel = useMemo(
    () => formatSavedAddressLabel(user?.defaultAddress || user?.addresses?.[0]),
    [user?.defaultAddress, user?.addresses]
  );

  useEffect(() => {
    if (Platform.OS === "web") return;
    let cancelled = false;
    (async () => {
      const [cached, confirmed] = await Promise.all([
        loadCachedDeliverySnippet(),
        loadDeliveryConfirmedAt(),
      ]);
      if (cancelled) return;
      if (cached?.label) {
        snippetRef.current = cached;
        setSnippet(cached);
      }
      setConfirmedAt(confirmed);
      setBootstrapped(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const detect = useCallback(
    async ({ force = false } = {}) => {
      if (Platform.OS === "web" || detectInFlightRef.current) return snippetRef.current;

      const now = Date.now();
      const cached = snippetRef.current;
      if (!force && cached?.label && now - lastDetectAtRef.current < DETECT_COOLDOWN_MS) {
        return cached;
      }

      detectInFlightRef.current = true;
      setStatus("detecting");
      try {
        const address = await getCurrentAddressFromGPS();
        const label = formatDeliveryLocationLabel(address);
        const next = {
          ...address,
          label: label || "Current location",
          updatedAt: now,
        };
        snippetRef.current = next;
        setSnippet(next);
        await saveCachedDeliverySnippet(next);
        lastDetectAtRef.current = now;
        setStatus("ready");
        return next;
      } catch {
        const fallback = snippetRef.current;
        setStatus(fallback?.label ? "ready" : savedLabel ? "ready" : "error");
        return fallback;
      } finally {
        detectInFlightRef.current = false;
      }
    },
    [savedLabel]
  );

  const confirmLocation = useCallback(async (nextSnippet) => {
    const payload = nextSnippet || snippetRef.current;
    const now = Date.now();
    if (payload?.label) {
      snippetRef.current = payload;
      setSnippet(payload);
      await saveCachedDeliverySnippet(payload);
    }
    await saveDeliveryConfirmedAt(now);
    setConfirmedAt(now);
    setStatus("ready");
  }, []);

  const clearConfirmation = useCallback(async () => {
    setConfirmedAt(null);
    await saveDeliveryConfirmedAt(0);
  }, []);

  const needsFindScreen = useMemo(() => {
    if (Platform.OS === "web" || !bootstrapped) return false;
    return !isDeliveryLocationConfirmed(confirmedAt);
  }, [bootstrapped, confirmedAt]);

  const isFinding = status === "detecting";
  const displayLabel = snippet?.label || savedLabel || "Set delivery location";

  const value = useMemo(
    () => ({
      bootstrapped,
      status,
      snippet,
      detect,
      confirmLocation,
      clearConfirmation,
      needsFindScreen,
      isFinding,
      displayLabel,
      savedLabel,
      confirmedAt,
      confirmTtlMs: DELIVERY_CONFIRM_TTL_MS,
    }),
    [
      bootstrapped,
      status,
      snippet,
      detect,
      confirmLocation,
      clearConfirmation,
      needsFindScreen,
      isFinding,
      displayLabel,
      savedLabel,
      confirmedAt,
    ]
  );

  return (
    <DeliveryLocationContext.Provider value={value}>{children}</DeliveryLocationContext.Provider>
  );
}

export function useDeliveryLocation() {
  return useContext(DeliveryLocationContext);
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { checkApiHealth } from "../services/apiClient";
import { getApiBaseUrl } from "../services/apiBase";

const ApiHealthContext = createContext(undefined);

const POLL_MS = 45 * 1000;

export function ApiHealthProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [checking, setChecking] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);

  const runCheck = useCallback(async () => {
    setChecking(true);
    try {
      const ok = await checkApiHealth();
      setIsOnline(ok);
      setLastCheckedAt(Date.now());
      return ok;
    } catch {
      setIsOnline(false);
      setLastCheckedAt(Date.now());
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    runCheck();
    const interval = setInterval(runCheck, POLL_MS);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") runCheck();
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [runCheck]);

  const value = useMemo(
    () => ({
      isOnline,
      checking,
      lastCheckedAt,
      apiBaseUrl: getApiBaseUrl(),
      retry: runCheck,
    }),
    [isOnline, checking, lastCheckedAt, runCheck]
  );

  return <ApiHealthContext.Provider value={value}>{children}</ApiHealthContext.Provider>;
}

export function useApiHealth() {
  const ctx = useContext(ApiHealthContext);
  if (!ctx) {
    throw new Error("useApiHealth must be used inside ApiHealthProvider");
  }
  return ctx;
}

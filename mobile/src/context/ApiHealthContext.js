import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import { checkApiHealth } from "../services/apiClient";
import { getApiBaseUrl } from "../services/apiBase";

const ApiHealthContext = createContext(undefined);

const POLL_MS = 45 * 1000;
/** Floor between checks triggered by AppState "active" — web's AppState shim fires on
 *  every document `visibilitychange`, so rapid tab-switching (or an automated/embedded
 *  browser toggling focus in the background) can otherwise fire this many times a
 *  second with no debounce, hammering the health-check endpoint. */
const MIN_RECHECK_MS = 5 * 1000;

export function ApiHealthProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [checking, setChecking] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const inFlightRef = useRef(null);
  const lastRunAtRef = useRef(0);

  const runCheck = useCallback(async ({ force = true } = {}) => {
    if (inFlightRef.current) return inFlightRef.current;
    if (!force && Date.now() - lastRunAtRef.current < MIN_RECHECK_MS) {
      return Promise.resolve(isOnline);
    }
    lastRunAtRef.current = Date.now();
    setChecking(true);
    const promise = (async () => {
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
        inFlightRef.current = null;
      }
    })();
    inFlightRef.current = promise;
    return promise;
  }, [isOnline]);

  useEffect(() => {
    runCheck();
    const interval = setInterval(runCheck, POLL_MS);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") runCheck({ force: false });
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

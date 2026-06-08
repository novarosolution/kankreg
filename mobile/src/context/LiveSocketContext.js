import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  connectLiveSocket,
  disconnectLiveSocket,
  getLiveSocket,
  isLiveSocketConnected,
  onLiveEvent,
  subscribeLiveOrder,
  unsubscribeLiveOrder,
} from "../services/liveSocket";

const LiveSocketContext = createContext(undefined);

export function LiveSocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectLiveSocket();
      socketRef.current = null;
      setConnected(false);
      return undefined;
    }

    const sock = connectLiveSocket(token);
    socketRef.current = sock;
    if (!sock) {
      setConnected(false);
      return undefined;
    }

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    setConnected(sock.connected);

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      disconnectLiveSocket();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, token]);

  const subscribeOrder = useCallback((orderId) => {
    subscribeLiveOrder(orderId);
  }, []);

  const unsubscribeOrder = useCallback((orderId) => {
    unsubscribeLiveOrder(orderId);
  }, []);

  const on = useCallback((event, handler) => onLiveEvent(event, handler), []);

  const value = useMemo(
    () => ({
      connected,
      socket: getLiveSocket(),
      subscribeOrder,
      unsubscribeOrder,
      on,
    }),
    [connected, subscribeOrder, unsubscribeOrder, on]
  );

  return <LiveSocketContext.Provider value={value}>{children}</LiveSocketContext.Provider>;
}

export function useLiveSocket() {
  const ctx = useContext(LiveSocketContext);
  if (!ctx) {
    return {
      connected: false,
      socket: null,
      subscribeOrder: () => {},
      unsubscribeOrder: () => {},
      on: () => () => {},
    };
  }
  return ctx;
}

export function useLiveSocketStatus() {
  return useLiveSocket().connected || isLiveSocketConnected();
}

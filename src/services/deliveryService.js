import { apiGet, apiPatch } from "./apiClient";

/** @param {string} [_token] Legacy — ignored; apiClient injects session token. */
export const fetchMyDeliveryOrders = (_token) => apiGet("/delivery/orders");

/** @param {string} [_token] */
export const markDeliveryOrderDelivered = (_token, orderId) =>
  apiPatch(`/delivery/orders/${orderId}/mark-delivered`, {});

/** @param {string} [_token] */
export const updateDeliveryLocation = (_token, payload) =>
  apiPatch("/delivery/location", payload);

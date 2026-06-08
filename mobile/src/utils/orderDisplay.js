import { MY_ORDERS_UI } from "../content/appContent";
import { getOrderStatusLabel, isDeliveredOrder } from "./orderStatus";

/** `KG-20451` style short id from Mongo `_id`. */
export function formatOrderShortId(orderId) {
  return String(orderId || "").slice(-6).toUpperCase();
}

/** Figma-style line: `Pour-Over Set + 2` */
export function formatOrderItemsSummary(products = []) {
  const list = Array.isArray(products) ? products : [];
  if (!list.length) return "Your order";
  const first = String(list[0]?.name || "Item").trim();
  const extra = list.length - 1;
  return extra > 0 ? `${first} + ${extra}` : first;
}

export function getOrdersPageEyebrow(activeCount) {
  return activeCount > 0
    ? MY_ORDERS_UI.pageEyebrowActive
    : MY_ORDERS_UI.pageEyebrowDefault;
}

export function getOrderStatusTagTone(status) {
  if (isDeliveredOrder(status)) return "green";
  return "gold";
}

export function getPartnerInitial(name) {
  const n = String(name || "").trim();
  return n ? n.charAt(0).toUpperCase() : "D";
}

export function formatOrderStatusLabel(status) {
  return getOrderStatusLabel(status);
}

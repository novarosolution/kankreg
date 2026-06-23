/**
 * In-memory session cache for instant screen paint (stale-while-revalidate).
 */

const TTL_MS = 5 * 60 * 1000;

function createSlot() {
  return { data: null, fetchedAt: 0, key: "", promise: null };
}

const ordersSlot = createSlot();
const notificationsSlot = createSlot();

function isFresh(slot) {
  return Boolean(slot.data) && Date.now() - slot.fetchedAt < TTL_MS;
}

function peek(slot, key) {
  if (!slot.data || (key && slot.key !== key)) return null;
  return slot.data;
}

function store(slot, key, data) {
  slot.data = data;
  slot.fetchedAt = Date.now();
  slot.key = key || "";
  return data;
}

export function peekMyOrdersCache(userKey = "") {
  return peek(ordersSlot, userKey);
}

export function storeMyOrdersCache(userKey, orders) {
  return store(ordersSlot, userKey, Array.isArray(orders) ? orders : []);
}

export function revalidateMyOrders(userKey, fetcher, onUpdated) {
  if (isFresh(ordersSlot) && ordersSlot.key === userKey) {
    return Promise.resolve(ordersSlot.data);
  }
  if (ordersSlot.promise) {
    return ordersSlot.promise.then((data) => {
      if (onUpdated) onUpdated(data);
      return data;
    });
  }
  ordersSlot.promise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      const list = store(ordersSlot, userKey, data);
      if (onUpdated) onUpdated(list);
      return list;
    })
    .catch((err) => {
      ordersSlot.promise = null;
      if (ordersSlot.data && ordersSlot.key === userKey) return ordersSlot.data;
      throw err;
    })
    .finally(() => {
      ordersSlot.promise = null;
    });
  return ordersSlot.promise;
}

export function peekMyNotificationsCache(userKey = "") {
  return peek(notificationsSlot, userKey);
}

export function storeMyNotificationsCache(userKey, items) {
  return store(notificationsSlot, userKey, Array.isArray(items) ? items : []);
}

export function revalidateMyNotifications(userKey, fetcher, onUpdated) {
  if (isFresh(notificationsSlot) && notificationsSlot.key === userKey) {
    return Promise.resolve(notificationsSlot.data);
  }
  if (notificationsSlot.promise) {
    return notificationsSlot.promise.then((data) => {
      if (onUpdated) onUpdated(data);
      return data;
    });
  }
  notificationsSlot.promise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      const list = store(notificationsSlot, userKey, data);
      if (onUpdated) onUpdated(list);
      return list;
    })
    .catch((err) => {
      notificationsSlot.promise = null;
      if (notificationsSlot.data && notificationsSlot.key === userKey) return notificationsSlot.data;
      throw err;
    })
    .finally(() => {
      notificationsSlot.promise = null;
    });
  return notificationsSlot.promise;
}

export function clearUserScreenCaches() {
  ordersSlot.data = null;
  ordersSlot.fetchedAt = 0;
  ordersSlot.key = "";
  ordersSlot.promise = null;
  notificationsSlot.data = null;
  notificationsSlot.fetchedAt = 0;
  notificationsSlot.key = "";
  notificationsSlot.promise = null;
}

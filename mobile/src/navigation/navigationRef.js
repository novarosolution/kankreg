import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

const pendingActions = [];

function runOrQueue(action) {
  if (navigationRef.isReady()) {
    action();
    return true;
  }
  pendingActions.push(action);
  return false;
}

/** Navigate when the container is ready; queue until `flushPendingNavigationActions`. */
export function safeNavigate(name, params) {
  return runOrQueue(() => {
    navigationRef.navigate(name, params);
  });
}

export function safeReset(state) {
  return runOrQueue(() => {
    navigationRef.reset(state);
  });
}

export function flushPendingNavigationActions() {
  if (!navigationRef.isReady()) return;
  while (pendingActions.length) {
    const action = pendingActions.shift();
    try {
      action();
    } catch (error) {
      console.error("[navigation] pending action failed:", error);
    }
  }
}

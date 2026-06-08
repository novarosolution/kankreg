import { CommonActions } from "@react-navigation/native";

/** Flat stack — navigate to a customer-facing route by name. */
export function navigateCustomerRoute(navigation, name, params) {
  navigation?.navigate?.(name, params);
}

export function replaceCustomerRoute(navigation, name, params) {
  if (navigation?.replace) {
    navigation.replace(name, params);
  } else {
    navigation?.navigate?.(name, params);
  }
}

/** Clears the stack and lands on a main customer screen (e.g. after login). */
export function resetToMainTabs(navigation, name = "Home", params) {
  if (!navigation?.dispatch) return;
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    })
  );
}

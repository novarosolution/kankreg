import React from "react";
import CartScreen from "./CartScreen";

/** kankreg.html `#checkout` — same logic as cart, checkout-only layout on web. */
export default function CheckoutScreen(props) {
  return <CartScreen {...props} route={{ ...props.route, name: "Checkout", params: { ...props.route?.params, flow: "checkout" } }} />;
}

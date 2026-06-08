/** Human-readable one-line label for header / checkout snippets. */
export function formatDeliveryLocationLabel(address) {
  if (!address || typeof address !== "object") return "";

  const neighborhood = String(address.line1 || address.neighborhood || "").trim();
  const city = String(address.city || "").trim();
  const postal = String(address.postalCode || address.pincode || "").trim();

  if (neighborhood && city) {
    return postal ? `${neighborhood}, ${city} ${postal}` : `${neighborhood}, ${city}`;
  }
  if (city && postal) return `${city} ${postal}`;
  if (city) return city;
  if (neighborhood) return neighborhood;
  if (postal) return postal;
  return "";
}

export function formatSavedAddressLabel(defaultAddress) {
  if (!defaultAddress) return "";
  return formatDeliveryLocationLabel(defaultAddress)
    || [defaultAddress.city, defaultAddress.postalCode || defaultAddress.pincode].filter(Boolean).join(" ");
}

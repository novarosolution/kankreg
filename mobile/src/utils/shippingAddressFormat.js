/**
 * One-line summary for order cards when live map is not shown (street-first).
 * @param {Record<string, unknown> | null | undefined} addr
 * @returns {string}
 */
export function formatCompactShippingLine(addr) {
  if (!addr || typeof addr !== "object") return "";
  const street = [addr.houseNumber, addr.line1]
    .filter((x) => String(x || "").trim())
    .join(", ");
  const cityLine = [addr.city, addr.postalCode]
    .filter((x) => String(x || "").trim())
    .join(" - ");
  const parts = [street, cityLine].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  return [addr.city, addr.state].filter((x) => String(x || "").trim()).join(", ");
}

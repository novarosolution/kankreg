export function formatINR(amount) {
  const numeric = Number(amount || 0);
  if (Number.isNaN(numeric)) {
    return "₹0.00";
  }

  return `₹${numeric.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Whole rupees, typical for grocery price tiles (e.g. ₹31). */
export function formatINRWhole(amount) {
  const numeric = Math.round(Number(amount || 0));
  if (Number.isNaN(numeric)) {
    return "₹0";
  }
  return `₹${numeric.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** Compact display for profile KPIs (e.g. ₹4.2k). */
export function formatINRCompact(amount) {
  const n = Number(amount || 0);
  if (!Number.isFinite(n) || n <= 0) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return formatINRWhole(n);
}

/**
 * Cart line identity: same product id + same variant = one line.
 */
export function cartLineKey(item) {
  const id = String(item?.id ?? item?.product ?? "");
  const v = String(item?.variantLabel ?? "").trim();
  return `${id}::${v}`;
}

/**
 * Pick the listing-price SKU, not the first (often smallest) size.
 */
export function pickDefaultVariant(product) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  if (!variants.length) return null;
  const price = Number(product?.price);
  const matchPrice = variants.find((v) => Number(v.price) === price);
  if (matchPrice) return matchPrice;
  const tagged = variants.find((v) => /best value|most popular/i.test(String(v.tag || "")));
  if (tagged) return tagged;
  return variants[variants.length - 1];
}

/**
 * Build a cart-ready product from catalog data + optional variant label.
 * When variants exist and label is omitted, uses the listing price / featured size.
 */
export function productToCartLine(product, variantLabel) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const baseName = String(product?.name ?? "").trim();

  if (variants.length === 0) {
    return {
      ...product,
      variantLabel: "",
      price: Number(product?.price) || 0,
      name: baseName,
    };
  }

  const labelIn = String(variantLabel ?? "").trim();
  const v = labelIn
    ? variants.find((x) => String(x.label || "").trim() === labelIn) || pickDefaultVariant(product)
    : pickDefaultVariant(product);
  const lab = String(v?.label ?? "").trim();
  const p = Math.max(0, Number(v?.price) || Number(product?.price) || 0);
  return {
    ...product,
    variantLabel: lab,
    price: p,
    name: lab ? `${baseName} — ${lab}` : baseName,
  };
}

const Product = require("../models/Product");

function availableQty(product) {
  if (!product) return 0;
  if (product.inStock === false) return 0;
  return Math.max(0, Number(product.stockQty) || 0);
}

/** Validate each catalog line against live stock before order create. */
function validateOrderStockLines(normalizedItems, productMap) {
  for (const item of normalizedItems) {
    if (!item.product) continue;
    const product = productMap.get(String(item.product));
    if (!product) {
      return { ok: false, message: "One or more products were not found." };
    }
    const qty = Number(item.quantity) || 0;
    const stock = availableQty(product);
    if (stock < 1) {
      return {
        ok: false,
        message: `${product.name || "Product"} is out of stock.`,
      };
    }
    if (qty > stock) {
      return {
        ok: false,
        message: `Only ${stock} unit${stock === 1 ? "" : "s"} left for ${product.name || "product"}.`,
      };
    }
  }
  return { ok: true };
}

/** Atomically deduct stock for order lines with MongoDB product ids. */
async function deductStockForOrderLines(orderLines = []) {
  const adjusted = [];
  for (const line of orderLines) {
    const productId = line.product;
    if (!productId) continue;
    const qty = Math.max(1, Number(line.quantity) || 1);

    const updated = await Product.findOneAndUpdate(
      { _id: productId, stockQty: { $gte: qty }, inStock: { $ne: false } },
      { $inc: { stockQty: -qty } },
      { new: true }
    );

    if (!updated) {
      await restoreStockForOrderLines(adjusted);
      const name = line.name || "Product";
      const err = new Error(`Insufficient stock for ${name}.`);
      err.statusCode = 400;
      throw err;
    }

    if (Number(updated.stockQty) <= 0) {
      updated.inStock = false;
      await updated.save();
    }

    adjusted.push({ product: productId, quantity: qty, name: line.name });
  }
  return adjusted;
}

/** Restore stock when an order is cancelled after deduction. */
async function restoreStockForOrderLines(orderLines = []) {
  for (const line of orderLines) {
    const productId = line.product;
    if (!productId) continue;
    const qty = Math.max(1, Number(line.quantity) || 1);

    const updated = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stockQty: qty }, $set: { inStock: true } },
      { new: true }
    );
    if (updated && Number(updated.stockQty) < 1) {
      updated.inStock = false;
      await updated.save();
    }
  }
}

module.exports = {
  availableQty,
  validateOrderStockLines,
  deductStockForOrderLines,
  restoreStockForOrderLines,
};

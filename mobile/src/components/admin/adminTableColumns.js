import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { formatOrderPublicRef } from "../../content/appContent";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { formatINR } from "../../utils/currency";
import { getOrderStatusLabel } from "../../utils/orderStatus";
import AdminStatusPill, { orderStatusTone } from "./AdminStatusPill";
import AdminProductCell from "./AdminProductCell";

const linkStyle = StyleSheet.create({
  link: {
    color: KANKREG_PALETTE.goldDeep,
    fontWeight: "600",
    fontSize: 12.5,
  },
}).link;

function paymentLabel(order) {
  const m = String(order.paymentMethod || order.paymentMode || "").toLowerCase();
  if (m.includes("cod") || m.includes("cash")) return "COD";
  if (m.includes("razor")) return "Razorpay";
  return order.paymentMethod || "—";
}

export function buildOrderTableColumns({ onView }) {
  return [
    {
      key: "ref",
      label: "Order",
      flex: 1,
      strong: true,
      render: (row) => formatOrderPublicRef(row) || `#${String(row._id || "").slice(-6).toUpperCase()}`,
    },
    {
      key: "customer",
      label: "Customer",
      flex: 1.1,
      render: (row) => row.user?.name || row.userName || row.shippingAddress?.name || "Guest",
    },
    {
      key: "date",
      label: "Date",
      flex: 0.8,
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })
          : "—",
    },
    {
      key: "items",
      label: "Items",
      width: 56,
      render: (row) => String((row.items || []).length || 0),
    },
    {
      key: "total",
      label: "Total",
      flex: 0.9,
      strong: true,
      render: (row) => formatINR(row.totalPrice || 0),
    },
    {
      key: "payment",
      label: "Payment",
      flex: 0.8,
      render: (row) => paymentLabel(row),
    },
    {
      key: "status",
      label: "Status",
      flex: 1,
      render: (row) => (
        <AdminStatusPill label={getOrderStatusLabel(row.status)} tone={orderStatusTone(row.status)} />
      ),
    },
    {
      key: "view",
      label: "",
      width: 52,
      align: "right",
      render: (row) =>
        onView ? (
          <Pressable onPress={() => onView(row)}>
            <Text style={linkStyle}>View</Text>
          </Pressable>
        ) : null,
    },
  ];
}

export function buildInventoryTableColumns({ onEdit }) {
  return [
    {
      key: "name",
      label: "Product",
      flex: 1.5,
      render: (row) => <AdminProductCell name={row.name} imageUri={row.image} />,
    },
    { key: "sku", label: "SKU", flex: 0.8, render: (row) => row.sku || "—" },
    {
      key: "stock",
      label: "Stock",
      width: 72,
      strong: true,
      render: (row) => String(Math.max(0, Number(row.stockQty) || 0)),
    },
    {
      key: "status",
      label: "Status",
      flex: 0.8,
      render: (row) => {
        const q = Math.max(0, Number(row.stockQty) || 0);
        const out = row.inStock === false || q < 1;
        const low = !out && q <= 5;
        const label = out ? "Out" : low ? "Low stock" : "In stock";
        const tone = out ? "low" : low ? "pend" : "ok";
        return <AdminStatusPill label={label} tone={tone} />;
      },
    },
    {
      key: "edit",
      label: "",
      width: 52,
      align: "right",
      render: (row) =>
        onEdit ? (
          <Pressable onPress={() => onEdit(row)}>
            <Text style={linkStyle}>Edit</Text>
          </Pressable>
        ) : null,
    },
  ];
}

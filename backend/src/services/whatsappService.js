/** Send admin alert via Meta WhatsApp Cloud API (optional — skipped when env missing). */
async function sendWhatsAppText(body) {
  const token = String(process.env.WHATSAPP_ACCESS_TOKEN || "").trim();
  const phoneNumberId = String(process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
  const toRaw = String(process.env.ADMIN_WHATSAPP_PHONE || "").trim();

  if (!token || !phoneNumberId || !toRaw) {
    console.warn("[whatsapp] Not configured — skipped admin alert.");
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const to = toRaw.replace(/\D/g, "");
  if (!to) {
    return { ok: false, skipped: true, reason: "invalid_phone" };
  }

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: String(body || "").slice(0, 4096) },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[whatsapp] send failed:", response.status, detail);
    return { ok: false, error: detail || response.statusText };
  }

  return { ok: true };
}

module.exports = {
  sendWhatsAppText,
};

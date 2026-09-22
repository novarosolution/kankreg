const mongoose = require("mongoose");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

async function subscribeNewsletter(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Newsletter is starting. Try again in a moment." });
    }
    const email = normalizeEmail(req.body?.email);
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      res.status(400);
      throw new Error("Please enter a valid email address.");
    }

    await NewsletterSubscriber.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );

    res.json({ ok: true, message: "You're on the list." });
  } catch (err) {
    if (err?.code === 11000) {
      return res.json({ ok: true, message: "You're on the list." });
    }
    next(err);
  }
}

module.exports = { subscribeNewsletter };

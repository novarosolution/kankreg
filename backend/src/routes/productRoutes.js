const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getProducts,
  getProductById,
  getProductReviews,
  createOrUpdateProductReview,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id/reviews", getProductReviews);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, createOrUpdateProductReview);

module.exports = router;

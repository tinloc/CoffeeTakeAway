const express = require("express");

const router = express.Router();

const controller = require("../controllers/product.controller");

// ===============================
// Public API
// ===============================

router.get("/", controller.getAllProducts);

router.get("/featured", controller.getFeatured);

router.get("/newest", controller.getNewest);

router.get("/best-selling", controller.getBestSelling);

router.get("/search", controller.searchProducts);

router.get("/slug/:slug", controller.getBySlug);

router.get("/category/:id", controller.getByCategory);

router.get("/:id/detail", controller.getProductDetail);

router.get("/:id/related", controller.getRelated);

router.get("/:id", controller.getProductById);

module.exports = router;
const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart.controller");

const auth = require("../middleware/auth.middleware");

// =======================================
// Lấy giỏ hàng
// =======================================
router.get(
    "/",
    auth,
    cartController.getCart
);

// =======================================
// Thêm sản phẩm vào giỏ
// =======================================
router.post(
    "/add",
    auth,
    cartController.addToCart
);

// =======================================
// Cập nhật số lượng
// =======================================
router.put(
    "/item/:id",
    auth,
    cartController.updateQuantity
);

// =======================================
// Xóa một sản phẩm
// =======================================
router.delete(
    "/item/:id",
    auth,
    cartController.removeItem
);

// =======================================
// Xóa toàn bộ giỏ hàng
// =======================================
router.delete(
    "/clear",
    auth,
    cartController.clearCart
);

module.exports = router;
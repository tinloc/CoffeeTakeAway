const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");

const orderController = require("../controllers/order.controller");

// ======================================
// Checkout
// ======================================
router.post(

    "/checkout",

    auth,

    orderController.checkout

);

// ======================================
// Lịch sử đơn hàng
// ======================================
router.get(

    "/",

    auth,

    orderController.getMyOrders

);

// ======================================
// Chi tiết đơn hàng
// ======================================
router.get(

    "/:id",

    auth,

    orderController.getOrderDetail

);

// ======================================
// Hủy đơn hàng
// ======================================
router.put(

    "/:id/cancel",

    auth,

    orderController.cancelOrder

);

module.exports = router;
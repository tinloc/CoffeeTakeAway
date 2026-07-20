const orderService = require("../services/order.service");

// ======================================
// Checkout
// POST /api/orders/checkout
// ======================================
exports.checkout = async (req, res) => {

    try {

        const result = await orderService.checkout(

            req.user.user_id,

            req.body

        );

        res.status(201).json({

            success: true,

            message: "Đặt hàng thành công.",

            data: result

        });

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================
// Lịch sử đơn hàng
// GET /api/orders
// ======================================
exports.getMyOrders = async (req, res) => {

    try {

        const orders = await orderService.getMyOrders(

            req.user.user_id

        );

        res.json({

            success: true,

            data: orders

        });

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================
// Chi tiết đơn hàng
// GET /api/orders/:id
// ======================================
exports.getOrderDetail = async (req, res) => {

    try {

        const order = await orderService.getOrderDetail(

            req.user.user_id,

            req.params.id

        );

        res.json({

            success: true,

            data: order

        });

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================
// Hủy đơn hàng
// PUT /api/orders/:id/cancel
// ======================================
exports.cancelOrder = async (req, res) => {

    try {

        await orderService.cancelOrder(

            req.user.user_id,

            req.params.id

        );

        res.json({

            success: true,

            message: "Hủy đơn hàng thành công."

        });

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};
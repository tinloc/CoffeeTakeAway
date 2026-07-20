const cartService = require("../services/cart.service");

// =======================================
// Lấy giỏ hàng
// GET /api/cart
// =======================================
exports.getCart = async (req, res) => {

    try {

        const cart = await cartService.getCart(
            req.user.user_id
        );

        res.json({
            success: true,
            data: cart
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// =======================================
// Thêm sản phẩm
// POST /api/cart/add
// =======================================
exports.addToCart = async (req, res) => {

    try {

        const result = await cartService.addToCart(
            req.user.user_id,
            req.body
        );

        res.json({
            success: true,
            message: result.message
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// =======================================
// Cập nhật số lượng
// PUT /api/cart/item/:id
// =======================================
exports.updateQuantity = async (req, res) => {

    try {

        const result = await cartService.updateQuantity(

            req.params.id,

            req.body.quantity

        );

        res.json({
            success: true,
            message: result.message
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// =======================================
// Xóa sản phẩm
// DELETE /api/cart/item/:id
// =======================================
exports.removeItem = async (req, res) => {

    try {

        const result = await cartService.removeItem(
            req.params.id
        );

        res.json({
            success: true,
            message: result.message
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// =======================================
// Xóa toàn bộ giỏ hàng
// DELETE /api/cart/clear
// =======================================
exports.clearCart = async (req, res) => {

    try {

        const result = await cartService.clearCart(
            req.user.user_id
        );

        res.json({
            success: true,
            message: result.message
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};
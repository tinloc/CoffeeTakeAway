const CartService = require("../services/cart.service");

// ==========================================
// Lấy giỏ hàng
// ==========================================
exports.getCart = async (req, res) => {

    try {

        const data = await CartService.getCart(
            req.user.user_id
        );

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// Thêm sản phẩm
// ==========================================
exports.addToCart = async (req, res) => {

    try {

        const data = await CartService.addToCart(
            req.user.user_id,
            req.body
        );

        res.json({
            success: true,
            message: "Đã thêm vào giỏ hàng.",
            data
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// Cập nhật số lượng
// ==========================================
exports.updateCartItem = async (req, res) => {

    try {

        await CartService.updateCartItem(
            req.params.id,
            req.body.quantity
        );

        res.json({
            success: true,
            message: "Cập nhật thành công."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// Xóa sản phẩm
// ==========================================
exports.deleteCartItem = async (req, res) => {

    try {

        await CartService.deleteCartItem(
            req.params.id
        );

        res.json({
            success: true,
            message: "Đã xóa sản phẩm."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// Xóa toàn bộ
// ==========================================
exports.clearCart = async (req, res) => {

    try {

        await CartService.clearCart(
            req.user.user_id
        );

        res.json({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};
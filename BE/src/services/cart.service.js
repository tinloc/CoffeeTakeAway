const CartModel = require("../models/cart.model");

// =====================================
// Lấy Cart của User
// =====================================
async function getCart(userId) {

    let cart = await CartModel.findCartByUserId(userId);

    // Nếu chưa có giỏ hàng thì tạo mới
    if (!cart) {

        const cartId = await CartModel.createCart(userId);

        cart = {
            cart_id: cartId,
            user_id: userId
        };

    }

    const items = await CartModel.getCartItems(cart.cart_id);

    let total = 0;

    items.forEach(item => {

        item.subtotal = Number(item.price) * item.quantity;

        total += item.subtotal;

    });

    return {

        cart_id: cart.cart_id,

        items,

        total

    };

}

// =====================================
// Thêm sản phẩm vào Cart
// =====================================
async function addToCart(userId, body) {

    const {

        product_size_id,

        quantity,

        note

    } = body;

    if (!product_size_id) {

        throw new Error("Thiếu product_size_id.");

    }

    if (!quantity || quantity <= 0) {

        throw new Error("Số lượng không hợp lệ.");

    }

    let cart = await CartModel.findCartByUserId(userId);

    if (!cart) {

        const cartId = await CartModel.createCart(userId);

        cart = {

            cart_id: cartId,

            user_id: userId

        };

    }

    const item = await CartModel.findCartItem(

        cart.cart_id,

        product_size_id

    );

    // Nếu đã có thì cộng thêm số lượng
    if (item) {

        await CartModel.updateCartItem(

            item.cart_item_id,

            item.quantity + quantity

        );

        return {

            message: "Đã cập nhật số lượng sản phẩm."

        };

    }

    // Nếu chưa có thì thêm mới
    await CartModel.addCartItem(

        cart.cart_id,

        product_size_id,

        quantity,

        note || null

    );

    return {

        message: "Thêm vào giỏ hàng thành công."

    };

}

// =====================================
// Cập nhật số lượng
// =====================================
async function updateQuantity(cartItemId, quantity) {

    if (!quantity || quantity <= 0) {

        throw new Error("Số lượng không hợp lệ.");

    }

    await CartModel.updateCartItem(

        cartItemId,

        quantity

    );

    return {

        message: "Cập nhật thành công."

    };

}

// =====================================
// Xóa một sản phẩm
// =====================================
async function removeItem(cartItemId) {

    await CartModel.deleteCartItem(cartItemId);

    return {

        message: "Đã xóa sản phẩm."

    };

}

// =====================================
// Xóa toàn bộ Cart
// =====================================
async function clearCart(userId) {

    const cart = await CartModel.findCartByUserId(userId);

    if (!cart) {

        throw new Error("Giỏ hàng không tồn tại.");

    }

    await CartModel.clearCart(cart.cart_id);

    return {

        message: "Đã xóa toàn bộ giỏ hàng."

    };

}

module.exports = {

    getCart,

    addToCart,

    updateQuantity,

    removeItem,

    clearCart

};
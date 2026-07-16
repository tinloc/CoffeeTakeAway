const Cart = require("../models/cart.model");

// ==========================================
// Lấy hoặc tạo cart
// ==========================================
async function getOrCreateCart(userId) {

    if (!userId) {
        throw new Error("User ID không hợp lệ.");
    }

    let cart = await Cart.findCartByUser(userId);

    if (!cart) {

        const cartId = await Cart.createCart(userId);

        cart = {
            cart_id: cartId,
            user_id: userId
        };

    }

    return cart;

}

// ==========================================
// Lấy giỏ hàng
// ==========================================
async function getCart(userId) {

    const cart = await getOrCreateCart(userId);

    const items = await Cart.getCartItems(cart.cart_id);

    let total = 0;

    items.forEach(item => {

        total += Number(item.price) * item.quantity;

    });

    return {

        cart_id: cart.cart_id,

        total_items: items.length,

        total_amount: total,

        items

    };

}

// ==========================================
// Thêm sản phẩm
// ==========================================
async function addToCart(userId, body) {

    const cart = await getOrCreateCart(userId);

    const quantity = body.quantity || 1;

    const note = body.note || "";

    const exists = await Cart.findCartItem(

        cart.cart_id,

        body.product_size_id

    );

    if (exists) {

        await Cart.updateQuantity(

            exists.cart_item_id,

            exists.quantity + quantity

        );

    } else {

        await Cart.addItem(

            cart.cart_id,

            body.product_size_id,

            quantity,

            note

        );

    }

    return await getCart(userId);

}

// ==========================================
// Cập nhật số lượng
// ==========================================
async function updateCartItem(cartItemId, quantity) {

    if (quantity <= 0) {
        throw new Error("Số lượng phải lớn hơn 0.");
    }

    await Cart.updateQuantity(
        cartItemId,
        quantity
    );

}

// ==========================================
// Xóa sản phẩm
// ==========================================
async function deleteCartItem(cartItemId) {

    await Cart.deleteItem(cartItemId);

}

// ==========================================
// Xóa toàn bộ
// ==========================================
async function clearCart(userId) {

    const cart = await getOrCreateCart(userId);

    await Cart.clearCart(cart.cart_id);

}

module.exports = {

    getCart,

    addToCart,

    updateCartItem,

    deleteCartItem,

    clearCart

};
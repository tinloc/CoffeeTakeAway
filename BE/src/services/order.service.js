const OrderModel = require("../models/order.model");
const CartModel = require("../models/cart.model");

// ===============================
// Sinh mã đơn hàng
// ===============================
function generateOrderCode() {

    const now = new Date();

    const yyyy = now.getFullYear();

    const mm = String(now.getMonth() + 1).padStart(2, "0");

    const dd = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `OD${yyyy}${mm}${dd}${random}`;

}

// ===============================
// Checkout
// ===============================
async function checkout(userId, body) {

    const {

        address_id,

        coupon_id,

        payment_method,

        note

    } = body;

    const cart = await CartModel.findCartByUserId(userId);

    if (!cart) {

        throw new Error("Giỏ hàng chưa tồn tại.");

    }

    const cartItems = await CartModel.getCartItems(cart.cart_id);

    if (cartItems.length === 0) {

        throw new Error("Giỏ hàng đang trống.");

    }

    let subtotal = 0;

    for (const item of cartItems) {

        subtotal += Number(item.price) * item.quantity;

    }

    const shipping_fee = 0;

    const discount = 0;

    const total_amount = subtotal - discount + shipping_fee;

    const orderId = await OrderModel.createOrder({

        order_code: generateOrderCode(),

        user_id: userId,

        address_id,

        coupon_id,

        subtotal,

        discount,

        shipping_fee,

        total_amount,

        payment_method,

        payment_status: "Pending",

        order_status: "Pending",

        note

    });

    for (const item of cartItems) {

        await OrderModel.createOrderItem({

            order_id: orderId,

            product_size_id: item.product_size_id,

            quantity: item.quantity,

            price: item.price,

            subtotal: Number(item.price) * item.quantity,

            note: item.note

        });

    }

    await OrderModel.createPayment({

        order_id: orderId,

        payment_method,

        amount: total_amount,

        status: "Pending"

    });

    await CartModel.clearCart(cart.cart_id);

    return {

        order_id: orderId,

        total_amount

    };

}

// ===============================
// Lịch sử đơn hàng
// ===============================
async function getMyOrders(userId) {

    return await OrderModel.getOrdersByUser(userId);

}

// ===============================
// Chi tiết đơn hàng
// ===============================
async function getOrderDetail(userId, orderId) {

    const order = await OrderModel.getOrderById(

        orderId,

        userId

    );

    if (!order) {

        throw new Error("Không tìm thấy đơn hàng.");

    }

    const items = await OrderModel.getOrderItems(orderId);

    order.items = items;

    return order;

}

// ===============================
// Hủy đơn hàng
// ===============================
async function cancelOrder(userId, orderId) {

    const order = await OrderModel.getOrderById(

        orderId,

        userId

    );

    if (!order) {

        throw new Error("Không tìm thấy đơn hàng.");

    }

    if (

        order.order_status !== "Pending"

    ) {

        throw new Error(

            "Đơn hàng không thể hủy."

        );

    }

    await OrderModel.cancelOrder(orderId);

}

module.exports = {

    checkout,

    getMyOrders,

    getOrderDetail,

    cancelOrder

};
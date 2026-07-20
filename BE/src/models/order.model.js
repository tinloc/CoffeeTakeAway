const pool = require("../config/db");

// ======================================
// Tạo Order
// ======================================
async function createOrder(order) {

    const sql = `
        INSERT INTO orders
        (
            order_code,
            user_id,
            address_id,
            coupon_id,
            subtotal,
            discount,
            shipping_fee,
            total_amount,
            payment_method,
            payment_status,
            order_status,
            note
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        order.order_code,
        order.user_id,
        order.address_id,
        order.coupon_id,
        order.subtotal,
        order.discount,
        order.shipping_fee,
        order.total_amount,
        order.payment_method,
        order.payment_status,
        order.order_status,
        order.note
    ];

    const [result] = await pool.query(sql, values);

    return result.insertId;
}

// ======================================
// Thêm Order Item
// ======================================
async function createOrderItem(item) {

    const sql = `
        INSERT INTO order_items
        (
            order_id,
            product_size_id,
            quantity,
            price,
            subtotal,
            note
        )
        VALUES
        (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        item.order_id,
        item.product_size_id,
        item.quantity,
        item.price,
        item.subtotal,
        item.note
    ];

    const [result] = await pool.query(sql, values);

    return result.insertId;
}

// ======================================
// Tạo Payment
// ======================================
async function createPayment(payment) {

    const sql = `
        INSERT INTO payments
        (
            order_id,
            payment_method,
            amount,
            status
        )
        VALUES
        (?, ?, ?, ?)
    `;

    await pool.query(sql, [
        payment.order_id,
        payment.payment_method,
        payment.amount,
        payment.status
    ]);
}

// ======================================
// Lấy đơn hàng theo User
// ======================================
async function getOrdersByUser(userId) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return rows;
}

// ======================================
// Chi tiết đơn hàng
// ======================================
async function getOrderById(orderId, userId) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM orders
        WHERE order_id = ?
        AND user_id = ?
        `,
        [orderId, userId]
    );

    return rows[0];
}

// ======================================
// Chi tiết sản phẩm của đơn
// ======================================
async function getOrderItems(orderId) {

    const [rows] = await pool.query(
        `
        SELECT

            oi.order_item_id,
            oi.quantity,
            oi.price,
            oi.subtotal,
            oi.note,

            p.product_name,

            s.size_name

        FROM order_items oi

        INNER JOIN product_sizes ps
            ON oi.product_size_id = ps.product_size_id

        INNER JOIN products p
            ON ps.product_id = p.product_id

        INNER JOIN sizes s
            ON ps.size_id = s.size_id

        WHERE oi.order_id = ?
        `,
        [orderId]
    );

    return rows;
}

// ======================================
// Hủy đơn hàng
// ======================================
async function cancelOrder(orderId) {

    await pool.query(
        `
        UPDATE orders
        SET order_status='Cancelled'
        WHERE order_id=?
        `,
        [orderId]
    );
}

module.exports = {

    createOrder,

    createOrderItem,

    createPayment,

    getOrdersByUser,

    getOrderById,

    getOrderItems,

    cancelOrder

};
const pool = require("../config/db");

// ======================================
// Dashboard
// ======================================
async function getDashboard() {

    const [[users]] = await pool.query(
        "SELECT COUNT(*) totalUsers FROM users"
    );

    const [[products]] = await pool.query(
        "SELECT COUNT(*) totalProducts FROM products"
    );

    const [[orders]] = await pool.query(
        "SELECT COUNT(*) totalOrders FROM orders"
    );

    const [[pending]] = await pool.query(
        `
        SELECT COUNT(*) pendingOrders
        FROM orders
        WHERE order_status='Pending'
        `
    );

    const [[revenue]] = await pool.query(
        `
        SELECT
        IFNULL(SUM(total_amount),0) totalRevenue
        FROM orders
        WHERE order_status='Completed'
        `
    );

    return {

        totalUsers: users.totalUsers,

        totalProducts: products.totalProducts,

        totalOrders: orders.totalOrders,

        pendingOrders: pending.pendingOrders,

        totalRevenue: revenue.totalRevenue

    };

}

// ======================================
// Danh sách User
// ======================================
async function getUsers() {

    const [rows] = await pool.query(
        `
        SELECT

            user_id,

            full_name,

            email,

            phone,

            gender,

            is_active,

            created_at

        FROM users

        ORDER BY created_at DESC
        `
    );

    return rows;

}

// ======================================
// Khóa User
// ======================================
async function blockUser(id) {

    await pool.query(

        `
        UPDATE users

        SET is_active=0

        WHERE user_id=?
        `,

        [id]

    );

}

// ======================================
// Mở khóa User
// ======================================
async function unblockUser(id) {

    await pool.query(

        `
        UPDATE users

        SET is_active=1

        WHERE user_id=?
        `,

        [id]

    );

}

// ======================================
// Danh sách Order
// ======================================
async function getOrders() {

    const [rows] = await pool.query(

        `
        SELECT

            o.order_id,

            o.order_code,

            u.full_name,

            o.total_amount,

            o.payment_method,

            o.payment_status,

            o.order_status,

            o.created_at

        FROM orders o

        JOIN users u

        ON o.user_id=u.user_id

        ORDER BY o.created_at DESC

        `

    );

    return rows;

}

// ======================================
// Chi tiết Order
// ======================================
async function getOrder(id) {

    const [[order]] = await pool.query(

        `
        SELECT *

        FROM orders

        WHERE order_id=?

        `,

        [id]

    );

    return order;

}

// ======================================
// Update Status
// ======================================
async function updateOrderStatus(id,status){

    await pool.query(

        `
        UPDATE orders

        SET order_status=?

        WHERE order_id=?

        `,

        [

            status,

            id

        ]

    );

}

module.exports={

    getDashboard,

    getUsers,

    blockUser,

    unblockUser,

    getOrders,

    getOrder,

    updateOrderStatus

};
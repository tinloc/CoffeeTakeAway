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
    updateOrderStatus,

    getProducts,
    createProduct,
    createProductSizes,
    updateProduct,
    toggleProductAvailability,
    deleteProduct,

    getCategories,
    createCategory,
    updateCategory,
    getRevenueByMonth

};

// ======================================
// Danh sách sản phẩm (admin – gồm cả ẩn)
// ======================================
async function getProducts() {
    const [rows] = await pool.query(`
        SELECT p.product_id, p.product_name, p.slug, p.base_price,
               p.thumbnail, p.is_featured, p.is_available, p.sold, p.created_at,
               c.category_id, c.category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.created_at DESC
    `);
    return rows;
}

async function createProduct({ category_id, product_name, slug, description, base_price, thumbnail, is_featured }) {
    const [result] = await pool.query(
        `INSERT INTO products (category_id, product_name, slug, description, base_price, thumbnail, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [category_id, product_name, slug || null, description || null, base_price, thumbnail || null, is_featured ? 1 : 0]
    );
    return result.insertId;
}

async function createProductSizes(productId, sizes) {
    for (const s of sizes) {
        if (s.price !== "" && s.price !== null && s.price !== undefined) {
            await pool.query(
                `INSERT INTO product_sizes (product_id, size_id, price) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE price=VALUES(price)`,
                [productId, s.size_id, Number(s.price)]
            );
        }
    }
}

async function updateProduct(id, { category_id, product_name, slug, description, base_price, thumbnail, is_featured, is_available }) {
    await pool.query(
        `UPDATE products SET
            category_id=?, product_name=?, slug=?, description=?,
            base_price=?, thumbnail=COALESCE(?,thumbnail),
            is_featured=?, is_available=?
         WHERE product_id=?`,
        [category_id, product_name, slug || null, description || null,
         base_price, thumbnail || null,
         is_featured ? 1 : 0, is_available !== undefined ? (is_available ? 1 : 0) : 1,
         id]
    );
}

async function toggleProductAvailability(id) {
    await pool.query(`UPDATE products SET is_available = NOT is_available WHERE product_id=?`, [id]);
}

async function deleteProduct(id) {
    await pool.query(`DELETE FROM products WHERE product_id=?`, [id]);
}

// ======================================
// Danh mục (admin CRUD)
// ======================================
async function getCategories() {
    const [rows] = await pool.query(
        `SELECT * FROM categories ORDER BY display_order ASC, category_name ASC`
    );
    return rows;
}

async function createCategory({ category_name, description, image }) {
    const [result] = await pool.query(
        `INSERT INTO categories (category_name, description, image) VALUES (?, ?, ?)`,
        [category_name, description || null, image || null]
    );
    return result.insertId;
}

async function updateCategory(id, { category_name, description, image }) {
    await pool.query(
        `UPDATE categories SET category_name=?, description=?, image=COALESCE(?,image) WHERE category_id=?`,
        [category_name, description || null, image || null, id]
    );
}

// ======================================
// Doanh thu theo tháng
// ======================================
async function getRevenueByMonth() {
    const [rows] = await pool.query(`
        SELECT
            DATE_FORMAT(created_at,'%Y-%m') AS month,
            COUNT(*)                        AS total_orders,
            IFNULL(SUM(total_amount),0)     AS revenue
        FROM orders
        WHERE order_status='Completed'
        GROUP BY DATE_FORMAT(created_at,'%Y-%m')
        ORDER BY month DESC
        LIMIT 12
    `);
    return rows;
}

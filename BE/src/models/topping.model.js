const pool = require("../config/db");

// ==========================================
// Lấy tất cả topping
// ==========================================
async function findAll() {

    const [rows] = await pool.query(`
        SELECT *
        FROM toppings
        ORDER BY topping_name
    `);

    return rows;
}

// ==========================================
// Lấy topping theo ID
// ==========================================
async function findById(id) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM toppings
        WHERE topping_id = ?
        `,
        [id]
    );

    return rows[0];
}

// ==========================================
// Lấy topping theo sản phẩm
// ==========================================
async function findByProduct(productId) {

    const [rows] = await pool.query(
        `
        SELECT
            t.*
        FROM product_toppings pt
        INNER JOIN toppings t
            ON pt.topping_id = t.topping_id
        WHERE pt.product_id = ?
        ORDER BY t.topping_name
        `,
        [productId]
    );

    return rows;
}

module.exports = {

    findAll,

    findById,

    findByProduct

};
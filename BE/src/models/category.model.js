const pool = require("../config/db");

// =============================
// Lấy tất cả Category
// =============================
async function findAll() {

    const [rows] = await pool.query(`
        SELECT *
        FROM categories
        WHERE is_active = 1
        ORDER BY category_name
    `);

    return rows;
}

// =============================
// Category theo ID
// =============================
async function findById(id) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM categories
        WHERE category_id = ?
        `,
        [id]
    );

    return rows[0];
}

module.exports = {

    findAll,

    findById

};
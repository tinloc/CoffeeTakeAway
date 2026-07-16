const pool = require("../config/db");

// =========================================
// Lấy tất cả Size
// =========================================
async function findAll() {

    const [rows] = await pool.query(`
        SELECT *
        FROM sizes
        ORDER BY size_id
    `);

    return rows;
}

module.exports = {

    findAll

};
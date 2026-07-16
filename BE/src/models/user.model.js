const pool = require("../config/db");

// ===============================
// Lấy user theo ID
// ===============================
async function findById(userId) {

    const [rows] = await pool.query(
        `
        SELECT
            u.user_id,
            u.role_id,
            r.role_name,
            u.full_name,
            u.email,
            u.phone,
            u.avatar,
            u.gender,
            u.birthday,
            u.is_active,
            u.created_at
        FROM users u
        INNER JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.user_id = ?
        `,
        [userId]
    );

    return rows[0];
}

// ===============================
// Lấy user theo Email
// ===============================
async function findByEmail(email) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
}

// ===============================
// Cập nhật thông tin cá nhân
// ===============================
async function updateProfile(userId, user) {

    const sql = `
        UPDATE users
        SET
            full_name = ?,
            phone = ?,
            gender = ?,
            birthday = ?,
            avatar = ?
        WHERE user_id = ?
        `;

    const values = [
        user.full_name,
        user.phone,
        user.gender,
        user.birthday,
        user.avatar,
        userId
    ];

    const [result] = await pool.query(sql, values);

    return result;
}

// ===============================
// Cập nhật mật khẩu
// ===============================
async function updatePassword(userId, password) {

    const [result] = await pool.query(
        `
        UPDATE users
        SET password = ?
        WHERE user_id = ?
        `,
        [password, userId]
    );

    return result;
}

module.exports = {

    findById,

    findByEmail,

    updateProfile,

    updatePassword

};
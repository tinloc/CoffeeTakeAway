const pool = require("../config/db");

const findByEmail = async (email) => {

    const [rows] = await pool.query(
        `
        SELECT
            u.*,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = ?
        `,
        [email]
    );

    return rows[0];
};

const createUser = async (user) => {

    const [result] = await pool.query(
        `
        INSERT INTO users
        (
            role_id,
            full_name,
            email,
            password,
            phone
        )
        VALUES
        (?,?,?,?,?)
        `,
        [
            user.role_id,
            user.full_name,
            user.email,
            user.password,
            user.phone
        ]
    );

    return result.insertId;
};

module.exports = {
    findByEmail,
    createUser
};
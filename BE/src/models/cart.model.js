const pool = require("../config/db");

// ==========================================
// Lấy giỏ hàng của User
// ==========================================
async function findCartByUser(userId) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM cart
        WHERE user_id = ?
        `,
        [userId]
    );

    return rows[0];

}

// ==========================================
// Tạo giỏ hàng
// ==========================================
async function createCart(userId) {

    const [result] = await pool.query(
        `
        INSERT INTO cart(user_id)
        VALUES(?)
        `,
        [userId]
    );

    return result.insertId;

}

// ==========================================
// Lấy toàn bộ sản phẩm trong giỏ
// ==========================================
async function getCartItems(cartId) {

    const [rows] = await pool.query(
        `
        SELECT

            ci.cart_item_id,

            ci.quantity,

            ci.note,

            ps.product_size_id,

            ps.price,

            s.size_name,

            p.product_id,

            p.product_name,

            p.thumbnail

        FROM cart_items ci

        INNER JOIN product_sizes ps

            ON ci.product_size_id=ps.product_size_id

        INNER JOIN products p

            ON ps.product_id=p.product_id

        INNER JOIN sizes s

            ON ps.size_id=s.size_id

        WHERE ci.cart_id=?

        ORDER BY ci.created_at DESC
        `,
        [cartId]
    );

    return rows;

}

// ==========================================
// Kiểm tra sản phẩm đã tồn tại trong cart
// ==========================================
async function findCartItem(cartId, productSizeId) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM cart_items
        WHERE cart_id=?
        AND product_size_id=?
        `,
        [cartId, productSizeId]
    );

    return rows[0];

}

// ==========================================
// Thêm sản phẩm
// ==========================================
async function addItem(cartId, productSizeId, quantity, note) {

    const [result] = await pool.query(
        `
        INSERT INTO cart_items(

            cart_id,

            product_size_id,

            quantity,

            note

        )

        VALUES(?,?,?,?)
        `,
        [

            cartId,

            productSizeId,

            quantity,

            note

        ]
    );

    return result.insertId;

}

// ==========================================
// Cập nhật số lượng
// ==========================================
async function updateQuantity(cartItemId, quantity) {

    const [result] = await pool.query(
        `
        UPDATE cart_items

        SET quantity=?

        WHERE cart_item_id=?
        `,
        [

            quantity,

            cartItemId

        ]
    );

    return result;

}

// ==========================================
// Xóa Item
// ==========================================
async function deleteItem(cartItemId) {

    await pool.query(

        `
        DELETE FROM cart_items

        WHERE cart_item_id=?
        `,

        [

            cartItemId

        ]

    );

}

// ==========================================
// Xóa toàn bộ Cart
// ==========================================
async function clearCart(cartId) {

    await pool.query(

        `
        DELETE FROM cart_items

        WHERE cart_id=?
        `,

        [

            cartId

        ]

    );

}

module.exports={

    findCartByUser,

    createCart,

    getCartItems,

    findCartItem,

    addItem,

    updateQuantity,

    deleteItem,

    clearCart

};
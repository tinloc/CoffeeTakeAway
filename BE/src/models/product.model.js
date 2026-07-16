const pool = require("../config/db");

// ==========================================
// Lấy tất cả sản phẩm
// ==========================================
async function findAll() {

    const [rows] = await pool.query(`
        SELECT
            p.product_id,
            p.product_name,
            p.slug,
            p.description,
            p.base_price,
            p.thumbnail,
            p.sold,
            p.rating,
            p.view_count,
            p.is_featured,
            p.is_available,
            c.category_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        WHERE p.is_available = 1
        ORDER BY p.created_at DESC
    `);

    return rows;
}

// ==========================================
// Lấy sản phẩm theo ID
// ==========================================
async function findById(id) {

    const [rows] = await pool.query(`
        SELECT
            p.*,
            c.category_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        WHERE p.product_id = ?
    `, [id]);

    return rows[0];
}

// ==========================================
// Tìm kiếm theo tên
// ==========================================
async function search(keyword) {

    const [rows] = await pool.query(`
        SELECT
            p.product_id,
            p.product_name,
            p.slug,
            p.base_price,
            p.thumbnail,
            c.category_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        WHERE p.product_name LIKE ?
        AND p.is_available = 1
    `, [`%${keyword}%`]);

    return rows;
}

// ==========================================
// Lấy sản phẩm theo danh mục
// ==========================================
async function findByCategory(categoryId) {

    const [rows] = await pool.query(`
        SELECT
            *
        FROM products
        WHERE category_id = ?
        AND is_available = 1
        ORDER BY created_at DESC
    `,[categoryId]);

    return rows;
}

module.exports = {

    findAll,
    findById,
    search,
    findByCategory,

    getImages,
    getSizes,
    getToppings,

    getFeatured,
    getNewest,
    getBestSelling,

    findBySlug,

    getRelated

};

// ==========================================
// Hình ảnh sản phẩm
// ==========================================
async function getImages(productId) {

    const [rows] = await pool.query(
        `
        SELECT
            image_id,
            image_url,
            is_thumbnail
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_thumbnail DESC
        `,
        [productId]
    );

    return rows;

}

// ==========================================
// Size của sản phẩm
// ==========================================
async function getSizes(productId) {

    const [rows] = await pool.query(
        `
        SELECT
            ps.product_size_id,
            s.size_id,
            s.size_name,
            ps.price,
            ps.stock
        FROM product_sizes ps

        INNER JOIN sizes s

        ON ps.size_id=s.size_id

        WHERE ps.product_id=?

        ORDER BY s.size_id
        `,
        [productId]
    );

    return rows;

}

// ==========================================
// Topping của sản phẩm
// ==========================================
async function getToppings(productId) {

    const [rows] = await pool.query(
        `
        SELECT

            t.topping_id,

            t.topping_name,

            t.price,

            t.image

        FROM product_toppings pt

        INNER JOIN toppings t

        ON pt.topping_id=t.topping_id

        WHERE pt.product_id=?

        ORDER BY t.topping_name
        `,
        [productId]
    );

    return rows;

}

// ==========================================
// Sản phẩm nổi bật
// ==========================================
async function getFeatured() {

    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE is_featured = 1
        AND is_available = 1
        ORDER BY sold DESC
        LIMIT 8
    `);

    return rows;
}

// ==========================================
// Sản phẩm mới
// ==========================================
async function getNewest() {

    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE is_available = 1
        ORDER BY created_at DESC
        LIMIT 8
    `);

    return rows;
}

// ==========================================
// Bán chạy
// ==========================================
async function getBestSelling() {

    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE is_available = 1
        ORDER BY sold DESC
        LIMIT 8
    `);

    return rows;
}

// ==========================================
// Theo slug
// ==========================================
async function findBySlug(slug) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM products
        WHERE slug = ?
        `,
        [slug]
    );

    return rows[0];
}

// ==========================================
// Sản phẩm liên quan
// ==========================================
async function getRelated(productId, categoryId) {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM products
        WHERE category_id = ?
        AND product_id <> ?
        LIMIT 4
        `,
        [categoryId, productId]
    );

    return rows;
}
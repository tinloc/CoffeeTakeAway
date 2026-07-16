const Product = require("../models/product.model");

// ==========================================
// Lấy tất cả sản phẩm
// ==========================================
async function getAllProducts() {

    return await Product.findAll();

}

// ==========================================
// Lấy chi tiết sản phẩm
// ==========================================
async function getProductById(id) {

    const product = await Product.findById(id);

    if (!product) {
        throw new Error("Không tìm thấy sản phẩm.");
    }

    return product;

}

// ==========================================
// Tìm kiếm
// ==========================================
async function searchProducts(keyword) {

    return await Product.search(keyword);

}

// ==========================================
// Theo Category
// ==========================================
async function getByCategory(categoryId) {

    return await Product.findByCategory(categoryId);

}

module.exports = {

    getAllProducts,

    getProductById,

    searchProducts,

    getByCategory,
    
    getProductDetail,

    getFeaturedProducts,

    getNewestProducts,

    getBestSellingProducts,

    getProductBySlug,
    
    getRelatedProducts

};

// ==========================================
// Chi tiết sản phẩm
// ==========================================
async function getProductDetail(productId) {

    const product =
        await Product.findById(productId);

    if (!product) {

        throw new Error("Không tìm thấy sản phẩm.");

    }

    const images =
        await Product.getImages(productId);

    const sizes =
        await Product.getSizes(productId);

    const toppings =
        await Product.getToppings(productId);

    return {

        product,

        images,

        sizes,

        toppings

    };

}

async function getFeaturedProducts() {

    return await Product.getFeatured();

}

async function getNewestProducts() {

    return await Product.getNewest();

}

async function getBestSellingProducts() {

    return await Product.getBestSelling();

}

async function getProductBySlug(slug) {

    const product =
        await Product.findBySlug(slug);

    if (!product) {

        throw new Error("Không tìm thấy sản phẩm.");

    }

    return product;

}

async function getRelatedProducts(id) {

    const product =
        await Product.findById(id);

    if (!product) {

        throw new Error("Không tìm thấy sản phẩm.");

    }

    return await Product.getRelated(
        product.product_id,
        product.category_id
    );

}
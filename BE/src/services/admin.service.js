const AdminModel = require("../models/admin.model");

// ======================================
// Dashboard
// ======================================
async function getDashboard() {

    return await AdminModel.getDashboard();

}

// ======================================
// Danh sách User
// ======================================
async function getUsers() {

    return await AdminModel.getUsers();

}

// ======================================
// Khóa User
// ======================================
async function blockUser(id) {

    await AdminModel.blockUser(id);

}

// ======================================
// Mở khóa User
// ======================================
async function unblockUser(id) {

    await AdminModel.unblockUser(id);

}

// ======================================
// Danh sách Order
// ======================================
async function getOrders() {

    return await AdminModel.getOrders();

}

// ======================================
// Chi tiết Order
// ======================================
async function getOrder(id) {

    const order = await AdminModel.getOrder(id);

    if (!order) {

        throw new Error("Không tìm thấy đơn hàng.");

    }

    return order;

}

// ======================================
// Cập nhật trạng thái
// ======================================
async function updateOrderStatus(id, status) {

    const order = await AdminModel.getOrder(id);

    if (!order) {

        throw new Error("Không tìm thấy đơn hàng.");

    }

    const allowStatus = [

        "Pending",

        "Confirmed",

        "Preparing",

        "Delivering",

        "Completed",

        "Cancelled"

    ];

    if (!allowStatus.includes(status)) {

        throw new Error("Trạng thái không hợp lệ.");

    }

    await AdminModel.updateOrderStatus(

        id,

        status

    );

}

module.exports = {

    getDashboard,
    getUsers,
    blockUser,
    unblockUser,
    getOrders,
    getOrder,
    updateOrderStatus,

    getProducts,
    createProduct,
    updateProduct,
    toggleProductAvailability,
    deleteProduct,

    getCategories,
    createCategory,
    updateCategory,
    getRevenueByMonth

};

async function getProducts() {
    return await AdminModel.getProducts();
}

async function createProduct(body, thumbnailFilename) {
    const slug = body.slug || body.product_name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    const productId = await AdminModel.createProduct({
        category_id:  body.category_id,
        product_name: body.product_name,
        slug,
        description:  body.description,
        base_price:   body.base_price,
        thumbnail:    thumbnailFilename || null,
        is_featured:  body.is_featured
    });

    // Tạo giá theo size nếu có truyền
    const sizes = [
        { size_id: 1, price: body.price_s },
        { size_id: 2, price: body.price_m },
        { size_id: 3, price: body.price_l }
    ];
    await AdminModel.createProductSizes(productId, sizes);

    return productId;
}

async function updateProduct(id, body, thumbnailFilename) {
    await AdminModel.updateProduct(id, {
        category_id:  body.category_id,
        product_name: body.product_name,
        slug:         body.slug,
        description:  body.description,
        base_price:   body.base_price,
        thumbnail:    thumbnailFilename || null,
        is_featured:  body.is_featured,
        is_available: body.is_available
    });

    if (body.price_s || body.price_m || body.price_l) {
        const sizes = [
            { size_id: 1, price: body.price_s },
            { size_id: 2, price: body.price_m },
            { size_id: 3, price: body.price_l }
        ];
        await AdminModel.createProductSizes(id, sizes);
    }
}

async function toggleProductAvailability(id) {
    await AdminModel.toggleProductAvailability(id);
}

async function deleteProduct(id) {
    await AdminModel.deleteProduct(id);
}

async function getCategories() {
    return await AdminModel.getCategories();
}

async function createCategory(body, imageFilename) {
    return await AdminModel.createCategory({
        category_name: body.category_name,
        description:   body.description,
        image:         imageFilename || null
    });
}

async function updateCategory(id, body, imageFilename) {
    await AdminModel.updateCategory(id, {
        category_name: body.category_name,
        description:   body.description,
        image:         imageFilename || null
    });
}

async function getRevenueByMonth() {
    return await AdminModel.getRevenueByMonth();
}

const adminService = require("../services/admin.service");

// ======================================
// Dashboard
// ======================================
exports.getDashboard = async (req, res) => {

    try {

        const data = await adminService.getDashboard();

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Danh sách User
// ======================================
exports.getUsers = async (req, res) => {

    try {

        const users = await adminService.getUsers();

        res.json({
            success: true,
            data: users
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Khóa User
// ======================================
exports.blockUser = async (req, res) => {

    try {

        await adminService.blockUser(req.params.id);

        res.json({
            success: true,
            message: "Khóa tài khoản thành công."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Mở khóa User
// ======================================
exports.unblockUser = async (req, res) => {

    try {

        await adminService.unblockUser(req.params.id);

        res.json({
            success: true,
            message: "Mở khóa tài khoản thành công."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Danh sách Order
// ======================================
exports.getOrders = async (req, res) => {

    try {

        const orders = await adminService.getOrders();

        res.json({
            success: true,
            data: orders
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Chi tiết Order
// ======================================
exports.getOrder = async (req, res) => {

    try {

        const order = await adminService.getOrder(req.params.id);

        res.json({
            success: true,
            data: order
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Cập nhật trạng thái
// ======================================
exports.updateOrderStatus = async (req, res) => {

    try {

        await adminService.updateOrderStatus(

            req.params.id,

            req.body.status

        );

        res.json({

            success: true,

            message: "Cập nhật trạng thái thành công."

        });

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================
// Products
// ======================================
exports.getProducts = async (req, res) => {
    try {
        res.json({ success: true, data: await adminService.getProducts() });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createProduct = async (req, res) => {
    try {
        const id = await adminService.createProduct(req.body, req.file?.filename || null);
        res.status(201).json({ success: true, message: "Thêm sản phẩm thành công.", data: { product_id: id } });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        await adminService.updateProduct(req.params.id, req.body, req.file?.filename || null);
        res.json({ success: true, message: "Cập nhật sản phẩm thành công." });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.toggleProduct = async (req, res) => {
    try {
        await adminService.toggleProductAvailability(req.params.id);
        res.json({ success: true, message: "Đã cập nhật trạng thái." });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        await adminService.deleteProduct(req.params.id);
        res.json({ success: true, message: "Đã xoá sản phẩm." });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// ======================================
// Categories
// ======================================
exports.getCategories = async (req, res) => {
    try {
        res.json({ success: true, data: await adminService.getCategories() });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createCategory = async (req, res) => {
    try {
        const id = await adminService.createCategory(req.body, req.file?.filename || null);
        res.status(201).json({ success: true, message: "Thêm danh mục thành công.", data: { category_id: id } });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        await adminService.updateCategory(req.params.id, req.body, req.file?.filename || null);
        res.json({ success: true, message: "Cập nhật danh mục thành công." });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// ======================================
// Revenue by month
// ======================================
exports.getRevenue = async (req, res) => {
    try {
        res.json({ success: true, data: await adminService.getRevenueByMonth() });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

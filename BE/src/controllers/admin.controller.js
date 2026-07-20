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
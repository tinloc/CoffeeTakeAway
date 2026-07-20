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

    updateOrderStatus

};
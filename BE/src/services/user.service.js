const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

// ===============================
// Lấy thông tin người dùng
// ===============================
async function getProfile(userId) {

    const user = await userModel.findById(userId);

    if (!user) {
        throw new Error("Không tìm thấy người dùng.");
    }

    return user;
}

// ===============================
// Cập nhật hồ sơ
// ===============================
async function updateProfile(userId, data) {

    const user = await userModel.findById(userId);

    if (!user) {
        throw new Error("Người dùng không tồn tại.");
    }

    await userModel.updateProfile(userId, data);

    return await userModel.findById(userId);
}

// ===============================
// Đổi mật khẩu
// ===============================
async function changePassword(userId, oldPassword, newPassword) {

    const user = await userModel.findById(userId);

    if (!user) {
        throw new Error("Người dùng không tồn tại.");
    }

    const account = await userModel.findByEmail(user.email);

    const match = await bcrypt.compare(oldPassword, account.password);

    if (!match) {
        throw new Error("Mật khẩu cũ không chính xác.");
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await userModel.updatePassword(userId, hash);

    return true;
}

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};
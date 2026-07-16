const userService = require("../services/user.service");

// Lấy profile
exports.getProfile = async (req, res) => {

    try {

        const user = await userService.getProfile(req.user.user_id);

        res.json({
            success: true,
            data: user
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// Cập nhật profile
exports.updateProfile = async (req, res) => {

    try {

        const user = await userService.updateProfile(
            req.user.user_id,
            req.body
        );

        res.json({
            success: true,
            message: "Cập nhật thành công.",
            data: user
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

        await userService.changePassword(
            req.user.user_id,
            oldPassword,
            newPassword
        );

        res.json({
            success: true,
            message: "Đổi mật khẩu thành công."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};
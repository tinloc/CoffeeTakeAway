const bcrypt = require("bcryptjs");
const AuthModel = require("../models/auth.model");
const { generateToken } = require("../config/jwt");

const register = async (userData) => {
    // Kiểm tra email đã tồn tại
    const existingUser = await AuthModel.findByEmail(userData.email);

    if (existingUser) {
        throw new Error("Email đã được sử dụng.");
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
        role_id: 2, // Customer mặc định
        full_name: userData.full_name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone
    };

    const userId = await AuthModel.createUser(newUser);

    return {
        user_id: userId,
        full_name: newUser.full_name,
        email: newUser.email
    };
};

const login = async (email, password) => {
    const user = await AuthModel.findByEmail(email);

    if (!user) {
        throw new Error("Email không tồn tại.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Mật khẩu không chính xác.");
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            role_id: user.role_id
        }
    };
};

module.exports = {
    register,
    login
};
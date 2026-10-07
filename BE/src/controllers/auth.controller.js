const AuthService = require("../services/auth.service");
const Response = require("../utils/response");

const register = async (req, res) => {
    try {
        const user = await AuthService.register(req.body);

        return Response.success(
            res,
            "Đăng ký thành công",
            user,
            201
        );

    } catch (error) {

        return Response.error(
            res,
            error.message,
            400
        );

    }
};

const login = async (req, res) => {

    try {

        const result = await AuthService.login(
            req.body.email,
            req.body.password
        );

        return Response.success(
            res,
            "Đăng nhập thành công",
            result
        );

    } catch (error) {

        return Response.error(
            res,
            error.message,
            401
        );

    }
};

const logout = async (req, res) => {
    return Response.success(res, "Đăng xuất thành công");
};

module.exports = {
    register,
    login,
    logout
};
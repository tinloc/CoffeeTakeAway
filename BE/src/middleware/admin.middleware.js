function admin(req, res, next) {

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message: "Bạn chưa đăng nhập."

        });

    }

    if (req.user.role_id !== 1) {

        return res.status(403).json({

            success: false,

            message: "Bạn không có quyền truy cập."

        });

    }

    next();

}

module.exports = admin;
const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role_id: user.role_id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );

};

module.exports = {
    generateToken
};
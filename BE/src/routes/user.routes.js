const express = require("express");

const router = express.Router();

const controller = require("../controllers/user.controller");

const auth = require("../middleware/auth.middleware");

router.get(
    "/profile",
    auth,
    controller.getProfile
);

router.put(
    "/profile",
    auth,
    controller.updateProfile
);

router.put(
    "/change-password",
    auth,
    controller.changePassword
);

module.exports = router;
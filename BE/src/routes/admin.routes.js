const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");

const admin = require("../middleware/admin.middleware");

const controller = require("../controllers/admin.controller");

// Dashboard
router.get(

    "/dashboard",

    auth,

    admin,

    controller.getDashboard

);

// User
router.get(

    "/users",

    auth,

    admin,

    controller.getUsers

);

router.put(

    "/users/:id/block",

    auth,

    admin,

    controller.blockUser

);

router.put(

    "/users/:id/unblock",

    auth,

    admin,

    controller.unblockUser

);

// Order
router.get(

    "/orders",

    auth,

    admin,

    controller.getOrders

);

router.get(

    "/orders/:id",

    auth,

    admin,

    controller.getOrder

);

router.put(

    "/orders/:id/status",

    auth,

    admin,

    controller.updateOrderStatus

);

module.exports = router;
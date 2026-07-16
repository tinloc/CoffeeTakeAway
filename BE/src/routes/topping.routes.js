const express = require("express");

const router = express.Router();

const controller = require("../controllers/topping.controller");

router.get("/", controller.getAll);

router.get("/product/:productId", controller.getByProduct);

router.get("/:id", controller.getById);

module.exports = router;
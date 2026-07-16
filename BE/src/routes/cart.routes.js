const express = require("express");
const router = express.Router();

const controller = require("../controllers/cart.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getCart);

router.post("/add", auth, controller.addToCart);

router.put("/item/:id", auth, controller.updateCartItem);

router.delete("/item/:id", auth, controller.deleteCartItem);

router.delete("/clear", auth, controller.clearCart);

module.exports = router;
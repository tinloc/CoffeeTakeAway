const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const controller = require("../controllers/admin.controller");
const { createUploader } = require("../config/multer");

const uploadProduct  = createUploader("products");
const uploadCategory = createUploader("categories");

// Dashboard
router.get("/dashboard", auth, admin, controller.getDashboard);

// Revenue
router.get("/revenue", auth, admin, controller.getRevenue);

// Users
router.get("/users", auth, admin, controller.getUsers);
router.put("/users/:id/block",   auth, admin, controller.blockUser);
router.put("/users/:id/unblock", auth, admin, controller.unblockUser);

// Orders
router.get("/orders",              auth, admin, controller.getOrders);
router.get("/orders/:id",          auth, admin, controller.getOrder);
router.put("/orders/:id/status",   auth, admin, controller.updateOrderStatus);

// Products
router.get("/products",                auth, admin, controller.getProducts);
router.post("/products",               auth, admin, uploadProduct.single("thumbnail"), controller.createProduct);
router.put("/products/:id",            auth, admin, uploadProduct.single("thumbnail"), controller.updateProduct);
router.patch("/products/:id/toggle",   auth, admin, controller.toggleProduct);
router.delete("/products/:id",         auth, admin, controller.deleteProduct);

// Categories
router.get("/categories",       auth, admin, controller.getCategories);
router.post("/categories",      auth, admin, uploadCategory.single("image"), controller.createCategory);
router.put("/categories/:id",   auth, admin, uploadCategory.single("image"), controller.updateCategory);

module.exports = router;

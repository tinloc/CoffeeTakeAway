require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Import Routes
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Coffee TakeAway API",
        version: "1.0.0"
    });
});

module.exports = app;

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

const categoryRoutes =
require("./routes/category.routes");
app.use(
    "/api/categories",
    categoryRoutes
);

const sizeRoutes =
require("./routes/size.routes");
app.use(
"/api/sizes",
sizeRoutes
);

const toppingRoutes = require("./routes/topping.routes");
app.use("/api/toppings", toppingRoutes);

const cartRoutes = require("./routes/cart.routes");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/api/orders", orderRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);
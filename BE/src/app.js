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
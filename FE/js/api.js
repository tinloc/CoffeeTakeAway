// ======================================
// Coffee TakeAway API Configuration
// ======================================

const API = {

    BASE_URL: "http://localhost:3000/api",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        PROFILE: "/auth/profile",
        CHANGE_PASSWORD: "/auth/change-password",
        LOGOUT: "/auth/logout"
    },

    CATEGORY: {
        LIST: "/categories"
    },

    PRODUCT: {
        LIST: "/products",
        DETAIL: "/products"
    },

    CART: {
        LIST: "/cart",
        ADD: "/cart/add"
    },

    ORDER: {
        LIST: "/orders"
    }

};

// ===============================
// API Request
// ===============================

async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(API.BASE_URL + endpoint, {
        ...options,
        headers
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Server trả về dữ liệu không hợp lệ.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra.");
    }

    return data;
}
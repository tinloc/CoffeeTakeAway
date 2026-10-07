// ======================================
// Bunny API Configuration
// ======================================

const API = {

    BASE_URL: (() => {
        if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "null") {
            return `${window.location.origin}/api`;
        }
        return "http://localhost:3000/api";
    })(),

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout"
    },

    USERS: {
        PROFILE: "/users/profile",
        CHANGE_PASSWORD: "/users/change-password"
    },

    CATEGORY: {
        LIST: "/categories"
    },

    PRODUCT: {
        LIST: "/products",
        DETAIL: "/products",
        SEARCH: "/products/search",
        FEATURED: "/products/featured",
        NEWEST: "/products/newest",
        BEST_SELLING: "/products/best-selling"
    },

    CART: {
        LIST: "/cart",
        ADD: "/cart/add",
        UPDATE: "/cart/item",
        REMOVE: "/cart/item",
        CLEAR: "/cart/clear"
    },

    ORDER: {
        LIST: "/orders",
        CHECKOUT: "/orders/checkout"
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
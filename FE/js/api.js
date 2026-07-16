const API = {
    BASE_URL: "http://localhost:3000/api",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register"
    }
};

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

    return response.json();
}
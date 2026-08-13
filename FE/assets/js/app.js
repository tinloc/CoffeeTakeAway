// ======================================
// Bunny — App Core
// Xử lý: preloader, header, search,
//         mobile menu, back-to-top, cart count
// ======================================

"use strict";

/* ============================================================
   PRELOADER — ẩn sau khi trang tải xong
============================================================ */

const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {
    if (preloader) {
        preloader.classList.add("hide");
        // xoá khỏi DOM sau animation để không chặn click
        setTimeout(() => preloader.remove(), 500);
    }
});

// Fallback: ẩn sau 3 giây nếu load event không fire
setTimeout(() => {
    if (preloader && !preloader.classList.contains("hide")) {
        preloader.classList.add("hide");
    }
}, 3000);

/* ============================================================
   HEADER — sticky scroll effect
============================================================ */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ============================================================
   MOBILE MENU TOGGLE
============================================================ */

const menuToggle = document.getElementById("menuToggle");
const navbar    = document.querySelector(".navbar");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("open");
        menuToggle.setAttribute(
            "aria-expanded",
            navbar.classList.contains("open")
        );
    });

    // đóng khi click bên ngoài
    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            navbar.classList.remove("open");
        }
    });

    // đóng khi click vào nav-link
    navbar.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => navbar.classList.remove("open"));
    });
}

/* ============================================================
   SEARCH OVERLAY
============================================================ */

const searchBtn     = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch   = document.getElementById("closeSearch");
const searchInput   = document.getElementById("searchInput");

function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
    setTimeout(() => searchInput && searchInput.focus(), 300);
}

function closeSearchFn() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

if (searchBtn)     searchBtn.addEventListener("click", openSearch);
if (closeSearch)   closeSearch.addEventListener("click", closeSearchFn);

// đóng khi nhấn Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearchFn();
});

// đóng khi click ra ngoài search box
if (searchOverlay) {
    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) closeSearchFn();
    });
}

/* ============================================================
   BACK TO TOP
============================================================ */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (!backToTop) return;
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ============================================================
   CART COUNT — đọc từ localStorage
============================================================ */

function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (!countEl) return;

    try {
        const cart  = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        countEl.textContent = total;
        countEl.style.display = total > 0 ? "flex" : "none";
    } catch {
        countEl.textContent = "0";
    }
}

updateCartCount();

/* ============================================================
   AUTH STATE — hiển thị tên user nếu đã đăng nhập
============================================================ */

(function checkAuthState() {
    const token  = localStorage.getItem("token");
    const user   = JSON.parse(localStorage.getItem("user") || "null");
    const loginLink = document.querySelector('a[href="login.html"].header-action');

    if (token && user && loginLink) {
        // Đã đăng nhập — đổi icon thành avatar / tên
        loginLink.href  = "profile.html";
        loginLink.title = user.full_name || "Tài khoản";
        loginLink.setAttribute("aria-label", user.full_name || "Tài khoản");
    }
})();

/* ============================================================
   ACTIVE NAV LINK — highlight theo URL hiện tại
============================================================ */

(function setActiveNav() {
    const currentPage = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.split("#")[0] === currentPage) {
            link.classList.add("active");
        } else if (href !== "index.html") {
            link.classList.remove("active");
        }
    });
})();

/* ============================================================
   UTILITY — format tiền Việt Nam
============================================================ */

function formatCurrency(amount) {
    if (isNaN(amount)) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

/* ============================================================
   TOAST NOTIFICATION (dùng từ các trang khác)
============================================================ */

function showToast(message, type = "success", duration = 3000) {
    const existing = document.querySelector(".app-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `app-toast app-toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-xmark"}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // style inline để không phụ thuộc CSS riêng
    Object.assign(toast.style, {
        position:   "fixed",
        bottom:     "24px",
        right:      "24px",
        display:    "flex",
        alignItems: "center",
        gap:        "10px",
        background: type === "success" ? "#198754" : "#DC3545",
        color:      "#fff",
        padding:    "14px 20px",
        borderRadius: "12px",
        fontSize:   "14px",
        fontWeight: "600",
        boxShadow:  "0 8px 24px rgba(0,0,0,.15)",
        zIndex:     "9999",
        animation:  "none",
        opacity:    "1",
        transition: "opacity .3s ease",
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

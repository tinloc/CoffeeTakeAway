"use strict";

// =============================================
// Bunny — Home Page
// Countdown, Best Sellers, Categories, Search
// =============================================

// ─── Countdown Deal Of The Day ─────────────────────────

function initCountdown() {
    const daysEl    = document.getElementById("days");
    const hoursEl   = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    if (!daysEl) return;

    // Đặt deadline: cuối ngày hôm nay 23:59:59
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 0);

    function tick() {
        let diff = endTime - new Date();
        if (diff < 0) diff = 0;

        const d = Math.floor(diff / 86400000); diff %= 86400000;
        const h = Math.floor(diff / 3600000);  diff %= 3600000;
        const m = Math.floor(diff / 60000);    diff %= 60000;
        const s = Math.floor(diff / 1000);

        daysEl.textContent    = String(d).padStart(2, "0");
        hoursEl.textContent   = String(h).padStart(2, "0");
        minutesEl.textContent = String(m).padStart(2, "0");
        secondsEl.textContent = String(s).padStart(2, "0");
    }

    tick();
    setInterval(tick, 1000);
}

// ─── Best Sellers ─────────────────────────────────────

async function loadBestSellers() {
    const container = document.getElementById("bestSellerContainer");
    if (!container) return;

    try {
        const res      = await apiRequest(API.PRODUCT.BEST_SELLING);
        const products = (res.data || []).slice(0, 4);
        if (!products.length) return;

        container.innerHTML = products.map(p => {
            const img   = p.thumbnail
                ? "assets/images/products/" + p.thumbnail
                : "assets/images/products/placeholder.svg";
            const price = formatCurrency(parseFloat(p.base_price));
            return `
            <article class="product-card">
                <div class="product-image">
                    <img src="${img}" alt="${p.product_name}" loading="lazy"
                         onerror="this.src='assets/images/products/placeholder.svg'">
                    <div class="product-actions">
                        <button class="product-action" type="button" title="Xem chi tiết"
                                onclick="location.href='product.html?id=${p.product_id}'">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <span class="product-category">${p.category_name || ""}</span>
                    <h3 class="product-title">
                        <a href="product.html?id=${p.product_id}">${p.product_name}</a>
                    </h3>
                    <div class="product-rating">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <span>(${p.sold || 0})</span>
                    </div>
                    <div class="product-price">
                        <span class="price-current">${price}</span>
                    </div>
                    <div class="product-bottom">
                        <a href="product.html?id=${p.product_id}" class="btn btn-primary btn-sm">
                            <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                        </a>
                    </div>
                </div>
            </article>
            `;
        }).join("");
    } catch {}
}

// ─── Categories ───────────────────────────────────────

async function loadCategories() {
    const container = document.getElementById("categoryContainer");
    if (!container) return;

    try {
        const res        = await apiRequest(API.CATEGORY.LIST);
        const categories = res.data || [];
        if (!categories.length) return;

        container.innerHTML = categories.map(c => {
            const img = c.image
                ? "assets/images/categories/" + c.image
                : "assets/images/categories/placeholder.svg";
            return `
            <article class="category-card" role="button" tabindex="0"
                     style="cursor:pointer"
                     onclick="location.href='menu.html?category=${c.category_id}'"
                     onkeydown="if(event.key==='Enter') location.href='menu.html?category=${c.category_id}'"
                     aria-label="Xem danh mục ${c.category_name}">
                <img src="${img}" alt="${c.category_name}" loading="lazy"
                     onerror="this.src='assets/images/categories/placeholder.svg'">
                <h3>${c.category_name}</h3>
                <p>${c.description || ""}</p>
            </article>
            `;
        }).join("");
    } catch {}
}

// ─── Search Overlay ───────────────────────────────────

function initSearchForm() {
    const searchForm = document.getElementById("searchForm");
    if (!searchForm) return;
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = document.getElementById("searchInput")?.value.trim();
        if (keyword) window.location.href = "menu.html?q=" + encodeURIComponent(keyword);
    });
}

// ─── Cart count ───────────────────────────────────────

async function updateCartCount() {
    try {
        if (!localStorage.getItem("token")) return;
        const res   = await apiRequest(API.CART.LIST);
        const count = (res.data.items || []).reduce((s, i) => s + i.quantity, 0);
        const el    = document.getElementById("cartCount");
        if (el) { el.textContent = count; el.style.display = count > 0 ? "flex" : "none"; }
    } catch {}
}

// ─── Run ──────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    loadBestSellers();
    loadCategories();
    initSearchForm();
    updateCartCount();
});

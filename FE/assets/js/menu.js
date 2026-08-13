"use strict";

// =============================================
// Bunny — Menu Page
// =============================================

const PRODUCTS_PER_PAGE = 9;

let allProducts      = [];
let filteredProducts = [];
let currentPage      = 1;
let activeCategory   = "";

// DOM
const categoryTabs = document.getElementById("categoryTabs");
const productGrid  = document.getElementById("productGrid");
const menuLoading  = document.getElementById("menuLoading");
const menuEmpty    = document.getElementById("menuEmpty");
const productCount = document.getElementById("productCount");
const pagination   = document.getElementById("pagination");
const sortSelect   = document.getElementById("sortSelect");
const gridView     = document.getElementById("gridView");
const listView     = document.getElementById("listView");
const priceMin     = document.getElementById("priceMin");
const priceMax     = document.getElementById("priceMax");
const applyPrice   = document.getElementById("applyPrice");
const resetPrice   = document.getElementById("resetPrice");
const clearFilters = document.getElementById("clearFilters");

// ─── Init ─────────────────────────────────────────────

async function init() {
    const params   = new URLSearchParams(window.location.search);
    const searchQ  = params.get("q") || "";
    const catParam = params.get("category") || "";

    await loadCategories(catParam);

    if (searchQ) {
        await loadSearchResults(searchQ);
    } else {
        await loadAllProducts();
    }

    if (catParam) {
        activeCategory = catParam;
        setActiveTab(catParam);
        applyFilters();
    }

    bindEvents();
    updateCartCountFromAPI();
}

// ─── Load danh mục ────────────────────────────────────

async function loadCategories(activeCat) {
    try {
        const res = await apiRequest(API.CATEGORY.LIST);
        const categories = res.data || [];

        const tabs = categories.map(c => `
            <button class="category-tab ${activeCat === String(c.category_id) ? "active" : ""}"
                    data-id="${c.category_id}" type="button">
                ${c.category_name}
            </button>
        `).join("");

        categoryTabs.innerHTML = `
            <button class="category-tab ${!activeCat ? "active" : ""}" data-id="" type="button">Tất cả</button>
            ${tabs}
        `;
    } catch { /* giữ nguyên tab mặc định */ }
}

// ─── Load sản phẩm ────────────────────────────────────

async function loadAllProducts() {
    showLoading(true);
    try {
        const res = await apiRequest(API.PRODUCT.LIST);
        allProducts      = res.data || [];
        filteredProducts = [...allProducts];
        renderPage();
    } catch {
        showEmpty(true);
    } finally {
        showLoading(false);
    }
}

async function loadSearchResults(keyword) {
    showLoading(true);
    try {
        const res = await apiRequest(`${API.PRODUCT.SEARCH}?q=${encodeURIComponent(keyword)}`);
        allProducts      = res.data || [];
        filteredProducts = [...allProducts];
        renderPage();
    } catch {
        showEmpty(true);
    } finally {
        showLoading(false);
    }
}

// ─── Lọc & sắp xếp ────────────────────────────────────

function applyFilters() {
    let result = [...allProducts];

    // Lọc category
    if (activeCategory) {
        result = result.filter(p => String(p.category_id) === String(activeCategory));
    }

    // Lọc giá
    if (priceMin && priceMax && (priceMin.value || priceMax.value)) {
        const min = parseFloat(priceMin.value) || 0;
        const max = parseFloat(priceMax.value) || Infinity;
        result = result.filter(p => {
            const price = parseFloat(p.base_price);
            return price >= min && price <= max;
        });
    }

    // Lọc rating
    const ratingChecked = document.querySelector("input[name='rating']:checked");
    if (ratingChecked) {
        const minRating = parseFloat(ratingChecked.value);
        result = result.filter(p => parseFloat(p.rating) >= minRating);
    }

    // Sắp xếp
    const sort = sortSelect ? sortSelect.value : "default";
    if (sort === "price-asc") {
        result.sort((a, b) => parseFloat(a.base_price) - parseFloat(b.base_price));
    } else if (sort === "price-desc") {
        result.sort((a, b) => parseFloat(b.base_price) - parseFloat(a.base_price));
    } else if (sort === "name-asc") {
        result.sort((a, b) => a.product_name.localeCompare(b.product_name, "vi"));
    } else if (sort === "popular") {
        result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }

    filteredProducts = result;
    currentPage = 1;
    renderPage();
}

// ─── Render ───────────────────────────────────────────

function renderPage() {
    const start     = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageItems = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

    if (filteredProducts.length === 0) {
        showEmpty(true);
        productGrid.innerHTML = "";
        pagination.innerHTML  = "";
        if (productCount) productCount.textContent = "0";
        return;
    }

    showEmpty(false);
    if (productCount) productCount.textContent = filteredProducts.length;
    productGrid.innerHTML = pageItems.map(renderProductCard).join("");
    renderPagination();
}

function renderProductCard(p) {
    const price = formatCurrency(parseFloat(p.base_price));
    const img   = p.thumbnail
        ? "assets/images/products/" + p.thumbnail
        : "assets/images/products/placeholder.svg";
    const stars = renderStars(parseFloat(p.rating) || 0);
    const name  = (p.product_name || "").replace(/'/g, "\\'");

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
                    ${stars}
                    <span>(${p.sold || 0})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${price}</span>
                </div>
                <div class="product-bottom">
                    <button class="btn btn-primary btn-sm" type="button"
                            onclick="quickAddToCart(${p.product_id}, '${name}')">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderStars(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        if (rating >= i)            html += `<i class="fa-solid fa-star"></i>`;
        else if (rating >= i - 0.5) html += `<i class="fa-solid fa-star-half-stroke"></i>`;
        else                        html += `<i class="fa-regular fa-star"></i>`;
    }
    return html;
}

function renderPagination() {
    const total = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (total <= 1) { pagination.innerHTML = ""; return; }

    let html = "";
    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
    }
    for (let i = 1; i <= total; i++) {
        html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goPage(${i})">${i}</button>`;
    }
    if (currentPage < total) {
        html += `<button class="page-btn" onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
    }
    pagination.innerHTML = html;
}

window.goPage = function(page) {
    currentPage = page;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// ─── Quick Add to Cart ─────────────────────────────────

window.quickAddToCart = async function(productId, productName) {
    if (!localStorage.getItem("token")) {
        showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "error");
        setTimeout(() => location.href = "login.html", 1500);
        return;
    }
    try {
        const res   = await apiRequest(API.PRODUCT.DETAIL + "/" + productId + "/detail");
        const sizes = res.data.sizes || [];
        if (!sizes.length) { showToast("Sản phẩm chưa có size!", "error"); return; }

        await apiRequest(API.CART.ADD, {
            method: "POST",
            body: JSON.stringify({ product_size_id: sizes[0].product_size_id, quantity: 1 })
        });
        showToast("Đã thêm \"" + productName + "\" vào giỏ hàng!", "success");
        updateCartCountFromAPI();
    } catch (err) {
        showToast(err.message, "error");
    }
};

async function updateCartCountFromAPI() {
    try {
        if (!localStorage.getItem("token")) return;
        const res   = await apiRequest(API.CART.LIST);
        const count = (res.data.items || []).reduce((s, i) => s + i.quantity, 0);
        const el    = document.getElementById("cartCount");
        if (el) { el.textContent = count; el.style.display = count > 0 ? "flex" : "none"; }
    } catch {}
}

// ─── Hiện/ẩn trạng thái ───────────────────────────────

function showLoading(show) {
    if (menuLoading) menuLoading.classList.toggle("d-none", !show);
}
function showEmpty(show) {
    if (menuEmpty) menuEmpty.classList.toggle("d-none", !show);
}
function setActiveTab(categoryId) {
    if (!categoryTabs) return;
    categoryTabs.querySelectorAll(".category-tab").forEach(btn => {
        btn.classList.toggle("active", String(btn.dataset.id) === String(categoryId));
    });
}

// ─── Events ───────────────────────────────────────────

function bindEvents() {
    // Category tabs
    if (categoryTabs) {
        categoryTabs.addEventListener("click", (e) => {
            const btn = e.target.closest(".category-tab");
            if (!btn) return;
            activeCategory = btn.dataset.id;
            setActiveTab(btn.dataset.id);
            applyFilters();
        });
    }

    // Sort
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);

    // Price filter
    if (applyPrice) applyPrice.addEventListener("click", applyFilters);
    if (resetPrice) resetPrice.addEventListener("click", () => {
        if (priceMin) priceMin.value = "";
        if (priceMax) priceMax.value = "";
        applyFilters();
    });

    // Rating
    document.querySelectorAll("input[name='rating']").forEach(r => {
        r.addEventListener("change", applyFilters);
    });

    // Clear all filters
    if (clearFilters) {
        clearFilters.addEventListener("click", () => {
            activeCategory = "";
            setActiveTab("");
            if (priceMin) priceMin.value = "";
            if (priceMax) priceMax.value = "";
            const ratingChecked = document.querySelector("input[name='rating']:checked");
            if (ratingChecked) ratingChecked.checked = false;
            if (sortSelect) sortSelect.value = "default";
            filteredProducts = [...allProducts];
            currentPage = 1;
            renderPage();
        });
    }

    // View toggle
    if (gridView) gridView.addEventListener("click", () => {
        productGrid.className = "grid grid-3";
        gridView.classList.add("active");
        if (listView) listView.classList.remove("active");
    });
    if (listView) listView.addEventListener("click", () => {
        productGrid.className = "grid grid-1";
        listView.classList.add("active");
        if (gridView) gridView.classList.remove("active");
    });

    // Search overlay submit → chuyển về menu với từ khoá
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const keyword = document.getElementById("searchInput").value.trim();
            if (keyword) window.location.href = "menu.html?q=" + encodeURIComponent(keyword);
        });
    }
}

init();

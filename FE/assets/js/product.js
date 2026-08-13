"use strict";

// =============================================
// Bunny — Product Detail Page
// =============================================

let selectedSize     = null;
let selectedToppings = [];
let quantity         = 1;

// DOM
const productNameEl  = document.getElementById("productName");
const productDescEl  = document.getElementById("productDesc");
const detailCategory = document.getElementById("detailCategory");
const detailPrice    = document.getElementById("detailPrice");
const mainImage      = document.getElementById("mainImage");
const galleryThumbs  = document.getElementById("galleryThumbs");
const sizeList       = document.getElementById("sizeList");
const toppingList    = document.getElementById("toppingList");
const qtyMinus       = document.getElementById("qtyMinus");
const qtyPlus        = document.getElementById("qtyPlus");
const qtyValue       = document.getElementById("qtyValue");
const addToCartBtn   = document.getElementById("addToCartBtn");
const cartToast      = document.getElementById("cartToast");
const relatedSection = document.getElementById("relatedProducts");
const breadcrumbName = document.getElementById("breadcrumbName");

// ─── Init ─────────────────────────────────────────────

async function init() {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get("id");
    const slug   = params.get("slug");

    if (!id && !slug) {
        if (productNameEl) productNameEl.textContent = "Không tìm thấy sản phẩm.";
        return;
    }

    try {
        let productId = id;

        // Nếu truy cập bằng slug thì lấy id trước
        if (!productId && slug) {
            const slugRes = await apiRequest(API.PRODUCT.LIST + "/slug/" + slug);
            productId = slugRes.data.product_id;
        }

        const res    = await apiRequest(API.PRODUCT.DETAIL + "/" + productId + "/detail");
        const detail = res.data;

        renderProduct(detail);
        loadRelated(productId);
        updateCartCountFromAPI();

    } catch (err) {
        if (productNameEl) productNameEl.textContent = "Không tìm thấy sản phẩm.";
    }
}

// ─── Render sản phẩm ──────────────────────────────────

function renderProduct(detail) {
    const { product, images, sizes, toppings } = detail;

    // Title & Breadcrumb
    document.title = "Bunny | " + product.product_name;
    const pageTitle = document.getElementById("productBreadcrumbName");
    if (pageTitle)    pageTitle.textContent    = product.product_name;
    if (breadcrumbName) breadcrumbName.textContent = product.product_name;

    // Info
    if (productNameEl)  productNameEl.textContent  = product.product_name;
    if (productDescEl)  productDescEl.textContent  = product.description || "";
    if (detailCategory) detailCategory.textContent = product.category_name || "";

    // Ảnh
    renderGallery(product, images || []);

    // Giá mặc định (base_price)
    if (detailPrice) detailPrice.textContent = formatCurrency(parseFloat(product.base_price));

    // Size
    renderSizes(sizes || []);

    // Topping
    renderToppings(toppings || []);

    // Events
    bindEvents();
}

// ─── Gallery ──────────────────────────────────────────

function renderGallery(product, images) {
    const thumb = product.thumbnail
        ? "assets/images/products/" + product.thumbnail
        : "assets/images/products/placeholder.svg";

    if (mainImage) {
        mainImage.src = thumb;
        mainImage.onerror = function() { this.src = "assets/images/products/placeholder.svg"; };
    }

    if (galleryThumbs && images.length > 0) {
        galleryThumbs.innerHTML = images.map((img, i) => `
            <img src="assets/images/products/${img.image_url}"
                 class="gallery-thumb ${i === 0 ? "active" : ""}"
                 alt="Ảnh sản phẩm" loading="lazy"
                 onerror="this.src='assets/images/products/placeholder.svg'"
                 onclick="switchImage(this)">
        `).join("");
    }
}

window.switchImage = function(el) {
    if (mainImage) mainImage.src = el.src;
    document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
};

// ─── Sizes ────────────────────────────────────────────

function renderSizes(sizes) {
    const sizeGroup = document.getElementById("sizeGroup");
    if (!sizeList || !sizes.length) {
        if (sizeGroup) sizeGroup.classList.add("d-none");
        return;
    }

    sizeList.innerHTML = sizes.map((s, i) => `
        <button class="size-btn ${i === 0 ? "active" : ""}"
                type="button"
                data-size-id="${s.product_size_id}"
                data-price="${s.price}">
            ${s.size_name}
            <small>${formatCurrency(parseFloat(s.price))}</small>
        </button>
    `).join("");

    // Chọn size đầu tiên mặc định
    selectedSize = { product_size_id: sizes[0].product_size_id, price: parseFloat(sizes[0].price) };
    if (detailPrice) detailPrice.textContent = formatCurrency(parseFloat(sizes[0].price));

    sizeList.addEventListener("click", (e) => {
        const btn = e.target.closest(".size-btn");
        if (!btn) return;
        sizeList.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = {
            product_size_id: parseInt(btn.dataset.sizeId),
            price: parseFloat(btn.dataset.price)
        };
        updateTotalPrice();
    });
}

// ─── Toppings ─────────────────────────────────────────

function renderToppings(toppings) {
    const toppingGroup = document.getElementById("toppingGroup");
    if (!toppingList || !toppings.length) {
        if (toppingGroup) toppingGroup.classList.add("d-none");
        return;
    }

    toppingList.innerHTML = toppings.map(t => `
        <label class="topping-item">
            <input type="checkbox" value="${t.topping_id}" data-price="${t.price}">
            <span class="topping-name">${t.topping_name}</span>
            <span class="topping-price">+${formatCurrency(parseFloat(t.price))}</span>
        </label>
    `).join("");

    toppingList.addEventListener("change", (e) => {
        if (e.target.type !== "checkbox") return;
        const id    = parseInt(e.target.value);
        const price = parseFloat(e.target.dataset.price);
        if (e.target.checked) {
            selectedToppings.push({ topping_id: id, price });
        } else {
            selectedToppings = selectedToppings.filter(t => t.topping_id !== id);
        }
        updateTotalPrice();
    });
}

function updateTotalPrice() {
    if (!selectedSize) return;
    let total = selectedSize.price * quantity;
    selectedToppings.forEach(t => { total += t.price * quantity; });
    if (detailPrice) detailPrice.textContent = formatCurrency(total);
}

// ─── Sản phẩm liên quan ───────────────────────────────

async function loadRelated(productId) {
    if (!relatedSection) return;
    try {
        const res      = await apiRequest(API.PRODUCT.DETAIL + "/" + productId + "/related");
        const products = (res.data || []).slice(0, 4);
        if (!products.length) {
            const section = relatedSection.closest(".related-section");
            if (section) section.classList.add("d-none");
            return;
        }
        relatedSection.innerHTML = products.map(p => `
            <article class="product-card">
                <div class="product-image">
                    <a href="product.html?id=${p.product_id}">
                        <img src="assets/images/products/${p.thumbnail || "placeholder.svg"}"
                             alt="${p.product_name}" loading="lazy"
                             onerror="this.src='assets/images/products/placeholder.svg'">
                    </a>
                </div>
                <div class="product-content">
                    <span class="product-category">${p.category_name || ""}</span>
                    <h3 class="product-title">
                        <a href="product.html?id=${p.product_id}">${p.product_name}</a>
                    </h3>
                    <div class="product-price">
                        <span class="price-current">${formatCurrency(parseFloat(p.base_price))}</span>
                    </div>
                    <div class="product-bottom">
                        <a href="product.html?id=${p.product_id}" class="btn btn-primary btn-sm">Xem chi tiết</a>
                    </div>
                </div>
            </article>
        `).join("");
    } catch {}
}

// ─── Events ───────────────────────────────────────────

function bindEvents() {
    // Quantity
    if (qtyMinus) qtyMinus.addEventListener("click", () => {
        if (quantity > 1) { quantity--; if (qtyValue) qtyValue.textContent = quantity; updateTotalPrice(); }
    });
    if (qtyPlus) qtyPlus.addEventListener("click", () => {
        if (quantity < 99) { quantity++; if (qtyValue) qtyValue.textContent = quantity; updateTotalPrice(); }
    });

    // Add to cart
    if (addToCartBtn) addToCartBtn.addEventListener("click", addToCart);

    // Wishlist toggle
    const wishlistBtn = document.getElementById("wishlistBtn");
    if (wishlistBtn) {
        wishlistBtn.addEventListener("click", () => {
            const icon = wishlistBtn.querySelector("i");
            if (icon.classList.contains("fa-regular")) {
                icon.className = "fa-solid fa-heart";
                wishlistBtn.style.color = "var(--primary)";
            } else {
                icon.className = "fa-regular fa-heart";
                wishlistBtn.style.color = "";
            }
        });
    }

    // Search form
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const keyword = document.getElementById("searchInput").value.trim();
            if (keyword) window.location.href = "menu.html?q=" + encodeURIComponent(keyword);
        });
    }
}

// ─── Add to Cart ──────────────────────────────────────

async function addToCart() {
    if (!localStorage.getItem("token")) {
        showToast("Vui lòng đăng nhập để thêm vào giỏ!", "error");
        setTimeout(() => location.href = "login.html", 1500);
        return;
    }
    if (!selectedSize) {
        showToast("Vui lòng chọn size!", "error");
        return;
    }

    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Đang thêm...";

    try {
        await apiRequest(API.CART.ADD, {
            method: "POST",
            body: JSON.stringify({ product_size_id: selectedSize.product_size_id, quantity })
        });
        showToast("Đã thêm vào giỏ hàng!", "success");
        if (cartToast) {
            cartToast.classList.remove("d-none");
            setTimeout(() => cartToast.classList.add("d-none"), 3000);
        }
        updateCartCountFromAPI();
    } catch (err) {
        showToast(err.message, "error");
    } finally {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = "<i class='fa-solid fa-cart-plus'></i> Thêm vào giỏ";
    }
}

async function updateCartCountFromAPI() {
    try {
        if (!localStorage.getItem("token")) return;
        const res   = await apiRequest(API.CART.LIST);
        const count = (res.data.items || []).reduce((s, i) => s + i.quantity, 0);
        const el    = document.getElementById("cartCount");
        if (el) { el.textContent = count; el.style.display = count > 0 ? "flex" : "none"; }
    } catch {}
}

init();

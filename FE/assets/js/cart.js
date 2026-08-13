"use strict";

// =============================================
// Bunny — Cart & Checkout
// Xử lý cả cart.html và checkout.html
// =============================================

const isCartPage     = !!document.getElementById("cartTableBody");
const isCheckoutPage = !!document.getElementById("checkoutForm");

// ─── Init ─────────────────────────────────────────────

async function init() {
    // Search overlay
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const keyword = document.getElementById("searchInput").value.trim();
            if (keyword) window.location.href = "menu.html?q=" + encodeURIComponent(keyword);
        });
    }

    const token = localStorage.getItem("token");

    if (isCheckoutPage && !token) {
        location.href = "login.html";
        return;
    }

    if (isCartPage) {
        if (!token) { showCartEmpty(); return; }
        await loadCart();
    } else if (isCheckoutPage) {
        await loadCheckoutSummary();
        bindCheckoutEvents();
    }
}

// ─── CART PAGE ────────────────────────────────────────

async function loadCart() {
    try {
        const res    = await apiRequest(API.CART.LIST);
        const { items, total } = res.data;

        if (!items || items.length === 0) {
            showCartEmpty();
            return;
        }

        showCartLayout();
        renderCartItems(items, total);
        bindCartEvents();
    } catch (err) {
        showCartEmpty();
        showToast(err.message, "error");
    }
}

function showCartEmpty() {
    const empty  = document.getElementById("cartEmpty");
    const layout = document.getElementById("cartLayout");
    if (empty)  empty.classList.remove("d-none");
    if (layout) layout.classList.add("d-none");
}

function showCartLayout() {
    const empty  = document.getElementById("cartEmpty");
    const layout = document.getElementById("cartLayout");
    if (empty)  empty.classList.add("d-none");
    if (layout) layout.classList.remove("d-none");
}

function renderCartItems(items, total) {
    const tbody = document.getElementById("cartTableBody");
    if (!tbody) return;

    tbody.innerHTML = items.map(item => {
        const img = item.thumbnail
            ? "assets/images/products/" + item.thumbnail
            : "assets/images/products/placeholder.svg";
        return `
        <tr data-item-id="${item.cart_item_id}">
            <td class="col-product">
                <div class="cart-product">
                    <img src="${img}" alt="${item.product_name}"
                         onerror="this.src='assets/images/products/placeholder.svg'">
                    <div>
                        <a href="product.html?id=${item.product_id}" class="cart-product-name">
                            ${item.product_name}
                        </a>
                        <span class="cart-product-size">${item.size_name}</span>
                    </div>
                </div>
            </td>
            <td class="col-price">${formatCurrency(parseFloat(item.price))}</td>
            <td class="col-qty">
                <div class="quantity-control">
                    <button class="qty-btn" type="button"
                            onclick="changeQty(${item.cart_item_id}, ${item.quantity - 1})"
                            ${item.quantity <= 1 ? "disabled" : ""}>
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" type="button"
                            onclick="changeQty(${item.cart_item_id}, ${item.quantity + 1})">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </td>
            <td class="col-total">${formatCurrency(item.subtotal || parseFloat(item.price) * item.quantity)}</td>
            <td class="col-action">
                <button class="btn-remove" type="button"
                        onclick="removeItem(${item.cart_item_id})"
                        title="Xóa" aria-label="Xóa sản phẩm">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }).join("");

    updateCartTotals(total);
}

function updateCartTotals(total) {
    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl    = document.getElementById("cartTotal");
    const formatted  = formatCurrency(total || 0);
    if (subtotalEl) subtotalEl.textContent = formatted;
    if (totalEl)    totalEl.textContent    = formatted;
}

function bindCartEvents() {
    const clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", async () => {
            if (!confirm("Bạn có chắc muốn xoá toàn bộ giỏ hàng?")) return;
            try {
                await apiRequest(API.CART.CLEAR, { method: "DELETE" });
                showToast("Đã xoá giỏ hàng!", "success");
                showCartEmpty();
                updateCartBadge(0);
            } catch (err) {
                showToast(err.message, "error");
            }
        });
    }

    const applyCoupon = document.getElementById("applyCoupon");
    if (applyCoupon) {
        applyCoupon.addEventListener("click", () => {
            const code  = (document.getElementById("couponInput")?.value || "").trim();
            const msgEl = document.getElementById("couponMsg");
            if (!code) return;
            if (msgEl) {
                msgEl.textContent = "Mã giảm giá không hợp lệ hoặc đã hết hạn.";
                msgEl.className = "coupon-msg";
                msgEl.style.color = "red";
                msgEl.classList.remove("d-none");
            }
        });
    }
}

window.changeQty = async function(itemId, newQty) {
    if (newQty < 1) return;
    try {
        await apiRequest(API.CART.UPDATE + "/" + itemId, {
            method: "PUT",
            body: JSON.stringify({ quantity: newQty })
        });
        await loadCart();
        updateCartBadgeFromAPI();
    } catch (err) {
        showToast(err.message, "error");
    }
};

window.removeItem = async function(itemId) {
    try {
        await apiRequest(API.CART.REMOVE + "/" + itemId, { method: "DELETE" });
        showToast("Đã xóa sản phẩm!", "success");
        await loadCart();
        updateCartBadgeFromAPI();
    } catch (err) {
        showToast(err.message, "error");
    }
};

// ─── CHECKOUT PAGE ────────────────────────────────────

async function loadCheckoutSummary() {
    try {
        const res    = await apiRequest(API.CART.LIST);
        const { items, total } = res.data;

        if (!items || items.length === 0) {
            location.href = "cart.html";
            return;
        }

        renderCheckoutItems(items, total);

        // Điền thông tin user nếu có
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user) {
            const nameEl = document.getElementById("fullName");
            if (nameEl && user.full_name) nameEl.value = user.full_name;
        }
    } catch (err) {
        showToast(err.message, "error");
    }
}

function renderCheckoutItems(items, total) {
    const container = document.getElementById("checkoutItems");
    if (!container) return;

    container.innerHTML = items.map(item => {
        const img = item.thumbnail
            ? "assets/images/products/" + item.thumbnail
            : "assets/images/products/placeholder.svg";
        const sub = item.subtotal || parseFloat(item.price) * item.quantity;
        return `
        <div class="checkout-item">
            <img src="${img}" alt="${item.product_name}"
                 onerror="this.src='assets/images/products/placeholder.svg'">
            <div class="checkout-item-info">
                <span class="checkout-item-name">${item.product_name}
                    <small>(${item.size_name})</small>
                </span>
                <span class="checkout-item-qty">x${item.quantity}</span>
            </div>
            <span class="checkout-item-price">${formatCurrency(sub)}</span>
        </div>
        `;
    }).join("");

    const subtotalEl = document.getElementById("checkoutSubtotal");
    const totalEl    = document.getElementById("checkoutTotal");
    const formatted  = formatCurrency(total || 0);
    if (subtotalEl) subtotalEl.textContent = formatted;
    if (totalEl)    totalEl.textContent    = formatted;
}

function bindCheckoutEvents() {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", placeOrder);
    }
}

async function placeOrder() {
    const fullName = (document.getElementById("fullName")?.value || "").trim();
    const phone    = (document.getElementById("phone")?.value || "").trim();
    const address  = (document.getElementById("address")?.value || "").trim();
    const district = (document.getElementById("district")?.value || "").trim();
    const city     = (document.getElementById("city")?.value || "").trim();
    const note     = (document.getElementById("note")?.value || "").trim();
    const payment  = document.querySelector("input[name='payment']:checked")?.value || "cod";
    const msgEl    = document.getElementById("checkoutMsg");

    if (!fullName || !phone || !address || !district || !city) {
        if (msgEl) {
            msgEl.textContent = "Vui lòng điền đầy đủ thông tin giao hàng!";
            msgEl.style.color = "red";
            msgEl.classList.remove("d-none");
        }
        return;
    }

    const fullAddress = address + ", " + district + ", " + city;
    const btn = document.getElementById("placeOrderBtn");
    if (btn) { btn.disabled = true; btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Đang xử lý..."; }

    try {
        await apiRequest(API.ORDER.CHECKOUT, {
            method: "POST",
            body: JSON.stringify({
                payment_method: payment,
                note: fullName + " | " + phone + " | " + fullAddress + (note ? " | " + note : "")
            })
        });

        showToast("Đặt hàng thành công!", "success");
        if (msgEl) {
            msgEl.textContent = "✅ Đặt hàng thành công! Đang chuyển sang trang đơn hàng...";
            msgEl.style.color = "green";
            msgEl.classList.remove("d-none");
        }
        setTimeout(() => location.href = "orders.html", 2000);
    } catch (err) {
        if (msgEl) {
            msgEl.textContent = err.message;
            msgEl.style.color = "red";
            msgEl.classList.remove("d-none");
        }
        if (btn) { btn.disabled = false; btn.innerHTML = "<i class='fa-solid fa-check-circle'></i> Xác nhận đặt hàng"; }
    }
}

// ─── Cart Badge ───────────────────────────────────────

async function updateCartBadgeFromAPI() {
    try {
        if (!localStorage.getItem("token")) return;
        const res   = await apiRequest(API.CART.LIST);
        const count = (res.data.items || []).reduce((s, i) => s + i.quantity, 0);
        updateCartBadge(count);
    } catch {}
}

function updateCartBadge(count) {
    const el = document.getElementById("cartCount");
    if (el) { el.textContent = count; el.style.display = count > 0 ? "flex" : "none"; }
}

init();

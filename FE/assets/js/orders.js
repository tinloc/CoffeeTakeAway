"use strict";

// =============================================
// Bunny — Orders Page
// =============================================

// Auth guard
if (!localStorage.getItem("token")) {
    location.href = "login.html";
}

let allOrders  = [];
let currentTab = "all";

const ordersList    = document.getElementById("ordersList");
const ordersLoading = document.getElementById("ordersLoading");
const ordersEmpty   = document.getElementById("ordersEmpty");

// ─── Init ─────────────────────────────────────────────

async function init() {
    await loadOrders();
    bindTabEvents();
}

// ─── Load Orders ──────────────────────────────────────

async function loadOrders() {
    showLoading(true);
    try {
        const res = await apiRequest(API.ORDER.LIST);
        allOrders = res.data || [];
        renderOrders(allOrders);
    } catch (err) {
        showToast(err.message, "error");
        showEmpty(true);
    } finally {
        showLoading(false);
    }
}

// ─── Render ───────────────────────────────────────────

function renderOrders(orders) {
    if (!orders.length) {
        showEmpty(true);
        if (ordersList) ordersList.innerHTML = "";
        return;
    }
    showEmpty(false);
    if (ordersList) ordersList.innerHTML = orders.map(renderOrderCard).join("");
}

function renderOrderCard(order) {
    const statusClass = getStatusClass(order.order_status);
    const statusLabel = getStatusLabel(order.order_status);
    const date = new Date(order.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
    const total   = formatCurrency(parseFloat(order.total_amount || 0));
    const isPending = order.order_status === "Pending";

    return `
        <div class="order-card" data-status="${(order.order_status || "").toLowerCase()}">
            <div class="order-card-header">
                <div class="order-card-meta">
                    <span class="order-code">#${order.order_code || order.order_id}</span>
                    <span class="order-date"><i class="fa-regular fa-calendar"></i> ${date}</span>
                </div>
                <span class="order-status badge ${statusClass}">${statusLabel}</span>
            </div>
            <div class="order-card-body">
                <div class="order-meta">
                    <span><i class="fa-solid fa-credit-card"></i> ${order.payment_method || "COD"}</span>
                    <span><i class="fa-solid fa-circle-info"></i> ${order.payment_status || "Pending"}</span>
                </div>
                <div class="order-total">
                    Tổng tiền: <strong>${total}</strong>
                </div>
            </div>
            <div class="order-card-footer">
                <button class="btn btn-outline-primary btn-sm" type="button"
                        onclick="viewOrderDetail(${order.order_id})">
                    <i class="fa-solid fa-eye"></i> Xem chi tiết
                </button>
                ${isPending ? `
                <button class="btn btn-sm" type="button" style="color:red;border-color:red"
                        onclick="cancelOrder(${order.order_id})">
                    <i class="fa-solid fa-xmark"></i> Huỷ đơn
                </button>` : ""}
            </div>
        </div>
    `;
}

function getStatusClass(status) {
    const map = {
        "Pending":    "status-pending",
        "Processing": "status-processing",
        "Shipping":   "status-shipping",
        "Delivered":  "status-delivered",
        "Cancelled":  "status-cancelled"
    };
    return map[status] || "status-pending";
}

function getStatusLabel(status) {
    const map = {
        "Pending":    "Chờ xác nhận",
        "Processing": "Đang xử lý",
        "Shipping":   "Đang giao",
        "Delivered":  "Đã giao",
        "Cancelled":  "Đã huỷ"
    };
    return map[status] || (status || "Không rõ");
}

// ─── Tab Filter ───────────────────────────────────────

function bindTabEvents() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTab = btn.dataset.tab;
            filterOrders();
        });
    });
}

function filterOrders() {
    if (currentTab === "all") { renderOrders(allOrders); return; }
    const map = {
        "pending":    "Pending",
        "processing": "Processing",
        "shipping":   "Shipping",
        "delivered":  "Delivered",
        "cancelled":  "Cancelled"
    };
    const filtered = allOrders.filter(o => o.order_status === map[currentTab]);
    renderOrders(filtered);
}

// ─── Actions ──────────────────────────────────────────

window.viewOrderDetail = async function(orderId) {
    try {
        const res   = await apiRequest(API.ORDER.LIST + "/" + orderId);
        const data  = res.data;
        const order = data.order || data;
        const items = data.items || [];

        let itemsText = items.map(i => i.product_name + " x" + i.quantity).join(", ");
        const info = [
            "Mã đơn: #" + (order.order_code || orderId),
            "Trạng thái: " + getStatusLabel(order.order_status),
            "Tổng: " + formatCurrency(parseFloat(order.total_amount || 0)),
            items.length ? "Sản phẩm: " + itemsText : ""
        ].filter(Boolean).join("\n");

        alert(info);
    } catch (err) {
        showToast(err.message, "error");
    }
};

window.cancelOrder = async function(orderId) {
    if (!confirm("Bạn có chắc muốn huỷ đơn hàng này?")) return;
    try {
        await apiRequest(API.ORDER.LIST + "/" + orderId + "/cancel", { method: "PUT" });
        showToast("Đã huỷ đơn hàng!", "success");
        await loadOrders();
    } catch (err) {
        showToast(err.message, "error");
    }
};

// ─── Loading / Empty ──────────────────────────────────

function showLoading(show) {
    if (ordersLoading) ordersLoading.classList.toggle("d-none", !show);
}
function showEmpty(show) {
    if (ordersEmpty) ordersEmpty.classList.toggle("d-none", !show);
}

init();

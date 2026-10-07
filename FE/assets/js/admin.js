"use strict";

// =============================================
// Bunny — Admin Panel
// =============================================

const BASE = (() => {
    if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "null") {
        return `${window.location.origin}/api/admin`;
    }
    return "http://localhost:3000/api/admin";
})();

// Auth guard — chỉ cho role_id = 1
(function guard() {
    window.adminAuthorized = false;
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !user || user.role_id !== 1) {
        alert("Bạn không có quyền truy cập trang này.");
        location.replace("login.html");
        return;
    }
    window.adminAuthorized = true;
    const nameEl = document.getElementById("topbarName");
    const avatarEl = document.getElementById("topbarAvatar");
    if (nameEl) nameEl.textContent = user?.full_name || "Admin";
    if (avatarEl) avatarEl.textContent = (user?.full_name || "A")[0].toUpperCase();
})();

// ─── Helpers ─────────────────────────────────────────

function fmt(amount) {
    if (isNaN(amount)) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function fmtDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("vi-VN", { day:"2-digit", month:"2-digit", year:"numeric" });
}

function toast(msg, type = "success") {
    const t = document.createElement("div");
    t.className = "admin-toast";
    t.style.background = type === "success" ? "#198754" : type === "warning" ? "#D97706" : "#DC3545";
    t.innerHTML = `<i class="fa-solid fa-${type === "success" ? "circle-check" : "circle-xmark"}"></i> ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3000);
}

async function req(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";

    const res = await fetch(BASE + endpoint, { ...options, headers });
    let data;
    try { data = await res.json(); } catch { throw new Error("Lỗi kết nối server."); }
    if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra.");
    return data;
}

// ─── Navigation ───────────────────────────────────────

const pages = ["dashboard", "products", "categories", "orders", "users"];
const pageTitles = {
    dashboard: "Dashboard",
    products:  "Quản lý sản phẩm",
    categories:"Quản lý danh mục",
    orders:    "Quản lý đơn hàng",
    users:     "Quản lý người dùng"
};

function showPage(name) {
    pages.forEach(p => {
        document.getElementById(`page-${p}`)?.classList.remove("active");
    });
    document.querySelectorAll(".nav-item").forEach(el => {
        el.classList.toggle("active", el.dataset.page === name);
    });
    document.getElementById(`page-${name}`)?.classList.add("active");
    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = pageTitles[name] || name;
    loaders[name]?.();
}

const loaders = {
    dashboard:  loadDashboard,
    products:   loadProducts,
    categories: loadCategories,
    orders:     loadOrders,
    users:      loadUsers
};

document.querySelectorAll(".nav-item").forEach(el => {
    el.addEventListener("click", () => showPage(el.dataset.page));
});

document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

// ─── DASHBOARD ────────────────────────────────────────

async function loadDashboard() {
    try {
        const [dash, rev] = await Promise.all([
            req("/dashboard"),
            req("/revenue")
        ]);
        const d = dash.data;
        document.getElementById("statProducts").textContent = d.totalProducts ?? "—";
        document.getElementById("statOrders").textContent   = d.totalOrders ?? "—";
        document.getElementById("statPending").textContent  = d.pendingOrders ?? "—";
        document.getElementById("statUsers").textContent    = d.totalUsers ?? "—";
        document.getElementById("statRevenue").textContent  = fmt(d.totalRevenue);

        const tbody = document.getElementById("revenueTable");
        if (!tbody) return;
        const rows = rev.data || [];
        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:20px;color:#aaa">Chưa có dữ liệu doanh thu</td></tr>`;
            return;
        }
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td>${r.month}</td>
                <td>${r.total_orders}</td>
                <td><strong>${fmt(r.revenue)}</strong></td>
            </tr>
        `).join("");
    } catch (err) {
        toast(err.message, "error");
    }
}

// ─── PRODUCTS ─────────────────────────────────────────

let allProducts = [];
let allCategories = [];

async function loadProducts() {
    try {
        const [pr, cr] = await Promise.all([req("/products"), req("/categories")]);
        allProducts   = pr.data || [];
        allCategories = cr.data || [];
        renderProducts(allProducts);
    } catch (err) { toast(err.message, "error"); }
}

function renderProducts(list) {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="9" class="td-empty">Không có sản phẩm</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map((p, i) => {
        const img = p.thumbnail
            ? `assets/images/products/${p.thumbnail}`
            : "assets/images/products/placeholder.svg";
        return `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${img}" class="thumb-sm" onerror="this.src='assets/images/products/placeholder.svg'" alt="${p.product_name}"></td>
            <td><strong>${p.product_name}</strong></td>
            <td>${p.category_name || "—"}</td>
            <td>${fmt(p.base_price)}</td>
            <td>${p.is_featured ? '<span class="badge badge-warning">Nổi bật</span>' : '<span class="badge badge-gray">Bình thường</span>'}</td>
            <td>${p.is_available
                ? '<span class="badge badge-success">Đang bán</span>'
                : '<span class="badge badge-danger">Ẩn</span>'}</td>
            <td>${p.sold ?? 0}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-warning btn-sm" onclick="openEditProduct(${p.product_id})" title="Sửa">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm ${p.is_available ? 'btn-outline' : 'btn-success'}"
                            onclick="toggleProduct(${p.product_id})" title="${p.is_available ? 'Ẩn' : 'Hiện'}">
                        <i class="fa-solid fa-${p.is_available ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.product_id}, '${p.product_name.replace(/'/g,"\\'")}')" title="Xoá">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join("");
}

document.getElementById("productSearch")?.addEventListener("input", function () {
    const q = this.value.toLowerCase();
    renderProducts(allProducts.filter(p => p.product_name.toLowerCase().includes(q)));
});

document.getElementById("btnAddProduct")?.addEventListener("click", () => openProductForm(null));

function openProductForm(product) {
    const isEdit = !!product;
    const catOptions = allCategories.map(c =>
        `<option value="${c.category_id}" ${product && product.category_id == c.category_id ? "selected" : ""}>${c.category_name}</option>`
    ).join("");

    openModal(
        isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới",
        `<form id="productForm" enctype="multipart/form-data">
            <div class="form-row">
                <div class="form-group">
                    <label>Tên sản phẩm *</label>
                    <input class="form-control" name="product_name" required value="${product?.product_name || ""}" placeholder="Tên sản phẩm">
                </div>
                <div class="form-group">
                    <label>Danh mục *</label>
                    <select class="form-select" name="category_id" required>${catOptions}</select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Giá gốc (đ) *</label>
                    <input class="form-control" name="base_price" type="number" min="0" step="1000" required value="${product?.base_price || ""}">
                </div>
                <div class="form-group">
                    <label>Slug (URL)</label>
                    <input class="form-control" name="slug" value="${product?.slug || ""}" placeholder="tu-dong-tao-neu-bo-trong">
                </div>
            </div>
            <div class="form-group">
                <label>Mô tả</label>
                <textarea class="form-control" name="description" placeholder="Mô tả sản phẩm...">${product?.description || ""}</textarea>
            </div>
            <div class="form-group">
                <label>Giá theo size (để trống nếu không thay đổi)</label>
                <div class="price-grid">
                    <div class="form-group"><label>Size S</label><input class="form-control" name="price_s" type="number" min="0" step="1000" placeholder="Giá S"></div>
                    <div class="form-group"><label>Size M</label><input class="form-control" name="price_m" type="number" min="0" step="1000" placeholder="Giá M"></div>
                    <div class="form-group"><label>Size L</label><input class="form-control" name="price_l" type="number" min="0" step="1000" placeholder="Giá L"></div>
                </div>
            </div>
            <div class="form-group">
                <label>Ảnh thumbnail</label>
                <input class="form-control" name="thumbnail" type="file" accept="image/*">
                ${product?.thumbnail ? `<small style="color:#888">Ảnh hiện tại: ${product.thumbnail}</small>` : ""}
            </div>
            <div class="form-group">
                <label class="check-label">
                    <input type="checkbox" name="is_featured" value="1" ${product?.is_featured ? "checked" : ""}> Sản phẩm nổi bật
                </label>
            </div>
            ${isEdit ? `<input type="hidden" name="_method" value="PUT">` : ""}
        </form>`,
        async () => {
            const form = document.getElementById("productForm");
            const formData = new FormData(form);
            if (formData.get("is_featured") !== "1") formData.set("is_featured", "0");
            try {
                if (isEdit) {
                    await fetch(`${BASE}/products/${product.product_id}`, {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        body: formData
                    }).then(r => r.json()).then(d => { if (!d.success) throw new Error(d.message); });
                } else {
                    await fetch(`${BASE}/products`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        body: formData
                    }).then(r => r.json()).then(d => { if (!d.success) throw new Error(d.message); });
                }
                toast(isEdit ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm!", "success");
                closeModal();
                loadProducts();
            } catch (err) { toast(err.message, "error"); }
        }
    );
}

window.openEditProduct = async function(id) {
    const p = allProducts.find(x => x.product_id === id);
    if (p) openProductForm(p);
};

window.toggleProduct = async function(id) {
    try {
        await req(`/products/${id}/toggle`, { method: "PATCH" });
        toast("Đã cập nhật trạng thái!", "success");
        loadProducts();
    } catch (err) { toast(err.message, "error"); }
};

window.deleteProduct = async function(id, name) {
    if (!confirm(`Xoá sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
    try {
        await req(`/products/${id}`, { method: "DELETE" });
        toast("Đã xoá sản phẩm!", "success");
        loadProducts();
    } catch (err) { toast(err.message, "error"); }
};

// ─── CATEGORIES ───────────────────────────────────────

let allCategoriesAdmin = [];

async function loadCategories() {
    try {
        const res = await req("/categories");
        allCategoriesAdmin = res.data || [];
        renderCategories(allCategoriesAdmin);
    } catch (err) { toast(err.message, "error"); }
}

function renderCategories(list) {
    const tbody = document.getElementById("categoryTableBody");
    if (!tbody) return;
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="td-empty">Không có danh mục</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map((c, i) => {
        const img = c.image
            ? `assets/images/categories/${c.image}`
            : "assets/images/categories/placeholder.svg";
        return `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${img}" class="thumb-sm" onerror="this.src='assets/images/categories/placeholder.svg'" alt="${c.category_name}"></td>
            <td><strong>${c.category_name}</strong></td>
            <td>${c.description || "—"}</td>
            <td><span class="badge ${c.is_active ? 'badge-success' : 'badge-danger'}">${c.is_active ? 'Hoạt động' : 'Ẩn'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-warning btn-sm" onclick="openEditCategory(${c.category_id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join("");
}

document.getElementById("btnAddCategory")?.addEventListener("click", () => openCategoryForm(null));

function openCategoryForm(cat) {
    const isEdit = !!cat;
    openModal(
        isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới",
        `<form id="categoryForm">
            <div class="form-group">
                <label>Tên danh mục *</label>
                <input class="form-control" name="category_name" required value="${cat?.category_name || ""}" placeholder="Tên danh mục">
            </div>
            <div class="form-group">
                <label>Mô tả</label>
                <textarea class="form-control" name="description" placeholder="Mô tả ngắn...">${cat?.description || ""}</textarea>
            </div>
            <div class="form-group">
                <label>Ảnh danh mục</label>
                <input class="form-control" name="image" type="file" accept="image/*">
                ${cat?.image ? `<small style="color:#888">Ảnh hiện tại: ${cat.image}</small>` : ""}
            </div>
        </form>`,
        async () => {
            const form = document.getElementById("categoryForm");
            const formData = new FormData(form);
            try {
                const endpoint = isEdit ? `/categories/${cat.category_id}` : "/categories";
                const method   = isEdit ? "PUT" : "POST";
                await fetch(`${BASE}${endpoint}`, {
                    method,
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    body: formData
                }).then(r => r.json()).then(d => { if (!d.success) throw new Error(d.message); });
                toast(isEdit ? "Đã cập nhật danh mục!" : "Đã thêm danh mục!", "success");
                closeModal();
                loadCategories();
            } catch (err) { toast(err.message, "error"); }
        }
    );
}

window.openEditCategory = function(id) {
    const c = allCategoriesAdmin.find(x => x.category_id === id);
    if (c) openCategoryForm(c);
};

// ─── ORDERS ───────────────────────────────────────────

let allOrders = [];

const ORDER_STATUS_MAP = {
    Pending:    { label: "Chờ xác nhận", cls: "badge-warning" },
    Confirmed:  { label: "Đã xác nhận",  cls: "badge-info" },
    Preparing:  { label: "Đang pha chế", cls: "badge-brown" },
    Delivering: { label: "Đang giao",    cls: "badge-brown" },
    Completed:  { label: "Đã hoàn tất",  cls: "badge-success" },
    Cancelled:  { label: "Đã huỷ",       cls: "badge-danger" }
};

async function loadOrders() {
    try {
        const res = await req("/orders");
        allOrders = res.data || [];
        renderOrders(allOrders);
    } catch (err) { toast(err.message, "error"); }
}

function renderOrders(list) {
    const tbody = document.getElementById("orderTableBody");
    if (!tbody) return;
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="td-empty">Không có đơn hàng</td></tr>`;
        return;
    }
    const statusOptions = Object.entries(ORDER_STATUS_MAP)
        .map(([val, { label }]) => `<option value="${val}">${label}</option>`).join("");

    tbody.innerHTML = list.map(o => {
        const s = ORDER_STATUS_MAP[o.order_status] || { label: o.order_status, cls: "badge-gray" };
        return `
        <tr>
            <td><code>#${o.order_code || o.order_id}</code></td>
            <td>${o.full_name || "—"}</td>
            <td><strong>${fmt(o.total_amount)}</strong></td>
            <td>${o.payment_method || "COD"}</td>
            <td><span class="badge ${s.cls}">${s.label}</span></td>
            <td>${fmtDate(o.created_at)}</td>
            <td>
                <select class="form-select" style="font-size:12px;padding:5px 8px;max-width:150px"
                        onchange="updateOrderStatus(${o.order_id}, this.value)">
                    ${statusOptions.replace(`value="${o.order_status}"`, `value="${o.order_status}" selected`)}
                </select>
            </td>
        </tr>`;
    }).join("");
}

document.getElementById("orderStatusFilter")?.addEventListener("change", function() {
    const val = this.value;
    renderOrders(val ? allOrders.filter(o => o.order_status === val) : allOrders);
});

window.updateOrderStatus = async function(id, status) {
    try {
        await req(`/orders/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status })
        });
        toast("Đã cập nhật trạng thái đơn hàng!", "success");
        const o = allOrders.find(x => x.order_id === id);
        if (o) o.order_status = status;
    } catch (err) { toast(err.message, "error"); }
};

// ─── USERS ────────────────────────────────────────────

let allUsers = [];

async function loadUsers() {
    try {
        const res = await req("/users");
        allUsers = res.data || [];
        renderUsers(allUsers);
    } catch (err) { toast(err.message, "error"); }
}

function renderUsers(list) {
    const tbody = document.getElementById("userTableBody");
    if (!tbody) return;
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="td-empty">Không có người dùng</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map((u, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${u.full_name || "—"}</td>
            <td>${u.email}</td>
            <td>${u.phone || "—"}</td>
            <td><span class="badge ${u.is_active ? 'badge-success' : 'badge-danger'}">${u.is_active ? 'Hoạt động' : 'Đã khoá'}</span></td>
            <td>${fmtDate(u.created_at)}</td>
            <td>
                <button class="btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}"
                        onclick="toggleUser(${u.user_id}, ${u.is_active})">
                    <i class="fa-solid fa-${u.is_active ? 'lock' : 'lock-open'}"></i>
                    ${u.is_active ? 'Khoá' : 'Mở khoá'}
                </button>
            </td>
        </tr>
    `).join("");
}

document.getElementById("userSearch")?.addEventListener("input", function() {
    const q = this.value.toLowerCase();
    renderUsers(allUsers.filter(u =>
        (u.full_name || "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ));
});

window.toggleUser = async function(id, isActive) {
    const action = isActive ? "block" : "unblock";
    try {
        await req(`/users/${id}/${action}`, { method: "PUT" });
        toast(isActive ? "Đã khoá tài khoản!" : "Đã mở khoá tài khoản!", "success");
        loadUsers();
    } catch (err) { toast(err.message, "error"); }
};

// ─── MODAL ────────────────────────────────────────────

let modalConfirmFn = null;

function openModal(title, bodyHTML, onConfirm) {
    document.getElementById("modalTitle").textContent  = title;
    document.getElementById("modalBody").innerHTML     = bodyHTML;
    document.getElementById("modalOverlay").classList.remove("d-none");
    modalConfirmFn = onConfirm;
}

function closeModal() {
    document.getElementById("modalOverlay").classList.add("d-none");
    modalConfirmFn = null;
}

document.getElementById("modalClose")?.addEventListener("click", closeModal);
document.getElementById("modalCancel")?.addEventListener("click", closeModal);
document.getElementById("modalConfirm")?.addEventListener("click", () => modalConfirmFn?.());
document.getElementById("modalOverlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ─── Init ─────────────────────────────────────────────

if (window.adminAuthorized) loadDashboard();

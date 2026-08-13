"use strict";

// =============================================
// Bunny — Profile Page
// =============================================

// Auth guard
if (!localStorage.getItem("token")) {
    location.href = "login.html";
}

// ─── Load Profile ─────────────────────────────────────

async function init() {
    try {
        const res  = await apiRequest(API.USERS.PROFILE);
        const user = res.data;

        // Fill form fields
        const nameEl  = document.getElementById("profileFullName");
        const phoneEl = document.getElementById("profilePhone");
        const emailEl = document.getElementById("profileEmail");
        if (nameEl)  nameEl.value  = user.full_name || "";
        if (phoneEl) phoneEl.value = user.phone || "";
        if (emailEl) emailEl.value = user.email || "";

        // Sidebar
        const sidebarName  = document.getElementById("sidebarName");
        const sidebarEmail = document.getElementById("sidebarEmail");
        if (sidebarName)  sidebarName.textContent  = user.full_name || "Người dùng";
        if (sidebarEmail) sidebarEmail.textContent = user.email || "";

    } catch (err) {
        showToast(err.message, "error");
    }
}

// ─── Tab Navigation ───────────────────────────────────

document.querySelectorAll(".profile-nav-link[data-tab]").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;

        document.querySelectorAll(".profile-nav-link").forEach(l => l.classList.remove("active"));
        document.querySelectorAll(".profile-block").forEach(b => b.classList.add("d-none"));

        link.classList.add("active");
        const block = document.getElementById(tab);
        if (block) block.classList.remove("d-none");
    });
});

// ─── Save Profile ─────────────────────────────────────

const profileForm = document.getElementById("profileForm");
if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msgEl = document.getElementById("profileMsg");
        const btn   = document.getElementById("saveProfileBtn");
        const body  = {
            full_name: (document.getElementById("profileFullName")?.value || "").trim(),
            phone:     (document.getElementById("profilePhone")?.value || "").trim()
        };

        if (btn) btn.disabled = true;
        try {
            await apiRequest(API.USERS.PROFILE, {
                method: "PUT",
                body: JSON.stringify(body)
            });
            showToast("Cập nhật thành công!", "success");
            if (msgEl) {
                msgEl.textContent = "Cập nhật thành công!";
                msgEl.style.color = "green";
                msgEl.classList.remove("d-none");
            }

            // Sync localStorage
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            stored.full_name = body.full_name;
            localStorage.setItem("user", JSON.stringify(stored));

            const sidebarName = document.getElementById("sidebarName");
            if (sidebarName) sidebarName.textContent = body.full_name;
        } catch (err) {
            if (msgEl) {
                msgEl.textContent = err.message;
                msgEl.style.color = "red";
                msgEl.classList.remove("d-none");
            }
        } finally {
            if (btn) btn.disabled = false;
        }
    });
}

// ─── Change Password ──────────────────────────────────

const passwordForm = document.getElementById("passwordForm");
if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msgEl       = document.getElementById("passwordMsg");
        const current     = document.getElementById("currentPassword")?.value || "";
        const newPass     = document.getElementById("newPassword")?.value || "";
        const confirmPass = document.getElementById("confirmPassword")?.value || "";
        const btn         = document.getElementById("changePasswordBtn");

        if (newPass.length < 6) {
            if (msgEl) { msgEl.textContent = "Mật khẩu mới tối thiểu 6 ký tự."; msgEl.style.color = "red"; msgEl.classList.remove("d-none"); }
            return;
        }
        if (newPass !== confirmPass) {
            if (msgEl) { msgEl.textContent = "Mật khẩu xác nhận không khớp."; msgEl.style.color = "red"; msgEl.classList.remove("d-none"); }
            return;
        }

        if (btn) btn.disabled = true;
        try {
            await apiRequest(API.USERS.CHANGE_PASSWORD, {
                method: "PUT",
                body: JSON.stringify({ oldPassword: current, newPassword: newPass })
            });
            showToast("Đổi mật khẩu thành công!", "success");
            if (msgEl) { msgEl.textContent = "Đổi mật khẩu thành công!"; msgEl.style.color = "green"; msgEl.classList.remove("d-none"); }
            passwordForm.reset();
        } catch (err) {
            if (msgEl) { msgEl.textContent = err.message; msgEl.style.color = "red"; msgEl.classList.remove("d-none"); }
        } finally {
            if (btn) btn.disabled = false;
        }
    });
}

// ─── Toggle Password Visibility ───────────────────────

document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const icon = btn.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            if (icon) icon.className = "fa-regular fa-eye-slash";
        } else {
            input.type = "password";
            if (icon) icon.className = "fa-regular fa-eye";
        }
    });
});

// ─── Logout ───────────────────────────────────────────

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.href = "login.html";
    });
}

// ─── Avatar Preview ───────────────────────────────────

const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const preview = document.getElementById("avatarPreview");
            if (preview) preview.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
}

init();

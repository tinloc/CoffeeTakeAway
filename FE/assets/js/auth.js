// ======================================
// Coffee TakeAway Authentication
// ======================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

//==============================
// Hiển thị thông báo
//==============================

function showMessage(text, type = "error") {

    if (!message) return;

    message.textContent = text;

    message.className = type;

}

//==============================
// Lưu thông tin đăng nhập
//==============================

function saveLogin(data) {

    localStorage.setItem("token", data.token);

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

}

//==============================
// LOGIN
//==============================

if (loginForm) {

    loginForm.addEventListener("submit", login);

}

async function login(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if (!email || !password) {

        return showMessage("Vui lòng nhập đầy đủ thông tin.");

    }

    try {

        const result = await apiRequest(

            API.AUTH.LOGIN,

            {

                method: "POST",

                body: JSON.stringify({

                    email,

                    password

                })

            }

        );

        saveLogin(result.data);

        showMessage(result.message, "success");

        setTimeout(() => {

            location.href = "index.html";

        }, 1000);

    } catch (err) {

        showMessage(err.message);

    }

}

//==============================
// REGISTER
//==============================

if (registerForm) {

    registerForm.addEventListener("submit", register);

}

async function register(e) {

    e.preventDefault();

    const body = {

        full_name: document.getElementById("full_name").value.trim(),

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value,

        phone: document.getElementById("phone").value.trim()

    };

    if (body.full_name.length < 3) {

        return showMessage("Họ tên tối thiểu 3 ký tự.");

    }

    if (body.password.length < 6) {

        return showMessage("Mật khẩu tối thiểu 6 ký tự.");

    }

    try {

        const result = await apiRequest(

            API.AUTH.REGISTER,

            {

                method: "POST",

                body: JSON.stringify(body)

            }

        );

        showMessage(result.message, "success");

        setTimeout(() => {

            location.href = "login.html";

        }, 1200);

    }

    catch (err) {

        showMessage(err.message);

    }

}
// ===============================
// Coffee TakeAway Authentication
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", login);
}

async function login(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.textContent = "";

    if (!email || !password) {
        message.textContent = "Vui lòng nhập đầy đủ thông tin.";
        return;
    }

    try {

        const result = await apiRequest(API.AUTH.LOGIN, {

            method: "POST",

            body: JSON.stringify({
                email,
                password
            })

        });

        if (result.success) {

            localStorage.setItem("token", result.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(result.data.user)
            );

            message.style.color = "green";
            message.textContent = result.message;

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1000);

        } else {

            message.style.color = "red";
            message.textContent = result.message;

        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.textContent = "Không thể kết nối tới máy chủ.";

    }

}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", register);
}

async function register(e) {

    e.preventDefault();

    const body = {
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value
    };

    const message = document.getElementById("message");

    try {

        const result = await apiRequest(API.AUTH.REGISTER, {

            method: "POST",

            body: JSON.stringify(body)

        });

        if (result.success) {

            message.style.color = "green";
            message.innerHTML = result.message;

            setTimeout(() => {

                location.href = "login.html";

            },1000);

        } else {

            message.style.color = "red";
            message.innerHTML = result.message;

        }

    } catch (err) {

        message.innerHTML = "Lỗi kết nối Server.";

    }

}
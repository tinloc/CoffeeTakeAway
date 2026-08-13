# 🐰 Bunny

> Hệ thống Website đặt đồ uống trực tuyến — Bunny Coffee

---

## 📌 Giới thiệu

**Bunny** là hệ thống website bán đồ uống trực tuyến xây dựng theo mô hình **Fullstack Web Application** (HTML/CSS/JS + Node.js + MySQL).

Khách hàng có thể:

- Đăng ký / đăng nhập tài khoản
- Xem thực đơn, tìm kiếm, lọc và sắp xếp sản phẩm
- Xem chi tiết sản phẩm, chọn size & topping
- Thêm vào giỏ hàng, đặt hàng, thanh toán
- Theo dõi trạng thái & lịch sử đơn hàng
- Quản lý thông tin tài khoản & mật khẩu

Quản trị viên (Admin) có thể:

- Xem Dashboard: tổng sản phẩm, đơn hàng, người dùng, doanh thu
- Theo dõi doanh thu theo từng tháng
- Quản lý sản phẩm: thêm, sửa, ẩn/hiện, xoá
- Quản lý danh mục: thêm, sửa
- Quản lý đơn hàng: xem danh sách, cập nhật trạng thái
- Quản lý người dùng: xem danh sách, khoá/mở khoá tài khoản

---

## 🛠 Công nghệ sử dụng

| Lớp      | Công nghệ                                 |
| -------- | ----------------------------------------- |
| Frontend | HTML5, CSS3, JavaScript ES6, Fetch API    |
| Backend  | Node.js, Express.js                       |
| Database | MySQL 8.0+                                |
| Auth     | JWT (jsonwebtoken)                        |
| Security | bcryptjs, helmet, cors                    |
| Upload   | Multer (ảnh sản phẩm, danh mục)           |
| Dev tool | nodemon, dotenv                           |

---

## 📂 Cấu trúc thư mục

```text
CoffeeTakeAway/
├── README.md
├── start.ps1
├── BE/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── config/        (db.js, jwt.js, multer.js)
│       ├── controllers/
│       ├── middleware/    (auth, admin)
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── FE/
│   ├── index.html         (Trang chủ)
│   ├── menu.html          (Thực đơn)
│   ├── product.html       (Chi tiết sản phẩm)
│   ├── cart.html          (Giỏ hàng)
│   ├── checkout.html      (Thanh toán)
│   ├── orders.html        (Đơn hàng của tôi)
│   ├── profile.html       (Tài khoản)
│   ├── login.html
│   ├── register.html
│   ├── admin.html         (Quản trị — role_id = 1)
│   └── assets/
│       ├── css/           (style, components, admin, ...)
│       ├── js/            (api, app, admin, cart, ...)
│       └── images/        (logo, products, categories, ...)
├── database/
│   └── takeaway.sql
└── mobile/
```

---

## 🚀 Hướng dẫn cài đặt

### 1. Chuẩn bị database

```sql
CREATE DATABASE takeaway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Import file: database/takeaway.sql
```

### 2. Cấu hình môi trường

```bash
cd BE
copy .env.example .env
# Mở .env và điền thông tin MySQL + JWT
```

### 3. Cài đặt dependencies

```bash
cd BE
npm install
```

### 4. Khởi động server

```bash
npm run dev    # development (nodemon)
npm start      # production
```

Server chạy tại: <http://localhost:3000>

> Frontend được serve tự động bởi Express.

---

## 🔑 Tài khoản admin

Tài khoản phải có `role_id = 1` trong database:

```sql
UPDATE users SET role_id = 1 WHERE email = 'your@email.com';
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Mô tả    |
| ------ | -------------------- | -------- |
| POST   | `/api/auth/register` | Đăng ký  |
| POST   | `/api/auth/login`    | Đăng nhập|

### Products (Public)

| Method | Endpoint                    | Mô tả              |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/products`             | Danh sách sản phẩm |
| GET    | `/api/products/:id/detail`  | Chi tiết sản phẩm  |
| GET    | `/api/products/featured`    | Sản phẩm nổi bật   |
| GET    | `/api/products/search?q=`   | Tìm kiếm           |

### Admin (yêu cầu role\_id = 1)

| Method          | Endpoint                       | Mô tả                       |
| --------------- | ------------------------------ | --------------------------- |
| GET             | `/api/admin/dashboard`         | Thống kê tổng quan          |
| GET             | `/api/admin/revenue`           | Doanh thu theo tháng        |
| GET/POST        | `/api/admin/products`          | Danh sách / Thêm sản phẩm   |
| PUT/PATCH/DELETE| `/api/admin/products/:id`      | Sửa / Toggle / Xoá sản phẩm |
| GET/POST        | `/api/admin/categories`        | Danh sách / Thêm danh mục   |
| PUT             | `/api/admin/categories/:id`    | Sửa danh mục                |
| GET             | `/api/admin/orders`            | Danh sách đơn hàng          |
| PUT             | `/api/admin/orders/:id/status` | Cập nhật trạng thái đơn     |
| GET             | `/api/admin/users`             | Danh sách người dùng        |
| PUT             | `/api/admin/users/:id/block`   | Khoá tài khoản              |
| PUT             | `/api/admin/users/:id/unblock` | Mở khoá tài khoản           |

---

## 🏗 Kiến trúc Backend (MVC)

```text
HTTP Request → Routes → Middleware → Controller → Service → Model → MySQL
```

---

## 👨‍💻 Tác giả

Dự án học tập — Bunny Coffee © 2026

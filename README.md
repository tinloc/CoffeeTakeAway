# ☕ Coffee TakeAway

<p align="center">
  <b>Hệ thống Website đặt đồ uống trực tuyến</b>
</p>

## 📌 Giới thiệu dự án

**Coffee TakeAway** là một hệ thống website bán đồ uống trực tuyến được xây dựng theo mô hình **Fullstack Web Application**.

Dự án hỗ trợ khách hàng đặt các sản phẩm như:

* ☕ Coffee
* 🍵 Tea
* 🧋 Freeze
* 🍰 Cake
* 🎁 Combo

Thông qua hệ thống, khách hàng có thể:

* Đăng ký tài khoản.
* Đăng nhập.
* Xem danh sách sản phẩm.
* Xem chi tiết sản phẩm.
* Chọn size, topping.
* Thêm sản phẩm vào giỏ hàng.
* Đặt hàng.
* Theo dõi trạng thái đơn hàng.

Quản trị viên có thể:

* Quản lý sản phẩm.
* Quản lý danh mục.
* Quản lý đơn hàng.
* Theo dõi doanh thu.
* Quản lý người dùng.

---

# 🎯 Mục tiêu dự án

Dự án được xây dựng nhằm:

* Áp dụng kiến thức lập trình Web Fullstack.
* Xây dựng hệ thống bán hàng trực tuyến hoàn chỉnh.
* Áp dụng mô hình MVC trong Backend.
* Thiết kế cơ sở dữ liệu quan hệ MySQL.
* Xây dựng RESTful API.
* Quản lý xác thực người dùng bằng JWT.

---

# 🏗 Kiến trúc hệ thống

Dự án sử dụng mô hình:

```
Client
 |
 | HTTP Request
 |
Frontend (HTML/CSS/JavaScript)
 |
 | REST API
 |
Backend (Node.js + Express)
 |
 | SQL Query
 |
Database (MySQL)
```

---

# 🛠 Công nghệ sử dụng

## Frontend

| Công nghệ      | Mục đích           |
| -------------- | ------------------ |
| HTML5          | Xây dựng giao diện |
| CSS3           | Thiết kế giao diện |
| JavaScript ES6 | Xử lý chức năng    |
| Fetch API      | Gọi API Backend    |

---

## Backend

| Công nghệ  | Mục đích                |
| ---------- | ----------------------- |
| Node.js    | Môi trường chạy server  |
| Express.js | Xây dựng REST API       |
| MySQL2     | Kết nối Database        |
| JWT        | Authentication          |
| Bcrypt     | Mã hóa mật khẩu         |
| Multer     | Upload hình ảnh         |
| Dotenv     | Quản lý biến môi trường |

---

## Database

| Công nghệ | Phiên bản          |
| --------- | ------------------ |
| MySQL     | 8.0+               |
| Charset   | utf8mb4            |
| Collation | utf8mb4_unicode_ci |

---

# 📂 Cấu trúc thư mục dự án

```
CoffeeTakeAway

│
├── README.md
│
├── BE
│   │
│   ├── src
│   │   │
│   │   ├── config
│   │   │   └── database.js
│   │   │
│   │   ├── controllers
│   │   │
│   │   ├── models
│   │   │
│   │   ├── services
│   │   │
│   │   ├── routes
│   │   │
│   │   ├── middleware
│   │   │
│   │   └── utils
│   │
│   ├── package.json
│   └── server.js
│
│
├── FE
│
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── menu.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── orders.html
│   └── profile.html
│
│
├── database
│   └── coffeetakeaway.sql
│
│
└── mobile

```

---

# 🔥 Backend Architecture

Backend được xây dựng theo mô hình MVC:

```
Request

   ↓

Routes

   ↓

Controller

   ↓

Service

   ↓

Model

   ↓

Database

```

## Ví dụ Auth Module

```
auth.routes.js

        ↓

auth.controller.js

        ↓

auth.service.js

        ↓

auth.model.js

        ↓

MySQL users table

```

---

# 🔐 Authentication

Hệ thống sử dụng JWT Token để xác thực người dùng.

## Đăng ký

Endpoint:

```
POST /api/auth/register
```

Request:

```json
{
    "full_name":"Nguyen Van A",
    "email":"user@gmail.com",
    "password":"123456"
}
```

---

## Đăng nhập

Endpoint:

```
POST /api/auth/login
```

Request:

```json
{
    "email":"user@gmail.com",
    "password":"123456"
}
```

Response:

```json
{
    "success":true,
    "message":"Đăng nhập thành công",
    "data":{
        "token":"JWT_TOKEN"
    }
}
```

Token được sử dụng để truy cập các API yêu cầu quyền.

---

# 🗄 Database Design

Database gồm các nhóm chức năng:

## 👤 User Management

Các bảng:

```
roles

users

addresses

activity_logs
```

Chức năng:

* Phân quyền Admin / Customer.
* Quản lý thông tin tài khoản.
* Lưu lịch sử hoạt động.

---

## ☕ Product Management

Các bảng:

```
categories

products

product_images

sizes

product_sizes

toppings

product_toppings
```

Chức năng:

* Quản lý sản phẩm.
* Quản lý danh mục.
* Quản lý size.
* Quản lý topping.

---

## 🛒 Shopping Cart

Các bảng:

```
cart

cart_items

cart_item_toppings
```

Chức năng:

* Lưu sản phẩm khách hàng chọn.
* Cập nhật số lượng.
* Lưu topping.

---

## 📦 Order Management

Các bảng:

```
orders

order_items

payments
```

Chức năng:

* Tạo đơn hàng.
* Quản lý thanh toán.
* Theo dõi trạng thái đơn.

---

## ⭐ Advanced Features

Các bảng:

```
reviews

favorites

notifications

coupons

banners

settings
```

Bao gồm:

* Đánh giá sản phẩm.
* Yêu thích sản phẩm.
* Mã giảm giá.
* Thông báo.
* Quản lý banner.

---

# 🚀 Cài đặt dự án

## 1. Clone project

```bash
git clone <repository-url>
```

---

# Backend Setup

Đi vào thư mục:

```bash
cd BE
```

Cài đặt package:

```bash
npm install
```

Tạo file:

```
.env
```

Ví dụ:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=

DB_NAME=coffeetakeaway

JWT_SECRET=coffee_secret
```

Chạy Backend:

```bash
npm start
```

Server chạy:

```
http://localhost:3000
```

---

# Database Setup

Import file:

```
database/coffeetakeaway.sql
```

Có thể sử dụng:

* MySQL Workbench
* phpMyAdmin
* XAMPP

---

# Frontend Setup

Truy cập:

```
FE/
```

Chạy bằng:

* VS Code Live Server

hoặc mở:

```
index.html
```

---

# 📡 API hiện tại

## Authentication

| Method | API                | Chức năng |
| ------ | ------------------ | --------- |
| POST   | /api/auth/register | Đăng ký   |
| POST   | /api/auth/login    | Đăng nhập |

---

# 📌 Roadmap phát triển

## Phase 1 - Core System

✅ Database Design

✅ Backend MVC Structure

✅ JWT Authentication

---

## Phase 2 - Product System

⬜ Product API

⬜ Category API

⬜ Product Detail

⬜ Menu Page

---

## Phase 3 - Shopping System

⬜ Cart API

⬜ Checkout

⬜ Order API

⬜ Payment

---

## Phase 4 - Admin System

⬜ Dashboard

⬜ Product Management

⬜ User Management

⬜ Revenue Statistics

---

# 👨‍💻 Developer

**Trần Tín Lộc**

Project:

```
Coffee TakeAway
```

Version:

```
1.0
```

---

# 📄 License

Project được phát triển với mục đích:

* Học tập.
* Nghiên cứu.
* Đồ án môn học.

Không sử dụng cho mục đích thương mại.

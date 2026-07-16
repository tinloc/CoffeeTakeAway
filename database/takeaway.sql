/*=====================================================================
    DỰ ÁN      : Coffee TakeAway
    TÁC GIẢ    : Trần Tín Lộc
    PHIÊN BẢN  : 1.0
    HỆ QUẢN TRỊ: MySQL 8.0+
======================================================================*/

-- ==========================================================
-- XÓA DATABASE CŨ (NẾU ĐÃ TỒN TẠI)
-- ==========================================================

DROP DATABASE IF EXISTS coffeetakeaway;

-- ==========================================================
-- TẠO DATABASE
-- ==========================================================

CREATE DATABASE coffeetakeaway
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE coffeetakeaway;

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- BẢNG: ROLES (PHÂN QUYỀN)
-- ==========================================================

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles(role_name, description)
VALUES
('Admin', 'Quản trị viên'),
('Customer', 'Khách hàng');

-- ==========================================================
-- BẢNG: USERS (NGƯỜI DÙNG)
-- ==========================================================

CREATE TABLE users (

    user_id INT AUTO_INCREMENT PRIMARY KEY,

    role_id INT NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    phone VARCHAR(20) UNIQUE,

    avatar VARCHAR(255),

    gender ENUM('Male','Female','Other')
    DEFAULT 'Other',

    birthday DATE,

    last_login TIMESTAMP NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY(role_id)
        REFERENCES roles(role_id)
);

CREATE INDEX idx_user_email
ON users(email);

CREATE INDEX idx_user_phone
ON users(phone);

-- ==========================================================
-- BẢNG: CATEGORIES (DANH MỤC)
-- ==========================================================

CREATE TABLE categories (

    category_id INT AUTO_INCREMENT PRIMARY KEY,

    category_name VARCHAR(100) NOT NULL UNIQUE,

    image VARCHAR(255),

    description TEXT,

    display_order INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_name
ON categories(category_name);

-- ==========================================================
-- BẢNG: PRODUCTS (SẢN PHẨM)
-- ==========================================================

CREATE TABLE products (

    product_id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT NOT NULL,

    product_name VARCHAR(150) NOT NULL,

    slug VARCHAR(180) UNIQUE,

    description TEXT,

    base_price DECIMAL(10,2) NOT NULL,

    thumbnail VARCHAR(255),

    sold INT DEFAULT 0,

    rating DECIMAL(2,1) DEFAULT 5.0,

    view_count INT DEFAULT 0,

    is_featured BOOLEAN DEFAULT FALSE,

    is_available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
);

CREATE INDEX idx_product_name
ON products(product_name);

CREATE INDEX idx_product_category
ON products(category_id);

CREATE INDEX idx_product_featured
ON products(is_featured);

-- ==========================================================
-- BẢNG: PRODUCT_IMAGES (ẢNH SẢN PHẨM)
-- ==========================================================

CREATE TABLE product_images (

    image_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    image_url VARCHAR(255) NOT NULL,

    display_order INT DEFAULT 0,

    is_thumbnail BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_image
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_product_image
ON product_images(product_id);

-- ==========================================================
-- BẢNG: SIZES (KÍCH THƯỚC LY)
-- ==========================================================

CREATE TABLE sizes (

    size_id INT AUTO_INCREMENT PRIMARY KEY,

    size_name VARCHAR(10) NOT NULL UNIQUE,

    description VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sizes(size_name, description)
VALUES
('S','Ly nhỏ'),
('M','Ly vừa'),
('L','Ly lớn');

-- ==========================================================
-- BẢNG: PRODUCT_SIZES (GIÁ THEO KÍCH THƯỚC)
-- ==========================================================

CREATE TABLE product_sizes (

    product_size_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    size_id INT NOT NULL,

    sku VARCHAR(50),

    price DECIMAL(10,2) NOT NULL,

    stock INT DEFAULT 999,

    is_available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ps_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ps_size
        FOREIGN KEY(size_id)
        REFERENCES sizes(size_id),

    CONSTRAINT uq_product_size
        UNIQUE(product_id, size_id)
);

CREATE INDEX idx_ps_product
ON product_sizes(product_id);

CREATE INDEX idx_ps_size
ON product_sizes(size_id);

-- ==========================================================
-- KẾT THÚC CHƯƠNG 1
-- ==========================================================

-- ==========================================================
-- CHƯƠNG 2: HỆ THỐNG ĐẶT HÀNG
-- ==========================================================

-- ==========================================================
-- BẢNG: CART (GIỎ HÀNG)
-- Mỗi người dùng chỉ có 1 giỏ hàng đang hoạt động
-- ==========================================================

CREATE TABLE cart (

    cart_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- ==========================================================
-- BẢNG: CART_ITEMS (CHI TIẾT GIỎ HÀNG)
-- ==========================================================

CREATE TABLE cart_items (

    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,

    cart_id INT NOT NULL,

    product_size_id INT NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

    note VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY(cart_id)
        REFERENCES cart(cart_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_product_size
        FOREIGN KEY(product_size_id)
        REFERENCES product_sizes(product_size_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_cart_items_cart
ON cart_items(cart_id);

CREATE INDEX idx_cart_items_product_size
ON cart_items(product_size_id);

-- ==========================================================
-- BẢNG: ADDRESSES (ĐỊA CHỈ GIAO HÀNG)
-- ==========================================================

CREATE TABLE addresses (

    address_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    receiver_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    province VARCHAR(100) NOT NULL,

    district VARCHAR(100) NOT NULL,

    ward VARCHAR(100),

    street VARCHAR(255) NOT NULL,

    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_address_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_address_user
ON addresses(user_id);

-- ==========================================================
-- BẢNG: COUPONS (MÃ GIẢM GIÁ)
-- ==========================================================

CREATE TABLE coupons (

    coupon_id INT AUTO_INCREMENT PRIMARY KEY,

    coupon_code VARCHAR(50) NOT NULL UNIQUE,

    coupon_name VARCHAR(100),

    discount_type ENUM('Percent','Amount') NOT NULL,

    discount_value DECIMAL(10,2) NOT NULL,

    minimum_order DECIMAL(10,2) DEFAULT 0,

    maximum_discount DECIMAL(10,2),

    start_date DATETIME,

    end_date DATETIME,

    quantity INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BẢNG: ORDERS (ĐƠN HÀNG)
-- ==========================================================

CREATE TABLE orders (

    order_id INT AUTO_INCREMENT PRIMARY KEY,

    order_code VARCHAR(30) UNIQUE,

    user_id INT NOT NULL,

    address_id INT,

    coupon_id INT,

    subtotal DECIMAL(10,2) NOT NULL,

    discount DECIMAL(10,2) DEFAULT 0,

    shipping_fee DECIMAL(10,2) DEFAULT 0,

    total_amount DECIMAL(10,2) NOT NULL,

    payment_method ENUM('COD','MOMO','VNPAY') DEFAULT 'COD',

    payment_status ENUM('Pending','Paid','Failed')
    DEFAULT 'Pending',

    order_status ENUM(
        'Pending',
        'Confirmed',
        'Preparing',
        'Delivering',
        'Completed',
        'Cancelled'
    ) DEFAULT 'Pending',

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_order_address
        FOREIGN KEY(address_id)
        REFERENCES addresses(address_id),

    CONSTRAINT fk_order_coupon
        FOREIGN KEY(coupon_id)
        REFERENCES coupons(coupon_id)
);

CREATE INDEX idx_order_user
ON orders(user_id);

CREATE INDEX idx_order_status
ON orders(order_status);

-- ==========================================================
-- BẢNG: ORDER_ITEMS (CHI TIẾT ĐƠN HÀNG)
-- ==========================================================

CREATE TABLE order_items (

    order_item_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    product_size_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    note VARCHAR(255),

    CONSTRAINT fk_order_item_order
        FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product_size
        FOREIGN KEY(product_size_id)
        REFERENCES product_sizes(product_size_id)
);

CREATE INDEX idx_order_item_order
ON order_items(order_id);

CREATE INDEX idx_order_item_product
ON order_items(product_size_id);

-- ==========================================================
-- BẢNG: PAYMENTS (LỊCH SỬ THANH TOÁN)
-- ==========================================================

CREATE TABLE payments (

    payment_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    transaction_code VARCHAR(100),

    payment_method ENUM(
        'COD',
        'MOMO',
        'VNPAY'
    ) NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_time DATETIME,

    status ENUM(
        'Pending',
        'Success',
        'Failed'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_order
        FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_payment_order
ON payments(order_id);

-- ==========================================================
-- CHƯƠNG 3: CHỨC NĂNG NÂNG CAO
-- ==========================================================

-- ==========================================================
-- BẢNG: REVIEWS (ĐÁNH GIÁ SẢN PHẨM)
-- ==========================================================

CREATE TABLE reviews (

    review_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_review UNIQUE(user_id, product_id)
);

CREATE INDEX idx_review_product
ON reviews(product_id);

CREATE INDEX idx_review_user
ON reviews(user_id);

-- ==========================================================
-- BẢNG: FAVORITES (SẢN PHẨM YÊU THÍCH)
-- ==========================================================

CREATE TABLE favorites (

    favorite_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorite_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_favorite UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorite_user
ON favorites(user_id);

CREATE INDEX idx_favorite_product
ON favorites(product_id);

-- ==========================================================
-- BẢNG: PRODUCT_VIEWS (LƯỢT XEM SẢN PHẨM)
-- ==========================================================

CREATE TABLE product_views (

    view_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    user_id INT NULL,

    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_view_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_view_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE INDEX idx_view_product
ON product_views(product_id);

-- ==========================================================
-- BẢNG: NOTIFICATIONS (THÔNG BÁO)
-- ==========================================================

CREATE TABLE notifications (

    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_notification_user
ON notifications(user_id);

-- ==========================================================
-- BẢNG: ACTIVITY_LOGS (NHẬT KÝ HỆ THỐNG)
-- ==========================================================

CREATE TABLE activity_logs (

    log_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    action VARCHAR(100),

    description TEXT,

    ip_address VARCHAR(45),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE INDEX idx_log_user
ON activity_logs(user_id);

-- ==========================================================
-- VIEW: TOP SẢN PHẨM BÁN CHẠY
-- ==========================================================

CREATE VIEW vw_best_selling_products AS

SELECT

    p.product_id,

    p.product_name,

    p.thumbnail,

    p.sold,

    p.rating,

    c.category_name

FROM products p

JOIN categories c
ON p.category_id = c.category_id

ORDER BY p.sold DESC;

-- ==========================================================
-- VIEW: THỐNG KÊ ĐƠN HÀNG
-- ==========================================================

CREATE VIEW vw_order_statistics AS

SELECT

    DATE(created_at) AS order_date,

    COUNT(*) AS total_orders,

    SUM(total_amount) AS revenue

FROM orders

GROUP BY DATE(created_at);

DELIMITER $$

CREATE TRIGGER trg_update_product_sold

AFTER INSERT ON order_items

FOR EACH ROW

BEGIN

UPDATE products

SET sold = sold + NEW.quantity

WHERE product_id = (

SELECT product_id

FROM product_sizes

WHERE product_size_id = NEW.product_size_id

);

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_update_rating

AFTER INSERT ON reviews

FOR EACH ROW

BEGIN

UPDATE products

SET rating = (

SELECT ROUND(AVG(rating),1)

FROM reviews

WHERE product_id = NEW.product_id

)

WHERE product_id = NEW.product_id;

END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_generate_order_code(

OUT new_code VARCHAR(30)

)

BEGIN

SET new_code = CONCAT(

'ORD',

DATE_FORMAT(NOW(),'%Y%m%d'),

LPAD(FLOOR(RAND()*9999),4,'0')

);

END$$

DELIMITER ;

-- ==========================================================
-- CHƯƠNG 4: TOPPING & HỆ THỐNG
-- ==========================================================

-- ==========================================================
-- BẢNG: TOPPINGS (TOPPING)
-- ==========================================================

CREATE TABLE toppings (

    topping_id INT AUTO_INCREMENT PRIMARY KEY,

    topping_name VARCHAR(100) NOT NULL,

    description TEXT,

    image VARCHAR(255),

    price DECIMAL(10,2) NOT NULL,

    is_available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP

);

CREATE INDEX idx_topping_name
ON toppings(topping_name);

-- ==========================================================
-- BẢNG: PRODUCT_TOPPINGS
-- Mỗi sản phẩm được phép chọn topping nào
-- ==========================================================

CREATE TABLE product_toppings (

    product_topping_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    topping_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pt_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pt_topping
        FOREIGN KEY(topping_id)
        REFERENCES toppings(topping_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_product_topping
        UNIQUE(product_id,topping_id)

);

CREATE INDEX idx_pt_product
ON product_toppings(product_id);

CREATE INDEX idx_pt_topping
ON product_toppings(topping_id);

-- ==========================================================
-- BẢNG: CART_ITEM_TOPPINGS
-- Lưu topping khi còn trong giỏ hàng
-- ==========================================================

CREATE TABLE cart_item_toppings (

    cart_item_topping_id INT AUTO_INCREMENT PRIMARY KEY,

    cart_item_id INT NOT NULL,

    topping_id INT NOT NULL,

    quantity INT DEFAULT 1,

    price DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cit_cart_item
        FOREIGN KEY(cart_item_id)
        REFERENCES cart_items(cart_item_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cit_topping
        FOREIGN KEY(topping_id)
        REFERENCES toppings(topping_id)
        ON DELETE CASCADE

);

CREATE INDEX idx_cart_item_topping
ON cart_item_toppings(cart_item_id);

-- ==========================================================
-- BẢNG: ORDER_ITEM_TOPPINGS
-- Lưu topping của từng món sau khi đặt hàng
-- ==========================================================

CREATE TABLE order_item_toppings (

    order_item_topping_id INT AUTO_INCREMENT PRIMARY KEY,

    order_item_id INT NOT NULL,

    topping_id INT NOT NULL,

    quantity INT DEFAULT 1,

    price DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_oit_order_item
        FOREIGN KEY(order_item_id)
        REFERENCES order_items(order_item_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_oit_topping
        FOREIGN KEY(topping_id)
        REFERENCES toppings(topping_id)
        ON DELETE CASCADE

);

CREATE INDEX idx_order_item_topping
ON order_item_toppings(order_item_id);

-- ==========================================================
-- BẢNG: BANNERS
-- Banner trang chủ
-- ==========================================================

CREATE TABLE banners (

    banner_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(150),

    image_url VARCHAR(255) NOT NULL,

    link_url VARCHAR(255),

    display_order INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================================
-- BẢNG: SETTINGS
-- Thông tin cửa hàng
-- ==========================================================

CREATE TABLE settings (

    setting_id INT AUTO_INCREMENT PRIMARY KEY,

    setting_key VARCHAR(100) UNIQUE,

    setting_value TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================================
-- VIEW: THỐNG KÊ DOANH THU
-- ==========================================================

CREATE VIEW vw_dashboard AS

SELECT

COUNT(DISTINCT users.user_id) AS total_users,

COUNT(DISTINCT products.product_id) AS total_products,

COUNT(DISTINCT orders.order_id) AS total_orders,

COALESCE(SUM(
CASE
WHEN orders.payment_status='Paid'
THEN orders.total_amount
ELSE 0
END
),0) AS total_revenue

FROM users

LEFT JOIN orders
ON users.user_id=orders.user_id

CROSS JOIN products;

/*==============================================================
    CHƯƠNG 5: DỮ LIỆU MẪU (SEED DATA)
==============================================================*/

-- ==========================================================
-- DANH MỤC SẢN PHẨM
-- ==========================================================

INSERT INTO categories
(category_name, image, description, display_order)
VALUES
('Coffee','coffee.png','Các loại cà phê',1),
('Tea','tea.png','Các loại trà',2),
('Freeze','freeze.png','Đồ uống đá xay',3),
('Cake','cake.png','Các loại bánh',4),
('Combo','combo.png','Combo tiết kiệm',5);

-- ==========================================================
-- SIZE
-- ==========================================================

INSERT INTO sizes
(size_name, description)
VALUES
('S','Ly nhỏ'),
('M','Ly vừa'),
('L','Ly lớn');

-- ==========================================================
-- TOPPING
-- ==========================================================

INSERT INTO toppings
(topping_name, description, image, price)
VALUES
('Trân châu trắng','Topping','white_pearl.png',5000),
('Trân châu đen','Topping','black_pearl.png',5000),
('Kem Cheese','Topping','cheese.png',10000),
('Whipping Cream','Topping','whipping.png',8000),
('Espresso Shot','Topping','espresso_shot.png',12000),
('Caramel Sauce','Topping','caramel.png',6000),
('Chocolate Sauce','Topping','chocolate.png',6000),
('Đào ngâm','Topping','peach.png',7000),
('Thạch cà phê','Topping','coffee_jelly.png',7000),
('Kem Vanilla','Topping','vanilla.png',12000);

-- ==========================================================
-- MÃ GIẢM GIÁ
-- ==========================================================

INSERT INTO coupons
(
coupon_code,
coupon_name,
discount_type,
discount_value,
minimum_order,
maximum_discount,
start_date,
end_date,
quantity
)

VALUES

(
'WELCOME10',
'Giảm 10%',
'Percent',
10,
100000,
30000,
NOW(),
DATE_ADD(NOW(),INTERVAL 6 MONTH),
100
),

(
'FREESHIP',
'Miễn phí giao hàng',
'Amount',
20000,
50000,
20000,
NOW(),
DATE_ADD(NOW(),INTERVAL 6 MONTH),
100
);

-- ==========================================================
-- BANNER
-- ==========================================================

INSERT INTO banners
(title,image_url,display_order)
VALUES
('Coffee TakeAway','banner1.jpg',1),
('Ưu đãi mùa hè','banner2.jpg',2),
('Combo tiết kiệm','banner3.jpg',3);

-- ==========================================================
-- CẤU HÌNH WEBSITE
-- ==========================================================

INSERT INTO settings
(setting_key,setting_value)
VALUES
('store_name','Coffee TakeAway'),
('hotline','19001234'),
('email','support@coffeetakeaway.com'),
('address','01 Võ Văn Ngân, TP.HCM'),
('facebook','https://facebook.com/coffeetakeaway'),
('instagram','https://instagram.com/coffeetakeaway');

-- ==========================================================
-- TÀI KHOẢN
-- ==========================================================

INSERT INTO users
(
role_id,
full_name,
email,
password,
phone
)

VALUES

(
1,
'Administrator',
'admin@coffee.com',
'123456',
'0900000001'
),

(
2,
'Nguyễn Văn A',
'user@coffee.com',
'123456',
'0900000002'
);

-- ==========================================================
-- SẢN PHẨM
-- ==========================================================

INSERT INTO products
(
category_id,
product_name,
slug,
description,
base_price,
thumbnail,
is_featured
)

VALUES

(1,'Espresso','espresso','Espresso nguyên chất',30000,'espresso.jpg',1),

(1,'Americano','americano','Americano',35000,'americano.jpg',1),

(1,'Latte','latte','Latte',39000,'latte.jpg',1),

(1,'Cappuccino','cappuccino','Cappuccino',42000,'cappuccino.jpg',1),

(1,'Mocha','mocha','Mocha',45000,'mocha.jpg',1),

(2,'Trà Đào','tra-dao','Trà đào cam sả',39000,'tradao.jpg',1),

(2,'Trà Vải','tra-vai','Trà vải',39000,'travai.jpg',0),

(3,'Freeze Chocolate','freeze-chocolate','Freeze Chocolate',55000,'freeze.jpg',1),

(4,'Tiramisu','tiramisu','Bánh Tiramisu',35000,'cake.jpg',0),

(5,'Combo Breakfast','combo-breakfast','Combo bữa sáng',69000,'combo.jpg',1);

-- ==========================================================
-- GIÁ THEO SIZE
-- ==========================================================

INSERT INTO product_sizes
(product_id,size_id,price)

VALUES

(1,1,30000),(1,2,35000),(1,3,40000),

(2,1,35000),(2,2,40000),(2,3,45000),

(3,1,39000),(3,2,45000),(3,3,52000),

(4,1,42000),(4,2,48000),(4,3,55000),

(5,1,45000),(5,2,50000),(5,3,58000),

(6,1,39000),(6,2,45000),(6,3,52000),

(7,1,39000),(7,2,45000),(7,3,52000),

(8,1,55000),(8,2,60000),(8,3,65000),

(9,2,35000),

(10,2,69000);

-- ==========================================================
-- HÌNH ẢNH SẢN PHẨM
-- ==========================================================

INSERT INTO product_images
(product_id,image_url,is_thumbnail)

VALUES

(1,'espresso.jpg',1),
(2,'americano.jpg',1),
(3,'latte.jpg',1),
(4,'cappuccino.jpg',1),
(5,'mocha.jpg',1),
(6,'tradao.jpg',1),
(7,'travai.jpg',1),
(8,'freeze.jpg',1),
(9,'cake.jpg',1),
(10,'combo.jpg',1);

-- ==========================================================
-- TOPPING ÁP DỤNG CHO SẢN PHẨM
-- ==========================================================

INSERT INTO product_toppings
(product_id,topping_id)

VALUES

(1,5),

(2,5),

(3,3),
(3,4),
(3,5),

(4,3),
(4,5),

(5,3),
(5,6),
(5,7),

(6,1),
(6,8),

(7,1),

(8,4),
(8,7);

SET FOREIGN_KEY_CHECKS = 1;
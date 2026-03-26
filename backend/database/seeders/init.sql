-- ==========================================
-- TABLES (MySQL Version)
-- ==========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    hash_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    created_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE user_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    lastused_at TIMESTAMP NULL
);

CREATE TABLE user_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_id VARCHAR(50) NOT NULL,
    user_img TEXT NOT NULL,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL
);

CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    receive_name VARCHAR(255) NOT NULL,
    receive_phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    street TEXT NOT NULL,
    is_default BOOLEAN NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('ADMIN', 'CUSTOMER', 'STAFF') NOT NULL
);

CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('CREATE', 'DELETE', 'UPDATE', 'READ') NOT NULL
);

CREATE TABLE role_has_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE
);

CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT
);

CREATE TABLE rental_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    late_day_fee DECIMAL(10,2) NOT NULL,
    max_late_day INT NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policies_id INT NOT NULL,
    category_id INT NOT NULL,
    brand_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    daily_price DECIMAL(10,2) NOT NULL,
    deposit_price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE product_img (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE combos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    daily_price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE combo_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    combo_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL
);

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE import_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    admin_id INT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    import_date TIMESTAMP NOT NULL
);

CREATE TABLE import_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    import_order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    cost_price INT
);

CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    import_order_id INT NOT NULL,
    `condition` ENUM('NEW', 'GOOD', 'FAIR', 'DAMAGED') NOT NULL,
    status ENUM('AVAILABLE', 'RENTING', 'MAINTENANCE', 'LOST') NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    notes TEXT,
    purchased_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT NOT NULL,
    staff_id INT NOT NULL,
    maintenance_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status ENUM('INVENTORY', 'MAINTENANCED') NOT NULL
);

CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    discount_amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    valid_from TIMESTAMP NULL,
    valid_until TIMESTAMP NULL
);

CREATE TABLE rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_id INT,
    address_id INT NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    actual_return_date TIMESTAMP NULL,
    total_price DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'DEPOSITED', 'PICKED_UP', 'COMPLETED', 'CANCELLED') NOT NULL,
    note TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE rental_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    product_id INT,
    combo_id INT,
    inventory_id INT,
    quantity INT NOT NULL,
    price_at_rental DECIMAL(10,2) NOT NULL
);

CREATE TABLE rental_issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    rental_detail_id INT NOT NULL,
    type ENUM('LATE', 'DAMAGED', 'LOST') NOT NULL,
    description TEXT NOT NULL,
    penalty_fee DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'RESOLVED') NOT NULL
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    user_id INT NOT NULL,
    issue_id INT,
    type ENUM('DEPOSIT', 'PAYMENT', 'REFUND', 'FINE') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    status ENUM('SUCCESS', 'FAILED', 'PENDING') NOT NULL,
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rental_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE return_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    return_date TIMESTAMP NOT NULL
);

CREATE TABLE return_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_order_id INT NOT NULL,
    rental_detail_id INT NOT NULL,
    `condition` ENUM('GOOD', 'DAMAGED', 'LOST') NOT NULL,
    note TEXT
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('ORDER', 'SYSTEM') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

-- ==========================================
-- FOREIGN KEYS
-- ==========================================

ALTER TABLE addresses ADD CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_info ADD CONSTRAINT fk_userinfo_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_tokens ADD CONSTRAINT fk_user_tokens_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE user_roles ADD CONSTRAINT fk_uroles_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_roles ADD CONSTRAINT fk_uroles_role FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE role_has_permission ADD CONSTRAINT fk_rhp_role FOREIGN KEY (role_id) REFERENCES roles(id);
ALTER TABLE role_has_permission ADD CONSTRAINT fk_rhp_perm FOREIGN KEY (permission_id) REFERENCES permissions(id);

ALTER TABLE products ADD CONSTRAINT fk_prod_policy FOREIGN KEY (policies_id) REFERENCES rental_policies(id);
ALTER TABLE products ADD CONSTRAINT fk_prod_cat FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE products ADD CONSTRAINT fk_prod_brand FOREIGN KEY (brand_id) REFERENCES brands(id);

ALTER TABLE product_img ADD CONSTRAINT fk_pimg_prod FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE combo_details ADD CONSTRAINT fk_cdet_combo FOREIGN KEY (combo_id) REFERENCES combos(id);
ALTER TABLE combo_details ADD CONSTRAINT fk_cdet_prod FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE import_orders ADD CONSTRAINT fk_iord_supp FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
ALTER TABLE import_orders ADD CONSTRAINT fk_iord_admin FOREIGN KEY (admin_id) REFERENCES users(id);

ALTER TABLE import_details ADD CONSTRAINT fk_idet_ord FOREIGN KEY (import_order_id) REFERENCES import_orders(id);
ALTER TABLE import_details ADD CONSTRAINT fk_idet_prod FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE inventory ADD CONSTRAINT fk_inv_prod FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE inventory ADD CONSTRAINT fk_inv_iord FOREIGN KEY (import_order_id) REFERENCES import_orders(id);

ALTER TABLE maintenance_logs ADD CONSTRAINT fk_mlog_inv FOREIGN KEY (inventory_id) REFERENCES inventory(id);
ALTER TABLE maintenance_logs ADD CONSTRAINT fk_mlog_staff FOREIGN KEY (staff_id) REFERENCES users(id);

ALTER TABLE rentals ADD CONSTRAINT fk_rent_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE rentals ADD CONSTRAINT fk_rent_addr FOREIGN KEY (address_id) REFERENCES addresses(id);
ALTER TABLE rentals ADD CONSTRAINT fk_rent_coup FOREIGN KEY (coupon_id) REFERENCES coupons(id);

ALTER TABLE rental_details ADD CONSTRAINT fk_rdet_rent FOREIGN KEY (rental_id) REFERENCES rentals(id);
ALTER TABLE rental_details ADD CONSTRAINT fk_rdet_prod FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE rental_details ADD CONSTRAINT fk_rdet_combo FOREIGN KEY (combo_id) REFERENCES combos(id);
ALTER TABLE rental_details ADD CONSTRAINT fk_rdet_inv FOREIGN KEY (inventory_id) REFERENCES inventory(id);

ALTER TABLE rental_issues ADD CONSTRAINT fk_riss_rent FOREIGN KEY (rental_id) REFERENCES rentals(id);
ALTER TABLE rental_issues ADD CONSTRAINT fk_riss_rdet FOREIGN KEY (rental_detail_id) REFERENCES rental_details(id);

ALTER TABLE transactions ADD CONSTRAINT fk_trans_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE transactions ADD CONSTRAINT fk_trans_rent FOREIGN KEY (rental_id) REFERENCES rentals(id);
ALTER TABLE transactions ADD CONSTRAINT fk_trans_issue FOREIGN KEY (issue_id) REFERENCES rental_issues(id);

ALTER TABLE reviews ADD CONSTRAINT fk_rev_prod FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE reviews ADD CONSTRAINT fk_rev_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE reviews ADD CONSTRAINT fk_rev_rent FOREIGN KEY (rental_id) REFERENCES rentals(id);

ALTER TABLE return_orders ADD CONSTRAINT fk_ro_rent FOREIGN KEY (rental_id) REFERENCES rentals(id);

ALTER TABLE return_details ADD CONSTRAINT fk_rd_ro FOREIGN KEY (return_order_id) REFERENCES return_orders(id);
ALTER TABLE return_details ADD CONSTRAINT fk_rd_rdet FOREIGN KEY (rental_detail_id) REFERENCES rental_details(id);

ALTER TABLE notifications ADD CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id);
-- ==========================================
-- SEED DATA — Dữ liệu mẫu
-- ==========================================

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- reset existing data để có thể import nhiều lần
-- ==========================================
TRUNCATE TABLE notifications;
TRUNCATE TABLE return_details;
TRUNCATE TABLE return_orders;
TRUNCATE TABLE reviews;
TRUNCATE TABLE transactions;
TRUNCATE TABLE rental_issues;
TRUNCATE TABLE rental_details;
TRUNCATE TABLE rentals;
TRUNCATE TABLE maintenance_logs;
TRUNCATE TABLE inventory;
TRUNCATE TABLE import_details;
TRUNCATE TABLE import_orders;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE combo_details;
TRUNCATE TABLE combos;
TRUNCATE TABLE product_img;
TRUNCATE TABLE products;
TRUNCATE TABLE rental_policies;
TRUNCATE TABLE brands;
TRUNCATE TABLE categories;
TRUNCATE TABLE addresses;
TRUNCATE TABLE user_info;
TRUNCATE TABLE user_tokens;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE role_has_permission;
TRUNCATE TABLE permissions;
TRUNCATE TABLE roles;
TRUNCATE TABLE users;

-- ==========================================
-- roles
-- ==========================================
INSERT INTO roles (id, name) VALUES
(1, 'ADMIN'),
(2, 'STAFF'),
(3, 'CUSTOMER');

-- ==========================================
-- permissions
-- ==========================================
INSERT INTO permissions (id, name) VALUES
(1, 'CREATE'),
(2, 'READ'),
(3, 'UPDATE'),
(4, 'DELETE');

-- ==========================================
-- role_has_permission
-- ADMIN: full quyền | STAFF: CREATE,READ,UPDATE | CUSTOMER: READ
-- ==========================================
INSERT INTO role_has_permission (role_id, permission_id) VALUES
(1, 1),(1, 2),(1, 3),(1, 4),
(2, 1),(2, 2),(2, 3),
(3, 2);

-- ==========================================
-- users (password = "password123" bcrypt)
-- ==========================================
INSERT INTO users (id, email, hash_password, full_name, phone, status, created_at) VALUES
(1, 'admin@rentgear.vn',    '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Nguyễn Văn Admin',  '0901000001', 'ACTIVE', '2025-01-01 08:00:00'),
(2, 'staff1@rentgear.vn',   '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Trần Thị Staff',    '0901000002', 'ACTIVE', '2025-01-02 08:00:00'),
(3, 'baonguyen@gmail.com',  '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Nguyễn Hữu Bảo',   '0901000003', 'ACTIVE', '2025-02-10 09:00:00'),
(4, 'cuongle@gmail.com',    '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Lê Văn Cường',     '0901000004', 'ACTIVE', '2025-02-15 10:00:00'),
(5, 'danhpham@gmail.com',   '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Phạm Tiến Danh',   '0901000005', 'ACTIVE', '2025-03-01 11:00:00'),
(6, 'customer1@gmail.com',  '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Hoàng Thị Mai',    '0901000006', 'ACTIVE', '2025-03-05 08:30:00'),
(7, 'customer2@gmail.com',  '$2y$12$wSNEjZKw9zAzH0Z2c6V6luU8X6znRx5QCGAPh4S1xeyvBTSpfOSum', 'Đinh Quốc Tuấn',   '0901000007', 'INACTIVE','2025-03-10 08:00:00');

-- ==========================================
-- user_roles
-- ==========================================
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3);

-- ==========================================
-- user_tokens
-- ==========================================
INSERT INTO user_tokens (user_id, token, expires_at, lastused_at) VALUES
(1, 'token_admin_001',    '2026-12-31 23:59:59', '2026-03-26 08:00:00'),
(2, 'token_staff_001',    '2026-12-31 23:59:59', '2026-03-26 08:10:00'),
(3, 'token_bao_001',      '2026-06-30 23:59:59', '2026-03-25 10:00:00'),
(4, 'token_cuong_001',    '2026-06-30 23:59:59', '2026-03-24 09:00:00'),
(6, 'token_customer1_001','2026-06-30 23:59:59', '2026-03-26 07:00:00');

-- ==========================================
-- user_info
-- ==========================================
INSERT INTO user_info (user_id, card_id, user_img, status) VALUES
(3, '079201012345', 'https://cdn.rentgear.vn/users/bao.jpg',      'VERIFIED'),
(4, '079201012346', 'https://cdn.rentgear.vn/users/cuong.jpg',    'VERIFIED'),
(5, '079201012347', 'https://cdn.rentgear.vn/users/danh.jpg',     'PENDING'),
(6, '079201012348', 'https://cdn.rentgear.vn/users/mai.jpg',      'VERIFIED'),
(7, '079201012349', 'https://cdn.rentgear.vn/users/tuan.jpg',     'REJECTED');

-- ==========================================
-- addresses
-- ==========================================
INSERT INTO addresses (user_id, receive_name, receive_phone, city, ward, street, is_default) VALUES
(3, 'Nguyễn Hữu Bảo',  '0901000003', 'TP. Hồ Chí Minh',         'Phường Bến Nghé',   '12 Lê Lợi',          TRUE),
(4, 'Lê Văn Cường',     '0901000004', 'TP. Hồ Chí Minh',         'Phường 4',          '88 Võ Văn Tần',      TRUE),
(5, 'Phạm Tiến Danh',   '0901000005', 'TP. Hồ Chí Minh',     'Phường 25',         '34 Đinh Bộ Lĩnh',   TRUE),
(6, 'Hoàng Thị Mai',    '0901000006', 'TP. Hồ Chí Minh',         'Phường Tân Phú',    '56 Nguyễn Thị Thập', TRUE),
(6, 'Hoàng Thị Mai',    '0901000006', 'TP. Hồ Chí Minh',  'Phường 2',          '9 Cộng Hòa',         FALSE),
(7, 'Đinh Quốc Tuấn',   '0901000007', 'Hà Nội',               'Phường Dịch Vọng',  '101 Trần Thái Tông', TRUE);

-- ==========================================
-- categories
-- ==========================================
INSERT INTO categories (id, name, slug) VALUES
(1, 'Máy ảnh',         'may-anh'),
(2, 'Ống kính',        'ong-kinh'),
(3, 'Flycam',          'flycam'),
(4, 'Phụ kiện quay',   'phu-kien-quay'),
(5, 'Thiết bị âm thanh','thiet-bi-am-thanh'),
(6, 'Ánh sáng',        'anh-sang');

-- ==========================================
-- brands
-- ==========================================
INSERT INTO brands (id, name, logo) VALUES
(1, 'Sony',    'https://cdn.rentgear.vn/brands/sony.png'),
(2, 'Canon',   'https://cdn.rentgear.vn/brands/canon.png'),
(3, 'Nikon',   'https://cdn.rentgear.vn/brands/nikon.png'),
(4, 'DJI',     'https://cdn.rentgear.vn/brands/dji.png'),
(5, 'Rode',    'https://cdn.rentgear.vn/brands/rode.png'),
(6, 'Godox',   'https://cdn.rentgear.vn/brands/godox.png'),
(7, 'Fujifilm','https://cdn.rentgear.vn/brands/fujifilm.png');

-- ==========================================
-- rental_policies
-- ==========================================
INSERT INTO rental_policies (id, late_day_fee, max_late_day) VALUES
(1, 50000.00,  7),
(2, 100000.00, 5),
(3, 200000.00, 3),
(4, 30000.00,  10);

-- ==========================================
-- products
-- ==========================================
INSERT INTO products (id, policies_id, category_id, brand_id, name, slug, daily_price, deposit_price, description, status, created_at, updated_at) VALUES
(1, 2, 1, 1, 'Sony A7 III',          'sony-a7-iii',          500000.00, 5000000.00, 'Máy ảnh mirrorless full-frame 24.2MP, quay video 4K.',         'ACTIVE', '2025-01-10 08:00:00', '2025-03-01 08:00:00'),
(2, 2, 1, 2, 'Canon EOS R6 Mark II', 'canon-eos-r6-mark-ii', 600000.00, 6000000.00, 'Máy ảnh mirrorless tốc độ cao, IBIS 8 stops.',                 'ACTIVE', '2025-01-12 08:00:00', '2025-03-01 08:00:00'),
(3, 1, 2, 1, 'Sony FE 24-70mm f/2.8','sony-fe-24-70-f28',    350000.00, 3500000.00, 'Ống kính zoom tiêu chuẩn, khẩu độ lớn f/2.8.',                'ACTIVE', '2025-01-15 08:00:00', '2025-03-01 08:00:00'),
(4, 3, 3, 4, 'DJI Mavic 3 Pro',      'dji-mavic-3-pro',      700000.00, 7000000.00, 'Flycam 3 camera, bay 43 phút, hình ảnh Hasselblad.',           'ACTIVE', '2025-02-01 08:00:00', '2025-03-01 08:00:00'),
(5, 1, 5, 5, 'Rode VideoMic Pro+',   'rode-videomic-pro-plus',150000.00, 1000000.00, 'Micro shotgun on-camera, lọc noise tốt, dùng pin AA.',        'ACTIVE', '2025-02-05 08:00:00', '2025-03-01 08:00:00'),
(6, 1, 6, 6, 'Godox SL-60W',         'godox-sl-60w',          200000.00, 1500000.00, 'Đèn LED studio 60W, nhiệt độ màu 5600K, không flickering.',   'ACTIVE', '2025-02-10 08:00:00', '2025-03-01 08:00:00'),
(7, 2, 1, 7, 'Fujifilm X-T5',        'fujifilm-x-t5',         450000.00, 4500000.00, 'Máy ảnh APS-C 40.2MP, body nhỏ gọn, màu film Fuji đẹp.',     'ACTIVE', '2025-02-20 08:00:00', '2025-03-01 08:00:00'),
(8, 1, 4, 4, 'DJI RS 3 Mini',        'dji-rs-3-mini',         180000.00, 1200000.00, 'Gimbal 3 trục nhẹ 795g, phù hợp máy ảnh mirrorless nhỏ.',    'ACTIVE', '2025-03-01 08:00:00', '2025-03-01 08:00:00');

-- ==========================================
-- product_img
-- ==========================================
INSERT INTO product_img (product_id, image_url) VALUES
(1, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1516035069371-29a1b244cc32-69c8ef042c5c9.jpg'),
(1, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1516724562728-afc824a36e84-69c8ef05eb797.jpg'),
(2, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1502920917128-1aa500764cbd-69c8ef06d435c.jpg'),
(2, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/900-69c8ef58c9bb5.jpg'),
(3, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1617005082133-548c4dd27f35-69c8ef092a711.jpg'),
(4, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1473968512647-3e447244af8f-69c8ef0b107b5.jpg'),
(4, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1508614589041-895b88991e3e-69c8ef0c593b4.jpg'),
(5, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1590602847861-f357a9332bbc-69c8ef0e40579.jpg'),
(6, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/900-69c8ef5aed793.jpg'),
(7, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/photo-1510127034890-ba27508e9f1c-69c8ef1048c5e.jpg'),
(8, 'https://woeymreiygtlspyzjkfe.supabase.co/storage/v1/object/public/images/products/migrated/900-69c8ef5ce7d8b.jpg');

-- ==========================================
-- combos
-- ==========================================
INSERT INTO combos (id, name, daily_price, description) VALUES
(1, 'Combo Quay phim Cơ bản',   900000.00, 'Sony A7 III + Rode VideoMic Pro+ + DJI RS 3 Mini'),
(2, 'Combo Flycam Pro',         850000.00, 'DJI Mavic 3 Pro + thẻ nhớ + sạc dự phòng'),
(3, 'Combo Studio Ánh sáng',    550000.00, 'Godox SL-60W x2 + chân đèn + softbox'),
(4, 'Combo Chụp ảnh Toàn diện', 950000.00, 'Canon EOS R6 II + Sony 24-70mm + Godox SL-60W');

-- ==========================================
-- combo_details
-- ==========================================
INSERT INTO combo_details (combo_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 5, 1),
(1, 8, 1),
(2, 4, 1),
(3, 6, 2),
(4, 2, 1),
(4, 3, 1),
(4, 6, 1);

-- ==========================================
-- suppliers
-- ==========================================
INSERT INTO suppliers (id, name, phone, email) VALUES
(1, 'Sony Việt Nam phân phối',      '02838123456', 'supply@sony.com.vn'),
(2, 'Canon Việt Nam',               '02835678901', 'supply@canon.com.vn'),
(3, 'DJI Authorized Distributor',   '02839012345', 'vn@dji-dist.com'),
(4, 'Rode Audio VN',                '02833456789', 'contact@rodeaudio.vn'),
(5, 'Godox Lighting VN',            '02836789012', 'sales@godox.vn'),
(6, 'Fujifilm VN',                  '02832345678', 'supply@fujifilm.vn');

-- ==========================================
-- import_orders
-- ==========================================
INSERT INTO import_orders (id, supplier_id, admin_id, total_cost, import_date) VALUES
(1, 1, 1, 45000000.00, '2025-01-08 10:00:00'),
(2, 2, 1, 36000000.00, '2025-01-10 10:00:00'),
(3, 3, 1, 28000000.00, '2025-01-25 09:00:00'),
(4, 4, 1,  6000000.00, '2025-02-03 09:00:00'),
(5, 5, 1, 12000000.00, '2025-02-08 09:00:00'),
(6, 6, 1, 27000000.00, '2025-02-18 10:00:00');

-- ==========================================
-- import_details
-- ==========================================
INSERT INTO import_details (import_order_id, product_id, quantity, cost_price) VALUES
(1, 1, 3, 15000000),
(2, 2, 2, 18000000),
(3, 4, 2, 14000000),
(4, 5, 4,  1500000),
(5, 6, 4,  3000000),
(6, 7, 3,  9000000),
(1, 3, 2,  7500000),
(3, 8, 3,  1800000);

-- ==========================================
-- inventory
-- ==========================================
INSERT INTO inventory (id, product_id, import_order_id, `condition`, status, serial_number, notes, purchased_at) VALUES
(1,  1, 1, 'NEW',  'AVAILABLE', 'SNYSN-A73-001', NULL,                    '2025-01-08 00:00:00'),
(2,  1, 1, 'NEW',  'RENTING',   'SNYSN-A73-002', NULL,                    '2025-01-08 00:00:00'),
(3,  1, 1, 'GOOD', 'AVAILABLE', 'SNYSN-A73-003', 'Xước nhẹ viền body',   '2025-01-08 00:00:00'),
(4,  2, 2, 'NEW',  'AVAILABLE', 'CNESR-R6-001',  NULL,                    '2025-01-10 00:00:00'),
(5,  2, 2, 'NEW',  'RENTING',   'CNESR-R6-002',  NULL,                    '2025-01-10 00:00:00'),
(6,  4, 3, 'NEW',  'AVAILABLE', 'DJIMV3-001',    NULL,                    '2025-01-25 00:00:00'),
(7,  4, 3, 'NEW',  'MAINTENANCE','DJIMV3-002',   'Đang hiệu chỉnh gimbal','2025-01-25 00:00:00'),
(8,  5, 4, 'NEW',  'AVAILABLE', 'RODE-VMP-001',  NULL,                    '2025-02-03 00:00:00'),
(9,  6, 5, 'NEW',  'AVAILABLE', 'GDXSL-001',     NULL,                    '2025-02-08 00:00:00'),
(10, 7, 6, 'NEW',  'AVAILABLE', 'FJXT5-001',     NULL,                    '2025-02-18 00:00:00');

-- ==========================================
-- maintenance_logs
-- ==========================================
INSERT INTO maintenance_logs (inventory_id, staff_id, maintenance_name, description, cost, start_date, end_date, status) VALUES
(7, 2, 'Hiệu chỉnh gimbal',      'Gimbal bị lệch trục sau chuyến thuê, cần căn chỉnh lại.',   500000.00, '2026-03-20 09:00:00', '2026-03-25 17:00:00', 'INVENTORY'),
(3, 2, 'Vệ sinh body máy ảnh',   'Làm sạch cảm biến và vệ sinh tổng thể body.',               200000.00, '2026-02-10 09:00:00', '2026-02-10 17:00:00', 'MAINTENANCED'),
(5, 2, 'Thay pin grip',          'Pin grip bị phồng, thay mới.',                               350000.00, '2026-01-15 09:00:00', '2026-01-16 17:00:00', 'MAINTENANCED'),
(2, 2, 'Kiểm tra shutter count', 'Kiểm tra shutter count định kỳ sau 500 lần thuê.',           100000.00, '2026-03-01 09:00:00', '2026-03-01 12:00:00', 'MAINTENANCED');

-- ==========================================
-- coupons
-- ==========================================
INSERT INTO coupons (id, code, discount_amount, description, valid_from, valid_until) VALUES
(1, 'WELCOME50K',  50000.00,  'Giảm 50k cho khách hàng mới',           '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
(2, 'SALE100K',   100000.00,  'Giảm 100k dịp khai trương',             '2025-03-01 00:00:00', '2025-03-31 23:59:59'),
(3, 'SUMMER200K', 200000.00,  'Ưu đãi mùa hè, đơn từ 1 triệu',        '2025-06-01 00:00:00', '2025-08-31 23:59:59'),
(4, 'VIP150K',    150000.00,  'Dành riêng cho khách VIP',              '2025-01-01 00:00:00', '2026-12-31 23:59:59'),
(5, 'NEWUSER30K',  30000.00,  'Tặng kèm khi đăng ký tài khoản',       '2025-01-01 00:00:00', '2026-06-30 23:59:59');

-- ==========================================
-- rentals
-- ==========================================
INSERT INTO rentals (id, user_id, coupon_id, address_id, code, start_date, end_date, actual_return_date, total_price, deposit_amount, status, note, created_at, updated_at) VALUES
(1, 3, 1,  1, 'RENT-2026-0001', '2026-03-10 08:00:00', '2026-03-13 08:00:00', '2026-03-13 07:30:00', 1450000.00, 5000000.00, 'COMPLETED', NULL,                          '2026-03-08 10:00:00', '2026-03-13 08:00:00'),
(2, 4, NULL,2, 'RENT-2026-0002', '2026-03-15 08:00:00', '2026-03-18 08:00:00', NULL,                  2100000.00, 7000000.00, 'PICKED_UP', 'Giao buổi sáng trước 9h',    '2026-03-13 14:00:00', '2026-03-15 08:00:00'),
(3, 6, 2,  4, 'RENT-2026-0003', '2026-03-20 08:00:00', '2026-03-22 08:00:00', NULL,                  1300000.00, 6000000.00, 'DEPOSITED', NULL,                          '2026-03-18 09:00:00', '2026-03-19 10:00:00'),
(4, 6, NULL,4, 'RENT-2026-0004', '2026-03-28 08:00:00', '2026-03-30 08:00:00', NULL,                   700000.00, 1500000.00, 'APPROVED',  'Cần thêm túi đựng thiết bị', '2026-03-25 11:00:00', '2026-03-26 08:00:00'),
(5, 5, 4,  3, 'RENT-2026-0005', '2026-04-01 08:00:00', '2026-04-05 08:00:00', NULL,                  1750000.00, 4500000.00, 'PENDING',   NULL,                          '2026-03-26 09:00:00', '2026-03-26 09:00:00'),
(6, 3, NULL,1, 'RENT-2026-0006', '2026-02-01 08:00:00', '2026-02-03 08:00:00', '2026-02-05 10:00:00',  960000.00, 7000000.00, 'COMPLETED', 'Trả trễ 2 ngày',             '2026-01-28 15:00:00', '2026-02-05 11:00:00');

-- ==========================================
-- rental_details
-- ==========================================
INSERT INTO rental_details (rental_id, product_id, combo_id, inventory_id, quantity, price_at_rental) VALUES
(1, 1,    NULL, 1,    1, 500000.00),
(2, 2,    NULL, 5,    1, 600000.00),
(2, 4,    NULL, 6,    1, 700000.00),
(3, 2,    NULL, 4,    1, 600000.00),
(4, 5,    NULL, 8,    1, 150000.00),
(4, 6,    NULL, 9,    2, 200000.00),
(5, 7,    NULL, 10,   1, 450000.00),
(6, 2,    NULL, 5,    1, 600000.00);

-- ==========================================
-- rental_issues
-- ==========================================
INSERT INTO rental_issues (rental_id, rental_detail_id, type, description, penalty_fee, status) VALUES
(6, 8, 'LATE',    'Khách trả trễ 2 ngày so với hợp đồng.',        200000.00, 'RESOLVED'),
(2, 2, 'DAMAGED', 'Phát hiện trầy màn hình LCD sau khi trả máy.', 500000.00, 'PENDING');

-- ==========================================
-- transactions
-- ==========================================
INSERT INTO transactions (rental_id, user_id, issue_id, type, amount, payment_method, status, transaction_ref, created_at) VALUES
(1, 3, NULL, 'DEPOSIT',  5000000.00, 'bank_transfer', 'SUCCESS', 'TXN-DEP-20260308-001', '2026-03-08 10:30:00'),
(1, 3, NULL, 'PAYMENT',  1450000.00, 'bank_transfer', 'SUCCESS', 'TXN-PAY-20260313-001', '2026-03-13 08:30:00'),
(1, 3, NULL, 'REFUND',   5000000.00, 'bank_transfer', 'SUCCESS', 'TXN-REF-20260313-001', '2026-03-13 09:00:00'),
(2, 4, NULL, 'DEPOSIT',  7000000.00, 'bank_transfer', 'SUCCESS', 'TXN-DEP-20260313-002', '2026-03-13 14:30:00'),
(3, 6, NULL, 'DEPOSIT',  6000000.00, 'momo',          'SUCCESS', 'TXN-DEP-20260318-003', '2026-03-18 09:30:00'),
(6, 3, NULL, 'DEPOSIT',  7000000.00, 'bank_transfer', 'SUCCESS', 'TXN-DEP-20260128-006', '2026-01-28 15:30:00'),
(6, 3, NULL, 'PAYMENT',   960000.00, 'bank_transfer', 'SUCCESS', 'TXN-PAY-20260205-006', '2026-02-05 11:00:00'),
(6, 3, 1,   'FINE',       200000.00, 'cash',          'SUCCESS', 'TXN-FIN-20260205-006', '2026-02-05 11:15:00');

-- ==========================================
-- reviews
-- ==========================================
INSERT INTO reviews (user_id, product_id, rental_id, rating, comment, created_at) VALUES
(3, 1, 1, 5, 'Máy ảnh tuyệt vời, chụp đẹp, giao hàng đúng giờ. Sẽ thuê lại!',              '2026-03-14 09:00:00'),
(3, 2, 6, 4, 'Máy tốt nhưng lần này mình trả trễ do kẹt việc. Lỗi mình, shop xử lý ok.',   '2026-02-06 10:00:00'),
(4, 2, 2, 5, 'Canon R6 II xuất sắc, autofocus cực nhanh. Đóng gói cẩn thận.',               '2026-03-20 08:00:00'),
(6, 2, 3, 4, 'Hài lòng với chất lượng sản phẩm, nhân viên tư vấn nhiệt tình.',              '2026-03-23 14:00:00');

-- ==========================================
-- return_orders
-- ==========================================
INSERT INTO return_orders (id, rental_id, return_date) VALUES
(1, 1, '2026-03-13 07:30:00'),
(2, 6, '2026-02-05 10:00:00');

-- ==========================================
-- return_details
-- ==========================================
INSERT INTO return_details (return_order_id, rental_detail_id, `condition`, note) VALUES
(1, 1, 'GOOD',    NULL),
(2, 8, 'DAMAGED', 'Trầy nhẹ màn hình LCD, đã ghi nhận và xử lý phạt trễ 2 ngày.');

-- ==========================================
-- notifications
-- ==========================================
INSERT INTO notifications (user_id, title, content, type, is_read, created_at) VALUES
(3, 'Đơn thuê đã được duyệt',      'Đơn RENT-2026-0001 đã được xác nhận. Vui lòng đặt cọc để tiếp tục.',        'ORDER',  TRUE,  '2026-03-08 11:00:00'),
(3, 'Trả hàng thành công',         'Cảm ơn bạn đã trả hàng đúng hạn. Tiền cọc sẽ được hoàn trong 1-3 ngày.',   'ORDER',  TRUE,  '2026-03-13 09:00:00'),
(4, 'Đơn thuê đang xử lý',         'Đơn RENT-2026-0002 đã được nhận. Chúng tôi sẽ liên hệ xác nhận sớm.',      'ORDER',  FALSE, '2026-03-13 15:00:00'),
(6, 'Xác nhận đặt cọc',            'Đặt cọc cho đơn RENT-2026-0003 thành công. Chuẩn bị nhận hàng ngày 20/3.', 'ORDER',  TRUE,  '2026-03-18 10:00:00'),
(6, 'Nhắc nhở trả hàng',           'Đơn RENT-2026-0004 sẽ kết thúc sau 2 ngày. Vui lòng chuẩn bị trả hàng.',  'ORDER',  FALSE, '2026-03-28 08:00:00'),
(5, 'Đăng ký thành công',          'Chào mừng Phạm Tiến Danh! Tài khoản của bạn đã được tạo.',                 'SYSTEM', TRUE,  '2025-03-01 11:05:00'),
(7, 'Tài khoản bị tạm khoá',       'Tài khoản của bạn đã bị tạm khoá. Liên hệ hỗ trợ để biết thêm chi tiết.', 'SYSTEM', FALSE, '2025-04-10 08:00:00');

SET FOREIGN_KEY_CHECKS = 1;
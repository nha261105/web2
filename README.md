# Đồ án Web2: Management Rental Equipment System

## Tổng quan đồ án
Dự án là một nền tảng chuyên dụng cho các cửa hàng cho thuê thiết bị quay phim, nhiếp ảnh và IT. Hệ thống giải quyết các bài toán nghiệp vụ phức tạp mà các phần mềm bán hàng thông thường không làm được:

* **Quản lý Tài sản định danh (Serialized Inventory):** Theo dõi từng thiết bị vật lý qua số Serial (Status: Available, Renting, Maintenance, Lost).
* **Quy trình Trả hàng linh hoạt:** Hỗ trợ trả hàng nhiều lần (Partial Return), kiểm tra tình trạng hỏng hóc, mất mát ngay tại quầy.
* **Cơ chế Phạt & Đền bù:** Tự động tính phí trễ hạn (Late Fee) và phí đền bù hư hỏng dựa trên Policy động.
* **Đặt lịch thông minh:** Kiểm tra tồn kho theo thời gian thực (Real-time Availability Check) để tránh trùng lịch.

## 👥 Thành viên nhóm (Team Members)

| STT | Họ và Tên | MSSV |
| :-- | :--- | :--- | :--- | :--- |
| 1 | **Nguyễn Hoàng Anh** | 3123410007  |
| 2 | **Nguyễn Âu Gia Bảo** | 3123410029 |
| 3 | **Lê Mạnh Cường** | 3123410035 | 
| 4 | **Nguyễn Trần Công Danh** | 31234100?? | 

---

## 🛠 Công nghệ sử dụng (Tech Stack)

### Frontend (Client-side)
* **Framework:** ReactJS (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Hooks / Context API / Zustand / ReactQuery
* **HTTP Client:** Axios

### Backend (Server-side)
* **Framework:** Laravel 11
* **Language:** PHP >= 8.2
* **Dependency Manager:** Composer 2.x
* **Architecture:** MVC + Service Layer Pattern
* **Authentication:** Laravel Sanctum (API Token)
* **Database:** MySQL / MariaDB


### Tools & DevOps
* **Database Management:** DBeaver, phpMyAdmin.
* **Design:** v0.dev / gooddesign
* **Version Control:** Git & GitHub.
* **API Testing:** Postman / SwaggerUI.


## 🏗 Kiến trúc Hệ thống (System Architecture)


### 1. Frontend Architecture (Feature-based)
```text
frontend/src/
├── pages/
│   ├── auth/
│   ├── admin/
│   └── client/
├── components/
├── services/   ← gọi API
├── layouts/
├── hooks/
└── utils/

backend/app/
├── Http/Controllers/
├── Services/        ← Logic chính
├── Models/
├── Requests/
├── Resources/

```


### Hướng dẫn Cài đặt & Chạy dự án (Setup Guide)
Yêu cầu:
 Node.js (v18 trở lên)
 PHP (v8.2 trở lên)
Composer (v2 trở lên)
 MySQL/MariaDB Server

Step 1: Clone project
tạo folder (tùy ae)
git clone https://github.com/nha261105/web2.git

### Window
Step 2:Setup database
+ Download XAMPP
+ Mở XAMPP Control Panel -> Start Apache và MySQL
+ Truy cập http://localhost/phpmyadmin
+ Tạo một database mới tên là: web2 (Collation: utf8mb4_unicode_ci).

### Linux
Step 2: Setup database
+ Download Mariadb
+ sudo systemctl start mariadb (chạy mariadb)
+ CREATE DATABASE web2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; (tạo database)

Step 3:
## 1.vào folder backend
cd Backend
## 2. Cài đặt các gói thư viện PHP
composer install

## 3. Tạo file môi trường từ file mẫu
cp .env.example .env

## 4. Tạo Key ứng dụng
php artisan key:generate

## 5. Cấu hình kết nối Database
## Mở file .env và sửa các dòng sau:
## DB_CONNECTION=mysql
## DB_HOST=127.0.0.1
## DB_PORT=3306
## DB_DATABASE=web2  <-- Tên DB vừa tạo
## DB_USERNAME=root       <-- Mặc định XAMPP là root
## DB_PASSWORD=           <-- Mặc định XAMPP để trống (Linux thì điền pass root của bạn)

# 6. Chạy Migration để tạo bảng dữ liệu
php artisan migrate

# 8. Khởi chạy Server
php artisan serve

# 9. Backend port
PORT: http://localhost:8000


Step 4:
## 1.Vào folder frontend
cd frontend

## 2.Cài lib
npm install

## 3.Chạy fe
npm run dev

## 4.Frontend port
PORT: http://localhost:5173


# WORKFLOW
- main: Chỉ chứa code ổn định để demo / release
- dev: Nhánh phát triển chính

Quy tắc:
- Feature mới → tạo nhánh từ develop (vd: feat/login)
- Hoàn thành → tạo Pull Request vào dev
- Tuyệt đối không push trực tiếp vào main
















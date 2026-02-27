# Đồ án Web2: Management Rental Equipment System

## Tổng quan đồ án

Dự án là một nền tảng chuyên dụng cho các cửa hàng cho thuê thiết bị quay phim, nhiếp ảnh và IT. Hệ thống giải quyết các bài toán nghiệp vụ phức tạp mà các phần mềm bán hàng thông thường không làm được:

- **Quản lý Tài sản định danh (Serialized Inventory):** Theo dõi từng thiết bị vật lý qua số Serial (Status: Available, Renting, Maintenance, Lost).
- **Quy trình Trả hàng linh hoạt:** Hỗ trợ trả hàng nhiều lần (Partial Return), kiểm tra tình trạng hỏng hóc, mất mát ngay tại quầy.
- **Cơ chế Phạt & Đền bù:** Tự động tính phí trễ hạn (Late Fee) và phí đền bù hư hỏng dựa trên Policy động.
- **Đặt lịch thông minh:** Kiểm tra tồn kho theo thời gian thực (Real-time Availability Check) để tránh trùng lịch.

## Thành viên nhóm (Team Members)

| STT | Họ và Tên                 | MSSV       |
| :-- | :------------------------ | ---------- |
| 1   | **Nguyễn Hoàng Anh**      | 3123410007 |
| 2   | **Nguyễn Âu Gia Bảo**     | 3123410029 |
| 3   | **Lê Mạnh Cường**         | 3123410035 |
| 4   | **Nguyễn Trần Công Danh** | 31234100?? |

---

## Công nghệ sử dụng (Tech Stack)

### Frontend (Client-side)

- **Framework:** ReactJS (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS,react-hot-toast,lucid-react(icon),swiper(hero slide)
- **State Management:** Zustand
- **Data Fetching:** React Query (@tanstack/react-query)
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend (Server-side)

- **Framework:** Laravel 12
- **Language:** PHP >= 8.2
- **Dependency Manager:** Composer 2.x
- **Architecture:** MVC + Service Layer Pattern
- **Authentication:** Laravel Sanctum (API Token)
- **Database:** MySQL / MariaDB

### Tools & DevOps

- **Database Management:** DBeaver, phpMyAdmin.
- **Design:** figma
- **Version Control:** Git & GitHub.
- **API Testing:** Postman / SwaggerUI.

## 🏗 Kiến trúc Hệ thống (System Architecture)

### 1. Frontend Architecture (Feature-based)

### FRONTEND

```text
frontend/
├── src/                         # Mã nguồn chính
│   ├── components/              # Reusable UI components
│   │   ├── common/             # Common components (Button, Input, Modal...)
│   │   └── layout/             # Layout components (Header, Footer, Sidebar...)
│   │
│   ├── pages/                   # Page components (màn hình)
│   │   ├── auth/               # Login, Register, ForgotPassword
│   │   ├── admin/              # admin management
│   │   ├── client/             # end user management
│   │
│   ├── services/                # API calls (axios instances)
│   │   ├── api.ts              # Axios config
│   │   ├── authService.ts      # Auth APIs
│   │   ├── userService.ts      # User APIs
│   │   └── ...
│   │
│   ├── stores/                  # Zustand state management
│   │   ├── authStore.ts        # Auth state
│   │   ├── userStore.ts        # User state
│   │   └── ...
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Auth hook
│   │   ├── useUsers.ts         # User hook (React Query)
│   │   └── ...
│   │
│   ├── types/                   # TypeScript types/interfaces
│   │   ├── user.ts             # User types
│   │   ├── product.ts          # Product types
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── validation.ts       # Validation helpers
│   │   ├── formatters.ts       # Format data
│   │   └── ...
│   │
│   ├── routes/                  # React Router config
│   │   └── index.tsx           # Routes definition
│   │
│   ├── assets/                  # Static files (images, fonts)
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── public/                      # Static assets (không qua build)
├── dist/                        # Build output (production)
└── node_modules/                # Dependencies từ npm

```

### BACKEND

```text

backend/
├── app/                          # Mã nguồn chính của ứng dụng
│   ├── Http/
│   │   ├── Controllers/         # Xử lý HTTP requests
│   │   ├── Requests/            # Validation rules (Form Requests)
│   │   ├── Resources/           # Format JSON responses (API Resources)
│   │   └── Middleware/          # Xử lý trước/sau request
│   ├── Models/                  # Eloquent ORM models (tương tác database)
│   ├── Services/                # Business logic layer
│   └── Providers/               # Service providers (config services)
│
├── bootstrap/                   # Khởi tạo framework
│   ├── app.php                  # Bootstrap ứng dụng
│   └── cache/                   # Cache bootstrap
│
├── config/                      # Các file cấu hình
│   ├── app.php                  # Config ứng dụng
│   ├── database.php             # Config database
│   ├── auth.php                 # Config authentication
│   └── ...
│
├── database/
│   ├── migrations/              # Database schema (tạo/sửa bảng)
│   ├── seeders/                 # Dữ liệu mẫu
│   └── factories/               # Tạo fake data cho testing
│
├── routes/
│   ├── api.php                  # API routes (prefix: /api)
│   ├── web.php                  # Web routes
│   └── console.php              # Artisan commands
│
├── storage/                     # Files được tạo bởi app
│   ├── app/                     # Files upload
│   ├── logs/                    # Log files
│   └── framework/               # Cache, sessions, views
│
├── public/                      # Public assets (entry point)
│   └── index.php                # Entry point
│
├── resources/                   # Views và assets chưa compile
├── tests/                       # Unit & Feature tests
└── vendor/                      # Dependencies từ Composer

```

## Backend Flow

```text
Request → Route → Controller → Request Validation → Service → Model → Database
                                                     ↓
Response ← Resource (JSON Format) ← Controller ← Service ←┘

1. CLIENT gửi request
   ↓
2. ROUTE (routes/api.php) - Định tuyến request đến Controller
   ↓
3. CONTROLLER (app/Http/Controllers/) - Nhận request
   ↓
4. REQUEST VALIDATION (app/Http/Requests/) - Validate dữ liệu
   ↓
5. SERVICE (app/Services/) - Xử lý business logic
   ↓
6. MODEL (app/Models/) - Tương tác với database (Eloquent ORM)
   ↓
7. DATABASE - Thực hiện query (SELECT, INSERT, UPDATE, DELETE)
   ↓
8. MODEL trả kết quả về SERVICE
   ↓
9. SERVICE trả kết quả về CONTROLLER
   ↓
10. RESOURCE (app/Http/Resources/) - Format dữ liệu thành JSON
   ↓
11. CONTROLLER trả response về CLIENT

```

## Frontend Flow

```text
UI Event → Service (API Call) → Backend → Response → Store/State → UI Update

1. USER tương tác với UI (click button, submit form)
   ↓
2. COMPONENT (pages/users/CreateUser.tsx) - Xử lý event
   ↓
3. CUSTOM HOOK (hooks/useUsers.ts) - React Query hook
   ↓
4. SERVICE (services/userService.ts) - Gọi API qua Axios
   ↓
5. BACKEND API - Xử lý request
   ↓
6. RESPONSE trả về từ Backend
   ↓
7. REACT QUERY - Cache và update data
   ↓
8. STORE (stores/userStore.ts - Zustand) - Update global state (optional)
   ↓
9. COMPONENT re-render với data mới
   ↓
10. UI cập nhật hiển thị cho user

```

### Hướng dẫn Cài đặt & Chạy dự án (Setup Guide)

```text

Yêu cầu:
Node.js (v18 trở lên)
PHP (v8.2 trở lên)
Composer (v2 trở lên)
MySQL/MariaDB Server

```

```text

Step 1: Clone project
tạo folder (tùy ae)
git clone https://github.com/nha261105/web2.git

### Window

Step 2:Setup database

- Download XAMPP
- Mở XAMPP Control Panel -> Start Apache và MySQL
- Truy cập http://localhost/phpmyadmin
- Tạo một database mới tên là: web2 (Collation: utf8mb4_unicode_ci).

### Linux

Step 2: Setup database

- Download Mariadb
- sudo systemctl start mariadb (chạy mariadb)
- CREATE DATABASE web2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; (tạo database)

Step 3:

### Setup Backend

cd Backend
1.Cài đặt các gói thư viện PHP
composer install

2.Tạo file môi trường từ file mẫu
cp .env.example .env

3.Tạo Key ứng dụng
php artisan key:generate

4.Mở file .env và sửa các dòng sau:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=web2 <-- Tên DB vừa tạo
DB_USERNAME=root <-- Mặc định XAMPP là root
DB_PASSWORD= <-- Mặc định XAMPP để trống (Linux thì điền pass root của bạn)

5.Chạy Migration để tạo bảng dữ liệu
php artisan migrate

6. Khởi chạy Server
   php artisan serve

7. Backend port
   PORT: http://localhost:8000

```

### Setup Frontend

```text

1.Vào folder frontend
cd frontend

2.Cài lib
npm install

3.Chạy fe
npm run dev

4.Frontend port
PORT: http://localhost:5173

```

# WORKFLOW

## Github

- **feature/abcd**: tạo nhánh để code(cd: code trang giỏ hàng -> feature/cart)
- **feature/admin-abcd**: tạo nhánh code trong trang admin
- **main**: Chỉ chứa code ổn định để demo / release
- **dev**: Nhánh phát triển chính

**Quy tắc:**

- Feature mới → tạo nhánh từ nhánh dev( chuyển sang nhánh dev xong mới tạo nhánh)
- Done → tạo Pull Request vào dev
- Không push trực tiếp vào main

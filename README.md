# Rental Equipment System — Web2

Nền tảng cho thuê thiết bị quay phim, nhiếp ảnh. Quản lý tài sản định danh (serial), quy trình thuê/trả/phạt, đặt lịch theo tồn kho thực.

---

## Thành viên

| STT | Họ và Tên | MSSV |
|-----|-----------|------|
| 1 | Nguyễn Hoàng Anh (Lead) | 3123410007 |
| 2 | Nguyễn Âu Gia Bảo | 3123410029 |
| 3 | Lê Mạnh Cường | 3123410035 |
| 4 | Nguyễn Trần Công Danh | 3123410??? |

---

## Tech Stack

| | |
|--|--|
| **Frontend** | ReactJS + Vite, TypeScript, Tailwind CSS, Zustand, React Query, Axios |
| **Backend** | Laravel 12, PHP ≥ 8.2, MySQL/MariaDB |
| **Tools** | Git/GitHub, Postman, Figma, DBeaver/phpMyAdmin |

---

## Cài đặt & Chạy dự án

### Yêu cầu

- Node.js ≥ 18
- PHP ≥ 8.2 + Composer ≥ 2
- MySQL/MariaDB

---

### Bước 1 — Clone & chọn nhánh đúng

```bash
git clone https://github.com/nha261105/web2.git
cd web2
git checkout dev        # ⚠️ Luôn làm việc trên dev, không phải main
```

---

### Bước 2 — Tạo database

**Windows (XAMPP):** Mở phpMyAdmin → tạo database `web2`, collation `utf8mb4_unicode_ci`.

**Linux (MariaDB):**
```bash
sudo systemctl start mariadb
mysql -u root -p -e "CREATE DATABASE web2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

### Bước 3 — Setup Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Mở `.env`, sửa phần database:
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=web2
DB_USERNAME=root
DB_PASSWORD=          # XAMPP để trống, Linux điền pass của bạn
```

Chạy migration + seed:
```bash
php artisan migrate
mysql -u root -p web2 < database/seeders/seed_data.sql
```

> **Tài khoản mẫu:** `admin@rentgear.vn` / `password123`

Khởi động server:
```bash
php artisan serve
# Backend chạy tại http://localhost:8000
```

---

### Bước 4 — Setup Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend chạy tại http://localhost:5173
```

---

## Sau khi pull code mới (Team Pull Checklist)

Chạy các lệnh sau **mỗi lần pull** để đồng bộ:

```bash
# Backend
cd backend
composer install
php artisan optimize:clear
php artisan migrate

# Frontend
cd frontend
npm install
```

Nếu database bị lỗi hoặc cần reset về đúng bộ data mẫu:
```bash
cd backend
php artisan migrate:fresh
mysql -u root -p web2 < database/seeders/seed_data.sql
```

---

## Workflow Git

### Nhánh

| Nhánh | Dùng để |
|-------|---------|
| `main` | Chỉ chứa code ổn định để demo/release. Không push trực tiếp. |
| `dev` | Nhánh phát triển chính. Mọi PR merge vào đây. |
| `feature/<tên>` | Code tính năng mới (client) |
| `feature/admin-<tên>` | Code tính năng admin |
| `fix/<tên>` | Sửa lỗi |

### Quy trình làm việc

```bash
# 1. Luôn tạo nhánh mới từ dev
git checkout dev
git pull origin dev
git checkout -b feature/ten-tinh-nang

# 2. Code xong → commit
git add .
git commit -m "feat: mô tả ngắn gọn"

# 3. Push và tạo Pull Request vào dev
git push origin feature/ten-tinh-nang
# → Vào GitHub tạo PR: feature/... → dev
```

> Không push thẳng vào `main` Mọi thay đổi phải qua PR => squash vào dev

---

## Kiến trúc & Flow

### Backend flow

```
Request → Route → Middleware → Controller → Request (validate) → Service → Model → DB
                                                                              ↓
Response ← Resource (JSON) ←————————————— Controller ←————— Service ←————————┘
```

### Frontend flow

```
UI Event → Hook (React Query) → Service (Axios) → Backend API
                                                        ↓
UI re-render ← Component ← Zustand Store ← React Query cache ←┘
```

### Cấu trúc thư mục

```
frontend/src/
├── components/     # Reusable UI (common/, layout/)
├── pages/          # Màn hình (auth/, client/, admin/)
├── services/       # Gọi API qua Axios
├── stores/         # Zustand global state
├── hooks/          # Custom hooks (React Query)
├── types/          # TypeScript interfaces
└── utils/          # Helpers (format, validate)

backend/
├── app/Http/
│   ├── Controllers/   # Nhận request, gọi service
│   ├── Requests/      # Validate input
│   ├── Resources/     # Format JSON output
│   └── Middleware/    # Auth, role check
├── app/Models/        # Eloquent ORM
├── app/Services/      # Business logic
├── database/
│   ├── migrations/    # Schema
│   └── seeders/       # Dữ liệu mẫu
└── routes/api.php     # Khai báo endpoint
```

---

## Ports mặc định

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API prefix | http://localhost:8000/api |

---

## Trạng thái triển khai hiện tại (27/03/2026)

### Đã làm

- Đã gỡ Scribe khỏi backend.
- Đã chuẩn hóa host local sang localhost.
- Đã thiết lập config kết nối FE-BE qua biến môi trường.
- Frontend đã dùng config API tập trung ở `frontend/src/config/api.ts`.
- Endpoint đăng nhập FE đã đổi sang `/api/auth/sign-in`.
- Endpoint check token FE đã khớp `/api/user-tokens/check-token`.
- Backend đã có cấu hình CORS ở `backend/config/cors.php` và env `FRONTEND_URL`.

### Chưa làm

- Chưa có lớp API client chung (axios instance với interceptors, timeout, retry, xử lý 401 tập trung).
- Chưa có test API/feature cho các endpoint auth, user, RBAC.
- Chưa implement các module nghiệp vụ chính: catalog, inventory, rental, return, transaction, review, notification.
- Frontend mới kết nối một phần auth; các page chính chưa nối API đầy đủ.

### Kết nối FE-BE đang dùng

- Frontend env: `VITE_API_BASE_URL=http://localhost:8000`
- Backend env: `APP_URL=http://localhost:8000`
- Backend env: `FRONTEND_URL=http://localhost:5173`
- Backend env: `SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000,localhost:8000`

---

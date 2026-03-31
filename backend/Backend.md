# Backend — Tài liệu tham khảo nhóm

> Cập nhật: 27/03/2026

---

## Mục lục

1. [Quy ước chốt](#1-quy-ước-chốt)
2. [Trạng thái triển khai](#2-trạng-thái-triển-khai)
3. [Flow implement](#3-flow-implement-theo-thứ-tự-bắt-buộc)
4. [Cấu trúc folder chuẩn](#4-cấu-trúc-folder-chuẩn)
5. [Mẫu code từng file](#5-mẫu-code-từng-file)
6. [Response format chuẩn](#6-response-format-chuẩn)
7. [API Response Helper](#7-api-response-helper-bắt-buộc)
8. [Seeder RBAC](#8-seeder-rbac-chạy-1-lần-sau-khi-setup)
9. [Checklist trước khi tạo PR](#9-checklist-trước-khi-tạo-pr)
10. [Phân công team](#10-phân-công-team)

---

## 1. Quy ước chốt

| Hạng mục   | Chi tiết                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| Auth       | Token custom, bảng `user_tokens`, header `Authorization: Bearer <token>` |
| Phân quyền | RBAC — bảng `roles`, `permissions`, `user_roles`, `role_has_permission`  |

---

## 2. Trạng thái triển khai

### Đã implement

| Endpoint                                | Middleware              |
| --------------------------------------- | ----------------------- |
| `POST /api/users`                       | public                  |
| `POST /api/auth/sign-in`                | public                  |
| `POST /api/auth/sign-out`               | auth.token              |
| `GET /api/auth/me`                      | auth.token              |
| `POST /api/user-tokens/check-token`     | auth.token              |
| `GET /api/roles`                        | auth.token + role:ADMIN |
| `GET /api/permissions`                  | auth.token + role:ADMIN |
| `POST /api/roles/{id}/permissions`      | auth.token + role:ADMIN |
| `GET /api/users/{id}/roles`             | auth.token + role:ADMIN |
| `POST /api/users/{id}/roles`            | auth.token + role:ADMIN |
| `DELETE /api/users/{id}/roles/{roleId}` | auth.token + role:ADMIN |
| `GET /api/rentals`                      | auth.token + role:ADMIN |
| `POST /api/rentals`                     | auth.token + role:ADMIN |
| `GET /api/rentals/{id}`                 | auth.token + role:ADMIN |
| `PATCH /api/rentals/{id}`               | auth.token + role:ADMIN |
| `POST /api/return-orders`               | auth.token + role:ADMIN |
| `PATCH /api/return-orders/{id}`         | auth.token + role:ADMIN |
| `POST /api/rental-issues`               | auth.token + role:ADMIN |
| `PATCH /api/rental-issues/{id}`         | auth.token + role:ADMIN |
| `POST /api/transactions`                | auth.token + role:ADMIN |
| `PATCH /api/transactions/{id}`          | auth.token + role:ADMIN |

**Auth hardening đã hoàn tất:**

- Response/error của auth và middleware đã được chuẩn hoá.
- Mã lỗi đã thống nhất cho 401 / 403 / 422 / 500.
- Đã thêm bộ test auth flow tại `tests/Feature/Auth/AuthFlowTest.php`.

---

### Chưa làm — danh sách & tên nhánh

| Module           | Endpoints chính                                                             | Nhánh GitHub                 |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------- |
| **User CRUD**    | `GET/PATCH/DELETE /api/users`, `/api/users/me`                              | `feature/user-crud`          |
| **User Address** | CRUD `/api/users/{id}/addresses`                                            | `feature/user-address`       |
| **Category**     | CRUD `/api/categories`                                                      | `feature/catalog-category`   |
| **Brand**        | CRUD `/api/brands`                                                          | `feature/catalog-brand`      |
| **Product**      | CRUD `/api/products` + ảnh                                                  | `feature/catalog-product`    |
| **Coupon**       | CRUD `/api/coupons` + validate                                              | `feature/catalog-coupon`     |
| **Combo**        | CRUD `/api/combos` + details                                                | `feature/catalog-combo`      |
| **Supplier**     | CRUD `/api/suppliers`                                                       | `feature/inventory-supplier` |
| **Import Order** | CRUD `/api/import-orders`                                                   | `feature/inventory-import`   |
| **Inventory**    | CRUD `/api/inventory` + status + availability                               | `feature/inventory-stock`    |
| **Rental**       | CRUD `/api/rentals` + flow (approve / deposit / pickup / complete / cancel) | `feature/rental-core`        |
| **Return**       | CRUD `/api/return-orders`                                                   | `feature/rental-return`      |
| **Rental Issue** | CRUD `/api/rental-issues` + resolve                                         | `feature/rental-issue`       |
| **Transaction**  | CRUD `/api/transactions`                                                    | `feature/rental-transaction` |
| **Review**       | CRUD `/api/reviews`                                                         | `feature/review`             |
| **Notification** | CRUD `/api/notifications`                                                   | `feature/notification`       |

> **Quy tắc đặt tên nhánh:**
>
> - `feature/<module>` — khi làm tính năng mới
> - `fix/<vấn-đề>` — khi sửa lỗi

---

## 3. Flow implement (theo thứ tự bắt buộc)

```
Model → Migration → Request → Service → Controller → Route → Resource → Test
```

**Ví dụ làm module Product:**

```bash
# 1. Tạo model + migration cùng lúc
php artisan make:model Product -m

# 2. Tạo các file còn lại
php artisan make:request Product/CreateProductRequest
php artisan make:request Product/UpdateProductRequest
php artisan make:resource ProductResource
```

Tạo thủ công (chưa có lệnh artisan):

```
app/Services/Product/ProductService.php
app/Http/Controllers/Product/ProductController.php
tests/Feature/Product/ProductApiTest.php
```

---

## 4. Cấu trúc folder chuẩn

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Product/ProductController.php       ← 1 folder per module
│   ├── Requests/
│   │   └── Product/CreateProductRequest.php
│   └── Resources/
│       └── ProductResource.php
├── Models/
│   └── Product.php
└── Services/
    └── Product/ProductService.php              ← business logic ở đây

database/
└── migrations/
    └── 2026_03_26_000000_create_products_table.php

tests/
└── Feature/
    └── Product/ProductApiTest.php
```

---

## 5. Mẫu code từng file

### Model

```php
// app/Models/Product.php
class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price_per_day',
        'category_id',
        'status',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
```

### Service (chứa toàn bộ logic)

```php
// app/Services/Product/ProductService.php
class ProductService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Product::with(['category'])
            ->when(
                $filters['search'] ?? null,
                fn($q, $s) => $q->where('name', 'like', "%$s%"),
            )
            ->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): Product
    {
        return Product::create($data);
    }
}
```

### Controller (chỉ nhận request → gọi service → trả resource)

```php
// app/Http/Controllers/Product/ProductController.php
class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}

    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list($request->all());
        return ApiResponse::success([
            'data' => ProductResource::collection($result),
            'meta' => [
                'total' => $result->total(),
                'last_page' => $result->lastPage(),
            ],
        ]);
    }

    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->service->create($request->validated());
        return ApiResponse::success(
            ['data' => new ProductResource($product)],
            'Created',
            201,
        );
    }
}
```

### Route

```php
// routes/api.php
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']); // public
    Route::get('/{id}', [ProductController::class, 'show']); // public

    Route::middleware('auth.token')->group(function () {
        Route::middleware('role:ADMIN')->group(function () {
            Route::post('/', [ProductController::class, 'store']);
            Route::patch('/{product}', [ProductController::class, 'update']);
            Route::delete('/{product}', [ProductController::class, 'destroy']);
        });
    });
});
```

### Resource

```php
// app/Http/Resources/ProductResource.php
public function toArray(Request $request): array
{
    return [
        'id'            => $this->id,
        'name'          => $this->name,
        'price_per_day' => $this->price_per_day,
        'status'        => $this->status,
        'category'      => new CategoryResource($this->whenLoaded('category')),
        'created_at'    => $this->created_at?->toISOString(),
    ];
}
```

---

## 6. Response format chuẩn

```json
// Single item
{ "data": { "id": 1, "name": "..." }, "message": "..." }

// List
{ "data": [...], "meta": { "total": 72, "current_page": 1, "last_page": 5, "per_page": 15 } }

// Error
{ "message": "Mô tả lỗi.", "errors": { "field": ["..."] } }
```

---

## 7. API Response Helper (bắt buộc)

Tất cả controller và middleware **phải** dùng helper chung: `App\Support\ApiResponse`.

> Không được `return response()->json([...])` trực tiếp trong controller / middleware (trừ trường hợp đặc biệt có lý do rõ ràng).

### Các method được phép dùng

| Method                                                  | HTTP Status   | Code               |
| ------------------------------------------------------- | ------------- | ------------------ |
| `ApiResponse::success($data, $message, $status)`        | 200 (default) | —                  |
| `ApiResponse::error($message, $code, $status, $errors)` | tuỳ           | tuỳ                |
| `ApiResponse::unauthorized($message)`                   | 401           | `UNAUTHORIZED`     |
| `ApiResponse::forbidden($message)`                      | 403           | `FORBIDDEN`        |
| `ApiResponse::validation($errors, $message)`            | 422           | `VALIDATION_ERROR` |
| `ApiResponse::internalError($message)`                  | 500           | `INTERNAL_ERROR`   |

### Quy tắc sử dụng

1. Validation fail → trả schema 422 thống nhất.
2. Auth fail → trả 401 code `UNAUTHORIZED`.
3. Role/permission fail → trả 403 code `FORBIDDEN`.
4. Lỗi hệ thống → không để lộ stack trace ra response.

### Ví dụ nhanh

```php
return ApiResponse::success(
    ['rental' => new RentalResource($rental)],
    'Rental created',
    201,
);

return ApiResponse::unauthorized('Token không hợp lệ hoặc đã hết hạn.');

return ApiResponse::validation($validator->errors(), 'Dữ liệu không hợp lệ.');
```

---

## 8. Seeder RBAC (chạy 1 lần sau khi setup)

```php
// database/seeders/RolePermissionSeeder.php
public function run(): void
{
    $permissions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

    foreach ($permissions as $name) {
        Permission::firstOrCreate(['name' => $name]);
    }

    $admin    = Role::firstOrCreate(['name' => 'ADMIN']);
    $staff    = Role::firstOrCreate(['name' => 'STAFF']);
    $customer = Role::firstOrCreate(['name' => 'CUSTOMER']);

    $admin->permissions()->sync(Permission::pluck('id'));
    $staff->permissions()->sync(Permission::whereIn('name', ['READ', 'UPDATE'])->pluck('id'));
    $customer->permissions()->sync(Permission::whereIn('name', ['READ'])->pluck('id'));
}
```

```bash
php artisan db:seed --class=RolePermissionSeeder
```

---

## 9. Checklist trước khi tạo PR

- [ ] Chạy `php artisan test` — tất cả pass
- [ ] Có test cho: 200 success, 401 unauth, 403 forbidden, 404 not found
- [ ] Controller không chứa query trực tiếp (chỉ gọi Service)
- [ ] Resource dùng `whenLoaded()` cho relationship
- [ ] Không dùng `response()->json()` trực tiếp — dùng `ApiResponse`
- [ ] Đã cập nhật Postman collection

---

## 10. Phân công team

### Tổng quan

| Người         | UI (Frontend)                                                                     | API (Backend)                                               |
| ------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Bảo**       | `HomePage`, `ProductDetailPage`                                                   | Catalog (Category, Brand, Product, Coupon, Combo)           |
| **Cường**     | `SignInPage`, `SignUpPage`, `CartPage`, `CheckoutPage` + 3 step con               | Inventory (Supplier, Import, Stock) + Review + Notification |
| **Danh**      | Account pages (profile, địa chỉ, lịch sử đơn)                                     | User CRUD + User Address                                    |
| **Hoàng Anh** | Toàn bộ Admin (Dashboard, Products, Orders, Categories, Users, Reports, Settings) | Rental flow (core + return + issue + transaction)           |

---

### Chi tiết từng người

#### Bảo — Home + Product UI + Catalog API

**Frontend:**

- `HomePage.tsx` — kết nối API thật: `GET /categories`, `GET /products` (filter / sort / search)
- `ProductDetailPage.tsx` — kết nối API thật: `GET /products/{id}`, `GET /reviews`

**Backend:**

- `feature/catalog-category` — Category CRUD
- `feature/catalog-brand` — Brand CRUD
- `feature/catalog-product` — Product CRUD + ảnh _(download ảnh từ Google → lưu string URL vào DB)_
- `feature/catalog-coupon` — Coupon CRUD + validate
- `feature/catalog-combo` — Combo CRUD + details

---

#### Cường — Cart/Checkout UI + Inventory API

**Frontend:**

- `SignUpPage.tsx` — kết nối API: `POST /api/users`
- `CartPage.tsx` — kết nối: `GET /inventory/availability`, `POST /coupons/validate`
- `CheckoutPage.tsx` + `ShippingStep`, `PaymentStep`, `ConfirmStep` — kết nối: `POST /rentals`, `POST /rental-details`, `POST /transactions`

**Backend:**

- `feature/inventory-supplier` — Supplier CRUD
- `feature/inventory-import` — Import order CRUD
- `feature/inventory-stock` — Inventory CRUD + status + availability
- `feature/review` — Review CRUD
- `feature/notification` — Notification CRUD

---

#### Danh — Account UI + User API

**Frontend:**

- Account pages — profile user, danh sách địa chỉ, lịch sử đơn thuê _(các page này chưa có trong route, cần tạo mới)_

**Backend:**

- `feature/user-crud` — `GET /users`, `PATCH /users/{id}`, `PATCH /users/{id}/status`, `DELETE /users/{id}`
- `feature/user-address` — CRUD `/users/{id}/addresses` + set default

---

#### Hoàng Anh — Admin UI + Rental API

**Frontend (Admin):**

- `AdminDashboard.tsx` — connect dashboard metrics API
- `AdminProducts.tsx` — connect Catalog API của Bảo _(cần Bảo merge trước, xử lý mock tạm)_
- `AdminOrders.tsx` — connect Rental API (tự làm)
- `AdminCategories.tsx` — connect Catalog API của Bảo
- `AdminUsers.tsx` — connect User API của Danh
- `AdminReports.tsx` — connect reports endpoints
- `AdminSettings.tsx` — connect settings/policies endpoints

**Backend:**

- `feature/rental-core` — Rental CRUD + status flow (approve / deposit / pickup / complete / cancel)
- `feature/rental-return` — Return order + details
- `feature/rental-issue` — Rental issue + resolve
- `feature/rental-transaction` — Transaction (DEPOSIT / PAYMENT / REFUND / FINE)

---

### Thứ tự triển khai để frontend chạy được sớm

```
1. Bảo làm Catalog API       →  HomePage + ProductDetailPage connect được
2. Cường làm Inventory API   →  CartPage + CheckoutPage connect được
3. Hoàng Anh làm Rental API  →  AdminOrders connect được
4. Danh làm User API         →  AdminUsers connect được
5. Reports + Settings        →  làm sau cùng
```

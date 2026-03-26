# Backend — Team Reference

> Cập nhật: 26/03/2026

---

## 1. Quy ước chốt

|                    |                                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| Auth               | Token custom, bảng `user_tokens`, header `Authorization: Bearer <token>` |
| Phân quyền         | RBAC — bảng `roles`, `permissions`, `user_roles`, `role_has_permission`  |

---

## 2. Đã làm / Chưa làm

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

### Chưa làm — danh sách & tên nhánh

| Module           | Endpoints chính                                                     | Nhánh Github                 |
| ---------------- | ------------------------------------------------------------------- | ---------------------------- |
| **User CRUD**    | GET/PATCH/DELETE `/api/users`, `/api/users/me`                      | `feature/user-crud`          |
| **User Address** | CRUD `/api/users/{id}/addresses`                                    | `feature/user-address`       |
| **Category**     | CRUD `/api/categories`                                              | `feature/catalog-category`   |
| **Brand**        | CRUD `/api/brands`                                                  | `feature/catalog-brand`      |
| **Product**      | CRUD `/api/products` + ảnh                                          | `feature/catalog-product`    |
| **Coupon**       | CRUD `/api/coupons` + validate                                      | `feature/catalog-coupon`     |
| **Combo**        | CRUD `/api/combos` + details                                        | `feature/catalog-combo`      |
| **Supplier**     | CRUD `/api/suppliers`                                               | `feature/inventory-supplier` |
| **Import Order** | CRUD `/api/import-orders`                                           | `feature/inventory-import`   |
| **Inventory**    | CRUD `/api/inventory` + status + availability                       | `feature/inventory-stock`    |
| **Rental**       | CRUD `/api/rentals` + flow (approve/deposit/pickup/complete/cancel) | `feature/rental-core`        |
| **Return**       | CRUD `/api/return-orders`                                           | `feature/rental-return`      |
| **Rental Issue** | CRUD `/api/rental-issues` + resolve                                 | `feature/rental-issue`       |
| **Transaction**  | CRUD `/api/transactions`                                            | `feature/rental-transaction` |
| **Review**       | CRUD `/api/reviews`                                                 | `feature/review`             |
| **Notification** | CRUD `/api/notifications`                                           | `feature/notification`       |

> Đặt tên nhánh theo pattern: `feature/<module>` khi làm mới, `fix/<vấn-đề>` khi sửa lỗi.

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
    protected $fillable = ['name', 'description', 'price_per_day', 'category_id', 'status'];

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
            ->when($filters['search'] ?? null, fn($q, $s) => $q->where('name', 'like', "%$s%"))
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
        return response()->json([
            'data' => ProductResource::collection($result),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage()],
        ]);
    }

    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->service->create($request->validated());
        return response()->json(['data' => new ProductResource($product)], 201);
    }
}
```

### Route

```php
// routes/api.php
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);          // public
    Route::get('/{id}', [ProductController::class, 'show']);       // public

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

## 7. Seeder RBAC (chạy 1 lần sau khi setup)

```php
// database/seeders/RolePermissionSeeder.php
public function run(): void
{
    $permissions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

    foreach ($permissions as $name) {
        Permission::firstOrCreate(['name' => $name]);
    }

    $admin = Role::firstOrCreate(['name' => 'ADMIN']);
    $staff = Role::firstOrCreate(['name' => 'STAFF']);
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

## 8. Checklist trước khi tạo PR (để sau)

- [ ] Chạy `php artisan test` — tất cả pass
- [ ] Có test cho: 200 success, 401 unauth, 403 forbidden, 404 not found
- [ ] Controller không chứa query trực tiếp (chỉ gọi Service)
- [ ] Resource dùng `whenLoaded()` cho relationship
- [ ] Đã cập nhật Postman collection

---

## 9. Phân công team (Fullstack)
 
---
 
### Tổng quan
 
| Người | UI (Frontend) | API (Backend) |
|-------|--------------|---------------|
| **Bảo** | `HomePage`, `ProductDetailPage` | Catalog (Category, Brand, Product, Coupon, Combo) |
| **Cường** | `SignInPage`, `SignUpPage`, `CartPage`, `CheckoutPage` + 3 Step con | Inventory (Supplier, Import, Stock) + Review + Notification |
| **Danh** | Account pages (profile, address, lịch sử đơn) | **Fix trước** (3 cái) + User CRUD + User address |
| **Lead (bạn)** | Toàn bộ Admin (`Dashboard`, `Products`, `Orders`, `Categories`, `Users`, `Reports`, `Settings`) | Rental flow (core + return + issue + transaction) |
 
---
 
### Chi tiết từng người
 
#### Bảo — Home + Product UI + Catalog API
 
**Frontend:**
- `HomePage.tsx` — kết nối API thật: GET categories, GET products (filter/sort/search)
- `ProductDetailPage.tsx` — kết nối API thật: GET product/{id}, GET reviews
 
**Backend:**
- `feature/catalog-category` — Category CRUD
- `feature/catalog-brand` — Brand CRUD
- `feature/catalog-product` — Product CRUD + ảnh *(lên gg down thêm ảnh về => lưu vào db string)*
- `feature/catalog-coupon` — Coupon CRUD + validate
- `feature/catalog-combo` — Combo CRUD + details
 
---
 
#### Cường — Cart/Checkout UI + Inventory API
 
**Frontend:**
- `SignUpPage.tsx` — kết nối API thật: POST /api/users
- `CartPage.tsx` — kết nối: GET inventory/availability, POST coupons/validate
- `CheckoutPage.tsx` + `ShippingStep`, `PaymentStep`, `ConfirmStep` — kết nối: POST rentals, POST rental-details, POST transactions
 
**Backend:**
- `feature/inventory-supplier` — Supplier CRUD
- `feature/inventory-import` — Import order CRUD
- `feature/inventory-stock` — Inventory CRUD + status + availability
- `feature/review` — Review CRUD
- `feature/notification` — Notification CRUD
 
---
 
#### Danh — Account UI + User API
 
**Frontend:**
- Account pages — profile user, danh sách địa chỉ, lịch sử đơn thuê (các page này chưa có trong route, cần tạo mới)
 
**Backend:**
- `feature/user-crud` — GET /users, PATCH /users/{id}, PATCH /users/{id}/status, DELETE /users/{id}
- `feature/user-address` — CRUD /users/{id}/addresses + set default
 
---
 
#### Hoàng Anh — Admin UI + Rental API
 
**Frontend (Admin):**
- `AdminDashboard.tsx` — connect dashboard metrics API
- `AdminProducts.tsx` — connect Catalog API của Bảo (cần Bảo merge trước, xử lý mock tạm)
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
1. Bảo làm Catalog API → HomePage + ProductDetailPage connect được
2. Cường làm Inventory API → CartPage + CheckoutPage connect được
3. Bạn làm Rental API → AdminOrders connect được
4. Danh làm User API → AdminUsers connect được
5. Reports + Settings làm sau cùng
```

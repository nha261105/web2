# API Test

Updated: 2026-04-02

## 1. Scope
This document lists all API routes currently available in the project, their CRUD status, and quick test examples using `cURL`. 
Source of truth: `backend/routes/api.php`

## 2. Quick Test Convention
Base URL example: `http://localhost:8000`

Common headers for Auth endpoints:
```bash
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-H "Accept: application/json"
```

## 3. API Checklist By Module

### Auth
- **Sign In (`POST /api/auth/sign-in`)**
  ```bash
  curl -X POST "http://localhost:8000/api/auth/sign-in" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@demo.com","password":"password"}'
  ```
- **Me (`GET /api/auth/me`)**
- **Sign Out (`POST /api/auth/sign-out`)**

### User
- **Read Me (`GET /api/users/me`)**
  ```bash
  curl -X GET "http://localhost:8000/api/users/me" -H "Authorization: Bearer YOUR_TOKEN"
  ```
- **Update Me (`PATCH /api/users/me`)**
- **Change Password (`PATCH /api/users/me/password`)**
  ```bash
  curl -X PATCH "http://localhost:8000/api/users/me/password" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "current_password": "old_password", "new_password": "new_password", "confirm_password": "new_password" }'
  ```

### Address
- **List Addresses (`GET /api/users/me/addresses`)**
- **Create Address (`POST /api/users/me/addresses`)**

### Cart & Checkout
- **Get Cart (`GET /api/cart`)**
- **Add Item (`POST /api/cart`)**
- **Checkout (`POST /api/cart/checkout`)**
  ```bash
  curl -X POST "http://localhost:8000/api/cart/checkout" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"address_id": 1, "note": "Giao hàng sớm giúp"}'
  ```
- **Rent Now Direct (`POST /api/cart/rent-now`)**
- **Update Return Date (`PATCH /api/cart/return-date`)**

### Rental (Admin & User)
- **List rentals (`GET /api/rentals`)** 
  *(User only sees their rentals. Admin sees all)*
- **Show rental (`GET /api/rentals/{id}`)**
- **Update status (`PATCH /api/rentals/{id}`)** (Admin)
  ```bash
  curl -X PATCH "http://localhost:8000/api/rentals/1" \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"APPROVED"}'
  ```

### Return Order (Admin)
- **Process Return (`POST /api/return-orders`)**
  ```bash
  curl -X POST "http://localhost:8000/api/return-orders" \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "rental_id": 1,
      "items": [
        { "rental_detail_id": 1, "condition": "GOOD" },
        { "rental_detail_id": 2, "condition": "DAMAGED", "penalty_fee": 50000, "note": "Nứt màn hình" }
      ]
    }'
  ```
- **Update Return (`PATCH /api/return-orders/{id}`)**

*(Các API danh mục Product, Category, Brand, Combo, Coupon đã được hỗ trợ đủ CRUD dành cho quyền ADMIN. Hãy tham chiếu file `routes/api.php`)*

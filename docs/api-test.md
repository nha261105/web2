# API Test

Updated: 2026-04-02

## 1. Scope

This document lists all API routes currently available in the project,
their CRUD status, and quick test examples.

Source of truth: backend/routes/api.php

## 2. Quick Test Convention

Base URL example:

```bash
http://localhost:8000
```

Common headers:

```bash
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
Accept: application/json
```

## 3. API Checklist By Module

### Auth

- Create: `POST /api/auth/sign-in`
- Read: `GET /api/auth/me`
- Update: Not available
- Delete: `POST /api/auth/sign-out`
- Extra: `POST /api/user-tokens/check-token`

Test API:

```bash
curl -X POST "http://localhost:8000/api/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret"}'
```

### User

- Create: `POST /api/users`
- Read: `GET /api/users/me`, `GET /api/users` (admin)
- Update: `PATCH /api/users/me`, `PATCH /api/users/{id}/status` (admin)
- Delete: `DELETE /api/users/{id}` (admin)

Test API:

```bash
curl -X GET "http://localhost:8000/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Address

- Create: `POST /api/users/{userId}/addresses`
- Read: `GET /api/users/{userId}/addresses`
- Update: `PATCH /api/users/{userId}/addresses/{id}`
- Delete: `DELETE /api/users/{userId}/addresses/{id}`

Test API:

```bash
curl -X GET "http://localhost:8000/api/users/1/addresses" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Product

- Create: `POST /api/admin/products` (admin)
- Read: `GET /api/products`, `GET /api/products/{id}`, `GET /api/admin/products` (admin)
- Update: `PATCH /api/admin/products/{product}` (admin)
- Delete: `DELETE /api/admin/products/{product}` (admin)

Test API:

```bash
curl -X POST "http://localhost:8000/api/admin/products" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Macbook Pro 14",
    "slug":"macbook-pro-14",
    "policies_id":1,
    "category_id":1,
    "brand_id":1,
    "daily_price":500000,
    "deposit_price":5000000,
    "description":"Laptop rental",
    "status":"ACTIVE"
  }'
```

### Category

- Create: `POST /api/admin/categories` (admin)
- Read: `GET /api/categories`, `GET /api/categories/{id}`, `GET /api/admin/categories` (admin)
- Update: `PATCH /api/admin/categories/{category}` (admin)
- Delete: `DELETE /api/admin/categories/{category}` (admin)

Test API:

```bash
curl -X GET "http://localhost:8000/api/categories"
```

### Brand

- Create: `POST /api/admin/brands` (admin)
- Read: `GET /api/brands`, `GET /api/brands/{id}`
- Update: `PATCH /api/admin/brands/{brand}` (admin)
- Delete: `DELETE /api/admin/brands/{brand}` (admin)

Test API:

```bash
curl -X GET "http://localhost:8000/api/brands"
```

### Combo

- Create: `POST /api/combos` (admin)
- Read: `GET /api/combos`, `GET /api/combos/{id}`
- Update: `PATCH /api/combos/{combo}` (admin)
- Delete: `DELETE /api/combos/{combo}` (admin)

Test API:

```bash
curl -X GET "http://localhost:8000/api/combos"
```

### Coupon

- Create: `POST /api/coupons` (admin)
- Read: `GET /api/coupons`, `GET /api/coupons/{id}` (admin)
- Update: `PATCH /api/coupons/{coupon}` (admin)
- Delete: `DELETE /api/coupons/{coupon}` (admin)
- Extra: `POST /api/coupons/check` (public)

Test API:

```bash
curl -X POST "http://localhost:8000/api/coupons/check" \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10"}'
```

### Rental Policy

- Create: `POST /api/rental-policies` (admin)
- Read: `GET /api/rental-policies`, `GET /api/rental-policies/{id}`
- Update: `PATCH /api/rental-policies/{rentalPolicy}` (admin)
- Delete: `DELETE /api/rental-policies/{rentalPolicy}` (admin)

Test API:

```bash
curl -X GET "http://localhost:8000/api/rental-policies"
```

### Rental

- Create: `POST /api/rentals` (admin)
- Read: `GET /api/rentals` (user), `GET /api/rentals/{id}` (admin)
- Update: `PATCH /api/rentals/{id}` (admin)
- Delete: Not available

Test API:

```bash
curl -X GET "http://localhost:8000/api/rentals" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Return Order

- Create: `POST /api/return-orders` (admin)
- Read: Not available
- Update: `PATCH /api/return-orders/{id}` (admin)
- Delete: Not available

Test API:

```bash
curl -X PATCH "http://localhost:8000/api/return-orders/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"RECEIVED"}'
```

### Rental Issue

- Create: `POST /api/rental-issues` (admin)
- Read: Not available
- Update: `PATCH /api/rental-issues/{id}` (admin)
- Delete: Not available

Test API:

```bash
curl -X PATCH "http://localhost:8000/api/rental-issues/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"RESOLVED"}'
```

### Transaction

- Create: `POST /api/transactions` (admin)
- Read: Not available
- Update: `PATCH /api/transactions/{id}` (admin)
- Delete: Not available

Test API:

```bash
curl -X PATCH "http://localhost:8000/api/transactions/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"PAID"}'
```

### Cart (custom flow)

- Create: `POST /api/cart`, `POST /api/cart/rent-now`
- Read: `GET /api/cart`
- Update: `PATCH /api/cart/items/{id}`
- Delete: `DELETE /api/cart/items/{id}`

Test API:

```bash
curl -X POST "http://localhost:8000/api/cart" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":1,"rental_days":3}'
```

### RBAC (role and permission assignment)

- Create: `POST /api/roles/{id}/permissions`, `POST /api/users/{id}/roles`
- Read: `GET /api/roles`, `GET /api/permissions`, `GET /api/users/{id}/roles`
- Update: Not available as full resource update
- Delete: `DELETE /api/users/{id}/roles/{roleId}`

Test API:

```bash
curl -X GET "http://localhost:8000/api/roles" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Admin Dashboard

- Read: `GET /api/admin/dashboard` (admin)

Test API:

```bash
curl -X GET "http://localhost:8000/api/admin/dashboard" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 4. Missing APIs By CRUD Standard

- Rental: missing Delete
- Return Order: missing Read and Delete
- Rental Issue: missing Read and Delete
- Transaction: missing Read and Delete
- RBAC: no full CRUD for roles and permissions as resources

## 5. Notes

- There are duplicated route blocks for `/users/me` and `/users/{userId}/addresses` in `backend/routes/api.php`.
- Product create route in current runtime routes is `/api/admin/products`.

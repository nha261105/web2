# API Contract v1

Updated: 2026-03-27

## 1. Objective

Provide one stable response format for all backend modules.

## 2. Success Response

### 2.1 Single Resource

```json
{
  "success": true,
  "message": "Created successfully",
  "data": {
    "id": 1,
    "name": "Example"
  }
}
```

### 2.2 List Resource

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "A"
    }
  ],
  "meta": {
    "total": 1,
    "current_page": 1,
    "per_page": 15,
    "last_page": 1
  }
}
```

## 3. Error Response

### 3.1 Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### 3.2 Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

### 3.3 Forbidden (403)

```json
{
  "success": false,
  "message": "Forbidden",
  "code": "FORBIDDEN"
}
```

### 3.4 Not Found (404)

```json
{
  "success": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 3.5 Internal Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## 4. HTTP Status Mapping

- 200: read/update/delete success
- 201: create success
- 204: optional no-content delete success
- 400: bad request (rare, only if needed)
- 401: unauthorized
- 403: forbidden
- 404: not found
- 409: conflict
- 422: validation error
- 500: internal error

## 5. Naming Rules

- Use snake_case for JSON keys.
- Keep key names stable across modules.
- Do not return mixed schemas for same endpoint type.

## 6. Pagination Rules

If endpoint is paginated, always include meta:

- total
- current_page
- per_page
- last_page

## 7. Contract Change Policy

Any change to request/response contract must include:

1. PR section "Request/Response Contract" filled.
2. Frontend service update in same PR or linked PR.
3. Backward compatibility note.

## 8. Current Auth Endpoints

- POST /api/auth/sign-in
- POST /api/auth/sign-out
- GET /api/auth/me
- POST /api/user-tokens/check-token

Frontend endpoint map source:

- frontend/src/config/api.ts

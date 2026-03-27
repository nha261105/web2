# Backend Coding Guideline (Team Standard)

Updated: 2026-03-27

## 1. Goal

This document defines a strict backend standard so all modules follow one implementation style.

## 2. Required Architecture

Use this flow for every module:

Model -> Migration -> Request -> Service -> Controller -> Route -> Resource -> Test

Rules:

- Controller: only receive request, call service, return response.
- Service: all business logic and transaction handling.
- Request: all input validation.
- Resource: output mapping only.

## 3. Folder Convention

- app/Http/Controllers/<Module>/<Module>Controller.php
- app/Http/Requests/<Module>/Create<Module>Request.php
- app/Http/Requests/<Module>/Update<Module>Request.php
- app/Http/Resources/<Module>Resource.php
- app/Services/<Module>/<Module>Service.php
- tests/Feature/<Module>/<Module>ApiTest.php

## 4. Route Convention

- Public routes: no middleware.
- Protected routes: auth.token middleware.
- Admin-only routes: auth.token + role:ADMIN.

Example:

```php
Route::middleware(['auth.token'])->group(function () {
    Route::middleware(['role:ADMIN'])->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
    });
});
```

## 5. Response Convention

Always follow docs/api-contract-v1.md.

Minimum requirements:

- Stable keys: success, message, data, meta, errors, code.
- No ad-hoc shape per endpoint.
- Keep error message user-safe and non-sensitive.

## 6. Validation Convention

- Never validate in controller if Request class is expected.
- Every write endpoint (POST/PATCH/PUT/DELETE) must use Request class.
- Validation messages should be consistent across modules.

## 7. Service Convention

- Service method names should be explicit: createX, updateX, deleteX, listX, getXById.
- Service should throw domain-level exceptions where needed.
- Use DB transaction for multi-step writes.

## 8. Security Convention

- Never return secret/internal stack details in API response.
- Always verify ownership or role before write operations.
- Normalize auth errors (401) and permission errors (403).

## 9. Test Minimum (Per Endpoint Group)

Required test cases:

- success flow
- unauthorized 401
- forbidden 403 (if role-protected)
- validation fail 422
- not found 404

## 10. PR Definition of Done

PR is merge-ready only when all are true:

- Route + Request + Service + Controller + Resource + Test exist.
- Response matches docs/api-contract-v1.md.
- No business query logic in controller.
- php artisan test passed.
- PR template is fully filled.

## 11. Team Workflow

Before coding:

1. Pull latest dev.
2. Sync env and run migration.
3. Confirm endpoint path and response contract.

During coding:

1. Implement backend first.
2. Add/adjust tests.
3. Then update frontend endpoint map/service.

Before PR:

1. Run tests.
2. Self-review checklist.
3. Fill PR template with QA and rollback notes.

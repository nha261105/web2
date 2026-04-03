<?php

use App\Http\Controllers\Brand\BrandController;
use App\Http\Controllers\Product\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RbacController;
use App\Http\Controllers\Auth\UserTokenController;
use App\Http\Controllers\Rental\RentalController;
use App\Http\Controllers\Rental\RentalIssueController;
use App\Http\Controllers\Rental\RentalPolicyController;
use App\Http\Controllers\Rental\ReturnOrderController;
use App\Http\Controllers\Rental\TransactionController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Combos\ComboController;
use App\Http\Controllers\Coupon\CouponController;
use App\Http\Controllers\Address\AddressController;
use App\Http\Controllers\Admin\AdminDashboardController;

/**
 * User Routes
 */
Route::post('/users', [UserController::class, 'store']);

/**
 * Auth Routes
 */
Route::post('/auth/sign-in', [AuthController::class, 'signIn']);

// Category public routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}', [CategoryController::class, 'show']);
});

// Brand public routes
Route::prefix('brands')->group(function () {
    Route::get('/', [BrandController::class, 'index']);
    Route::get('/{id}', [BrandController::class, 'show']);
});

// Product public routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
});

// Combo public routes
Route::prefix('combos')->group(function () {
    Route::get('/', [ComboController::class, 'index']);
    Route::get('/{id}', [ComboController::class, 'show']);
});

// Rental policy public routes
Route::prefix('rental-policies')->group(function () {
    Route::get('/', [RentalPolicyController::class, 'index']);
    Route::get('/{id}', [RentalPolicyController::class, 'show']);
});

// Coupon public routes
Route::post('/coupons/check', [CouponController::class, 'check']);

Route::middleware(['auth.token'])->group(function () {
    Route::post('/auth/sign-out', [AuthController::class, 'signOut']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/user-tokens/check-token', [
        UserTokenController::class,
        'check',
    ]);

    Route::get('/users/me', [UserController::class, 'me']);
    Route::patch('/users/me', [UserController::class, 'updateMe']);
    Route::patch('/users/me/password', [
        UserController::class,
        'changePassword',
    ]);

    Route::prefix('users/me/addresses')->group(function () {
        Route::get('/', [AddressController::class, 'indexMe']);
        Route::post('/', [AddressController::class, 'storeMe']);
        Route::patch('/{id}', [AddressController::class, 'updateMe']);
        Route::delete('/{id}', [AddressController::class, 'destroyMe']);
    });

    Route::prefix('me/address')->group(function () {
        Route::get('/', [AddressController::class, 'indexMe']);
        Route::post('/', [AddressController::class, 'storeMe']);
        Route::patch('/{id}', [AddressController::class, 'updateMe']);
        Route::delete('/{id}', [AddressController::class, 'destroyMe']);
    });

    // address crud
    Route::prefix('users/{userId}/addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::patch('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
    });

    // rental user
    Route::get('/rentals', [RentalController::class, 'index']);
    Route::patch('/rentals/{id}/cancel', [RentalController::class, 'cancel']);
    Route::get('/my/rental-issues', [RentalIssueController::class, 'myIssues']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::post('/cart/rent-now', [CartController::class, 'rentNow']);
    Route::post('/cart/checkout', [
        \App\Http\Controllers\Cart\CheckoutController::class,
        'checkout',
    ]);
    Route::patch('/cart/return-date', [
        CartController::class,
        'updateReturnDate',
    ]);
    Route::patch('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'destroyItem']);

    // Admin routes with granular permissions. ADMIN role bypasses permissions via RequirePermission middleware.
    Route::group([], function () {
        Route::get('/admin/dashboard', [
            AdminDashboardController::class,
            'index',
        ])->middleware('permission:ADMIN_DASHBOARD_VIEW');

        Route::get('/users', [UserController::class, 'index'])->middleware(
            'permission:USER_READ',
        );
        Route::delete('/users/{id}', [
            UserController::class,
            'destroy',
        ])->middleware('permission:USER_DELETE');
        Route::patch('/users/{id}/status', [
            UserController::class,
            'updateStatus',
        ])->middleware('permission:USER_UPDATE');

        Route::get('/roles', [RbacController::class, 'roles'])->middleware(
            'permission:RBAC_READ',
        );
        Route::get('/permissions', [
            RbacController::class,
            'permissions',
        ])->middleware('permission:RBAC_READ');
        Route::post('/roles/{id}/permissions', [
            RbacController::class,
            'syncRolePermissions',
        ])->middleware('permission:RBAC_UPDATE');
        Route::get('/users/{id}/roles', [
            RbacController::class,
            'userRoles',
        ])->middleware('permission:RBAC_READ');
        Route::post('/users/{id}/roles', [
            RbacController::class,
            'assignRoleToUser',
        ])->middleware('permission:RBAC_UPDATE');
        Route::delete('/users/{id}/roles/{roleId}', [
            RbacController::class,
            'removeRoleFromUser',
        ])->middleware('permission:RBAC_UPDATE');
        Route::get('/users/{id}/permissions', [
            RbacController::class,
            'userPermissions',
        ])->middleware('permission:RBAC_READ');
        Route::post('/users/{id}/permissions', [
            RbacController::class,
            'syncUserPermissions',
        ])->middleware('permission:RBAC_UPDATE');

        // Rental CRUD
        Route::post('/rentals', [RentalController::class, 'store'])->middleware(
            'permission:RENTAL_CREATE',
        );
        Route::get('/rentals/{id}', [
            RentalController::class,
            'show',
        ])->middleware('permission:RENTAL_READ');
        Route::patch('/rentals/{id}', [
            RentalController::class,
            'update',
        ])->middleware('permission:RENTAL_UPDATE');

        // Return order
        Route::post('/return-orders', [
            ReturnOrderController::class,
            'store',
        ])->middleware('permission:RETURN_ORDER_CREATE');
        Route::patch('/return-orders/{id}', [
            ReturnOrderController::class,
            'update',
        ])->middleware('permission:RETURN_ORDER_UPDATE');

        // Rental issue
        Route::get('/rental-issues', [
            RentalIssueController::class,
            'index',
        ])->middleware('permission:RENTAL_ISSUE_READ');
        Route::post('/rental-issues', [
            RentalIssueController::class,
            'store',
        ])->middleware('permission:RENTAL_ISSUE_CREATE');
        Route::patch('/rental-issues/{id}', [
            RentalIssueController::class,
            'update',
        ])->middleware('permission:RENTAL_ISSUE_UPDATE');

        // Transaction
        Route::post('/transactions', [
            TransactionController::class,
            'store',
        ])->middleware('permission:TRANSACTION_CREATE');
        Route::patch('/transactions/{id}', [
            TransactionController::class,
            'update',
        ])->middleware('permission:TRANSACTION_UPDATE');

        // Category (Admin)
        Route::prefix('admin/categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->middleware(
                'permission:CATEGORY_READ',
            );
            Route::post('/', [CategoryController::class, 'store'])->middleware(
                'permission:CATEGORY_CREATE',
            );
            Route::patch('/{category}', [
                CategoryController::class,
                'update',
            ])->middleware('permission:CATEGORY_UPDATE');
            Route::delete('/{category}', [
                CategoryController::class,
                'destroy',
            ])->middleware('permission:CATEGORY_DELETE');
        });
        // Brands (Admin)
        Route::prefix('admin/brands')->group(function () {
            Route::post('/', [BrandController::class, 'store'])->middleware(
                'permission:BRAND_CREATE',
            );
            Route::patch('/{brand}', [
                BrandController::class,
                'update',
            ])->middleware('permission:BRAND_UPDATE');
            Route::delete('/{brand}', [
                BrandController::class,
                'destroy',
            ])->middleware('permission:BRAND_DELETE');
        });
        // Products (Admin)
        Route::prefix('admin/products')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->middleware(
                'permission:PRODUCT_READ',
            );
            Route::post('/', [ProductController::class, 'store'])->middleware(
                'permission:PRODUCT_CREATE',
            );
            Route::patch('/{product}', [
                ProductController::class,
                'update',
            ])->middleware('permission:PRODUCT_UPDATE');
            Route::delete('/{product}', [
                ProductController::class,
                'destroy',
            ])->middleware('permission:PRODUCT_DELETE');
        });

        // Coupons admin
        Route::prefix('coupons')->group(function () {
            Route::get('/', [CouponController::class, 'index'])->middleware(
                'permission:COUPON_READ',
            );
            Route::post('/', [CouponController::class, 'store'])->middleware(
                'permission:COUPON_CREATE',
            );
            Route::get('/{id}', [CouponController::class, 'show'])->middleware(
                'permission:COUPON_READ',
            );
            Route::patch('/{coupon}', [
                CouponController::class,
                'update',
            ])->middleware('permission:COUPON_UPDATE');
            Route::delete('/{coupon}', [
                CouponController::class,
                'destroy',
            ])->middleware('permission:COUPON_DELETE');
        });

        // Combos admin
        Route::prefix('combos')->group(function () {
            Route::post('/', [ComboController::class, 'store'])->middleware(
                'permission:COMBO_CREATE',
            );
            Route::patch('/{combo}', [
                ComboController::class,
                'update',
            ])->middleware('permission:COMBO_UPDATE');
            Route::delete('/{combo}', [
                ComboController::class,
                'destroy',
            ])->middleware('permission:COMBO_DELETE');
        });

        // Rental policies admin
        Route::prefix('rental-policies')->group(function () {
            Route::post('/', [
                RentalPolicyController::class,
                'store',
            ])->middleware('permission:RENTAL_POLICY_CREATE');
            Route::patch('/{rentalPolicy}', [
                RentalPolicyController::class,
                'update',
            ])->middleware('permission:RENTAL_POLICY_UPDATE');
            Route::delete('/{rentalPolicy}', [
                RentalPolicyController::class,
                'destroy',
            ])->middleware('permission:RENTAL_POLICY_DELETE');
        });
    });
});

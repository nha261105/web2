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
    Route::post('/user-tokens/check-token', [UserTokenController::class, 'check']);

    Route::get('/users/me', [UserController::class, 'me']);
    Route::patch('/users/me', [UserController::class, 'updateMe']);
    Route::patch('/users/me/password', [UserController::class, 'changePassword']);

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
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::post('/cart/rent-now', [CartController::class, 'rentNow']);
    Route::post('/cart/checkout', [\App\Http\Controllers\Cart\CheckoutController::class, 'checkout']);
    Route::patch('/cart/return-date', [CartController::class, 'updateReturnDate']);
    Route::patch('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'destroyItem']);

    Route::middleware(['role:ADMIN'])->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/users/{id}/status', [
            UserController::class,
            'updateStatus',
        ]);

        Route::get('/roles', [RbacController::class, 'roles']);
        Route::get('/permissions', [RbacController::class, 'permissions']);
        Route::post('/roles/{id}/permissions', [RbacController::class, 'syncRolePermissions']);
        Route::get('/users/{id}/roles', [RbacController::class, 'userRoles']);
        Route::post('/users/{id}/roles', [RbacController::class, 'assignRoleToUser']);
        Route::delete('/users/{id}/roles/{roleId}', [RbacController::class, 'removeRoleFromUser']);

        // Rental CRUD
        Route::post('/rentals', [RentalController::class, 'store']);
        Route::get('/rentals/{id}', [RentalController::class, 'show']);
        Route::patch('/rentals/{id}', [RentalController::class, 'update']);

        // Return order
        Route::post('/return-orders', [ReturnOrderController::class, 'store']);
        Route::patch('/return-orders/{id}', [ReturnOrderController::class, 'update']);

        // Rental issue
        Route::post('/rental-issues', [RentalIssueController::class, 'store']);
        Route::patch('/rental-issues/{id}', [RentalIssueController::class, 'update']);

        // Transaction
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::patch('/transactions/{id}', [TransactionController::class, 'update']);

        // Category (Admin)
        Route::prefix('admin/categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index']);
            Route::post('/', [CategoryController::class, 'store']);
            Route::patch('/{category}', [CategoryController::class, 'update']);
            Route::delete('/{category}', [CategoryController::class, 'destroy']);
        });
        // Brands (Admin)
        Route::prefix('admin/brands')->group(function () {
            Route::post('/', [BrandController::class, 'store']);
            Route::patch('/{brand}', [BrandController::class, 'update']);
            Route::delete('/{brand}', [BrandController::class, 'destroy']);
        });
        // Products (Admin)
        Route::prefix('admin/products')->group(function () {
            Route::get('/', [ProductController::class, 'index']);
            Route::post('/', [ProductController::class, 'store']);
            Route::patch('/{product}', [ProductController::class, 'update']);
            Route::delete('/{product}', [ProductController::class, 'destroy']);
        });

        // Coupons admin
        Route::prefix('coupons')->group(function () {
            Route::get('/', [CouponController::class, 'index']);
            Route::post('/', [CouponController::class, 'store']);
            Route::get('/{id}', [CouponController::class, 'show']);
            Route::patch('/{coupon}', [CouponController::class, 'update']);
            Route::delete('/{coupon}', [CouponController::class, 'destroy']);
        });

        // Combos admin
        Route::prefix('combos')->group(function () {
            Route::post('/', [ComboController::class, 'store']);
            Route::patch('/{combo}', [ComboController::class, 'update']);
            Route::delete('/{combo}', [ComboController::class, 'destroy']);
        });

        // Rental policies admin
        Route::prefix('rental-policies')->group(function () {
            Route::post('/', [RentalPolicyController::class, 'store']);
            Route::patch('/{rentalPolicy}', [RentalPolicyController::class, 'update']);
            Route::delete('/{rentalPolicy}', [RentalPolicyController::class, 'destroy']);
        });
    });
});

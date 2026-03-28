<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RbacController;
use App\Http\Controllers\Auth\UserTokenController;
use App\Http\Controllers\Rental\RentalController;
use App\Http\Controllers\Rental\RentalIssueController;
use App\Http\Controllers\Rental\ReturnOrderController;
use App\Http\Controllers\Rental\TransactionController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Category\CategoryController;

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

Route::middleware(['auth.token'])->group(function () {
    Route::post('/auth/sign-out', [AuthController::class, 'signOut']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/user-tokens/check-token', [
        UserTokenController::class,
        'check',
    ]);

    Route::middleware(['role:ADMIN'])->group(function () {
        Route::get('/roles', [RbacController::class, 'roles']);
        Route::get('/permissions', [RbacController::class, 'permissions']);
        Route::post('/roles/{id}/permissions', [
            RbacController::class,
            'syncRolePermissions',
        ]);
        Route::get('/users/{id}/roles', [RbacController::class, 'userRoles']);
        Route::post('/users/{id}/roles', [
            RbacController::class,
            'assignRoleToUser',
        ]);
        Route::delete('/users/{id}/roles/{roleId}', [
            RbacController::class,
            'removeRoleFromUser',
        ]);

        //Rental CRUD
        Route::get('/rentals', [RentalController::class, 'index']);
        Route::post('/rentals', [RentalController::class, 'store']);
        Route::get('/rentals/{id}', [RentalController::class, 'show']);
        Route::patch('/rentals/{id}', [RentalController::class, 'update']);

        // Return order
        Route::post('/return-orders', [ReturnOrderController::class, 'store']);
        Route::patch('/return-orders/{id}', [
            ReturnOrderController::class,
            'update',
        ]);

        // Rental issue
        Route::post('/rental-issues', [RentalIssueController::class, 'store']);
        Route::patch('/rental-issues/{id}', [
            RentalIssueController::class,
            'update',
        ]);

        // Transaction
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::patch('/transactions/{id}', [
            TransactionController::class,
            'update',
        ]);

        // Category
        Route::prefix('categories')->group(function () {
            Route::post('/', [CategoryController::class, 'store']);
            Route::patch('/{category}', [CategoryController::class, 'update']);
            Route::delete('/{category}', [
                CategoryController::class,
                'destroy',
            ]);
        });
    });
});

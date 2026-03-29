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
use App\Http\Controllers\Address\AddressController;


/**
 * User Routes
 */
Route::post('/users', [UserController::class, 'store']);

/**
 * Auth Routes
 */
Route::post('/auth/sign-in', [AuthController::class, 'signIn']);

Route::middleware(['auth.token'])->group(function () {
	Route::post('/auth/sign-out', [AuthController::class, 'signOut']);
	Route::get('/auth/me', [AuthController::class, 'me']);
	Route::post('/user-tokens/check-token', [UserTokenController::class, 'check']);

	Route::get('/users/me', [UserController::class, 'me']);
	Route::patch('/users/me', [UserController::class, 'updateMe']);

	// address crud
	Route::prefix('users/{userId}/addresses')->group(function () {
		Route::get('/', [AddressController::class, 'index']);
		Route::post('/', [AddressController::class, 'store']);
		Route::patch('/{id}', [AddressController::class, 'update']);
		Route::delete('/{id}', [AddressController::class, 'destroy']);
	});

	//rental user
	Route::get('/rentals', [RentalController::class, 'index']);

	Route::middleware(['role:ADMIN'])->group(function () {
		Route::get('/users', [UserController::class, 'index']);
		Route::get('/users/{id}', [UserController::class, 'show']);
		Route::delete('/users/{id}', [UserController::class, 'destroy']);
		Route::get('/roles', [RbacController::class, 'roles']);
		Route::get('/permissions', [RbacController::class, 'permissions']);
		Route::post('/roles/{id}/permissions', [RbacController::class, 'syncRolePermissions']);
		Route::get('/users/{id}/roles', [RbacController::class, 'userRoles']);
		Route::post('/users/{id}/roles', [RbacController::class, 'assignRoleToUser']);
		Route::delete('/users/{id}/roles/{roleId}', [RbacController::class, 'removeRoleFromUser']);
		Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);

		//Rental CRUD
		// Route::get('/rentals', [RentalController::class, 'index']);
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
	});
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RbacController;
use App\Http\Controllers\Auth\UserTokenController;
use App\Http\Controllers\User\UserController;

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

	Route::middleware(['role:ADMIN'])->group(function () {
		Route::get('/roles', [RbacController::class, 'roles']);
		Route::get('/permissions', [RbacController::class, 'permissions']);
		Route::post('/roles/{id}/permissions', [RbacController::class, 'syncRolePermissions']);
		Route::get('/users/{id}/roles', [RbacController::class, 'userRoles']);
		Route::post('/users/{id}/roles', [RbacController::class, 'assignRoleToUser']);
		Route::delete('/users/{id}/roles/{roleId}', [RbacController::class, 'removeRoleFromUser']);
	});
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\UserTokenController;
use App\Http\Controllers\User\UserController;

/**
 * User Routes
 */
Route::post('/users', [UserController::class, 'store']);

/**
 * Users Routes
*/
Route::post('/users/sign-in', [AuthController::class, 'signIn']);
Route::post('/user-tokens/check-token', [UserTokenController::class, 'check']);
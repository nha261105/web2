<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\UserTokensController;

/**
 * User Routes
 */
Route::post('/users', [UserController::class, 'store']);

/**
 * Users Routes
*/
Route::post('/users/sign-in', [UsersController::class, 'signInUserByEmailAndPassword']);
Route::post('/user-tokens/check-token', [UserTokensController::class, 'checkUserToken']);
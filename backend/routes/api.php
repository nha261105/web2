<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;

/**
 * User Routes
 */
Route::post('/users', [UserController::class, 'store']);

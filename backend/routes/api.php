<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/**
 * User Routes
 */
Route::post('/users', [UserController::class, 'store']);

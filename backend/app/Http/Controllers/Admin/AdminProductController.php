<?php

namespace App\Http\Controller\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminProductService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;


class AdminProductController extends Controller {
    public function __construct(private AdminProductService $service) {}

    public function index(): JsonResponse {
        return ApiResponse::success([
            'dashboard' => $this->service->getOverview(),
        ]);
    }
}
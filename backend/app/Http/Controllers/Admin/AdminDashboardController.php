<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminDashboardService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function __construct(private AdminDashboardService $service) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success([
            'dashboard' => $this->service->getOverview(),
        ]);
    }
}

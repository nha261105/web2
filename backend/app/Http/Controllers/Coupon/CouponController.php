<?php

namespace App\Http\Controllers\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Requests\Coupon\CreateCouponRequest;
use App\Http\Requests\Coupon\UpdateCouponRequest;
use App\Http\Resources\CouponResource;
use App\Services\Coupon\CouponService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function __construct(private CouponService $service) {}

    public function index(): JsonResponse
    {
        $coupons = $this->service->list();
        return ApiResponse::success(
            [
                'items' => CouponResource::collection($coupons),
            ],
            'Fetched coupons',
        );
    }

    public function show(int $id): JsonResponse
    {
        $coupon = $this->service->findById($id);
        return ApiResponse::success(
            [
                'coupon' => new CouponResource($coupon),
            ],
            'Fetched coupon',
        );
    }

    public function store(CreateCouponRequest $request): JsonResponse
    {
        $coupon = $this->service->create($request->validated());
        return ApiResponse::success(
            [
                'coupon' => new CouponResource($coupon),
            ],
            'Coupon created',
            201,
        );
    }

    public function update(
        UpdateCouponRequest $request,
        int $coupon,
    ): JsonResponse {
        $updated = $this->service->updateById($coupon, $request->validated());
        return ApiResponse::success(
            [
                'coupon' => new CouponResource($updated),
            ],
            'Coupon updated',
        );
    }

    public function destroy(int $coupon): JsonResponse
    {
        $this->service->deleteById($coupon);
        return ApiResponse::success([], 'Coupon deleted');
    }

    public function check(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);
        $coupon = $this->service->findByCode($request->code);

        if (!$coupon) {
            return ApiResponse::error(
                'Invalid or expired coupon code',
                'COUPON_NOT_FOUND',
                404,
            );
        }

        return ApiResponse::success(
            [
                'coupon' => new CouponResource($coupon),
            ],
            'Coupon is valid',
        );
    }
}

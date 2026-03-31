<?php

namespace App\Http\Controllers\Brand;

use App\Http\Controllers\Controller;
use App\Http\Requests\Brand\CreateBrandRequest;
use App\Http\Requests\Brand\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use App\Services\Brand\BrandService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    public function __construct(private BrandService $service) {}

    public function index(): JsonResponse
    {
        $brand = $this->service->list();

        return ApiResponse::success(
            [
                'items' => BrandResource::collection($brand),
            ],
            'Fetched brand',
        );
    }

    public function show(int $id): JsonResponse
    {
        $brand = $this->service->findById($id);

        return ApiResponse::success(
            [
                'brand' => new BrandResource($brand),
            ],
            'Fetched brand',
        );
    }

    public function store(CreateBrandRequest $request): JsonResponse
    {
        $brand = $this->service->create($request->validated());

        return ApiResponse::success(
            [
                'brand' => new BrandResource($brand),
            ],
            'brand created',
            201,
        );
    }

    public function update(
        UpdateBrandRequest $request,
        int $brand,
    ): JsonResponse {
        $updated = $this->service->updateById($brand, $request->validated());

        return ApiResponse::success(
            [
                'brand' => new BrandResource($updated),
            ],
            'brand updated',
        );
    }

    public function destroy(int $brand): JsonResponse
    {
        $this->service->deleteById($brand);

        return ApiResponse::success([], 'Brand deleted');
    }
}

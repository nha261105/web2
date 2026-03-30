<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\Product\ProductService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}
    public function index(Request $request): JsonResponse
    {
        $product = $this->service->list($request->all());
        return ApiResponse::success(
            [
                'items' => ProductResource::collection($product),
            ],
            'fetched products',
        );
    }
    public function show(int $id): JsonResponse
    {
        $product = $this->service->findById($id);
        return ApiResponse::success(
            [
                'product' => new ProductResource($product),
            ],
            'fetched product',
        );
    }
    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->service->create($request->validated());
        return ApiResponse::success(
            [
                'product' => new ProductResource($product),
            ],
            'Product created',
            201,
        );
    }
    public function update(
        UpdateProductRequest $request,
        int $product,
    ): JsonResponse {
        $update = $this->service->updateById($product, $request->validated());
        return ApiResponse::success(
            [
                'product' => new ProductResource($update),
            ],
            'Product updated',
        );
    }
    public function destroy(int $product): JsonResponse
    {
        $this->service->deleteById($product);
        return ApiResponse::success([], 'Product deleted');
    }
}

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
        $perPage = $request->query('per_page', 20);
        $search = $request->query('search');
        $categoryId = $request->query('category_id');

        // For admin, return paginated results
        $query = \App\Models\Product::with(['category', 'brand', 'images']);

        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->paginate($perPage);
        $productResources = ProductResource::collection($products);

        return ApiResponse::success(
            [
                // Keep both keys for backward compatibility across FE modules.
                'items' => $productResources,
                'products' => $productResources,
                'pagination' => [
                    'total' => $products->total(),
                    'current_page' => $products->currentPage(),
                    'per_page' => $products->perPage(),
                    'last_page' => $products->lastPage(),
                ],
            ],
            'Fetched products',
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

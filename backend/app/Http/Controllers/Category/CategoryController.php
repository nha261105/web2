<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\Category\CategoryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $service) {}

    public function index(): JsonResponse
    {
        // Return paginated categories for admin listing
        $categories = \App\Models\Category::paginate(20);
        $categoryResources = CategoryResource::collection($categories);

        return ApiResponse::success(
            [
                // Keep both keys for backward compatibility across FE modules.
                'items' => $categoryResources,
                'categories' => $categoryResources,
                'pagination' => [
                    'total' => $categories->total(),
                    'current_page' => $categories->currentPage(),
                    'per_page' => $categories->perPage(),
                    'last_page' => $categories->lastPage(),
                ],
            ],
            'Fetched categories',
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->service->findById($id);

        return ApiResponse::success(
            [
                'category' => new CategoryResource($category),
            ],
            'Fetched category',
        );
    }

    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $category = $this->service->create($request->validated());

        return ApiResponse::success(
            [
                'category' => new CategoryResource($category),
            ],
            'Category created',
            201,
        );
    }

    public function update(
        UpdateCategoryRequest $request,
        int $category,
    ): JsonResponse {
        $updated = $this->service->updateById($category, $request->validated());

        return ApiResponse::success(
            [
                'category' => new CategoryResource($updated),
            ],
            'Category updated',
        );
    }

    public function destroy(int $category): JsonResponse
    {
        $this->service->deleteById($category);

        return ApiResponse::success([], 'Category deleted');
    }
}

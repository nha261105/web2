<?php

namespace App\Http\Controllers\Combos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Combos\CreateComboRequest;
use App\Http\Requests\Combos\UpdateComboRequest;
use App\Http\Resources\ComboResource;
use App\Services\Combos\ComboService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ComboController extends Controller
{
    public function __construct(private ComboService $service) {}

    public function index(): JsonResponse
    {
        $combos = $this->service->list();
        return ApiResponse::success(
            ['items' => ComboResource::collection($combos)],
            'Fetched combos',
        );
    }

    public function show(int $id): JsonResponse
    {
        $combo = $this->service->findById($id);
        return ApiResponse::success(
            ['combo' => new ComboResource($combo)],
            'Fetched combo',
        );
    }

    public function store(CreateComboRequest $request): JsonResponse
    {
        $combo = $this->service->create($request->validated());
        return ApiResponse::success(
            [
                'combo' => new ComboResource($combo),
            ],
            'Combo created',
            201,
        );
    }

    public function update(
        UpdateComboRequest $request,
        int $combo,
    ): JsonResponse {
        $updated = $this->service->updateById($combo, $request->validated());
        return ApiResponse::success(
            ['combo' => new ComboResource($updated)],
            'Combo updated',
        );
    }

    public function destroy(int $combo): JsonResponse
    {
        $this->service->deleteById($combo);
        return ApiResponse::success([], 'Combo deleted');
    }
}

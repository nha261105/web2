<?php

namespace App\Http\Controllers\Rental;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rental\CreateReturnOrderRequest;
use App\Http\Requests\Rental\UpdateReturnOrderRequest;
use App\Http\Resources\Rental\ReturnOrderResource;
use App\Services\Rental\ReturnOrderService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ReturnOrderController extends Controller
{
    public function __construct(private ReturnOrderService $service)
    {
    }

    public function store(CreateReturnOrderRequest $request): JsonResponse
    {
        $returnOrder = $this->service->create($request->validated());

        return ApiResponse::success([
            'return_order' => new ReturnOrderResource($returnOrder),
        ], 'Return order created', 201);
    }

    public function update(UpdateReturnOrderRequest $request, int $id): JsonResponse
    {
        $returnOrder = $this->service->update($id, $request->validated());

        return ApiResponse::success([
            'return_order' => new ReturnOrderResource($returnOrder),
        ], 'Return order updated');
    }
}

<?php

namespace App\Http\Controllers\Rental;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rental\CreateReturnOrderRequest;
use App\Http\Requests\Rental\UpdateReturnOrderRequest;
use App\Http\Resources\Rental\ReturnOrderResource;
use App\Services\Rental\ReturnOrderService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReturnOrderController extends Controller
{
    public function __construct(private \App\Services\Rental\ReturnOrderFallbackService $service) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rental_id' => 'required|integer|exists:rentals,id',
            'items' => 'required|array',
            'items.*.rental_detail_id' => 'required|integer|exists:rental_details,id',
            'items.*.condition' => 'required|in:GOOD,DAMAGED,LOST',
            'items.*.note' => 'nullable|string',
            'items.*.penalty_fee' => 'nullable|numeric|min:0',
        ]);

        $returnOrder = $this->service->processReturn($validated['rental_id'], $validated['items']);

        return ApiResponse::success(
            [
                'return_order' => $returnOrder,
            ],
            'Return order processed successfully',
            201,
        );
    }

    public function update(
        UpdateReturnOrderRequest $request,
        int $id,
    ): JsonResponse {
        $returnOrder = $this->service->update($id, $request->validated());

        return ApiResponse::success(
            [
                'return_order' => new ReturnOrderResource($returnOrder),
            ],
            'Return order updated',
        );
    }
}

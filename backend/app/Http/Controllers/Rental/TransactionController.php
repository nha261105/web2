<?php

namespace App\Http\Controllers\Rental;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rental\CreateTransactionRequest;
use App\Http\Requests\Rental\UpdateTransactionRequest;
use App\Http\Resources\Rental\TransactionResource;
use App\Services\Rental\TransactionService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    public function __construct(private TransactionService $service)
    {
    }

    public function store(CreateTransactionRequest $request): JsonResponse
    {
        $transaction = $this->service->create($request->validated());

        return ApiResponse::success([
            'transaction' => new TransactionResource($transaction),
        ], 'Transaction created', 201);
    }

    public function update(UpdateTransactionRequest $request, int $id): JsonResponse
    {
        $transaction = $this->service->update($id, $request->validated());

        return ApiResponse::success([
            'transaction' => new TransactionResource($transaction),
        ], 'Transaction updated');
    }
}

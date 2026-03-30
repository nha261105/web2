<?php

namespace App\Http\Controllers\Rental;

use App\Http\Controllers\Controller;
use App\Http\Requests\RentalPolicy\CreateRentalPolicyRequest;
use App\Http\Requests\RentalPolicy\UpdateRentalPolicyRequest;
use App\Http\Resources\RentalPolicyResource;
use App\Models\RentalPolicy;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class RentalPolicyController extends Controller
{
    public function index(): JsonResponse
    {
        $policies = RentalPolicy::all();

        return ApiResponse::success(
            ['items' => RentalPolicyResource::collection($policies)],
            'Fetched rental policies',
        );
    }

    public function show(int $id): JsonResponse
    {
        $policy = RentalPolicy::findOrFail($id);

        return ApiResponse::success(
            ['policy' => new RentalPolicyResource($policy)],
            'Fetched rental policy',
        );
    }

    public function store(CreateRentalPolicyRequest $request): JsonResponse
    {
        $policy = RentalPolicy::create($request->validated());

        return ApiResponse::success(
            ['policy' => new RentalPolicyResource($policy)],
            'Rental policy created',
            201,
        );
    }

    public function update(
        UpdateRentalPolicyRequest $request,
        int $id,
    ): JsonResponse {
        $policy = RentalPolicy::findOrFail($id);
        $policy->update($request->validated());

        return ApiResponse::success(
            ['policy' => new RentalPolicyResource($policy)],
            'Rental policy updated',
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $policy = RentalPolicy::findOrFail($id);
        $policy->delete();

        return ApiResponse::success([], 'Rental policy deleted');
    }
}

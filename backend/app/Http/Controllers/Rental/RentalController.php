<?php

namespace App\Http\Controllers\Rental;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rental\CreateRentalRequest;
use App\Http\Requests\Rental\UpdateRentalRequest;
use App\Http\Resources\Rental\RentalResource;
use App\Services\Rental\RentalService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function __construct(private RentalService $service) {}

    public function index(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $result = $this->service->paginate($request->all(), $authUser);

        return ApiResponse::success([
            'items' => RentalResource::collection($result)->resolve(),
            'meta' => [
                'total'        => $result->total(),
                'current_page' => $result->currentPage(),
                'per_page'     => $result->perPage(),
                'last_page'    => $result->lastPage(),
            ],
        ]);
    }

    public function store(CreateRentalRequest $request): JsonResponse
    {
        $rental = $this->service->create($request->validated());

        return ApiResponse::success(
            [
                'rental' => new RentalResource($rental),
            ],
            'Rental created',
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $rental = $this->service->findById($id);

        return ApiResponse::success([
            'rental' => new RentalResource($rental),
        ]);
    }

    public function update(UpdateRentalRequest $request, int $id): JsonResponse
    {
        try {
            $rental = $this->service->update($id, $request->validated());
        } catch (\InvalidArgumentException $e) {
            return ApiResponse::validation([
                'status' => [$e->getMessage()],
            ]);
        }

        return ApiResponse::success(
            [
                'rental' => new RentalResource($rental),
            ],
            'Rental updated',
        );
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $rental = $this->service->findById($id);

        if ($rental->user_id !== $authUser->id) {
            return ApiResponse::forbidden('Bạn không có quyền huỷ đơn này.');
        }

        try {
            $rental = $this->service->update($id, ['status' => 'CANCELLED']);
        } catch (\InvalidArgumentException $e) {
            return ApiResponse::validation([
                'status' => [$e->getMessage()],
            ]);
        }

        return ApiResponse::success([
            'rental' => new RentalResource($rental),
        ], 'Đã hủy đơn thành công');
    }
}

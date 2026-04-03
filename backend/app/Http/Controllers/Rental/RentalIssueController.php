<?php

namespace App\Http\Controllers\Rental;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rental\CreateRentalIssueRequest;
use App\Http\Requests\Rental\UpdateRentalIssueRequest;
use App\Http\Resources\Rental\RentalIssueResource;
use App\Services\Rental\RentalIssueService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RentalIssueController extends Controller
{
    public function __construct(private RentalIssueService $service) {}

    public function index(Request $request): JsonResponse
    {
        $issues = $this->service->paginateForAdmin($request->all());

        return ApiResponse::success([
            'items' => RentalIssueResource::collection($issues)->resolve(),
            'meta' => [
                'total' => $issues->total(),
                'current_page' => $issues->currentPage(),
                'per_page' => $issues->perPage(),
                'last_page' => $issues->lastPage(),
            ],
        ]);
    }

    public function myIssues(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        if (!$authUser) {
            return ApiResponse::unauthorized();
        }

        $issues = $this->service->paginateForUser(
            (int) $authUser->id,
            $request->all(),
        );

        return ApiResponse::success([
            'items' => RentalIssueResource::collection($issues)->resolve(),
            'meta' => [
                'total' => $issues->total(),
                'current_page' => $issues->currentPage(),
                'per_page' => $issues->perPage(),
                'last_page' => $issues->lastPage(),
            ],
        ]);
    }

    public function store(CreateRentalIssueRequest $request): JsonResponse
    {
        $issue = $this->service->create($request->validated());

        return ApiResponse::success(
            [
                'rental_issue' => new RentalIssueResource($issue),
            ],
            'Rental issue created',
            201,
        );
    }

    public function update(
        UpdateRentalIssueRequest $request,
        int $id,
    ): JsonResponse {
        $issue = $this->service->update($id, $request->validated());

        return ApiResponse::success(
            [
                'rental_issue' => new RentalIssueResource($issue),
            ],
            'Rental issue updated',
        );
    }
}

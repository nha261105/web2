<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\User\UpdateUserRequest;
use App\Support\ApiResponse;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * POST /api/users
     * Tạo user mới
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());

            return ApiResponse::success([
                'user' => new UserResource($user)
            ], 'Tạo user thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi tạo user', 'CREATE_FAILED', 400, ['detail' => $e->getMessage()]);
        }
    }

    /**
     * GET /api/users (Admin)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 15);
        $users = $this->userService->listUsers((int)$perPage);

        return ApiResponse::success([
            'data' => UserResource::collection($users),
            'meta' => [
                'total' => $users->total(),
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'last_page' => $users->lastPage()
            ]
        ], 'Fetched successfully');
    }

    /**
     * GET /api/users/me
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        return ApiResponse::success([
            'user' => new UserResource($user)
        ], 'Fetched successfully');
    }

    /**
     * PATCH /api/users/me
     */
    public function updateMe(UpdateUserRequest $request): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');
            $user = $this->userService->updateUser($authUser->id, $request->all());

            return ApiResponse::success([
                'user' => new UserResource($user)
            ], 'Profile updated successfully');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 'UPDATE_FAILED', 400);
        }
    }

    /**
     * DELETE /api/users/{id} (Admin)
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->userService->deleteUser((int)$id);
            return ApiResponse::success([], 'User deleted successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('User not found', 'NOT_FOUND', 404);
        }
    }

    /**
     * PATCH /api/users/{id}/status (Admin)
     */
    public function updateStatus(Request $request, $id): JsonResponse 
    {
        try {
            $request->validate([
                'status' => 'required|in:ACTIVE,INACTIVE'
            ]);

            $user = $this->userService->updateUser($id, ['status' => $request->status]);

            return ApiResponse::success([
                'user' => new UserResource($user)
            ], 'Cập nhật trạng thái người dùng thành công');
        } catch (\Exception $e) {
            return ApiResponse::error('Cập nhật trạng thái thất bại', 'UPDATE_STATUS_FAILED', 400);
        }
    }
}

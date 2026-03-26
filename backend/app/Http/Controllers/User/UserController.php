<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

            return response()->json([
                'success' => true,
                'message' => 'Tạo user thành công',
                'data' => new UserResource($user),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo user',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * GET /api/users (Admin)
     */
    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();
        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
            'meta' => [
                'total' => $users->total(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage()
            ]
        ]);
    }

    /**
     * GET /api/users/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user())
        ]);
    }

    /**
     * PATCH /api/users/me
     */
    public function updateMe(Request $request): JsonResponse
    {
        $user = $this->userService->update($request->user()->id, $request->all());
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật profile thành công',
            'data' => new UserResource($user)
        ]);
    }

    /**
     * DELETE /api/users/{id} (Admin)
     */
    public function destroy($id): JsonResponse
    {
        $this->userService->deleteUser($id);
        return response()->json([
            'success' => true,
            'message' => 'Xóa người dùng thành công'
        ]);
    }
}

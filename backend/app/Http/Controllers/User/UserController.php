<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\UserService;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

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
}

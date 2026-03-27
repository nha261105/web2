<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddressResource;
use App\Services\Address\AddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    protected AddressService $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    /**
     * GET /api/users/{userId}/addresses
     */
    public function index(Request $request, $userId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        
        if ($authUser->id != $userId && !$this->checkAdmin($authUser)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xem địa chỉ của người khác',
            ], 403);
        }

        $addresses = \App\Models\Address::where('user_id', $userId)->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách địa chỉ thành công',
            'data' => AddressResource::collection($addresses),
        ]);
    }

    /**
     * POST /api/users/{userId}/addresses
     */
    public function store(Request $request, $userId): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');

            if ($authUser->id != $userId && !$this->checkAdmin($authUser)) {
                return response()->json(['success' => false, 'message' => 'Hành động không hợp lệ'], 403);
            }

            $address = $this->addressService->save($request->all(), $userId); 

            return response()->json([
                'success' => true,
                'message' => 'Thêm địa chỉ thành công',
                'data' => new AddressResource($address),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thêm địa chỉ',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * PATCH /api/users/{userId}/addresses/{id}
     */
    public function update(Request $request, $userId, $id): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');

            if ($authUser->id != $userId && !$this->checkAdmin($authUser)) {
                return response()->json(['success' => false, 'message' => 'Hành động không hợp lệ'], 403);
            }

            $address = $this->addressService->save($request->all(), $userId, $id); 

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật địa chỉ thành công',
                'data' => new AddressResource($address),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật địa chỉ',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * DELETE /api/users/{userId}/addresses/{id}
     */
    public function destroy(Request $request, $userId, $id): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');

            if ($authUser->id != $userId && !$this->checkAdmin($authUser)) {
                return response()->json(['success' => false, 'message' => 'Hành động không hợp lệ'], 403);
            }

            $this->addressService->delete($userId, $id);

            return response()->json([
                'success' => true,
                'message' => 'Xóa địa chỉ thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa địa chỉ',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Hàm phụ kiểm tra quyền Admin
     */
    private function checkAdmin($user): bool
    {
        return $user->roles->contains('name', 'ADMIN');
    }
}
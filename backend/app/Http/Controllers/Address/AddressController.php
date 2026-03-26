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
     * GET /api/addresses
     * Lấy danh sách địa chỉ của user đang đăng nhập
     */
    public function index(Request $request): JsonResponse // 123
    {
        $user = $request->attributes->get('auth_user');
        $addresses = \App\Models\Address::where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách địa chỉ thành công',
            'data' => AddressResource::collection($addresses),
        ]);
    }

    /**
     * POST /api/addresses
     * Thêm địa chỉ mới
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = $request->attributes->get('auth_user');
            // Gọi service xử lý logic (bao gồm cả logic is_default)
            $address = $this->addressService->save($request->all(), $user->id);

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
     * PATCH /api/addresses/{id}
     * Cập nhật địa chỉ
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->attributes->get('auth_user');
            $address = $this->addressService->save($request->all(), $user->id, $id);

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
     * DELETE /api/addresses/{id}
     * Xóa địa chỉ
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->attributes->get('auth_user');
            $this->addressService->delete($user->id, $id);

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
}
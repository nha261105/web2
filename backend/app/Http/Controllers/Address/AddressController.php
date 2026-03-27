<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddressResource;
use App\Services\Address\AddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Address\CreateAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Support\ApiResponse;

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

        if ($authUser->id != $userId && !$authUser->hasRole('ADMIN')) {
            return ApiResponse::forbidden('Bạn không có quyền xem địa chỉ của người khác');
        }

        $addresses = \App\Models\Address::where('user_id', $userId)->get();

        return ApiResponse::success([
            'addresses' => AddressResource::collection($addresses)
        ], 'Lấy danh sách địa chỉ thành công');
    }

    /**
     * POST /api/users/{userId}/addresses
     */
    public function store(CreateAddressRequest $request, $userId): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');

            if ($authUser->id != $userId && !$authUser->hasRole('ADMIN')) {
                return ApiResponse::forbidden('Hành động không hợp lệ');
            }

            $address = $this->addressService->save($request->all(), $userId);

            return ApiResponse::success([
                'address' => new AddressResource($address)
            ], 'Thêm địa chỉ thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi thêm địa chỉ', 'STORE_FAILED', 400, ['detail' => $e->getMessage()]);
        }
    }

    /**
     * PATCH /api/users/{userId}/addresses/{id}
     */
    public function update(UpdateAddressRequest $request, $userId, $id): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');

            if ($authUser->id != $userId && !$authUser->hasRole('ADMIN')) {
                return ApiResponse::forbidden('Hành động không hợp lệ');
            }

            $address = $this->addressService->save($request->all(), $userId, $id);

            return ApiResponse::success([
                'address' => new AddressResource($address)
            ], 'Cập nhật địa chỉ thành công');
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi cập nhật địa chỉ', 'UPDATE_FAILED', 400, ['detail' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /api/users/{userId}/addresses/{id}
     */
    public function destroy(Request $request, $userId, $id): JsonResponse
    {
        try {
            $authUser = $request->attributes->get('auth_user');

            if ($authUser->id != $userId && !$authUser->hasRole('ADMIN')) {
                return ApiResponse::forbidden('Hành động không hợp lệ');
            }

            $this->addressService->delete($userId, $id);

            return ApiResponse::success([], 'Xóa địa chỉ thành công');
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi xóa địa chỉ', 'DELETE_FAILED', 400, ['detail' => $e->getMessage()]);
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

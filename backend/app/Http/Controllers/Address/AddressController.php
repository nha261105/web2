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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Address;

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

            $address = $this->addressService->save($request->validated(), $userId);

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

            $address = $this->addressService->save($request->validated(), $userId, $id);
            if ($address === false) {
                return ApiResponse::error('Không tìm thấy địa chỉ', 'NOT_FOUND', 404);
            }

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

            $result = $this->addressService->delete($userId, $id);

            if ($result === false) {
                return ApiResponse::error('Không tìm thấy địa chỉ', 'NOT_FOUND', 404);
            }

            return ApiResponse::success([], 'Xóa địa chỉ thành công');
        } catch (\Exception $e) {
            return ApiResponse::internalError('Lỗi khi xóa địa chỉ');
        }
    }

    
    public function indexMe(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        return $this->index($request, $authUser->id);
    }

    public function storeMe(CreateAddressRequest $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        try {
            $data = $request->validated();

            $address = DB::transaction(function () use ($data, $authUser) {
                if (isset($data['is_default']) && $data['is_default']) {
                    Address::where('user_id', $authUser->id)->update(['is_default' => 0]);
                }

                $allowed = ['receive_name', 'receive_phone', 'city', 'district', 'ward', 'street', 'note', 'is_default'];
                $payload = array_intersect_key($data, array_flip($allowed));
                $payload['user_id'] = $authUser->id;

                return Address::create($payload);
            });

            return ApiResponse::success([
                'address' => new AddressResource($address)
            ], 'Thêm địa chỉ thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi thêm địa chỉ', 'STORE_FAILED', 400, ['detail' => $e->getMessage()]);
        }
    }

    public function updateMe(UpdateAddressRequest $request, $id): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        try {
            $data = $request->validated();
            $address = DB::transaction(function () use ($data, $authUser, $id) {
                $address = Address::where('user_id', $authUser->id)->where('id', $id)->first();
                Log::info($data);
                if (!$address) {
                    return false;
                }

                if (isset($data['is_default']) && $data['is_default']) {
                    Address::where('user_id', $authUser->id)->update(['is_default' => 0]);
                }

                $allowed = ['receive_name', 'receive_phone', 'city', 'district', 'ward', 'street', 'note', 'is_default'];
                $payload = array_intersect_key($data, array_flip($allowed));

                $address->update($payload);
                return $address;
            });

            if ($address === false) {
                return ApiResponse::error('Không tìm thấy địa chỉ', 'NOT_FOUND', 404);
            }

            return ApiResponse::success([
                'address' => new AddressResource($address)
            ], 'Cập nhật địa chỉ thành công');
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi cập nhật địa chỉ', 'UPDATE_FAILED', 400, ['detail' => $e->getMessage()]);
        }
    }

    public function destroyMe(Request $request, $id): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        try {
            $result = DB::transaction(function () use ($authUser, $id) {
                $address = Address::where('user_id', $authUser->id)->where('id', $id)->first();
                if (!$address) {
                    return false;
                }

                $wasDefault = $address->is_default;
                $address->delete();

                if ($wasDefault) {
                    $nextAddress = Address::where('user_id', $authUser->id)->first();
                    if ($nextAddress) {
                        $nextAddress->update(['is_default' => 1]);
                    }
                }

                return true;
            });

            if ($result === false) {
                return ApiResponse::error('Không tìm thấy địa chỉ', 'NOT_FOUND', 404);
            }

            return ApiResponse::success([], 'Xóa địa chỉ thành công');
        } catch (\Exception $e) {
            return ApiResponse::internalError('Lỗi khi xóa địa chỉ');
        }
    }
}

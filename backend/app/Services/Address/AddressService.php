<?php

namespace App\Services\Address;

use App\Models\Address;
use Illuminate\Support\Facades\DB;

class AddressService
{
    public function save($data, $userId, $id = null)
    {
        return DB::transaction(function () use ($data, $userId, $id) {
            // Nếu set địa chỉ này làm mặc định, reset tất cả địa chỉ cũ của user này về 0
            if (isset($data['is_default']) && $data['is_default']) {
                Address::where('user_id', $userId)->update(['is_default' => 0]);
            }

            // Cập nhật hoặc Tạo mới dựa trên việc có $id hay không
            return Address::updateOrCreate(
                ['id' => $id, 'user_id' => $userId],
                $data
            );
        });
    }

    public function delete($userId, $id)
    {
        return Address::where('user_id', $userId)->where('id', $id)->delete();
    }
}
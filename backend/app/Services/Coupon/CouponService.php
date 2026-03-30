<?php

namespace App\Services\Coupon;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Collection;

class CouponService
{
    public function list(): Collection
    {
        return Coupon::query()->orderByDesc('id')->get();
    }

    public function findById(int $id): Coupon
    {
        return Coupon::findOrFail($id);
    }

    public function findByCode(string $code): ?Coupon
    {
        return Coupon::where('code', $code)
            ->where(function ($query) {
                $query
                    ->whereNull('valid_from')
                    ->orWhere('valid_from', '<=', now());
            })
            ->where(function ($query) {
                $query
                    ->whereNull('valid_until')
                    ->orWhere('valid_until', '>=', now());
            })
            ->first();
    }

    public function create(array $data): Coupon
    {
        return Coupon::create($data);
    }

    public function updateById(int $id, array $data): Coupon
    {
        $coupon = $this->findById($id);
        $coupon->update($data);
        return $coupon->fresh();
    }

    public function deleteById(int $id): bool
    {
        $coupon = $this->findById($id);
        return (bool) $coupon->forceDelete();
    }
}

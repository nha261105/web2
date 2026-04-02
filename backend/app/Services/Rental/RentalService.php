<?php

namespace App\Services\Rental;

use App\Models\Rental;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalService
{
    public function paginate(array $filters, $user): LengthAwarePaginator
    {
        $isAdmin = $user && $user->roles()->where('name', 'ADMIN')->exists();

        $query = Rental::with(['user', 'products']);

        // User thường chỉ thấy đơn của mình, loại trừ CART
        if (!$isAdmin) {
            $query->where('user_id', $user->id)
                  ->where('status', '!=', 'CART');
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')
                     ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): Rental
    {
        return Rental::create($data);
    }

    public function findById(int $id): Rental
    {
        return Rental::query()->findOrFail($id);
    }

    public function update(int $id, array $data): Rental
    {
        $rental = $this->findById($id);
        $oldStatus = $rental->status;
        
        $rental->fill($data)->save();

        if ($oldStatus === 'PENDING' && $rental->status === 'APPROVED') {
            foreach ($rental->details as $detail) {
                if ($detail->product) {
                    $detail->product->decrement('stock', $detail->quantity);
                    if ($detail->product->stock < 1) {
                        $detail->product->update(['status' => 'INACTIVE']);
                    }
                }
            }
        } elseif (in_array($oldStatus, ['PENDING', 'APPROVED', 'READY_FOR_PICKUP']) && $rental->status === 'CANCELLED') {
             // restore if cancelled after being approved
             if ($oldStatus !== 'PENDING') {
                foreach ($rental->details as $detail) {
                    if ($detail->product) {
                        $detail->product->increment('stock', $detail->quantity);
                        if ($detail->product->stock > 0 && $detail->product->status === 'INACTIVE') {
                            $detail->product->update(['status' => 'ACTIVE']);
                        }
                    }
                }
             }
        }

        return $rental;
    }
}

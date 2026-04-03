<?php

namespace App\Services\Rental;

use App\Models\Rental;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RentalService
{
    /**
     * Các chuyển trạng thái hợp lệ theo flow.md
     */
    private const ALLOWED_TRANSITIONS = [
        'PENDING'          => ['APPROVED', 'CANCELLED'],
        'APPROVED'         => ['DEPOSITED', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED'],
        'DEPOSITED'        => ['READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED'],
        'READY_FOR_PICKUP' => ['PICKED_UP', 'CANCELLED'],
        'PICKED_UP'        => ['COMPLETED'],
        'COMPLETED'        => [],
        'CANCELLED'        => [],
    ];

    public function paginate(array $filters, $user): LengthAwarePaginator
    {
        $isAdmin = $user && $user->roles()->where('name', 'ADMIN')->exists();

        $query = Rental::with(['user', 'products']);

        // Cả admin và user đều không thấy đơn CART
        $query->where('status', '!=', 'CART');

        // User thường chỉ thấy đơn của mình
        if (!$isAdmin) {
            $query->where('user_id', $user->id);
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
        $newStatus = $data['status'] ?? $oldStatus;

        // Validate status transition
        if ($newStatus !== $oldStatus) {
            $allowed = self::ALLOWED_TRANSITIONS[$oldStatus] ?? [];
            if (!in_array($newStatus, $allowed)) {
                throw new \InvalidArgumentException(
                    "Không thể chuyển trạng thái từ {$oldStatus} sang {$newStatus}. "
                    . "Chỉ được phép: " . (empty($allowed) ? 'không có' : implode(', ', $allowed))
                );
            }
        }

        $rental->fill($data)->save();

        // Khi APPROVED: trừ stock
        if ($oldStatus === 'PENDING' && $rental->status === 'APPROVED') {
            foreach ($rental->details as $detail) {
                if ($detail->product) {
                    $detail->product->decrement('stock', $detail->quantity);
                    $detail->product->refresh(); // Refresh model sau decrement
                    if ($detail->product->stock < 1) {
                        $detail->product->update(['status' => 'INACTIVE']);
                    }
                }
            }
        }

        // Khi CANCELLED: hoàn lại stock nếu đã approve trước đó
        if ($rental->status === 'CANCELLED' && in_array($oldStatus, ['APPROVED', 'DEPOSITED', 'READY_FOR_PICKUP'])) {
            foreach ($rental->details as $detail) {
                if ($detail->product) {
                    $detail->product->increment('stock', $detail->quantity);
                    $detail->product->refresh(); // Refresh model sau increment
                    if ($detail->product->stock > 0 && $detail->product->status === 'INACTIVE') {
                        $detail->product->update(['status' => 'ACTIVE']);
                    }
                }
            }
        }

        return $rental;
    }
}

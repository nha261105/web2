<?php

namespace App\Services\Rental;

use App\Models\Rental;
use App\Services\Notification\NotificationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\RentalDetail;

class RentalService
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

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
        $query = Rental::with(['user', 'products.images']);
        $query->where('status', '!=', 'CART');

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
        $rental = Rental::create($data);

        $this->notificationService->create(
            $rental->user_id,
            'Đặt hàng thành công',
            "Đơn thuê {$rental->code} của bạn đã được tiếp nhận và đang chờ duyệt.",
            'ORDER'
        );

        return $rental;
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

        if ($newStatus !== $oldStatus) {
            $allowed = self::ALLOWED_TRANSITIONS[$oldStatus] ?? [];
            if (!in_array($newStatus, $allowed)) {
                throw new \InvalidArgumentException(
                    "Không thể chuyển trạng thái từ {$oldStatus} sang {$newStatus}. "
                );
            }
        }

        $rental->fill($data)->save();

        // Lấy lại rental với relationship cần thiết cho combo
        $rental = Rental::with(['details.product', 'details.combo.comboDetails.product'])->findOrFail($id);

        // Khi APPROVED: không trừ stock nữa vì đã trừ lúc Checkout (PENDING).

        // Khi CANCELLED: hoàn lại stock nếu đã pending/approve trước đó
        if ($rental->status === 'CANCELLED' && in_array($oldStatus, ['PENDING', 'APPROVED', 'DEPOSITED', 'READY_FOR_PICKUP'])) {
            foreach ($rental->details as $detail) {
                if ($detail->product) {
                    $detail->product->increment('stock', $detail->quantity);
                    $detail->product->refresh(); // Refresh model sau increment
                    if ($detail->product->stock > 0 && $detail->product->status === 'INACTIVE') {
                        $detail->product->update(['status' => 'ACTIVE']);
                    }
                } elseif ($detail->combo) {
                    foreach ($detail->combo->comboDetails as $comboDetail) {
                        $product = $comboDetail->product;
                        $qty = $detail->quantity * $comboDetail->quantity;
                        $product->increment('stock', $qty);
                        $product->refresh();
                        if ($product->stock > 0 && $product->status === 'INACTIVE') {
                            $product->update(['status' => 'ACTIVE']);
                        }
                    }
                }
            }
        }
        if ($newStatus !== $oldStatus) {
            $this->notificationService->notifyRentalStatusChanged(
                $rental->user_id,
                $rental->code,
                $newStatus
            );
        }

        return $rental;
    }

    public function createFromExisting(Rental $oldRental): Rental
    {
        $newCode = 'RNT-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        $newRental = Rental::create([
            'user_id' => $oldRental->user_id,
            'coupon_id' => null,
            'address_id' => $oldRental->address_id,
            'code' => $newCode,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(4),
            'actual_return_date' => null,
            'total_price' => $oldRental->total_price,
            'deposit_amount' => $oldRental->deposit_amount,
            'status' => 'PENDING',
            'note' => 'Đơn thuê lại từ đơn #' . $oldRental->code,
        ]);
        
        foreach ($oldRental->details as $detail) {
            RentalDetail::create([
                'rental_id' => $newRental->id,
                'product_id' => $detail->product_id,
                'combo_id' => $detail->combo_id,
                'inventory_id' => null,
                'quantity' => $detail->quantity,
                'price_at_rental' => $detail->price_at_rental,
            ]);
        }
        $this->notificationService->create(
            $newRental->user_id,
            'Đặt hàng thành công',
            "Đơn thuê mới {$newRental->code} (thuê lại) của bạn đã được tiếp nhận.",
            'ORDER'
        );        
        return $newRental->load('details.product');
    }
}
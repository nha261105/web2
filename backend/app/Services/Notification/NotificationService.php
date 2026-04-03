<?php

namespace App\Services\Notification;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{

    // ─── Tạo notification ─────────────────────────────────────────────────────
    public function create(int $userId, string $title, string $content, string $type = 'ORDER'): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title'   => $title,
            'content' => $content,
            'type'    => $type,
            'is_read' => false,
            'created_at' => now(),
        ]);
    }

    // ─── Lấy danh sách notification của user ─────────────────────────────────
    public function listForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Notification::forUser($userId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    // ─── Đếm số chưa đọc ─────────────────────────────────────────────────────
    public function countUnread(int $userId): int
    {
        return Notification::forUser($userId)->unread()->count();
    }

    // ─── Đánh dấu 1 notification đã đọc ─────────────────────────────────────
    public function markAsRead(int $notificationId, int $userId): bool
    {
        return (bool) Notification::forUser($userId)
            ->where('id', $notificationId)
            ->update(['is_read' => true]);
    }

    // ─── Đánh dấu tất cả đã đọc ──────────────────────────────────────────────
    public function markAllAsRead(int $userId): int
    {
        return Notification::forUser($userId)
            ->unread()
            ->update(['is_read' => true]);
    }

    // ─── Hook: gọi khi rental status thay đổi ────────────────────────────────
    // Được gọi từ RentalService::update() sau khi save
    public function notifyRentalStatusChanged(int $userId, string $rentalCode, string $newStatus): void
    {
        $messages = [
            'APPROVED'   => ['Đơn thuê đã được duyệt',       "Đơn {$rentalCode} đã được xác nhận. Vui lòng đặt cọc để tiếp tục."],
            'DEPOSITED'  => ['Đặt cọc thành công',            "Đặt cọc cho đơn {$rentalCode} thành công. Chuẩn bị nhận hàng."],
            'PICKED_UP'  => ['Đơn thuê đang hoạt động',       "Đơn {$rentalCode} đã được giao. Chúc bạn sử dụng vui vẻ!"],
            'COMPLETED'  => ['Đơn thuê hoàn thành',           "Cảm ơn bạn đã trả hàng đúng hạn. Tiền cọc sẽ được hoàn trong 1-3 ngày."],
            'CANCELLED'  => ['Đơn thuê đã bị hủy',            "Đơn {$rentalCode} đã bị hủy. Liên hệ hỗ trợ nếu có thắc mắc."],
        ];

        if (!isset($messages[$newStatus])) return;

        [$title, $content] = $messages[$newStatus];

        $this->create($userId, $title, $content, 'ORDER');
    }
}
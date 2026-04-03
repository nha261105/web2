<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Services\Notification\NotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $service) {}

    /**
     * GET /api/notifications
     * Lấy danh sách notification của user đang đăng nhập
     */
    public function index(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $perPage  = (int) $request->query('per_page', 15);

        $result = $this->service->listForUser($authUser->id, $perPage);

        return ApiResponse::success(
            NotificationResource::collection($result)->resolve(),
            'Fetched successfully',
            200,
            [
                'total'        => $result->total(),
                'current_page' => $result->currentPage(),
                'per_page'     => $result->perPage(),
                'last_page'    => $result->lastPage(),
                'unread_count' => $this->service->countUnread($authUser->id),
            ]
        );
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Đánh dấu 1 notification đã đọc
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $updated  = $this->service->markAsRead($id, $authUser->id);

        if (!$updated) {
            return ApiResponse::error('Notification not found', 'NOT_FOUND', 404);
        }

        return ApiResponse::success([], 'Marked as read');
    }

    /**
     * PATCH /api/notifications/read-all
     * Đánh dấu tất cả đã đọc
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $count    = $this->service->markAllAsRead($authUser->id);

        return ApiResponse::success(
            ['updated_count' => $count],
            'All notifications marked as read'
        );
    }
}
import { useState, useEffect, useCallback } from "react";
import { Bell, Loader2, CheckCircle2 } from "lucide-react";
import { getNotifications, markAsRead, markAllRead } from "@/services/notificationService";
import toast from "react-hot-toast";

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications(1, 50); // Lấy 50 cái mới nhất
      if (res.success) {
        setNotifications(res.data ?? []);
        setUnreadCount(res.meta?.unread_count ?? 0);
      } else {
        toast.error("Không thể tải thông báo");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: number) => {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllRead();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("Đã đánh dấu tất cả là đã đọc");
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Trang */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Thông báo của tôi
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 h-9 px-4 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* Trạng thái Loading hoặc Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
            <p className="text-sm">Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
            <Bell className="w-10 h-10 text-gray-300" />
            <p className="text-sm">Bạn chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                className={`border rounded-xl p-4 transition-colors cursor-pointer ${
                  notif.is_read
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-blue-200 bg-blue-50/40 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notif.is_read ? "bg-transparent" : "bg-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <span className={`text-sm font-semibold ${notif.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notif.title}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(notif.created_at).toLocaleDateString("vi-VN", {
                           hour: '2-digit', minute:'2-digit'
                        })}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${notif.is_read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                      {notif.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
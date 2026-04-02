import { useState, useEffect } from "react";
import { Package, Eye, RotateCcw, Loader2 } from "lucide-react";
import { getMyRentals, type Rental } from "@/services/rentalService";
import toast from "react-hot-toast";

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED:  "bg-purple-50 text-purple-700 border-purple-200",
  DEPOSITED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PICKED_UP: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const FILTERS = [
  { id: "all",       label: "Tất cả" },
  { id: "PENDING",   label: "Chờ xác nhận" },
  { id: "PICKED_UP", label: "Ang thuê" },
  { id: "COMPLETED", label: "Hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" },
];

interface Props {
  initialRentals: Rental[];
  initialLoading: boolean;
}

export default function OrdersPage({ initialRentals, initialLoading }: Props) {
  const [activeFilter, setActiveFilter] = useState("all");

  // filtered* chỉ dùng khi đang filter — null = chưa filter, dùng initialRentals
  const [filteredRentals, setFilteredRentals] = useState<Rental[] | null>(null);
  const [filteredLoading, setFilteredLoading] = useState(false);

  // Data hiển thị: nếu đang ở filter cụ thể → dùng filteredRentals, còn lại → initialRentals
  const displayRentals = activeFilter === "all" ? initialRentals : (filteredRentals ?? []);
  const displayLoading = activeFilter === "all" ? initialLoading : filteredLoading;

  // Chỉ fetch khi đổi sang filter cụ thể (không fetch khi "all")
  useEffect(() => {
    if (activeFilter === "all") return;

    let cancelled = false;

    async function fetchFiltered() {
      setFilteredLoading(true);
      const res = await getMyRentals({ status: activeFilter });
      if (cancelled) return;
      if (res.success) {
        setFilteredRentals(res.data.items ?? []);
      } else {
        toast.error(res.message || "Không thể tải danh sách đơn thuê");
        setFilteredRentals([]);
      }
      setFilteredLoading(false);
    }

    fetchFiltered();
    return () => { cancelled = true; };
  }, [activeFilter]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === "all") {
      // Reset filtered state khi quay về all
      setFilteredRentals(null);
      setFilteredLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Lịch sử đơn thuê</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === f.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {displayLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="animate-spin text-[#0052CC] w-6 h-6" />
            <span className="text-sm">Ang tải dữ liệu...</span>
          </div>

        ) : displayRentals.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {activeFilter === "all"
                ? "Bạn chưa có đơn thuê nào"
                : "Không có đơn thuê nào với trạng thái này"}
            </p>
          </div>

        ) : (
          <div className="space-y-3">
            {displayRentals.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        #{order.code}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                          STATUS_STYLES[order.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Đặt ngày{" "}
                      {new Date(order.created_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.start_date).toLocaleDateString("vi-VN")}
                      {" → "}
                      {new Date(order.end_date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-gray-900">
                      {Number(order.total_price).toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Đặt cọc: {Number(order.deposit_amount).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>

                {order.note && (
                  <div className="text-xs text-gray-400 mb-3 italic">
                    Ghi chú: {order.note}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem chi tiết
                  </button>
                  {order.status === "COMPLETED" && (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 h-8 px-3 bg-blue-50 text-[#0052CC] rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Thuê lại
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <p className="text-sm font-medium text-[#0052CC] mb-1">💡 Mẹo thuê</p>
        <p className="text-sm text-gray-600">
          Cần gia hạn thuê? Liên hệ với chúng tôi trước ít nhất 24 giờ để
          kiểm tra tình trạng thiết bị.
        </p>
      </div>
    </div>
  );
}
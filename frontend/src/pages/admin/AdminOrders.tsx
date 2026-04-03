import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, AlertCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  completeReturnOrder,
  getAdminOrder,
  getAdminOrders,
  updateAdminOrder,
  type ReturnInspectionItem,
  type RentalOrder,
  AdminApiError,
} from "@/services/adminOrdersService";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-blue-50 text-blue-700",
  DEPOSITED: "bg-indigo-50 text-indigo-700",
  PICKED_UP: "bg-cyan-50 text-cyan-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Đã duyệt",
  DEPOSITED: "Đã đặt cọc",
  PICKED_UP: "Đang thuê",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  REFUNDED: "bg-red-50 text-red-700",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: "Đã thanh toán",
  PENDING: "Chờ thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string>("");
  const [inspectionMap, setInspectionMap] = useState<
    Record<
      number,
      {
        violation_type: "GOOD" | "DAMAGED" | "LOST";
        damage_percent: number;
        note: string;
      }
    >
  >({});

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminOrders(1, 20, statusFilter || undefined);
      setOrders(result.orders);
      setTotal(result.total);
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : "Không thể tải danh sách đơn thuê";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const setupInspectionMap = (order: RentalOrder) => {
    const next: Record<
      number,
      {
        violation_type: "GOOD" | "DAMAGED" | "LOST";
        damage_percent: number;
        note: string;
      }
    > = {};

    (order.details ?? []).forEach((detail) => {
      next[detail.id] = {
        violation_type: "GOOD",
        damage_percent: 0,
        note: "",
      };
    });

    setInspectionMap(next);
  };

  const openOrderDialog = async (orderId: number) => {
    try {
      setIsLoadingDetail(true);
      setError(null);
      const fullOrder = await getAdminOrder(orderId);
      setSelectedOrder(fullOrder);
      setNewStatus(fullOrder.status);
      setReturnDate(new Date().toISOString().slice(0, 10));
      setupInspectionMap(fullOrder);
      setIsDetailDialogOpen(true);
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : "Không thể tải chi tiết đơn thuê";
      setError(message);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const updateInspectionField = (
    detailId: number,
    field: "violation_type" | "damage_percent" | "note",
    value: string,
  ) => {
    setInspectionMap((prev) => {
      const current = prev[detailId] ?? {
        violation_type: "GOOD" as const,
        damage_percent: 0,
        note: "",
      };

      const next = { ...current };

      if (field === "violation_type") {
        next.violation_type = value as "GOOD" | "DAMAGED" | "LOST";
        if (next.violation_type !== "DAMAGED") {
          next.damage_percent = 0;
        }
      }

      if (field === "damage_percent") {
        const n = Number.parseFloat(value);
        next.damage_percent = Number.isNaN(n)
          ? 0
          : Math.max(0, Math.min(100, n));
      }

      if (field === "note") {
        next.note = value;
      }

      return {
        ...prev,
        [detailId]: next,
      };
    });
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      setSuccessMessage(null);

      if (newStatus === "COMPLETED") {
        if (!returnDate) {
          setError("Vui lòng nhập ngày trả hàng trước khi hoàn tất đơn.");
          return;
        }

        const details = selectedOrder.details ?? [];

        const payload: ReturnInspectionItem[] = details.map((detail) => {
          const inspection = inspectionMap[detail.id] ?? {
            violation_type: "GOOD" as const,
            damage_percent: 0,
            note: "",
          };

          return {
            rental_detail_id: detail.id,
            violation_type: inspection.violation_type,
            damage_percent:
              inspection.violation_type === "DAMAGED"
                ? inspection.damage_percent
                : 0,
            note: inspection.note,
          };
        });

        const result = await completeReturnOrder(
          selectedOrder.id,
          payload,
          returnDate,
        );
        const fmt = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        });

        setSuccessMessage(
          `Hoàn tất thành công. Phạt trễ: ${fmt.format(result.summary.late_fee_total)}, ` +
            `Phạt vi phạm: ${fmt.format(result.summary.condition_fee_total)}, ` +
            `Tổng phạt: ${fmt.format(result.summary.total_fine)}.` +
            (result.summary.force_lost_by_late
              ? " Đơn quá hạn trên 10 ngày nên được tính là mất."
              : ""),
        );
      } else {
        await updateAdminOrder(selectedOrder.id, {
          status: newStatus,
        });
      }

      setIsDetailDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus("");
      setReturnDate("");
      setInspectionMap({});
      await loadOrders();
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : "Cập nhật đơn hàng thất bại";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase().trim();
    const userName = String(
      order.user?.full_name ?? order.user?.name ?? "",
    ).toLowerCase();
    const orderId = String(order.id ?? "");
    const matchSearch =
      orderId.includes(keyword) ||
      userName.includes(keyword) ||
      (order.products?.some((p) =>
        String(p?.title ?? "")
          .toLowerCase()
          .includes(keyword),
      ) ??
        false);
    const matchStatus = statusFilter === "" || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const orderStats = [
    {
      label: "Tổng đơn",
      value: total,
      text: "text-black",
    },
    {
      label: "Chờ xác nhận",
      value: orders.filter((o) => o.status === "PENDING").length,
      text: "text-yellow-500",
    },
    {
      label: "Hoàn thành",
      value: orders.filter((o) => o.status === "COMPLETED").length,
      text: "text-green-500",
    },
    {
      label: "Đã hủy",
      value: orders.filter((o) => o.status === "CANCELLED").length,
      text: "text-red-500",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-gray-900">Đơn thuê</h1>
          <p className="text-gray-500 text-sm">{total} đơn</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-800 mt-1"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              {successMessage}
            </p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-green-700 hover:text-green-900 mt-1"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 p-5 rounded-xl"
          >
            <h1 className={`${stat.text} font-bold text-xl`}>{stat.value}</h1>
            <span className="text-gray-500 text-xs">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm đơn..."
            className="w-full h-9 pl-9 rounded-lg border border-gray-200 text-sm focus:border-[#0052CC] outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-sm appearance-none focus:border-[#0052CC] outline-none bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.keys(STATUS_STYLES).map((st) => (
              <option key={st} value={st}>
                {STATUS_LABELS[st] ?? st}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Đang tải đơn thuê...</p>
            </div>
          ) : (
            <>
              <table className="w-full min-w-245">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Mã đơn",
                      "Khách hàng",
                      "Thiết bị",
                      "Ngày bắt đầu",
                      "Ngày kết thúc",
                      "Số tiền",
                      "Thanh toán",
                      "Trạng thái",
                      "Thao tác",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="text-left px-5 py-3 text-xs font-medium text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm font-medium text-[#0052CC]">
                          #{order.id}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-900">
                          {order.user?.full_name ||
                            order.user?.name ||
                            "Không rõ"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {order.products
                            ?.map(
                              (p) => p?.name || p?.title || "Thiết bị không rõ",
                            )
                            .join(", ")
                            .substring(0, 30) || "Không có"}
                          {order.products && order.products.length > 1 && "..."}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {new Date(order.start_date).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {new Date(order.end_date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(
                            order.total_amount ?? order.total_price ?? 0,
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              PAYMENT_STATUS_STYLES[
                                order.payment_status || "PENDING"
                              ] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {PAYMENT_STATUS_LABELS[
                              order.payment_status || "PENDING"
                            ] ?? "Không xác định"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_STYLES[order.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => {
                              void openOrderDialog(order.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                            title="Cập nhật trạng thái"
                            disabled={isLoadingDetail}
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-12">
                        <p className="text-gray-400 text-sm">
                          Không tìm thấy đơn thuê
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Order Detail / Status Update Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn</DialogTitle>
            <DialogDescription>
              Đơn #{selectedOrder?.id} -{" "}
              {selectedOrder?.user?.full_name ?? selectedOrder?.user?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-gray-500">
                  Thông tin hiện tại
                </p>
                <div className="text-sm">
                  <p className="font-medium">
                    Thiết bị:{" "}
                    {selectedOrder.products
                      ?.map((p) => p.name || p.title)
                      .join(", ") || "Không có"}
                  </p>
                  <p className="text-gray-600">
                    Tổng tiền:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(
                      selectedOrder.total_amount ??
                        selectedOrder.total_price ??
                        0,
                    )}
                  </p>
                  <p className="text-gray-600">
                    Bắt đầu:{" "}
                    {new Date(selectedOrder.start_date).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                  <p className="text-gray-600">
                    Kết thúc:{" "}
                    {new Date(selectedOrder.end_date).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] bg-white"
                >
                  {Object.keys(STATUS_STYLES).map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status] ?? status}
                    </option>
                  ))}
                </select>
              </div>

              {newStatus === "COMPLETED" && (
                <div className="space-y-3 rounded-lg border border-gray-200 p-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Kiểm tra tình trạng khi trả hàng
                  </p>
                  <p className="text-xs text-gray-500">
                    Chọn tình trạng từng thiết bị. Nếu trễ 1-3 ngày tính 10%,
                    4-5 ngày 15%, 6-7 ngày 20%, 8-10 ngày 30%, trên 10 ngày tự
                    động tính mất.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700">
                        Ngày trả hàng (admin ghi nhận)
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2 text-xs"
                      />
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-end">
                      Số ngày trễ = ngày trả hàng - ngày cuối thuê. Với hư hỏng,
                      nhập thêm % hư hỏng để tính phí.
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {(selectedOrder.details ?? []).map((detail) => {
                      const value = inspectionMap[detail.id] ?? {
                        violation_type: "GOOD" as const,
                        damage_percent: 0,
                        note: "",
                      };

                      return (
                        <div
                          key={detail.id}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-lg border border-gray-100 p-3"
                        >
                          <div className="lg:col-span-4">
                            <p className="text-xs font-medium text-gray-800">
                              {detail.product?.name ??
                                detail.combo?.name ??
                                "Thiết bị thuê"}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              SL: {detail.quantity}
                            </p>
                          </div>

                          <div className="lg:col-span-3">
                            <select
                              value={value.violation_type}
                              onChange={(e) =>
                                updateInspectionField(
                                  detail.id,
                                  "violation_type",
                                  e.target.value,
                                )
                              }
                              className="w-full h-9 rounded-lg border border-gray-200 px-2 text-xs"
                            >
                              <option value="GOOD">Không vi phạm</option>
                              <option value="DAMAGED">Hư hỏng</option>
                              <option value="LOST">Mất mát</option>
                            </select>
                          </div>

                          <div className="lg:col-span-5">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={1}
                              value={value.damage_percent}
                              disabled={value.violation_type !== "DAMAGED"}
                              onChange={(e) =>
                                updateInspectionField(
                                  detail.id,
                                  "damage_percent",
                                  e.target.value,
                                )
                              }
                              className="w-full disabled:opacity-50"
                            />
                            <p className="text-[11px] text-gray-500 mt-1">
                              Hư hỏng:{" "}
                              {value.violation_type === "DAMAGED"
                                ? `${value.damage_percent}%`
                                : "Không áp dụng"}
                            </p>
                          </div>

                          <div className="lg:col-span-12">
                            <input
                              type="text"
                              value={value.note}
                              onChange={(e) =>
                                updateInspectionField(
                                  detail.id,
                                  "note",
                                  e.target.value,
                                )
                              }
                              className="w-full h-9 rounded-lg border border-gray-200 px-2 text-xs"
                              placeholder="Ghi chú"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={isUpdating}
              onClick={handleStatusUpdate}
              className="bg-[#0052CC] hover:bg-[#0747A6]"
            >
              {isUpdating
                ? "Đang cập nhật..."
                : newStatus === "COMPLETED"
                  ? "Hoàn tất trả hàng"
                  : "Cập nhật trạng thái"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

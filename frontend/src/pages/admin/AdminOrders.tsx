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
  getAdminOrders,
  updateAdminOrder,
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

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  REFUNDED: "bg-red-50 text-red-700",
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

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminOrders(1, 20, statusFilter || undefined);
      setOrders(result.orders);
      setTotal(result.total);
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to load orders";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      await updateAdminOrder(selectedOrder.id, {
        status: newStatus,
      });
      setIsDetailDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus("");
      await loadOrders();
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to update order";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase().trim();
    const userName = String(order.user?.name ?? "").toLowerCase();
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
      label: "Total Orders",
      value: total,
      text: "text-black",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "PENDING").length,
      text: "text-yellow-500",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "COMPLETED").length,
      text: "text-green-500",
    },
    {
      label: "Cancelled",
      value: orders.filter((o) => o.status === "CANCELLED").length,
      text: "text-red-500",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{total} orders</p>
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
              Dismiss
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
            placeholder="Search orders..."
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
            <option value="">All Status</option>
            {Object.keys(STATUS_STYLES).map((st) => (
              <option key={st} value={st}>
                {st}
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
              <p className="text-gray-400 text-sm">Loading orders...</p>
            </div>
          ) : (
            <>
              <table className="w-full min-w-245">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Products",
                      "Start Date",
                      "End Date",
                      "Amount",
                      "Payment",
                      "Status",
                      "Action",
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
                            "Unknown"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {order.products
                            ?.map(
                              (p) => p?.name || p?.title || "Unknown product",
                            )
                            .join(", ")
                            .substring(0, 30) || "N/A"}
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
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(
                            order.total_amount ??
                            order.total_price ??
                            0
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
                            {order.payment_status || "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_STYLES[order.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                              setIsDetailDialogOpen(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                            title="Update order status"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-12">
                        <p className="text-gray-400 text-sm">No orders found</p>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id} - {selectedOrder?.user?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-gray-500">
                  Current Info
                </p>
                <div className="text-sm">
                  <p className="font-medium">
                    Products:{" "}
                    {selectedOrder.products
                      ?.map((p) => p.name || p.title)
                      .join(", ") || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Tổng tiền:{" "}
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(
                      selectedOrder.total_amount ??
                      selectedOrder.total_price ??
                      0
                    )}
                  </p>
                  <p className="text-gray-600">
                    Start:{" "}
                    {new Date(selectedOrder.start_date).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                  <p className="text-gray-600">
                    End:{" "}
                    {new Date(selectedOrder.end_date).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] bg-white"
                >
                  {Object.keys(STATUS_STYLES).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isUpdating}
              onClick={handleStatusUpdate}
              className="bg-[#0052CC] hover:bg-[#0747A6]"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

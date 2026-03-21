import { useState } from "react";

import { Download, Search, ChevronDown, Eye } from "lucide-react";

import { RECENT_ORDERS, STATUS_STYLES } from "./admindata";
import { ORDER_CARD } from "./admindata";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
  const [orders] = useState(RECENT_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase().trim();
    const matchSearch =
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword) ||
      order.product.toLowerCase().includes(keyword);
    const matchStatus = statusFilter === "" || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} orders</p>
        </div>
        {/* EXPORT CSV */}
        <Button
          variant={"secondary"}
          className="bg-white border border-gray-300 cursor-pointer"
        >
          <i>
            <Download />
          </i>
          <span>Export CSV</span>
        </Button>
      </div>

      {/* START CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ORDER_CARD.map((order) => (
          <div
            key={order.label}
            className="bg-white border border-gray-200 p-5 rounded-xl"
          >
            <h1 className={`${order.text} font-bold text-xl`}>{order.value}</h1>
            <span className="text-gray-500 text-xs">{order.label}</span>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
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
            onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Days",
                  "Amount",
                  "Payment",
                  "Status",
                  "Date",
                  "",
                ].map((heading) => (
                  <th
                    key={heading || "actions"}
                    className="text-left px-5 py-3 text-xs font-medium text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3 text-sm font-medium text-[#0052CC]">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {order.product}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {order.days ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    ${order.amount}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-50 text-green-700"
                          : order.paymentStatus === "Refunded"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus ?? "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      aria-label={`View ${order.id} details`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

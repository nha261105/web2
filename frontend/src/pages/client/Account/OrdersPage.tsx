import { useState } from "react";
import { Package, Eye, RotateCcw } from "lucide-react";

const ORDERS = [
  {
    id: "ORD-001",
    date: "2026-02-10",
    items: 3,
    total: 312,
    status: "Delivered",
    products: ['MacBook Pro 16"', "Sony Camera", "Tripod"],
  },
  {
    id: "ORD-002",
    date: "2026-02-15",
    items: 1,
    total: 125,
    status: "Active",
    products: ["DJI Mavic 3 Pro"],
  },
  {
    id: "ORD-003",
    date: "2026-02-20",
    items: 2,
    total: 84,
    status: "Pending",
    products: ["iPad Pro", "Apple Pencil"],
  },
  {
    id: "ORD-004",
    date: "2026-01-28",
    items: 1,
    total: 45,
    status: "Delivered",
    products: ["Meta Quest 3"],
  },
  {
    id: "ORD-005",
    date: "2026-01-15",
    items: 4,
    total: 478,
    status: "Delivered",
    products: ["Sony FX3", "Lens Kit", "Tripod", "Microphone"],
  },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Orders" },
    { id: "active", label: "Active" },
    { id: "delivered", label: "Delivered" },
    { id: "pending", label: "Pending" },
  ];

  const filtered =
    activeFilter === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.status.toLowerCase() === activeFilter);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">My Orders</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
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

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Placed on{" "}
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-gray-900">
                      ${order.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items} item{order.items > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  {order.products.join(" · ")}
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                  {order.status === "Delivered" && (
                    <button className="flex items-center gap-1.5 h-8 px-3 bg-blue-50 text-[#0052CC] rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Rent Again
                    </button>
                  )}
                  {order.status === "Active" && (
                    <button className="flex items-center gap-1.5 h-8 px-3 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors">
                      Extend Rental
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rental tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <p className="text-sm font-medium text-[#0052CC] mb-1">💡 Rental Tip</p>
        <p className="text-sm text-gray-600">
          Need to extend a rental? Contact us at least 24 hours before your
          return date to check availability.
        </p>
      </div>
    </div>
  );
}

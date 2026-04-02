import { useEffect, useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import {
  getAdminDashboard,
  AdminDashboardApiError,
  type DashboardPayload,
} from "@/services/adminDashboardService";

interface Metric {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
}

export default function AdminReports() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminDashboard();
      setData(result);

      // Transform cards for display
      const dashboardMetrics = result.cards;
      const displayMetrics: Metric[] = [
        {
          label: "Total Orders",
          value: dashboardMetrics.total_orders || 0,
          change: "Live order count",
          up: true,
        },
        {
          label: "Active Products",
          value: dashboardMetrics.active_products || 0,
          change: "Products ready for rent",
          up: true,
        },
        {
          label: "Total Revenue",
          value: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(dashboardMetrics.total_revenue || 0),
          change: "Total confirmed revenue",
          up: true,
        },
        {
          label: "New Users",
          value: dashboardMetrics.new_users || 0,
          change: "Recently joined",
          up: true,
        },
      ];
      setMetrics(displayMetrics);
    } catch (err) {
      const message =
        err instanceof AdminDashboardApiError ? err.message : "Failed to load reports";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const revenueTrends = data
    ? data.revenue_overview.map(r => ({ month: r.month, amount: Number(r.revenue) }))
    : [];
  const categoryData = data
    ? data.rental_by_category.map(c => ({ category_name: c.category, rental_count: Number(c.rentals) }))
    : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bold text-xl text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm">
          Performance overview for your rental business
        </p>
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

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      )}

      {/* Metrics Grid */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white rounded-xl border border-gray-200 px-5 py-4"
              >
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p
                  className={`text-xs mt-1 font-medium ${metric.up ? "text-green-600" : "text-red-500"}`}
                >
                  {metric.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Revenue Trend */}
            <section className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-sm text-gray-800">
                Revenue Trend (Last 6 Months)
              </h2>
              <div className="mt-4 h-64 flex flex-col justify-end items-end gap-2">
                <div className="w-full h-full flex items-end justify-between gap-1">
                  {revenueTrends.map((data) => {
                    const maxAmount = Math.max(
                      ...revenueTrends.map((d) => d.amount),
                    );
                    const height = (data.amount / maxAmount) * 100;
                    return (
                      <div
                        key={data.month}
                        className="flex-1 bg-linear-to-t from-blue-500 to-blue-400 rounded-t-lg hover:opacity-80 transition-opacity group relative"
                        style={{ height: `${Math.max(height, 10)}%` }}
                        title={`${data.month}: $${data.amount.toLocaleString()}`}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded shadow-sm border border-gray-200">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              maximumFractionDigits: 0,
                              notation: "compact",
                            }).format(data.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex justify-between text-xs text-gray-500 mt-2">
                  {revenueTrends.map((data) => (
                    <span key={data.month}>{data.month}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Rentals by Category */}
            <section className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-sm text-gray-800">
                Rentals by Category
              </h2>
              <div className="mt-4">
                <div className="space-y-3">
                  {categoryData.map((cat) => {
                    const totalRentals = data?.cards.total_orders || 1;
                    const percentage = (
                      (cat.rental_count / totalRentals) *
                      100
                    ).toFixed(1);
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-pink-500",
                    ];
                    const colorClass =
                      colors[categoryData.indexOf(cat) % colors.length];

                    return (
                      <div key={cat.category_name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {cat.category_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {cat.rental_count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Summary Stats */}
          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-4">
              Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.cards?.total_orders || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Active Products</p>
                <p className="text-2xl font-bold text-orange-600">
                  {data?.cards?.active_products || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Average Order Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data?.cards?.total_orders
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(Math.round((data.cards.total_revenue || 0) / data.cards.total_orders))
                    : 0}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

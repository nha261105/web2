import { useEffect, useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import {
  getAdminReports,
  generateRevenueData,
  generateCategoryData,
  AdminApiError,
  type AdminReportsData,
} from "../../services/adminReportsService";

interface Metric {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
}

export default function AdminReports() {
  const [data, setData] = useState<AdminReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminReports();
      setData(result);

      // Transform metrics for display
      const dashboardMetrics = result.metrics || {};
      const displayMetrics: Metric[] = [
        {
          label: "Total Users",
          value: dashboardMetrics.total_users || 0,
          change: `+${dashboardMetrics.users_this_month || 0} this month`,
          up: true,
        },
        {
          label: "Total Products",
          value: dashboardMetrics.total_products || 0,
          change: "stable",
          up: true,
        },
        {
          label: "Total Revenue",
          value: `$${(dashboardMetrics.total_revenue || 0).toLocaleString()}`,
          change: `+${(dashboardMetrics.revenue_this_month || 0).toLocaleString()} this month`,
          up: true,
        },
        {
          label: "Active Rentals",
          value: dashboardMetrics.active_rentals || 0,
          change: `vs ${dashboardMetrics.pending_rentals || 0} pending`,
          up:
            dashboardMetrics.active_rentals! >=
            (dashboardMetrics.pending_rentals || 0),
        },
      ];
      setMetrics(displayMetrics);
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to load reports";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const revenueTrends = data
    ? generateRevenueData(data.metrics?.total_revenue || 0)
    : [];
  const categoryData = data
    ? generateCategoryData(data.metrics?.total_rentals || 0)
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
                        <div className="absolute -top-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            ${data.amount.toLocaleString()}
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
                    const totalRentals = data?.metrics?.total_rentals || 1;
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
                <p className="text-gray-500">Total Rentals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.metrics?.total_rentals || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Pending Rentals</p>
                <p className="text-2xl font-bold text-orange-600">
                  {data?.metrics?.pending_rentals || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Average Rental Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  $
                  {data?.metrics?.total_rentals
                    ? Math.round(
                        (data.metrics.total_revenue || 0) /
                          data.metrics.total_rentals,
                      ).toLocaleString()
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

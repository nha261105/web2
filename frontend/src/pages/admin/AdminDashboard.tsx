import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  CartesianGrid as RechartsCartesianGrid,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  AdminDashboardApiError,
  getAdminDashboard,
  type DashboardPayload,
} from "@/services/adminDashboardService";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-blue-50 text-blue-700",
  DEPOSITED: "bg-indigo-50 text-indigo-700",
  PICKED_UP: "bg-cyan-50 text-cyan-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatMonth = (value: string) => {
  const month = Number(value.split("-")[1] ?? 0);
  return month ? `T${month}` : value;
};

const truncateLabel = (value: string, size = 12) =>
  value.length > size ? `${value.slice(0, size)}...` : value;

const emptyData: DashboardPayload = {
  cards: {
    total_revenue: 0,
    total_orders: 0,
    active_products: 0,
    new_users: 0,
  },
  revenue_overview: [],
  rental_by_category: [],
  recent_orders: [],
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#0052CC",
  },
} satisfies ChartConfig;

const categoryChartConfig = {
  rentals: {
    label: "Rentals",
    color: "#0052CC",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboard, setDashboard] = useState<DashboardPayload>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const payload = await getAdminDashboard();
        setDashboard(payload);
      } catch (err: unknown) {
        if (err instanceof AdminDashboardApiError && err.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true, state: { from: location } });
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load dashboard";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, [location, navigate]);

  const metrics = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: formatCurrency(dashboard.cards.total_revenue),
        change: "Live",
        up: true,
        icon: DollarSign,
        color: "bg-blue-50 text-[#0052CC]",
      },
      {
        label: "Total Orders",
        value: dashboard.cards.total_orders.toString(),
        change: "Live",
        up: true,
        icon: ShoppingBag,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Active Products",
        value: dashboard.cards.active_products.toString(),
        change: "Live",
        up: true,
        icon: Package,
        color: "bg-orange-50 text-[#FF6A00]",
      },
      {
        label: "New Users (30d)",
        value: dashboard.cards.new_users.toString(),
        change: "Live",
        up: true,
        icon: Users,
        color: "bg-purple-50 text-purple-600",
      },
    ],
    [dashboard.cards],
  );

  const revenueChartData = useMemo(
    () =>
      dashboard.revenue_overview.map((item) => ({
        ...item,
        revenue: Number(item.revenue ?? 0),
      })),
    [dashboard.revenue_overview],
  );

  const categoryChartData = useMemo(
    () =>
      dashboard.rental_by_category.map((item) => ({
        ...item,
        rentals: Number(item.rentals ?? 0),
      })),
    [dashboard.rental_by_category],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-xl">Dashboard</h2>
        <span className="text-muted-foreground text-sm">
          {isLoading ? "Loading dashboard data..." : "Live data from database"}
        </span>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
      {/* START CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={`${metric.label}-${index}`}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.color.split(" ")[0]}`}
              >
                <metric.icon
                  className={`w-5 h-5 ${metric.color.split(" ")[1]}`}
                />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${metric.up ? "text-green-600" : "text-red-500"}`}
              >
                {metric.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl mb-1">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* REVENUE OVERVIEW & RENTAL BY CATEGORY */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex mb-6 justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold">Revenue Overview</h3>
              <span className="text-sm text-muted-foreground">
                Monthly revenue trend
              </span>
            </div>
            <div className="px-3 py-1 rounded-2xl flex items-center gap-2 bg-green-50 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-nowrap text-xs">Live updates</span>
            </div>
          </div>
          {dashboard.revenue_overview.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No monthly data yet
            </p>
          ) : (
            <ChartContainer config={revenueChartConfig} className="h-80">
              <RechartsAreaChart
                accessibilityLayer
                data={revenueChartData}
                margin={{
                  left: 8,
                  right: 8,
                  top: 12,
                }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>
                <RechartsCartesianGrid vertical={false} />
                <RechartsXAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatMonth(String(value))}
                />
                <RechartsYAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(label) =>
                        `Tháng ${formatMonth(String(label))}`
                      }
                      valueFormatter={(value) =>
                        formatCurrency(Number(value ?? 0))
                      }
                    />
                  }
                />
                <RechartsArea
                  dataKey="revenue"
                  type="natural"
                  fill="url(#revenueFill)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2.5}
                />
              </RechartsAreaChart>
            </ChartContainer>
          )}
        </div>

        {/* RENTAL CATEGORY */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex mb-6 justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold">Rental by Category</h3>
              <span className="text-sm text-muted-foreground">
                Top performing categories
              </span>
            </div>
          </div>

          {dashboard.rental_by_category.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No category data yet
            </p>
          ) : (
            <ChartContainer config={categoryChartConfig} className="h-80">
              <RechartsBarChart
                accessibilityLayer
                data={categoryChartData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 8,
                  top: 8,
                  bottom: 8,
                }}
              >
                <RechartsXAxis type="number" dataKey="rentals" hide />
                <RechartsYAxis
                  dataKey="category"
                  type="category"
                  width={110}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => truncateLabel(String(value), 11)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      valueFormatter={(value) =>
                        `${Number(value ?? 0).toLocaleString("vi-VN")} lượt`
                      }
                    />
                  }
                />
                <RechartsBar
                  dataKey="rentals"
                  fill="var(--color-rentals)"
                  radius={5}
                />
              </RechartsBarChart>
            </ChartContainer>
          )}

          {categoryChartData.length > 0 && (
            <div className="mt-3 space-y-1.5 text-xs text-gray-500">
              {categoryChartData.map((item) => (
                <p key={item.category}>
                  <span className="font-semibold text-gray-700">
                    {truncateLabel(item.category, 14)}
                  </span>{" "}
                  • {formatCompactCurrency(item.revenue)}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE RECENT ORDERS */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="text-xs text-[#0052CC] hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Amount",
                  "Status",
                  "Date",
                ].map((h, index) => (
                  <th
                    key={`${h}-${index}`}
                    className="text-left px-5 py-3 text-xs font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.recent_orders.map((order, i) => (
                <tr
                  key={`${order.id}-${i}`}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
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
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {order.date ?? "-"}
                  </td>
                </tr>
              ))}
              {!isLoading && dashboard.recent_orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-4 text-sm text-center text-gray-500"
                  >
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

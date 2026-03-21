import { METRICS } from "./admindata";

export default function AdminReports() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bold text-xl text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm">
          Performance overview for the last 6 months
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl border border-gray-200 px-5 py-4"
          >
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
            <p
              className={`text-xs mt-1 font-medium ${metric.up ? "text-green-600" : "text-red-500"}`}
            >
              {metric.change} vs last period
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-sm text-gray-800">Revenue Trend</h2>
          <div className="mt-3 h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <p className="text-sm text-gray-400">
              Chart placeholder (line chart)
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-sm text-gray-800">
            Rentals by Category
          </h2>
          <div className="mt-3 h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <p className="text-sm text-gray-400">
              Chart placeholder (pie chart)
            </p>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-sm text-gray-800">
          Monthly Orders & Customers
        </h2>
        <div className="mt-3 h-72 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
          <p className="text-sm text-gray-400">
            Chart placeholder (bar/combined chart)
          </p>
        </div>
      </section>
    </div>
  );
}

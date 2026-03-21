import { METRICS,RECENT_ORDERS,STATUS_STYLES } from "./admindata.ts";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-xl">Dashboard</h2>
        <span className="text-muted-foreground text-sm">
          Welcome back!Here's what's happening day
        </span>
      </div>
      {/* START CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
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
        <div className=" bg-white rounded-xl p-5 border  border-gray-200">
          <div className="flex mb-2 justify-between items-start">
            <div>
              <h3 className="text-xm">Revenue Overview</h3>
              <span className="text-sm text-muted-foreground">
                Monthly revenue & orders
              </span>
            </div>
            <div className="px-3 py-1 rounded-2xl flex items-center gap-2 bg-green-50 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-nowrap text-xs">18.2 % this month</span>
            </div>
          </div>
          {/* CHART */}
          <div className="">Chart Here</div>
        </div>

        {/* RENTAL CATEGORY */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex mb-2 justify-between items-start">
            <div>
              <h3 className="text-xm">Rental by Category</h3>
              <span className="text-sm text-muted-foreground">
                Top performing categories
              </span>
            </div>
          </div>

          <div>Char Here</div>
        </div>
      </div>

      {/* TABLE RECENT ORDERS */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs text-[#0052CC] hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, i) => (
                <tr key={order.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-5 py-3 text-sm font-medium text-[#0052CC]">{order.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-900">{order.customer}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{order.product}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">${order.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

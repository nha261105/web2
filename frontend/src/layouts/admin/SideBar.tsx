import {
  LayoutDashboard, Factory, Box, ShoppingBag,
  Tag, Users, ChartColumn, Settings, LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signout } from "@/services/usersService";
export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();

  // ─── Lấy thông tin admin từ localStorage ─────────────────────────────────
  const authUser = (() => {
    try {
      const saved = localStorage.getItem("auth_user");
      return (saved && saved !== "undefined") ? JSON.parse(saved) : null;
    } catch { return null; }
  })();

  const listFunction = [
    { id: 1, label: "Dashboard", icons: <LayoutDashboard color="#ffffff" />, address: "/admin", exact: true },
    { id: 2, label: "Products", icons: <Box color="#ffffff" />, address: "/admin/products" },
    { id: 3, label: "Orders", icons: <ShoppingBag color="#ffffff" />, address: "/admin/orders" },
    { id: 4, label: "Categories", icons: <Tag color="#ffffff" />, address: "/admin/categories" },
    { id: 5, label: "Users", icons: <Users color="#ffffff" />, address: "/admin/users" },
    { id: 6, label: "Reports", icons: <ChartColumn color="#ffffff" />, address: "/admin/reports" },
    { id: 7, label: "Settings", icons: <Settings color="#ffffff" />, address: "/admin/settings" },
  ];

  const isActive = (address: string, exact?: boolean) => {
    if (exact) return location.pathname === address;
    return location.pathname.startsWith(address);
  };

  const handleLogout = async () => {
    await signout();
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="flex flex-col bg-[#171E2C] w-62 min-h-screen">
      {/* Header */}
      <div className="flex gap-3 items-center justify-start border-b border-b-gray-700 p-5">
        <Factory size={30} color="#1251e5" strokeWidth={2} />
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold text-white hidden sm:block">RentalEM</span>
          <span className="text-sm text-gray-400 italic">admin panel</span>
        </div>
      </div>

      {/* Nav list */}
      <div className="flex-1 p-2">
        <nav className="space-y-1">
          {listFunction.map((item) => (
            <Link
              key={item.address}
              to={item.address}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.address, item.exact)
                  ? "bg-[#0052CC] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
            >
              {item.icons}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer — admin info + logout */}
      <div className="border-t border-t-gray-700 p-3">
        <div className="flex items-center gap-3">
          {/* Avatar initials */}
          <div className="w-9 h-9 rounded-xl bg-[#0052CC] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {authUser?.full_name
              ? authUser.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
              : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {authUser?.full_name ?? "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {authUser?.email ?? "admin"}
            </p>
          </div>
          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
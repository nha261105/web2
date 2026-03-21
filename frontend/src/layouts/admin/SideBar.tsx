import {
  LayoutDashboard,
  Factory,
  Box,
  ShoppingBag,
  Tag,
  Users,
  ChartColumn,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export default function SideBar() {
  const location = useLocation();
  const listFunction = [
    {
      id: 1,
      label: "Dashboard",
      icons: <LayoutDashboard color="#ffffff" />,
      address: "/admin",
      exact: true,
    },
    {
      id: 2,
      label: "Products",
      icons: <Box color="#ffffff" />,
      address: "/admin/products",
    },
    {
      id: 3,
      label: "Orders",
      icons: <ShoppingBag color="#ffffff" />,
      address: "/admin/orders",
    },
    {
      id: 4,
      label: "Categories",
      icons: <Tag color="#ffffff" />,
      address: "/admin/categories",
    },
    {
      id: 5,
      label: "Users",
      icons: <Users color="#ffffff" />,
      address: "/admin/users",
    },
    {
      id: 6,
      label: "Reports",
      icons: <ChartColumn color="#ffffff" />,
      address: "/admin/reports",
    },
    {
      id: 7,
      label: "Settings",
      icons: <Settings color="#ffffff" />,
      address: "/admin/settings",
    },
  ];

  const isActive = (address: string, exact?: boolean) => {
    if (exact) return location.pathname === address;
    return location.pathname.startsWith(address);
  };
  return (
    <div className="flex flex-col bg-[#171E2C]  w-62">
      {/* TopBar: Header,List function  */}
      {/* HEADER */}
      <div className="flex gap-3 items-center justify-start border-b border-b-gray-400 p-5">
        <Factory size={30} color="#1251e5" strokeWidth={2} />
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold text-white hidden sm:block">
            RentalEM
          </span>
          <span className="text-sm text-gray-400 italic">admin panel</span>
        </div>
      </div>

      {/* LIST FUNCTION: DASHBOARD, PRODUCT,ORDER,CATEGORIES,USERS,REPORTS,SETTING */}
      <div className="h-full p-2">
        <nav className="space-y-2">
          {listFunction.map((item) => (
            <Link
              key={item.address}
              to={item.address}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.address, item.exact) ? "bg-[#0052CC] text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
            >
              {item.icons}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* FOOTER: ICON, LABEL , LOGOUT */}
      <div className="flex gap-3 items-center justify-start border-t border-t-gray-400 p-2">
        <Factory size={30} color="#1251e5" strokeWidth={2} />
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-bold text-white hidden sm:block">
            Admin User
          </span>
          <span className="text-sm text-gray-400 italic">admin</span>
        </div>
        <div className="ml-5">
          <Link to={"/login"}>
            <LogOut color="#ffffff"/>
          </Link>
        </div>
      </div>
    </div>
  );
}

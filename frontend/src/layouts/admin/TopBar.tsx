import { Bell, MoveLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function TopBar() {
  const location = useLocation();
  const pathname = location.pathname.slice(6);
  const label: Map<string, string> = new Map();
  label.set("/products", "Products");
  label.set("/orders", "Orders");
  label.set("/categories", "Categories");
  label.set("/users", "Users");
  label.set("/reports", "Reports");
  label.set("/settings", "Settings");

  return (
    <div className="h-16 shadow-md px-6 flex items-center justify-between w-full">
      <div className="flex items-center gap-3 flex-row">
        <Link
          to={"/admin"}
          className="text-muted-foreground hover:text-blue-600 transition-colors"
        >
          Admin
        </Link>

        {pathname !== "" && (
          <div className="flex items-center gap-2">
            <ChevronRight size={16} />
            <span>{label.get(pathname) || pathname}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 flex-row">
        <Bell
          color="#6c6a6a"
          className="cursor-pointer hover:text-blue-600 transition-colors"
        />
        <Link
          to={"/"}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MoveLeft size={16} strokeWidth={1.5} />
          <span className="text-[13px]">View Store</span>
        </Link>
      </div>
    </div>
  );
}

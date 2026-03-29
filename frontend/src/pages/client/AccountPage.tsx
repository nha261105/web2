import { MyButton } from "@/components/ui/input/my-button";
import MyNavigateLink from "@/components/ui/my-navigate-link";
import { LogOut, Package, Settings, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfilePage from "./Account/ProfilePage";
import SettingsPage from "./Account/SettingsPage";
import OrdersPage from "./Account/OrdersPage";

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const getAccountPageFromTab = (tab: string | null) => {
    switch (tab) {
      case "orders":
        return "My Orders";
      case "settings":
        return "Settings";
      default:
        return "Profile";
    }
  };

  const getTabFromLabel = (label: string) => {
    switch (label) {
      case "My Orders":
        return "orders";
      case "Settings":
        return "settings";
      default:
        return "profile";
    }
  };

  const [isLogin, setIsLogin] = useState(false);
  const accountPage = useMemo(
    () => getAccountPageFromTab(tabParam),
    [tabParam],
  );
  const navigate = useNavigate();
  const NAV_ITEMS = [
    { label: "Profile", icon: User, exact: true },
    { label: "My Orders", icon: Package },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full bg-gray-50 flex flex-col items-center px-6 py-6">
      <div className="w-full max-w-250 flex flex-col gap-5">
        <MyNavigateLink
          items={[{ text: "Home", link: "/" }, { text: "My Account" }]}
        />
        {!isLogin && (
          <div className="min-h-[50vh] flex flex-col justify-center items-center gap-3">
            <div className="text-base font-semibold text-gray-500">
              Vui lòng đăng nhập tài khoản.
            </div>
            {/* <MyButton
              text="Đăng nhập"
              classname="w-fit px-3"
              src="/signin"
              onClick={() => {}}
          /> */}
            <MyButton
              text="Test"
              classname="w-fit px-3"
              onClick={() => {
                setIsLogin(true);
              }}
            />
          </div>
        )}
        {isLogin && (
          <div className="flex flex-row w-full gap-3">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 hidden sm:block">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* User info */}
                <div className="p-5 border-b border-gray-100 bg-linear-to-br from-[#0052CC] to-[#0747A6]">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm">Demo User</p>
                  <p className="text-blue-200 text-xs truncate">
                    user@email.com
                  </p>
                </div>

                {/* Nav */}
                <nav className="p-2 flex-col gap-3">
                  {NAV_ITEMS.map((item, index) => (
                    <button
                      key={index}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full ${
                        item.label === accountPage
                          ? "bg-blue-50 text-[#0052CC]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => {
                        navigate(`/account?tab=${getTabFromLabel(item.label)}`);
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setIsLogin(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Navigation */}
              <div className="sm:hidden flex gap-1 mb-3 bg-white rounded-xl border border-gray-200 p-1">
                {NAV_ITEMS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      navigate(`/account?tab=${getTabFromLabel(item.label)}`)
                    }
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      item.label === accountPage
                        ? "bg-[#0052CC] text-white"
                        : "text-gray-500"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              {accountPage === "Profile" && <ProfilePage />}
              {accountPage === "My Orders" && <OrdersPage />}
              {accountPage === "Settings" && <SettingsPage />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
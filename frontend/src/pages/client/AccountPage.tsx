import MyNavigateLink from "@/components/ui/my-navigate-link";
import { checkToken } from "@/services/userTokensService";
import { getMe, signout } from "@/services/usersService";
import { LogOut, MapPin, Package, Settings, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfilePage from "./Account/ProfilePage";
import SettingsPage from "./Account/SettingsPage";
import OrdersPage from "./Account/OrdersPage";
import AddressPage from "./Account/AddressPage";

interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const navigate = useNavigate();

  // ─── Auth state thật ────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("auth_user");
      if (saved && saved !== "undefined") {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Lỗi khi đọc data từ localStorage:", error);
    }
    return null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);
  useEffect(() => {
    async function checkAuth() {
      const tokenRes = await checkToken();
      if (!tokenRes.success) {
        setIsLoggedIn(false);
        return;
      }
      const meRes = await getMe();
      if (meRes.success) {
        setAuthUser(meRes.data.user);
        setIsLoggedIn(true);
        localStorage.setItem("auth_user", JSON.stringify(meRes.data.user));
      } else {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  // ─── Tab logic ──────────────────────────────────────────────────────────────
  const getAccountPageFromTab = (tab: string | null) => {
    switch (tab) {
      case "orders":    return "My Orders";
      case "settings":  return "Settings";
      case "addresses": return "Addresses";
      default:          return "Profile";
    }
  };

  const getTabFromLabel = (label: string) => {
    switch (label) {
      case "My Orders":  return "orders";
      case "Settings":   return "settings";
      case "Addresses":  return "addresses";
      default:           return "profile";
    }
  };

  const accountPage = useMemo(() => getAccountPageFromTab(tabParam), [tabParam]);

  const NAV_ITEMS = [
    { label: "Profile",   icon: User },
    { label: "Addresses", icon: MapPin },
    { label: "My Orders", icon: Package },
    { label: "Settings",  icon: Settings },
  ];

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signout();
    localStorage.removeItem("auth_user");
    setIsLoggedIn(false);
    setAuthUser(null);
    navigate("/");
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col items-center px-6 py-6">
      <div className="w-full max-w-250 flex flex-col gap-5">
        <MyNavigateLink
          items={[{ text: "Home", link: "/" }, { text: "My Account" }]}
        />

        {/* Chưa đăng nhập */}
        {!isLoggedIn && (
          <div className="min-h-[50vh] flex flex-col justify-center items-center gap-3">
            <div className="text-base font-semibold text-gray-500">
              Vui lòng đăng nhập tài khoản.
            </div>
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        )}

        {/* Đã đăng nhập */}
        {isLoggedIn && authUser && (
          <div className="flex flex-row w-full gap-3">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 hidden sm:block">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* User info */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-[#0052CC] to-[#0747A6]">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm truncate">
                    {authUser?.full_name ?? "—"}
                  </p>
                  <p className="text-blue-200 text-xs truncate">
                    {authUser?.email ?? "—"}
                  </p>
                </div>

                {/* Nav */}
                <nav className="p-2">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full ${
                        item.label === accountPage
                          ? "bg-blue-50 text-[#0052CC]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() =>
                        navigate(`/account?tab=${getTabFromLabel(item.label)}`)
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}

                  <button
                    onClick={handleLogout}
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
              {/* Mobile tab bar */}
              <div className="sm:hidden flex gap-1 mb-3 bg-white rounded-xl border border-gray-200 p-1 overflow-x-auto">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      navigate(`/account?tab=${getTabFromLabel(item.label)}`)
                    }
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap px-2 ${
                      item.label === accountPage
                        ? "bg-[#0052CC] text-white"
                        : "text-gray-500"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className={accountPage === "Profile" ? "block" : "hidden"}>
                <ProfilePage user={authUser} />
              </div>
              
              <div className={accountPage === "Addresses" ? "block" : "hidden"}>
                <AddressPage userId={authUser!.id} />
              </div>
              
              <div className={accountPage === "My Orders" ? "block" : "hidden"}>
                <OrdersPage />
              </div>
              
              <div className={accountPage === "Settings" ? "block" : "hidden"}>
                <SettingsPage />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
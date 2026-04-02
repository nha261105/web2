import MyNavigateLink from "@/components/ui/my-navigate-link";
import { checkToken } from "@/services/userTokensService";
import { getMe, signout } from "@/services/usersService";
import { getMyRentals, type Rental } from "@/services/rentalService";
import { LogOut, MapPin, Package, Settings, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfilePage from "./Account/ProfilePage";
import SettingsPage from "./Account/SettingsPage";
import OrdersPage from "./Account/OrdersPage";
import AddressPage from "./Account/AddressPage";
import { toast } from "react-hot-toast";

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

  // ─── Auth state ───────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("auth_user");
      if (saved && saved !== "undefined") return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);

  // ─── Preloaded rentals ────────────────────────────────────────────────────
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const tokenRes = await checkToken();
      if (!tokenRes.success) {
        setIsLoggedIn(false);
        setRentalsLoading(false);
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
        return;
      }

      const [meRes, rentalsRes] = await Promise.all([
        getMe(),
        getMyRentals(),
      ]);

      if (meRes.success) {
        const user = meRes.data.user;

        if (user.status !== 'ACTIVE') {
          toast.error("Tài khoản của bạn đã bị khóa. Vui lòng đăng nhập lại.");
          await signout();
          localStorage.removeItem("token");
          localStorage.removeItem("auth_user");
          setIsLoggedIn(false);
          setAuthUser(null);
          navigate("/signin");
          return;
        }

        setAuthUser(user);
        setIsLoggedIn(true);
        localStorage.setItem("auth_user", JSON.stringify(user));
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
      }

      if (rentalsRes.success) {
        setRentals(rentalsRes.data.items ?? []);
      }

      setRentalsLoading(false);
    }
    init();
  }, [navigate]);

  // ─── Tab logic ────────────────────────────────────────────────────────────
  const getAccountPageFromTab = (tab: string | null) => {
    switch (tab) {
      case "orders": return "Lịch sử đơn";
      case "settings": return "Cài đặt";
      case "addresses": return "Địa chỉ";
      default: return "Hồ sơ";
    }
  };

  const getTabFromLabel = (label: string) => {
    switch (label) {
      case "Lịch sử đơn": return "orders";
      case "Cài đặt": return "settings";
      case "Địa chỉ": return "addresses";
      default: return "profile";
    }
  };

  const accountPage = useMemo(() => getAccountPageFromTab(tabParam), [tabParam]);

  const NAV_ITEMS = [
    { label: "Hồ sơ", icon: User },
    { label: "Địa chỉ", icon: MapPin },
    { label: "Lịch sử đơn", icon: Package },
    { label: "Cài đặt", icon: Settings },
  ];

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signout();

    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");

    setIsLoggedIn(false);
    setAuthUser(null);
    setRentals([]);
    setRentalsLoading(false);

    navigate("/");
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col items-center px-6 py-6">
      <div className="w-full max-w-250 flex flex-col gap-5">
        <MyNavigateLink
          items={[{ text: "Home", link: "/" }, { text: "My Account" }]}
        />

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

        {isLoggedIn && authUser && (
          <div className="flex flex-row w-full gap-3">
            <aside className="w-56 shrink-0 hidden sm:block">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-[#0052CC] to-[#0747A6]">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm truncate">
                    {authUser.full_name}
                  </p>
                  <p className="text-blue-200 text-xs truncate">
                    {authUser.email}
                  </p>
                </div>

                <nav className="p-2">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full ${item.label === accountPage
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
                    Đăng xuất
                  </button>
                </nav>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="sm:hidden flex gap-1 mb-3 bg-white rounded-xl border border-gray-200 p-1 overflow-x-auto">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      navigate(`/account?tab=${getTabFromLabel(item.label)}`)
                    }
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap px-2 ${item.label === accountPage
                      ? "bg-[#0052CC] text-white"
                      : "text-gray-500"
                      }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className={accountPage === "Hồ sơ" ? "block" : "hidden"}>
                <ProfilePage user={authUser} />
              </div>

              <div className={accountPage === "Địa chỉ" ? "block" : "hidden"}>
                <AddressPage userId={authUser.id} />
              </div>

              <div className={accountPage === "Lịch sử đơn" ? "block" : "hidden"}>
                <OrdersPage
                  initialRentals={rentals}
                  initialLoading={rentalsLoading}
                />
              </div>

              <div className={accountPage === "Cài đặt" ? "block" : "hidden"}>
                <SettingsPage />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
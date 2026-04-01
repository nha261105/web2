import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { checkToken } from "@/services/userTokensService";
import { getMe } from "@/services/usersService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin", { replace: true, state: { from: location } });
        return;
      }

      const tokenResult = await checkToken();
      if (!tokenResult?.success) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true, state: { from: location } });
        return;
      }

      const meResult = await getMe();
      const roles = meResult?.data?.roles as string[] | undefined;
      if (!meResult?.success || !roles?.includes("ADMIN")) {
        navigate("/", { replace: true });
        return;
      }

      setIsCheckingAuth(false);
    };

    void verifyAdminAccess();
  }, [location, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  return (
    // ADMIN LAYOUT: SiderBar,TopBar,Layout chia doi(sidebar | Content => topbar + nd cua moi cai chuc nang trong sidebar)
    <div className="flex w-full min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex flex-col flex-1 min-h-screen min-w-0">
        <TopBar />
        <main className="flex-1 p-4 overflow-y-auto min-w-0 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

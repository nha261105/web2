import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { checkToken } from "@/services/userTokensService";
import { getAuthMe } from "@/services/usersService";

function extractRoles(payload: unknown): string[] {
  const data = payload as
    | {
        roles?: string[];
        user?: { roles?: Array<{ name?: string }> };
      }
    | undefined;

  if (Array.isArray(data?.roles)) {
    return data.roles;
  }

  if (Array.isArray(data?.user?.roles)) {
    return data.user.roles
      .map((role) => role?.name)
      .filter((name): name is string => Boolean(name));
  }

  return [];
}

function extractPermissions(payload: unknown): string[] {
  const data = payload as { permissions?: string[] } | undefined;
  if (!Array.isArray(data?.permissions)) {
    return [];
  }

  return data.permissions.filter(
    (name): name is string => typeof name === "string" && name.length > 0,
  );
}

const ADMIN_ENTRY_PREFIXES = [
  "ADMIN_",
  "RBAC_",
  "USER_",
  "PRODUCT_",
  "CATEGORY_",
  "BRAND_",
  "COMBO_",
  "COUPON_",
  "RENTAL_",
  "RETURN_ORDER_",
  "TRANSACTION_",
  "RENTAL_POLICY_",
  "RENTAL_ISSUE_",
];

function hasAdminAccess(roles: string[], permissions: string[]) {
  return (
    roles.includes("ADMIN") ||
    permissions.some((permission) =>
      ADMIN_ENTRY_PREFIXES.some((prefix) => permission.startsWith(prefix)),
    )
  );
}

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

      const meResult = await getAuthMe();
      const roles = extractRoles(meResult?.data);
      const permissions = extractPermissions(meResult?.data);

      if (!meResult?.success || !hasAdminAccess(roles, permissions)) {
        navigate("/", { replace: true });
        return;
      }

      localStorage.setItem("auth_permissions", JSON.stringify(permissions));

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

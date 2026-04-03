import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Bọc các route yêu cầu đăng nhập.
 * Nếu chưa có token → redirect /signin?redirect=<current url>
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    const redirectTo = location.pathname + location.search;
    return <Navigate to={`/signin?redirect=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return <Outlet />;
}

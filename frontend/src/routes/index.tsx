import { Routes, Route } from "react-router-dom";

import ClientLayout from "../layouts/client/ClientLayout";
import AdminLayout from "../layouts/admin/AdminLayout";

// Client Page
import HomePage from "../pages/client/HomePage";
// Admin Page
import AdminDashboard from "../pages/admin/AdminDashboard";
import CartPage from "@/pages/client/CartPage";
import CheckoutPage from "@/pages/client/CheckoutPage";
import ProductDetailPage from "@/pages/client/ProductDetailPage";
import SignInPage from "@/pages/client/SignInSignOut/SigInPage";
import SignUpPage from "@/pages/client/SignInSignOut/SignUpPage";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AccountPage from "@/pages/client/AccountPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Route cho client */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>

      {/* Route cho admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Page not found */}
      <Route path="*" element={<div>404 NOT FOUND</div>} />

      {/* Page đăng nhập */}
      <Route path="/signin" element={<SignInPage />} />

      {/* Page đăng ký */}
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};

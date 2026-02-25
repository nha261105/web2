import { Routes,Route } from "react-router-dom";

import ClientLayout from "../layouts/client/ClientLayout";
import AdminLayout from "../layouts/admin/AdminLayout";

// Client Page
import HomePage from "../pages/client/HomePage";
// Admin Page
import AdminDashboard from "../pages/admin/AdminDashboard";
import CartPage from "@/pages/client/CartPage";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Route cho client */}
            <Route element={<ClientLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
            </Route>

            {/* Route cho admin */}
            <Route path="/admin" element={<AdminLayout />} >
                <Route index element={<AdminDashboard />} />
            </Route>

            {/* Page not found */}
            <Route path="*" element={<div>404 NOT FOUND</div>} />
        </Routes>
    );
}
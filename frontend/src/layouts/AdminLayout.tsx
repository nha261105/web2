import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    // ADMIN LAYOUT: SiderBar,TopBar,Layout chia doi(sidebar | Content)
    <div>
      <h1 className="bg-purple-200 p-4">ADMIN LAYOUT</h1>
      <Outlet />
    </div>
  );
}

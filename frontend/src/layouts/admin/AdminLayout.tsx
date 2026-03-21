import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function AdminLayout() {
  return (
    // ADMIN LAYOUT: SiderBar,TopBar,Layout chia doi(sidebar | Content => topbar + nd cua moi cai chuc nang trong sidebar)
    <div className="flex w-full min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex flex-col flex-1 min-h-screen">
          <TopBar />
          <main className="flex-1 p-4 overflow-y-auto sm:p-6">
            <Outlet />
          </main>
      </div>
    </div>
  );
}

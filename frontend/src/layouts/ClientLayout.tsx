import { Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    // CLIENT LAYOUT: HEADER, NAVBAR,FOOTER,CONTENT.
    <div>
      <h1 className="bg-green-200 p-4">CLIENT LAYOUT</h1>
      <Outlet />
    </div>
  );
}

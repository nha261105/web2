import { Outlet } from "react-router-dom";

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

export default function ClientLayout() {
  return (
    // CLIENT LAYOUT: HEADER,NAVBAR,FOOTER,CONTENT.
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { Outlet } from "react-router-dom";

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

export default function ClientLayout() {
  return (
    // CLIENT LAYOUT: HEADER,NAVBAR,FOOTER,CONTENT.
    <div className="flex flex-col">
      <Header />
      <main className="flex min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

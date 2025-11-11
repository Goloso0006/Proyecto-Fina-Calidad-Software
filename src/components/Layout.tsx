import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido dinámico (cada vista) */}
  <main className="flex-1 overflow-y-auto bg-slate-50 min-w-0 px-2 sm:px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

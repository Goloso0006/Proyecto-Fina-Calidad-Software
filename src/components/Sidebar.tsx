import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGlobe, FaCube } from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const matematicasItems: SidebarItem[] = [
  { label: "Geometría 3D", route: "/geometria", icon: <FaCube /> },
];

const cienciasItems: SidebarItem[] = [
  { label: "Sistema Solar Interactivo", route: "/sistema-solar", icon: <FaGlobe /> },
];

export default function Sidebar() {
  const [openMatematicas, setOpenMatematicas] = useState(true);  // Por defecto abierto
  const [openCiencias, setOpenCiencias] = useState(false);      // Por defecto cerrado

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
  `w-full text-left flex items-center gap-2 justify-between rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 ${isActive ? "bg-emerald-50 text-emerald-700" : ""}`
      }
    >
      <div className="flex items-center gap-2">{icon} {label}</div>
    </NavLink>
  );

  return (
  <aside className="hidden md:block w-full md:w-60 lg:w-64 border-r-2 border-black bg-cover bg-center" style={{ backgroundImage: 'url("/sidebar.jpg")' }}> 
      <div className="p-3 space-y-1">

        {/* Acordeón Matemáticas / Geometría */}
        <button
          onClick={() => setOpenMatematicas(!openMatematicas)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
        >
          📐 Matemáticas
          <span>{openMatematicas ? "▲" : "▼"}</span>
        </button>
        {openMatematicas && <div className="pl-4 space-y-1">{matematicasItems.map(renderNavItem)}</div>}

        {/* Acordeón Ciencias Naturales */}
        <button
          onClick={() => setOpenCiencias(!openCiencias)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
        >
          🌍 Ciencias Naturales
          <span>{openCiencias ? "▲" : "▼"}</span>
        </button>
        {openCiencias && <div className="pl-4 space-y-1">{cienciasItems.map(renderNavItem)}</div>}

      </div>
    </aside>
  );
}

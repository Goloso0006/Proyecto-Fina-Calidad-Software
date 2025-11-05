import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const cienciasItems: SidebarItem[] = [
  { label: "Sistema Solar Interactivo", route: "/sistema-solar", icon: <FaGlobe /> },
];

export default function Sidebar() {
  const [openCiencias, setOpenCiencias] = useState(false);

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        w-full text-left flex items-center gap-2 justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 ${isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : ""}
      }
    >
      <div className="flex items-center gap-2">{icon} {label}</div>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-3 space-y-1">
        {/* Acordeón Ciencias Naturales */}
        <button
          onClick={() => setOpenCiencias(!openCiencias)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Ciencias Naturales
          <span>{openCiencias ? "▲" : "▼"}</span>
        </button>
        {openCiencias && <div className="pl-4 space-y-1">{cienciasItems.map(renderNavItem)}</div>}
      </div>
    </aside>
  );
}
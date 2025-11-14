import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGlobe, FaCube, FaTimes } from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const matematicasItems: SidebarItem[] = [
  { label: "Geometría 3D", route: "/geometria", icon: <FaCube /> },
];

const cienciasItems: SidebarItem[] = [
  { label: "Sistema Solar Interactivo", route: "/sistema-solar", icon: <FaGlobe /> },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openMatematicas, setOpenMatematicas] = useState(true);  // Por defecto abierto
  const [openCiencias, setOpenCiencias] = useState(false);      // Por defecto cerrado

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      onClick={onClose} // Cerrar sidebar al hacer clic en un enlace (móvil)
      className={({ isActive }) =>
  `w-full text-left flex items-center gap-2 justify-between rounded-lg px-3 py-2 bg-white/75 hover:bg-white text-slate-700 shadow-sm border border-slate-200 transition-all ${isActive ? "bg-emerald-100 text-emerald-700 border-emerald-300" : ""}`
      }
    >
      <div className="flex items-center gap-2">{icon} {label}</div>
    </NavLink>
  );

  return (
    <>
      {/* Overlay para cuando está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed
          top-0 left-0 h-full
          w-64
          border-r-2 border-black
          bg-cover bg-center
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundImage: 'url("/sidebar.jpg")' }}
      > 
        {/* Botón cerrar en la parte superior */}
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-lg transition-all border border-slate-300 cursor-pointer"
            aria-label="Cerrar menú"
            title="Cerrar menú"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-3 space-y-1">

        {/* Acordeón Matemáticas / Geometría */}
        <button
          onClick={() => setOpenMatematicas(!openMatematicas)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-color bg-color-start hover:bg-color-end font-medium cursor-pointer transition-colors duration-200 text-xl font-caveat"
        >
          📐 Matemáticas
          <span>{openMatematicas ? "▲" : "▼"}</span>
        </button>
        {openMatematicas && <div className="pl-4 space-y-1">{matematicasItems.map(renderNavItem)}</div>}

        {/* Acordeón Ciencias Naturales */}
        <button
          onClick={() => setOpenCiencias(!openCiencias)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-color bg-color-start hover:bg-color-end font-medium cursor-pointer transition-colors duration-200 text-lg font-caveat"
        >
          🌍 Naturales
          <span>{openCiencias ? "▲" : "▼"}</span>
        </button>
        {openCiencias && <div className="pl-4 space-y-1">{cienciasItems.map(renderNavItem)}</div>}

      </div>
    </aside>
    </>
  );
}

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGlobe, FaCube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionSection {
  title: string;
  emoji: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

const sections: AccordionSection[] = [
  {
    title: "Matemáticas",
    emoji: "📐",
    items: [{ label: "Geometría 3D", route: "/geometria", icon: <FaCube /> }],
    defaultOpen: true,
  },
  {
    title: "Naturales",
    emoji: "🌍",
    items: [{ label: "Sistema Solar Interactivo", route: "/sistema-solar", icon: <FaGlobe /> }],
    defaultOpen: false,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.title]: section.defaultOpen ?? false }), {})
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={onClose} 
          aria-label="Cerrar menú" 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-center bg-cover transform transition-transform duration-300 ease-in-out z-40 opacity-95 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundImage: 'url("/sidebar.jpg")'}}
      >
        {/* Botón cerrar animado */}
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="relative group w-8 h-8 duration-500 overflow-hidden cursor-pointer rounded-lg shadow-[0_0_8px_#ddd] hover:shadow-[0_0_14px_#C4ED6F] transition-shadow"
            aria-label="Cerrar menú"
            type="button"
          >
            <p className="font-Manrope text-3xl h-full w-full flex items-center justify-center text-[#ddd] duration-500 relative z-10 group-hover:scale-0 -mt-[6px]">
              ×
            </p>
            {/* Barras animadas */}
            <span className="absolute w-full h-full bg-[#ddd] rotate-45 top-8 left-0 group-hover:top-[27px] group-hover:bg-[#C4ED6F] duration-500" />
            <span className="absolute w-full h-full bg-[#ddd] rotate-45 top-0 left-8 group-hover:left-[27px] group-hover:bg-[#C4ED6F] duration-500" />
            <span className="absolute w-full h-full bg-[#ddd] rotate-45 top-0 right-8 group-hover:right-[27px] group-hover:bg-[#C4ED6F] duration-500" />
            <span className="absolute w-full h-full bg-[#ddd] rotate-45 bottom-8 right-0 group-hover:bottom-[27px] group-hover:bg-[#C4ED6F] duration-500" />
          </button>
        </div>

        {/* Secciones acordeón */}
        <div className="p-3 space-y-1">
          {sections.map((section) => (
            <div key={section.title}>
              {/* Botón acordeón */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-color bg-color-start hover:bg-color-end font-medium cursor-pointer transition-colors duration-200 text-xl font-caveat"
              >
                {section.emoji} {section.title}
                <span>{openSections[section.title] ? "▲" : "▼"}</span>
              </button>

              {/* Items del acordeón con animación suave */}
              <AnimatePresence initial={false}>
                {openSections[section.title] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 space-y-1 pt-1">
                      {section.items.map((item, index) => (
                        <motion.div
                          key={item.route}
                          initial={{ opacity: 0, x: -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                        >
                          <NavLink
                            to={item.route}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 bg-white/75 hover:bg-white text-slate-700 shadow-sm transition-all hover:scale-103 font-caveat-lg  ${
                                isActive ? "bg-emerald-100 text-emerald-700 border-emerald-300" : ""
                              }`
                            }
                          >
                            <div className="flex items-center gap-2">
                              {item.icon} {item.label}
                            </div>
                          </NavLink>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
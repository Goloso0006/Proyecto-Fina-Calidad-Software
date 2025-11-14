import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <motion.header
      className="h-16 sticky top-0 z-20 bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/navbar.jpg')`
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Botón menú hamburguesa + Logo y título */}
        <div className="flex items-center gap-3">
          {/* Botón hamburguesa - SIEMPRE VISIBLE */}
          <motion.button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-lg hover:shadow-xl border border-slate-300 relative z-10 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Abrir menú"
            title="Abrir/Cerrar menú"
          >
            <FaBars size={22} />
          </motion.button>

          {/* Logo y título */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 ">
              <img
                src="/icono.ico"
                alt="Icono GeoNova"
                className="w-12 h-12"
              />
            </div>
            <span className="text-2xl font-bold font-caveat text-[#344570] text-outline-blue font-caveat">
              GeoNova
            </span>
          </motion.div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          {/* Botón Home (solo si no estamos en home) */}
          {!isHome && (
            <button
              onClick={() => navigate("/")}
              className="btn-animated h-12"
            >
              <img src="/iconox2.png" alt="icon" />
              <span className="play">Inicio</span>
              <span className="now">Ir</span>
            </button>
          )}

        </div>
      </div>
      {/* Sombra/degradado ubicado justo fuera del navbar para no cubrir su interior */}
      <div className="pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-black/60 to-transparent" />
    </motion.header>
  );
}


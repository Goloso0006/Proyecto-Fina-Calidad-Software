import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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
          <label 
            onClick={onToggleSidebar}
            className="cursor-pointer group p-1.5 rounded-lg bg-[#ddd] hover:shadow-[0_0_12px_#ddd] relative z-10 inline-block transition-shadow duration-300"
            title="Abrir/Cerrar menú"
            aria-label="Abrir menú"
          >
            <svg
              strokeWidth="2.5"
              className="block w-5 h-5 fill-none stroke-slate-700 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="origin-center transition-transform duration-300 ease-out">
                <circle
                  cx="4"
                  cy="4"
                  r="1.5"
                  className="group-hover:translate-x-3 transition-transform duration-300"
                ></circle>
                <circle cx="16" cy="4" r="1.5"></circle>
                <circle
                  cx="28"
                  cy="4"
                  r="1.5"
                  className="group-hover:translate-y-3 transition-transform duration-300"
                ></circle>

                <circle cx="4" cy="16" r="1.5"></circle>
                <circle cx="16" cy="16" r="1.5"></circle>
                <circle cx="28" cy="16" r="1.5"></circle>

                <circle
                  cx="4"
                  cy="28"
                  r="1.5"
                  className="group-hover:-translate-y-3 transition-transform duration-300"
                ></circle>
                <circle cx="16" cy="28" r="1.5"></circle>
                <circle
                  cx="28"
                  cy="28"
                  r="1.5"
                  className="group-hover:-translate-x-3 transition-transform duration-300"
                ></circle>
              </g>
            </svg>
          </label>

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
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="text-2xl font-bold font-caveat text-[#ddd] text-outline-blue font-caveat">
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
              <img src="/iconox2.png" alt="icon" loading="lazy" decoding="async" />
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
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <motion.header
      className="h-16 sticky top-0 z-20 bg-cover bg-center border-b-2 border-black"
      style={{
        backgroundImage: `url('/navbar.jpg')`
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
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
          <span className="text-2xl font-bold bg-gradient-to-r from-green-300 to-sky-300 bg-clip-text text-transparent">
            GeoNova
          </span>
        </motion.div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          {/* Botón Home (solo si no estamos en home) */}
          {!isHome && (
            <motion.button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome />
              <span className="hidden sm:inline">Inicio</span>
            </motion.button>
          )}

        </div>
      </div>
    </motion.header>
  );
}


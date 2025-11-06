import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar tema del sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const isHome = location.pathname === "/";

  return (
    <motion.header
      className="h-16 sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-2 border-purple-200 dark:border-purple-800 shadow-lg"
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
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold shadow-lg">
            🕹️
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Panel principal
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

          {/* Botón Tema */}
          <motion.button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
            <span className="hidden sm:inline">Tema</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}


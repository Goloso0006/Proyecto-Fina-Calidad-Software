import { motion } from "framer-motion";

interface ControlButtonProps {
  onClick: () => void;
  label: string;
  emoji: string;
  color: "emerald" | "blue" | "purple" | "pink" | "amber" | "red";
  disabled?: boolean;
  isActive?: boolean;
  tooltip?: string;
}

const colorClasses: Record<string, string> = {
  emerald: "from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700",
  blue: "from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700",
  purple: "from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700",
  pink: "from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700",
  amber: "from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700",
  red: "from-red-400 to-red-600 hover:from-red-500 hover:to-red-700",
};

export function ControlButton({
  onClick,
  label,
  emoji,
  color,
  disabled = false,
  isActive = false,
  tooltip,
}: ControlButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-2xl font-bold text-white text-lg
        shadow-lg border-4 border-white
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-white
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isActive ? "scale-110 shadow-2xl" : ""}
        ${disabled ? "" : "cursor-pointer"}
        bg-gradient-to-br ${colorClasses[color]}
      `}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={tooltip}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <span className="hidden sm:inline">{label}</span>
      </div>

      {/* Efecto de brillo */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

interface ControlPanelProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  velocidadRotacion: number;
  // eslint-disable-next-line no-unused-vars
  onVelocidadChange: (velocidad: number) => void;
  onResetVista: () => void;
  onVistaGeneral: () => void;
  mostrarCaras: boolean;
  onCarasToggle: () => void;
  mostrarAristas: boolean;
  onAristasToggle: () => void;
  mostrarVertices: boolean;
  onVerticesToggle: () => void;
  onDescomponer: () => void;
  isDescompuesta: boolean;
  onReproducirAudio: () => void;
  onAyuda: () => void;
  ayudaActiva: boolean;
}

export function ControlPanel({
  isPaused,
  onPauseToggle,
  velocidadRotacion,
  onVelocidadChange,
  onResetVista,
  onVistaGeneral,
  mostrarCaras,
  onCarasToggle,
  mostrarAristas,
  onAristasToggle,
  mostrarVertices,
  onVerticesToggle,
  onDescomponer,
  isDescompuesta,
  onReproducirAudio,
  onAyuda,
  ayudaActiva,
}: ControlPanelProps) {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-3xl p-6 shadow-lg border-4 border-white dark:border-slate-600">
      {/* Grid de botones principales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        <ControlButton
          onClick={onPauseToggle}
          label={isPaused ? "Reanudar" : "Pausar"}
          emoji={isPaused ? "▶️" : "⏸️"}
          color={isPaused ? "blue" : "emerald"}
          isActive={isPaused}
        />

        <ControlButton
          onClick={onResetVista}
          label="Reset Vista"
          emoji="🔄"
          color="purple"
        />

        <ControlButton
          onClick={onVistaGeneral}
          label="Vista General"
          emoji="👁️"
          color="blue"
        />

        <ControlButton
          onClick={onDescomponer}
          label={isDescompuesta ? "Armar" : "Descomponer"}
          emoji={isDescompuesta ? "🧩" : "💥"}
          color={isDescompuesta ? "pink" : "purple"}
          isActive={isDescompuesta}
        />

        <ControlButton
          onClick={onReproducirAudio}
          label="Escuchar"
          emoji="🔊"
          color="amber"
        />

        <ControlButton
          onClick={onAyuda}
          label={ayudaActiva ? "Ocultar" : "Ayuda"}
          emoji={ayudaActiva ? "🙈" : "❓"}
          color={ayudaActiva ? "red" : "amber"}
          isActive={ayudaActiva}
        />
      </div>

      {/* Control de velocidad con diseño divertido */}
      <div className="bg-white dark:bg-slate-600 rounded-2xl p-4 mb-6 border-3 border-emerald-400">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">⚡</span>
          <label className="font-bold text-slate-900 dark:text-white text-lg">
            Velocidad de Rotación
          </label>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐢</span>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={velocidadRotacion}
            onChange={(e) => onVelocidadChange(parseFloat(e.target.value))}
            disabled={isPaused}
            className="flex-1 h-3 bg-slate-300 dark:bg-slate-500 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-2xl">🚀</span>
          <div className="w-16 text-center font-bold text-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 rounded-lg py-2 px-3">
            {velocidadRotacion.toFixed(1)}x
          </div>
        </div>
      </div>

      {/* Botones de visualización */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={onCarasToggle}
          disabled={isDescompuesta}
          className={`
            p-3 rounded-2xl font-bold border-3 border-white transition-all
            ${
              mostrarCaras
                ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg"
                : "bg-slate-300 dark:bg-slate-500 text-slate-700 dark:text-slate-300"
            }
            ${isDescompuesta ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
          `}
        >
          <div className="text-3xl mb-1">🎨</div>
          <div className="text-xs sm:text-sm">Caras</div>
        </button>

        <button
          onClick={onAristasToggle}
          className={`
            p-3 rounded-2xl font-bold border-3 border-white transition-all
            ${
              mostrarAristas
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg"
                : "bg-slate-300 dark:bg-slate-500 text-slate-700 dark:text-slate-300"
            }
            hover:scale-105
          `}
        >
          <div className="text-3xl mb-1">📏</div>
          <div className="text-xs sm:text-sm">Aristas</div>
        </button>

        <button
          onClick={onVerticesToggle}
          className={`
            p-3 rounded-2xl font-bold border-3 border-white transition-all
            ${
              mostrarVertices
                ? "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg"
                : "bg-slate-300 dark:bg-slate-500 text-slate-700 dark:text-slate-300"
            }
            hover:scale-105
          `}
        >
          <div className="text-3xl mb-1">🔴</div>
          <div className="text-xs sm:text-sm">Vértices</div>
        </button>
      </div>

      {/* Mensaje motivacional */}
      <motion.div
        className="text-center bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-800 dark:to-purple-800 rounded-2xl p-3 border-3 border-white"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="font-bold text-white text-lg">
          ¡Explora y diviértete aprendiendo! 🎉
        </p>
      </motion.div>
    </div>
  );
}
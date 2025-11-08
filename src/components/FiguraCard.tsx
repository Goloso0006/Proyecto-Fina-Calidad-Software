import { motion } from "framer-motion";

interface FiguraCardProps {
  figura: {
    id: string;
    nombre: string;
    color: string;
    vertices: number;
    aristas: number;
    caras: number;
  };
  isSelected: boolean;
  onClick: () => void;
  emoji: string;
}

// Emojis asignados a cada figura para hacerlo más divertido
const figuraEmojis: Record<string, string> = {
  cubo: "🟦",
  tetraedro: "🔺",
  octaedro: "💎",
  dodecaedro: "⚽",
  icosaedro: "🌐",
};

export default function FiguraCard({
  figura,
  isSelected,
  onClick,
  emoji,
}: FiguraCardProps) {
  // Use provided emoji or fall back to the mapping by figura id, then a generic one
  const displayEmoji = emoji ?? figuraEmojis[figura.id] ?? "🔷";
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl p-6 h-full w-full
        border-4 transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${
          isSelected
            ? "border-white scale-105 shadow-2xl"
            : "border-white/50 hover:border-white hover:scale-100"
        }
      `}
      style={{
        background: `linear-gradient(135deg, ${figura.color}DD 0%, ${figura.color} 100%)`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
    >
      {/* Partículas decorativas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: 0,
            }}
            animate={
              isSelected
                ? {
                    scale: [1, 1.5, 0],
                    y: -20,
                    opacity: [0.6, 1, 0],
                  }
                : { scale: 0 }
            }
            transition={{
              duration: 1,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
        {/* Emoji grande */}
        <motion.div
          className="text-5xl"
          animate={isSelected ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
            {displayEmoji}
        </motion.div>

        {/* Nombre */}
        <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
          {figura.nombre}
        </h3>

        {/* Mini stats */}
        <div className="flex gap-4 mt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-white drop-shadow">
              {figura.vertices}
            </div>
            <div className="text-xs text-white/80 font-semibold">V</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white drop-shadow">
              {figura.aristas}
            </div>
            <div className="text-xs text-white/80 font-semibold">A</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white drop-shadow">
              {figura.caras}
            </div>
            <div className="text-xs text-white/80 font-semibold">C</div>
          </div>
        </div>

        {/* Indicador de selección */}
        {isSelected && (
          <motion.div
            className="mt-3 bg-white text-slate-900 px-4 py-1 rounded-full font-bold text-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ✓ Seleccionada
          </motion.div>
        )}
      </div>

      {/* Brillo de selección */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
          initial={{ x: -100 }}
          animate={{ x: 100 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
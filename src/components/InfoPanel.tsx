import { motion } from "framer-motion";
import { Figura } from "../types/figuras";

interface InfoPanelProps {
  figura: Figura;
  euler: {
    resultado: number;
    cumple: boolean;
    formula: string;
  };
}

const estadoVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export function InfoPanel({ figura, euler }: InfoPanelProps) {
  const emojis: Record<string, string> = {
    cubo: "🟦",
    tetraedro: "🔺",
    octaedro: "💎",
    dodecaedro: "⚽",
    icosaedro: "🌐",
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header - Nombre de la figura */}
      <motion.div

        className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl p-6 shadow-lg border-4 border-white text-center"
      >
        <div className="text-6xl mb-3">{emojis[figura.id] || "✨"}</div>
        <h2 className="text-4xl font-black text-white drop-shadow-lg">
          {figura.nombre}
        </h2>
      </motion.div>

      {/* Descripción */}
      <motion.div

  className="bg-white rounded-2xl p-5 border-3 border-slate-300 shadow-md"
      >
  <p className="text-slate-900 text-lg leading-relaxed">
          {figura.descripcion}
        </p>
      </motion.div>

      {/* Datos numéricos - Tarjetas grandes y coloridas */}
      <motion.div

        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-center border-4 border-white shadow-lg transition-transform hover:scale-105">
          <div className="text-5xl font-black text-white">
            {figura.vertices}
          </div>
          <div className="text-white font-bold mt-2 text-sm sm:text-base">
            Vértices
          </div>
          <div className="text-xs text-white/80 mt-1">esquinas 🔴</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-4 text-center border-4 border-white shadow-lg transition-transform hover:scale-105">
          <div className="text-5xl font-black text-white">
            {figura.aristas}
          </div>
          <div className="text-white font-bold mt-2 text-sm sm:text-base">
            Aristas
          </div>
          <div className="text-xs text-white/80 mt-1">líneas 📏</div>
        </div>

        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-4 text-center border-4 border-white shadow-lg transition-transform hover:scale-105">
          <div className="text-5xl font-black text-white">
            {figura.caras}
          </div>
          <div className="text-white font-bold mt-2 text-sm sm:text-base">
            Caras
          </div>
          <div className="text-xs text-white/80 mt-1">superficies 🎨</div>
        </div>
      </motion.div>

      {/* Tipo de caras */}
      <motion.div

  className="bg-white rounded-2xl p-5 border-3 border-purple-400 shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔷</span>
          <div>
            <div className="text-slate-600 font-semibold">
              Tipo de caras:
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {figura.tipoCaras}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fórmula de Euler - Panel especial */}
      <motion.div

  className="bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl p-6 border-4 border-white shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-4xl">📐</span>
          <h3 className="text-2xl font-black text-slate-900">
            Fórmula de Euler
          </h3>
        </div>

  <p className="text-slate-800 font-semibold mb-4 text-base">
          Todos los poliedros convexos cumplen con:
        </p>

        {/* Fórmula grande */}
  <div className="bg-white rounded-2xl p-5 mb-4 text-center border-3 border-purple-400">
          <div className="text-4xl font-black text-slate-900 mb-3">
            V - A + C = 2
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-slate-700">
              <span className="font-bold">V</span> = Vértices
            </div>
            <div className="text-slate-700">
              <span className="font-bold">A</span> = Aristas
            </div>
            <div className="text-slate-700">
              <span className="font-bold">C</span> = Caras
            </div>
          </div>
        </div>

        {/* Verificación para esta figura */}
        <motion.div
          initial={estadoVariants.hidden}
          animate={estadoVariants.visible}
          className={`
            rounded-2xl p-4 text-center border-3 border-white font-bold
            ${
              euler.cumple
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                : "bg-gradient-to-r from-red-400 to-red-500 text-white"
            }
          `}
        >
          <div className="text-2xl mb-2">
            {euler.cumple ? "✅" : "❌"}
          </div>
          <div className="text-xl mb-1">{euler.formula}</div>
          <div className="text-sm">
            {euler.cumple
              ? "¡Cumple la fórmula de Euler! 🎉"
              : "Algo no está bien..."}
          </div>
        </motion.div>
      </motion.div>

      {/* Datos curiosos */}
      <motion.div

  className="bg-white rounded-3xl p-6 border-4 border-amber-400 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-4xl">🌟</span>
          <h3 className="text-2xl font-black text-slate-900">
            Datos Curiosos
          </h3>
        </div>
        <div className="space-y-3">
          {figura.datosCuriosos.map((dato, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 bg-amber-50 p-3 rounded-xl border-2 border-amber-200"
            >
              <span className="text-2xl flex-shrink-0">💡</span>
              <p className="text-slate-800 font-medium">
                {dato}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ejemplos en la vida real */}
      <motion.div

  className="bg-white rounded-3xl p-6 border-4 border-cyan-400 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-4xl">🌍</span>
          <h3 className="text-2xl font-black text-slate-900">
            En la Vida Real
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {figura.ejemplosVidaReal.map((ejemplo, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold border-2 border-white shadow-md"
            >
              {ejemplo}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

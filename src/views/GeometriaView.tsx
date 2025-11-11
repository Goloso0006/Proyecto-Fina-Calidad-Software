import { useState } from "react";
import { motion } from "framer-motion";
import GeometriaFiguras3D from "../components/GeometriaFiguras3D";
import FiguraCard from "../components/FiguraCard";
import { ControlPanel } from "../components/ControlPanel";
import { InfoPanel } from "../components/InfoPanel";
import { HelpPanel } from "../components/HelpPanel";
import figurasData from "../data/figuras-geometricas.json";
import type { FigurasData, Figura } from "../types/figuras";

export default function GeometriaView() {
  const [figuraSeleccionada, setFiguraSeleccionada] = useState<Figura>(
    (figurasData as FigurasData).figuras[0]
  );
  const [velocidadRotacion, setVelocidadRotacion] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [mostrarCaras, setMostrarCaras] = useState(true);
  const [mostrarAristas, setMostrarAristas] = useState(false);
  const [mostrarVertices, setMostrarVertices] = useState(false);
  const [isDescompuesta, setIsDescompuesta] = useState(false);
  const [ayudaActiva, setAyudaActiva] = useState(false);
  const [vistaActual, setVistaActual] = useState<"3d" | "galeria">("3d");

  const data = figurasData as FigurasData;
  const { figuras, textos } = data;

  // Calcular la fórmula de Euler
  const calcularEuler = (figura: Figura) => {
    const resultado = figura.vertices - figura.aristas + figura.caras;
    return {
      resultado,
      cumple: resultado === 2,
      formula: `${figura.vertices} - ${figura.aristas} + ${figura.caras} = ${resultado}`,
    };
  };

  const euler = calcularEuler(figuraSeleccionada);

  // Reproducir audio descriptivo
  const reproducirAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        figuraSeleccionada.audioDescripcion
      );
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFiguraChange = (figuraId: string) => {
    const figura = figuras.find((f) => f.id === figuraId);
    if (figura) {
      setFiguraSeleccionada(figura);
      setIsDescompuesta(false);
      setVistaActual("3d");
    }
  };

  const emojis: Record<string, string> = {
    cubo: "🟦",
    tetraedro: "🔺",
    octaedro: "💎",
    dodecaedro: "⚽",
    icosaedro: "🌐",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 sm:p-6 lg:p-8">
      {/* Decoración de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: Math.random() * 50 - 25,
              rotate: 360,
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header llamativo */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.span
              className="text-6xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔷
            </motion.span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
              {textos.titulo}
            </h1>
            <motion.span
              className="text-6xl"
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              🔷
            </motion.span>
          </div>
          <p className="text-2xl font-bold text-slate-700 mb-4">
            {textos.subtitulo}
          </p>

          {/* Botones de vista */}
          <div className="flex justify-center gap-4 mb-6">
            <motion.button
              onClick={() => setVistaActual("3d")}
              className={`
                px-6 py-3 rounded-2xl font-bold text-lg border-3 border-white
                transition-all duration-300
                ${
                  vistaActual === "3d"
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-xl scale-110"
                    : "bg-white/80 text-slate-900 hover:scale-105"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Vista 3D
            </motion.button>
            <motion.button
              onClick={() => setVistaActual("galeria")}
              className={`
                px-6 py-3 rounded-2xl font-bold text-lg border-3 border-white
                transition-all duration-300
                ${
                  vistaActual === "galeria"
                    ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-xl scale-110"
                    : "bg-white/80 text-slate-900 hover:scale-105"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🖼️ Galería
            </motion.button>
          </div>
        </motion.div>

        {/* Panel de ayuda */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <HelpPanel isActive={ayudaActiva} />
        </motion.div>

        {/* Vista 3D */}
        {vistaActual === "3d" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Columna izquierda: Visualización 3D y Controles */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selector de figuras */}
              <motion.div
                className="bg-white/95 rounded-3xl p-6 border-4 border-white shadow-xl backdrop-blur-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span>🎨</span> Elige una Figura
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {figuras.map((figura) => (
                    <FiguraCard
                      key={figura.id}
                      figura={figura}
                      isSelected={figuraSeleccionada.id === figura.id}
                      onClick={() => handleFiguraChange(figura.id)}
                      emoji={emojis[figura.id] || "✨"}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Visualización 3D */}
              <motion.div
                className="bg-white/95 rounded-3xl overflow-hidden border-4 border-white shadow-xl backdrop-blur-sm"
                style={{ minHeight: "50vh" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <GeometriaFiguras3D
                  figuraId={figuraSeleccionada.id}
                  velocidadRotacion={velocidadRotacion}
                  isPaused={isPaused}
                  mostrarCaras={mostrarCaras}
                  mostrarAristas={mostrarAristas}
                  mostrarVertices={mostrarVertices}
                  isDescompuesta={isDescompuesta}
                  color={figuraSeleccionada.color}
                />
              </motion.div>

              {/* Panel de Controles */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ControlPanel
                  isPaused={isPaused}
                  onPauseToggle={() => setIsPaused(!isPaused)}
                  velocidadRotacion={velocidadRotacion}
                  onVelocidadChange={setVelocidadRotacion}
                  onResetVista={() => {}}
                  onVistaGeneral={() => {}}
                  mostrarCaras={mostrarCaras}
                  onCarasToggle={() => setMostrarCaras(!mostrarCaras)}
                  mostrarAristas={mostrarAristas}
                  onAristasToggle={() => setMostrarAristas(!mostrarAristas)}
                  mostrarVertices={mostrarVertices}
                  onVerticesToggle={() => setMostrarVertices(!mostrarVertices)}
                  onDescomponer={() => setIsDescompuesta(!isDescompuesta)}
                  isDescompuesta={isDescompuesta}
                  onReproducirAudio={reproducirAudio}
                  onAyuda={() => setAyudaActiva(!ayudaActiva)}
                  ayudaActiva={ayudaActiva}
                />
              </motion.div>
            </div>

            {/* Columna derecha: Información */}
            <motion.div
              className="lg:col-span-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">
                <InfoPanel figura={figuraSeleccionada} euler={euler} />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Vista Galería */}
        {vistaActual === "galeria" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {figuras.map((figura, index) => (
              <motion.button
                key={figura.id}
                onClick={() => {
                  handleFiguraChange(figura.id);
                  setVistaActual("3d");
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-64 relative overflow-hidden rounded-3xl border-4 border-white shadow-xl hover:shadow-2xl transition-shadow"
                style={{
                  background: `linear-gradient(135deg, ${figura.color}DD 0%, ${figura.color} 100%)`,
                }}
              >
                <div className="flex flex-col items-center justify-center h-full gap-4 relative z-10">
                  <div className="text-8xl">{emojis[figura.id] || "✨"}</div>
                  <h3 className="text-3xl font-black text-white text-center drop-shadow-lg">
                    {figura.nombre}
                  </h3>
                  <p className="text-white font-bold text-lg drop-shadow-lg">
                    ✓ Ver detalles
                  </p>
                </div>

                {/* Efecto de luz */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent pointer-events-none"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Estrellas flotantes finales */}
      <motion.div
        className="fixed bottom-8 right-8 text-5xl pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ✨
      </motion.div>
    </div>
  );
}
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaCube, FaRocket, FaStar } from "react-icons/fa";

interface ModuloCard {
  id: string;
  titulo: string;
  descripcion: string;
  ruta: string;
  icono: React.ReactNode;
  colorGradiente: string;
  colorHover: string;
  emoji: string;
}

const modulos: ModuloCard[] = [
  {
    id: "geometria",
    titulo: "Geometría 3D",
    descripcion:
      "Explora figuras geométricas en 3D y aprende sobre sus propiedades",
    ruta: "/geometria",
    icono: <FaCube />,
    colorGradiente: "from-purple-500 via-pink-500 to-red-500",
    colorHover: "hover:from-purple-600 hover:via-pink-600 hover:to-red-600",
    emoji: "🔷",
  },
  {
    id: "sistema-solar",
    titulo: "Sistema Solar",
    descripcion:
      "Viaja por el espacio y descubre los planetas del sistema solar",
    ruta: "/sistema-solar",
    icono: <FaGlobe />,
    colorGradiente: "from-blue-500 via-cyan-500 to-teal-500",
    colorHover: "hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600",
    emoji: "🌍",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, rotateY: 0 },
  hover: {
    scale: 1.05,
    rotateY: 5,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: [0, -10, 10, -10, 0],
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function HomeView() {
  const navigate = useNavigate();

  const handleModuloClick = (ruta: string) => {
    // Efecto de sonido (opcional - usando Web Audio API para un sonido suave)
    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }

    // Navegar después de un pequeño delay para el feedback
    setTimeout(() => {
      navigate(ruta);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 relative overflow-hidden">
      {/* Estrellas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const randomX =
            typeof window !== "undefined"
              ? Math.random() * window.innerWidth
              : Math.random() * 1000;
          const randomY =
            typeof window !== "undefined"
              ? Math.random() * window.innerHeight
              : Math.random() * 1000;
          return (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-2xl"
              initial={{
                x: randomX,
                y: randomY,
                opacity: 0.3,
              }}
              animate={{
                y: [
                  null,
                  typeof window !== "undefined"
                    ? Math.random() * window.innerHeight
                    : randomY + 100,
                ],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <FaStar />
            </motion.div>
          );
        })}
      </div>

      {/* Contenido principal */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header con animación */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            className="inline-block mb-4"
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <FaRocket className="text-6xl text-orange-500" />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            ¡Bienvenido A Formas del Universo!
          <br /><br /></motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-semibold mb-2"
            variants={itemVariants}
          >
            🪐 ¡Prepárate para una aventura donde las matemáticas y el universo se unen!
          <br /><br /></motion.p>

          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300"
            variants={itemVariants}
          >

            Aquí podrás viajar por el espacio y descubrir las formas que se esconden en los planetas<br/>
            Juega, aprende y diviértete mientras exploras el sistema solar y las figuras geométricas<br /> con actividades llenas de color y sorpresas
          
          </motion.p>
        </motion.div>

        {/* Grid de módulos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          {modulos.map((modulo) => (
            <motion.div
              key={modulo.id}
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="cursor-pointer"
              onClick={() => handleModuloClick(modulo.ruta)}
            >
              <div
                className={`bg-gradient-to-br ${modulo.colorGradiente} ${modulo.colorHover} rounded-3xl p-8 shadow-2xl transform transition-all duration-300 border-4 border-white dark:border-slate-800`}
              >
                {/* Icono animado */}
                <motion.div
                  className="flex justify-center mb-4"
                  variants={iconVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-24 h-24 flex items-center justify-center">
                    <span className="text-5xl">{modulo.emoji}</span>
                  </div>
                </motion.div>

                {/* Título */}
                <h2 className="text-3xl font-bold text-white mb-3 text-center">
                  {modulo.titulo}
                </h2>

                {/* Descripción */}
                <p className="text-white/90 text-center mb-6 text-lg">
                  {modulo.descripcion}
                </p>

                {/* Botón de acción */}
                <motion.div
                  className="flex justify-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 font-bold text-white text-lg border-2 border-white/50">
                    🚀 ¡Explorar!
                  </div>
                </motion.div>

                {/* Partículas decorativas */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mensaje motivacional en la parte inferior */}
        <motion.div className="text-center mt-12" variants={itemVariants}>
          <motion.p
            className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            ✨ ¡Elige un módulo y comienza tu aventura de aprendizaje! ✨
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

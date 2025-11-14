import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaCube, FaStar } from "react-icons/fa";

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
    colorGradiente: "bg-[linear-gradient(135deg,#2672b8,#00adac)]",
    colorHover: "hover:bg-[linear-gradient(135deg,#065ba0,#908D9E)]",
    emoji: "🔷",
  },
  {
    id: "sistema-solar",
    titulo: "Sistema Solar",
    descripcion:
      "Viaja por el espacio y descubre los planetas del sistema solar",
    ruta: "/sistema-solar",
    icono: <FaGlobe />,
    colorGradiente: "bg-[linear-gradient(135deg,#2672b8,#00adac)]",
    colorHover: "hover:bg-[linear-gradient(135deg,#065ba0,#908D9E)]",
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
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/fondohome.jpg')" }}
    > 
      {/* Capa semitransparente encima del fondo */}
      <div className="absolute inset-0 bg-black/30"></div>

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
            <img 
              src="/iconox2.png" 
              alt="imagen marciano con un casco espacial" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-sky-400 bg-clip-text text-transparent font-caveat text-outline-blue"
            variants={itemVariants}
          >
            ¡Bienvenido A GeoNova!
          <br /><br /></motion.h1>

          <motion.p
              className="text-2xl md:text-4xl font-semibold mb-2 text-[#E5F0DF] text-outline-blue animate-fade-pulse font-caveat"
            variants={itemVariants}
          >
            ¡Prepárate para una aventura donde las matemáticas y el universo se unen!
          <br /><br /></motion.p>

          <motion.p
          className="text-lg md:text-2xl  text-[#FAFCF7] text-outline-blue font-caveat"
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
                  className={`bg-gradient-to-br ${modulo.colorGradiente} ${modulo.colorHover} rounded-3xl p-8 shadow-2xl transform transition-all duration-300 border-4 border-white`}
              >
                {/* Icono animado */}
                <motion.div
                  className="flex justify-center mb-4"
                  variants={iconVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-24 h-24 flex items-center justify-center">
                    <span className="text-6xl">{modulo.emoji}</span>
                  </div>
                </motion.div>

                {/* Título */}
                <h2 className="text-4xl font-bold text-white mb-3 text-center font-caveat">
                  {modulo.titulo}
                </h2>

                {/* Descripción */}
                <p className="text-white/90 text-center mb-6 text-xl font-caveat">
                  {modulo.descripcion}
                </p>

                {/* Botón de acción */}
                <motion.div
                  className="flex justify-center"
                  whileTap={{ scale: 0.87 }}
                >
                  <div className="bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 font-bold text-white text-lg border-2 border-white/50 flex items-center gap-3 font-caveat">
                    <img 
                      src="iconoSeleccion.ico" 
                      alt="Icono de un marciano" 
                      className="w-6 h-6 md:w-8 md:h-8 object-contain"
                    />
                    ¡Explorar!
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
              className="text-xl md:text-3xl font-bold text-[#E5F0DF] text-outline-blue animate-fade-pulse font-caveat"
          >
            👾 ¡Elige un módulo y comienza tu aventura de aprendizaje! 👾
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

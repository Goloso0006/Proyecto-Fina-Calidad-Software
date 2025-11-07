import { motion } from "framer-motion";

interface HelpPanelProps {
  isActive: boolean;
}

export function HelpPanel({ isActive }: HelpPanelProps) {
  const tips = [
    {
      icon: "🖱️",
      title: "Rota la Figura",
      description: "Haz clic y arrastra el ratón sobre la figura para rotarla",
    },
    {
      icon: "🔍",
      title: "Zoom",
      description: "Usa la rueda del ratón para acercar o alejar la figura",
    },
    {
      icon: "⏸️",
      title: "Pausa/Reanuda",
      description: "Pausa la rotación para ver la figura desde diferentes ángulos",
    },
    {
      icon: "💥",
      title: "Descompon",
      description: "Separa las caras de la figura para verlas individualmente",
    },
    {
      icon: "🎨",
      title: "Visualiza",
      description: "Activa/desactiva caras, aristas y vértices según quieras",
    },
    {
      icon: "🔊",
      title: "Escucha",
      description: "Reproduce la descripción de la figura",
    },
  ];

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 rounded-3xl p-6 border-4 border-white shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">🎯</span>
        <h3 className="text-3xl font-black text-slate-900">¿Cómo Usar?</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-4 border-3 border-yellow-400 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">{tip.icon}</div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{tip.title}</h4>
                <p className="text-slate-700 text-sm mt-1">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-4 bg-white rounded-2xl p-4 border-4 border-blue-500 text-center"
      >
        <p className="font-black text-slate-900 text-lg">
          ¡Diviértete explorando las figuras! 🚀
        </p>
      </motion.div>
    </motion.div>
  );
}
/**
 * Props para el componente de ficha de planeta en fullscreen
 */
interface PlanetCardFullscreenProps {
  planetaData: {
    id: string;
    nombre: string;
    descripcion: string;
    diametro: string;
    distanciaSol?: string;
    periodoRotacion: string;
    periodoOrbital?: string;
    datosCuriosos: string[];
  };
  planetaActualIndex: number;
  mostrarFicha: boolean;
  textos: {
    ficha: {
      datos: {
        diametro: string;
        distanciaSol: string;
        periodoRotacion: string;
        periodoOrbital: string;
        datosCuriosos: string;
      };
      anterior: string;
      siguiente: string;
    };
  };
  onToggleFicha: () => void;
  onCerrarFicha?: () => void;
  onAnteriorPlaneta?: () => void;
  onSiguientePlaneta?: () => void;
}

/**
 * Componente de ficha informativa del planeta en modo fullscreen
 */
export function PlanetCardFullscreen({
  planetaData,
  planetaActualIndex,
  mostrarFicha,
  textos,
  onToggleFicha,
  onCerrarFicha,
  onAnteriorPlaneta,
  onSiguientePlaneta,
}: PlanetCardFullscreenProps) {
  return (
    // Responsive positioning: 
    // - Pantallas pequeñas (< 640px): Posicionada en esquina superior derecha
    // - Pantallas medianas (640px - 768px): top-3, más espacio lateral
    // - Pantallas grandes (> 768px): posición normal desde la derecha
    <div
      className="absolute top-3 right-3 left-auto z-20 flex flex-col items-end max-w-[85vw] sm:max-w-md md:max-w-lg"
    >
      {/* Botón para ocultar/mostrar ficha */}
      <button
        type="button"
        onClick={onToggleFicha}
        className="mb-1 px-2 py-1 text-xs bg-slate-900/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-800/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ccc] cursor-pointer"
        aria-label={mostrarFicha ? "Ocultar ficha" : "Mostrar ficha"}
        title={mostrarFicha ? "Ocultar ficha" : "Mostrar ficha"}
      >
        {mostrarFicha ? "▼" : "▲"}
      </button>

      {/* Panel de ficha */}
      {mostrarFicha && (
        <div className="bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl p-3 sm:p-4 md:p-5 w-full h-[52vh] sm:h-[75vh] md:h-[65vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex-none pb-3 sm:pb-4 border-b border-slate-700/50 flex justify-between items-start">
            <h3 className="text-base sm:text-lg font-bold text-white">{planetaData.nombre}</h3>
            {onCerrarFicha && (
              <button
                type="button"
                onClick={onCerrarFicha}
                className="text-white/70 hover:text-white text-lg leading-none transition-colors focus:outline-none cursor-pointer"
                aria-label="Cerrar ficha"
                title="Cerrar ficha"
              >
                ×
              </button>
            )}
          </div>

          {/* Contenido desplazable */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* Descripción */}
            <p className="text-xs sm:text-sm md:text-base text-white/90 mb-3 sm:mb-4 md:mb-5 leading-relaxed">
              {planetaData.descripcion}
            </p>

            {/* Datos básicos - Grid compacto */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
            <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5">{textos.ficha.datos.diametro}</div>
              <div className="text-xs sm:text-sm md:text-base font-semibold text-white break-words">{planetaData.diametro}</div>
            </div>
            {planetaData.distanciaSol && (
              <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5">{textos.ficha.datos.distanciaSol}</div>
                <div className="text-xs sm:text-sm md:text-base font-semibold text-white break-words">{planetaData.distanciaSol}</div>
              </div>
            )}
            <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5">{textos.ficha.datos.periodoRotacion}</div>
              <div className="text-xs sm:text-sm md:text-base font-semibold text-white break-words">{planetaData.periodoRotacion}</div>
            </div>
            {planetaData.periodoOrbital && (
              <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5">{textos.ficha.datos.periodoOrbital}</div>
                <div className="text-xs sm:text-sm md:text-base font-semibold text-white break-words">{planetaData.periodoOrbital}</div>
              </div>
            )}
            </div>

            {/* Datos curiosos - Compacto */}
            {planetaData.datosCuriosos && planetaData.datosCuriosos.length > 0 && (
              <div className="mb-3 sm:mb-4 md:mb-5">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white/90 mb-2 sm:mb-3">
                  {textos.ficha.datos.datosCuriosos}
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
                  {planetaData.datosCuriosos.slice(0, 3).map((dato, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-white/80">
                      <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                      <span>{dato}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Navegación fija al fondo del panel */}
          {(onAnteriorPlaneta || onSiguientePlaneta) && (
            <div className="flex-none flex items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-slate-700/50">
              {onAnteriorPlaneta && (
                <button
                  type="button"
                  onClick={onAnteriorPlaneta}
                  disabled={planetaActualIndex <= 0}
                  className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-lg rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 font-caveat-lg cursor-pointer ${
                    planetaActualIndex <= 0
                      ? "bg-slate-700/50 text-white/40 cursor-not-allowed"
                      : "bg-emerald-700/90 hover:bg-emerald-600/90 text-white"
                  }`}
                  aria-label={textos.ficha.anterior}
                >
                  <span className="hidden sm:inline">←</span> {textos.ficha.anterior}
                </button>
              )}
              <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">
                {planetaActualIndex >= 0 ? `${planetaActualIndex + 1} / 9` : ""}
              </span>
              {onSiguientePlaneta && (
                <button
                  type="button"
                  onClick={onSiguientePlaneta}
                  disabled={planetaActualIndex >= 8}
                  className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-lg rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 font-caveat-lg cursor-pointer ${
                    planetaActualIndex >= 8
                      ? "bg-slate-700/50 text-white/40 cursor-not-allowed"
                      : "bg-emerald-700/90 hover:bg-emerald-600/90 text-white"
                  }`}
                  aria-label={textos.ficha.siguiente}
                >
                  {textos.ficha.siguiente} <span className="hidden sm:inline">→</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


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
    <div className="absolute top-3 right-3 z-20">
      {/* Botón para ocultar/mostrar ficha */}
      <button
        onClick={onToggleFicha}
        className="mb-1 px-2 py-1 text-xs bg-slate-900/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-800/90 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label={mostrarFicha ? "Ocultar ficha" : "Mostrar ficha"}
        title={mostrarFicha ? "Ocultar ficha" : "Mostrar ficha"}
      >
        {mostrarFicha ? "▼" : "▲"}
      </button>

      {/* Panel de ficha */}
      {mostrarFicha && (
        <div className="bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl p-5 max-w-[520px] max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-700/50">
            <h3 className="text-lg font-bold text-white">{planetaData.nombre}</h3>
            {onCerrarFicha && (
              <button
                onClick={onCerrarFicha}
                className="text-white/70 hover:text-white text-lg leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                aria-label="Cerrar ficha"
                title="Cerrar ficha"
              >
                ×
              </button>
            )}
          </div>

          {/* Descripción */}
          <p className="text-base text-white/90 mb-5 leading-relaxed">
            {planetaData.descripcion}
          </p>

          {/* Datos básicos - Grid compacto */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1.5">{textos.ficha.datos.diametro}</div>
              <div className="text-base font-semibold text-white">{planetaData.diametro}</div>
            </div>
            {planetaData.distanciaSol && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-white/70 mb-1.5">{textos.ficha.datos.distanciaSol}</div>
                <div className="text-base font-semibold text-white">{planetaData.distanciaSol}</div>
              </div>
            )}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1.5">{textos.ficha.datos.periodoRotacion}</div>
              <div className="text-base font-semibold text-white">{planetaData.periodoRotacion}</div>
            </div>
            {planetaData.periodoOrbital && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-white/70 mb-1.5">{textos.ficha.datos.periodoOrbital}</div>
                <div className="text-base font-semibold text-white">{planetaData.periodoOrbital}</div>
              </div>
            )}
          </div>

          {/* Datos curiosos - Compacto */}
          {planetaData.datosCuriosos && planetaData.datosCuriosos.length > 0 && (
            <div className="mb-5">
              <h4 className="text-base font-semibold text-white/90 mb-3">
                {textos.ficha.datos.datosCuriosos}
              </h4>
              <ul className="space-y-2.5">
                {planetaData.datosCuriosos.slice(0, 3).map((dato, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-white/80">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>{dato}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navegación */}
          {(onAnteriorPlaneta || onSiguientePlaneta) && (
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-700/50">
              {onAnteriorPlaneta && (
                <button
                  onClick={onAnteriorPlaneta}
                  disabled={planetaActualIndex <= 0}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    planetaActualIndex <= 0
                      ? "bg-slate-700/50 text-white/40 cursor-not-allowed"
                      : "bg-emerald-500/90 hover:bg-emerald-500 text-white"
                  }`}
                  aria-label={textos.ficha.anterior}
                >
                  ← {textos.ficha.anterior}
                </button>
              )}
              <span className="text-sm text-white/60">
                {planetaActualIndex >= 0 ? `${planetaActualIndex + 1} / 9` : ""}
              </span>
              {onSiguientePlaneta && (
                <button
                  onClick={onSiguientePlaneta}
                  disabled={planetaActualIndex >= 8}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    planetaActualIndex >= 8
                      ? "bg-slate-700/50 text-white/40 cursor-not-allowed"
                      : "bg-emerald-500/90 hover:bg-emerald-500 text-white"
                  }`}
                  aria-label={textos.ficha.siguiente}
                >
                  {textos.ficha.siguiente} →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


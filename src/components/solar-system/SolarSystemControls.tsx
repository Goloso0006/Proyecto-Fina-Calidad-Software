/**
 * Props para el componente de controles
 */
interface SolarSystemControlsProps {
  isPaused: boolean;
  velocidadAnimacion: number;
  mostrarControles: boolean;
  vozActiva: boolean;
  textos: {
    controles: {
      pausar: string;
      reanudar: string;
      resetVista: string;
      vistaGeneral: string;
      velocidad: string;
    };
  };
  onToggleControles: () => void;
  onPauseToggle: () => void;
  // eslint-disable-next-line no-unused-vars
  onVelocidadChange?: (velocidad: number) => void;
  onResetVista?: () => void;
  onVistaGeneral?: () => void;
  onRestablecer?: () => void;
  onVozToggle?: () => void;
}

/**
 * Componente de controles para el sistema solar en modo fullscreen
 */
export function SolarSystemControls({
  isPaused,
  velocidadAnimacion,
  mostrarControles,
  vozActiva,
  textos,
  onToggleControles,
  onPauseToggle,
  onVelocidadChange,
  onResetVista,
  onVistaGeneral,
  onRestablecer,
  onVozToggle,
}: SolarSystemControlsProps) {
  return (
    <div className="absolute top-3 left-3 z-20">
      {/* Botón para ocultar/mostrar controles */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleControles();
        }}
        className="mb-1 px-2 py-1 text-xs bg-slate-900/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-800/90 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label={mostrarControles ? "Ocultar controles" : "Mostrar controles"}
        title={mostrarControles ? "Ocultar controles" : "Mostrar controles"}
      >
        {mostrarControles ? "◄" : "►"}
      </button>

      {/* Panel de controles */}
      {mostrarControles && (
        <div className="bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl p-2.5 flex flex-col gap-1.5 min-w-44">
          {/* Botón Pausar/Reanudar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPauseToggle();
            }}
            className="px-2.5 py-1.5 text-xs bg-emerald-500/90 hover:bg-emerald-500 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-1.5"
            aria-label={isPaused ? textos.controles.reanudar : textos.controles.pausar}
          >
            <span className="sm:hidden">{isPaused ? "▶" : "⏸"}</span>
            <span className="hidden sm:inline">{isPaused ? textos.controles.reanudar : textos.controles.pausar}</span>
          </button>

          {/* Control de velocidad */}
          {onVelocidadChange && (
            <div className="flex items-center gap-1.5 px-1 py-1">
              <label htmlFor="velocidad-fs" className="text-xs text-white/90 w-12 shrink-0">
                {textos.controles.velocidad}:
              </label>
              <input
                id="velocidad-fs"
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={velocidadAnimacion}
                onChange={(e) => {
                  e.stopPropagation();
                  onVelocidadChange(parseFloat(e.target.value));
                }}
                className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                style={{
                  background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${(velocidadAnimacion / 5) * 100}%, rgb(51 65 85) ${(velocidadAnimacion / 5) * 100}%, rgb(51 65 85) 100%)`,
                }}
                aria-label={`${textos.controles.velocidad}: ${velocidadAnimacion.toFixed(1)}x`}
              />
              <span className="text-xs text-white/90 w-8 text-right shrink-0">
                {velocidadAnimacion.toFixed(1)}x
              </span>
            </div>
          )}

          {/* Botones en fila compacta */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Botón Reset Vista */}
            {onResetVista && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetVista();
                }}
                className="px-2 py-1.5 text-xs bg-slate-600/80 hover:bg-slate-600 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 flex items-center justify-center gap-1"
                aria-label={textos.controles.resetVista}
                title={textos.controles.resetVista}
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Botón Vista General */}
            {onVistaGeneral && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVistaGeneral();
                }}
                className="px-2 py-1.5 text-xs bg-blue-500/90 hover:bg-blue-500 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-1"
                aria-label={textos.controles.vistaGeneral}
                title={textos.controles.vistaGeneral}
              >
                <span>👁️</span>
                <span className="hidden sm:inline">Vista</span>
              </button>
            )}
          </div>

          {/* Botones en fila compacta */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Botón Restablecer */}
            {onRestablecer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestablecer();
                }}
                className="px-2 py-1.5 text-xs bg-red-500/90 hover:bg-red-500 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-1"
                aria-label="Restablecer sistema"
                title="Restablecer sistema"
              >
                <span>🔁</span>
                <span>Reset</span>
              </button>
            )}

            {/* Botón Voz */}
            {onVozToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVozToggle();
                }}
                className={`px-2 py-1.5 text-xs rounded-md font-medium transition-all focus:outline-none focus:ring-2 flex items-center justify-center gap-1 ${
                  vozActiva
                    ? "bg-rose-500/90 hover:bg-rose-500 text-white focus:ring-rose-500"
                    : "bg-slate-600/80 hover:bg-slate-600 text-white focus:ring-slate-500"
                }`}
                aria-pressed={vozActiva}
                aria-label="Alternar narración por voz"
                title="Alternar narración por voz"
              >
                <span>🔊</span>
                <span>{vozActiva ? "ON" : "OFF"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


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
    // Responsive positioning:
    // - Pantallas < 1024px (< lg): bottom-3 left-3, 50% ancho máximo, esquina inferior izquierda
    // - Pantallas >= 1024px (>= lg): top-3 left-3, ancho fijo, esquina superior izquierda
    <div className="absolute bottom-3 lg:top-3 left-3 z-20 w-[75%] max-w-lg lg:w-auto lg:max-w-xl">
      {/* Botón para ocultar/mostrar controles */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleControles();
        }}
        style={{
          fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
          padding: 'clamp(0.25rem, 0.5vw, 0.375rem) clamp(0.375rem, 1vw, 0.5rem)',
        }}
        className="mb-1 bg-slate-900/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-800/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ccc] cursor-pointer"
        aria-label={mostrarControles ? "Ocultar controles" : "Mostrar controles"}
        title={mostrarControles ? "Ocultar controles" : "Mostrar controles"}
      >
        <span className="lg:hidden">{mostrarControles ? "▼" : "▲"}</span>
        <span className="hidden lg:inline">{mostrarControles ? "◄" : "►"}</span>
      </button>

      {/* Panel de controles */}
      {mostrarControles && (
        <div 
          style={{
            padding: 'clamp(0.375rem, 0.8vw, 0.625rem)',
            gap: 'clamp(0.25rem, 0.4vw, 0.375rem)',
            maxHeight: '70vh',
          }}
          className="bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl flex flex-col w-full lg:min-w-44"
        >
          {/* Botón Pausar/Reanudar - Ancho completo, tamaño dinámico */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPauseToggle();
            }}
            style={{
              fontSize: 'clamp(0.625rem, 1.5vw, 0.95rem)',
              padding: 'clamp(0.375rem, 0.8vw, 0.5rem) clamp(0.5rem, 1.2vw, 0.625rem)',
              gap: 'clamp(0.25rem, 0.8vw, 0.375rem)',
            }}
            className="bg-[#FBBF24] text-black rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#ccc] flex items-center justify-center w-full cursor-pointer"
            aria-label={isPaused ? textos.controles.reanudar : textos.controles.pausar}
          >
            <span style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1rem)' }}>
              {isPaused ? "▶" : "⏸"}
            </span>
            <span>{isPaused ? textos.controles.reanudar : textos.controles.pausar}</span>
          </button>

          {/* Control de velocidad - Tamaño dinámico */}
          {onVelocidadChange && (
            <div 
              className="flex items-center"
              style={{
                gap: 'clamp(0.25rem, 0.8vw, 0.375rem)',
                padding: 'clamp(0.125rem, 0.4vw, 0.25rem)',
              }}
            >
              <label 
                htmlFor="velocidad-fs" 
                className="text-white/90 shrink-0"
                style={{
                  fontSize: 'clamp(0.625rem, 1.3vw, 0.95rem)',
                  whiteSpace: 'nowrap',
                }}
              >
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
                className="flex-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ffcd50]"
                style={{
                  height: 'clamp(0.25rem, 0.4vw, 0.375rem)',
                  minWidth: '50px',
                  background: `linear-gradient(to right, #ffcd508f 0%, #fbbe24d6 ${(velocidadAnimacion / 5) * 100}%, rgb(51 65 85) ${(velocidadAnimacion / 5) * 100}%, rgb(51 65 85) 100%)`,
                }}
                aria-label={`${textos.controles.velocidad}: ${velocidadAnimacion.toFixed(1)}x`}
              />
              <span 
                className="text-white/90 text-right shrink-0 tabular-nums"
                style={{
                  fontSize: 'clamp(0.625rem, 1.3vw, 0.95rem)',
                  minWidth: 'clamp(2rem, 6vw, 2.5rem)',
                }}
              >
                {velocidadAnimacion.toFixed(1)}x
              </span>
            </div>
          )}

          {/* Primera fila de botones - Reset y Vista General */}
          <div 
            className="grid grid-cols-2"
            style={{
              gap: 'clamp(0.25rem, 0.4vw, 0.375rem)',
            }}
          >
            {/* Botón Reset Vista */}
            {onResetVista && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetVista();
                }}
                style={{
                  fontSize: 'clamp(0.625rem, 1.3vw, 0.95rem)',
                  padding: 'clamp(0.25rem, 0.6vw, 0.375rem) clamp(0.375rem, 0.8vw, 0.5rem)',
                  gap: 'clamp(0.125rem, 0.25vw, 0.25rem)',
                }}
                className="bg-[#C44747] hover:bg-[#EB6565] text-black rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#ccc] flex items-center justify-center cursor-pointer"
                aria-label={textos.controles.resetVista}
                title={textos.controles.resetVista}
              >
                <span style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>🔄</span>
                <span className="hidden sm:inline">ResetView</span>
              </button>
            )}

            {/* Botón Vista General */}
            {onVistaGeneral && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVistaGeneral();
                }}
                style={{
                  fontSize: 'clamp(0.625rem, 1.3vw, 0.95rem)',
                  padding: 'clamp(0.25rem, 0.6vw, 0.375rem) clamp(0.375rem, 0.8vw, 0.5rem)',
                  gap: 'clamp(0.125rem, 0.25vw, 0.25rem)',
                }}
                className="bg-[#6A6CD4] hover:bg-[#6366F1] text-black rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#ccc] flex items-center justify-center cursor-pointer"
                aria-label={textos.controles.vistaGeneral}
                title={textos.controles.vistaGeneral}
              >
                <span style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>👁️</span>
                <span className="hidden sm:inline">Vista</span>
              </button>
            )}
          </div>

          {/* Segunda fila de botones - Restablecer y Voz */}
          <div 
            className="grid grid-cols-2"
            style={{
              gap: 'clamp(0.25rem, 0.4vw, 0.375rem)',
            }}
          >
            {/* Botón Restablecer */}
            {onRestablecer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestablecer();
                }}
                style={{
                  fontSize: 'clamp(0.625rem, 1.3vw, 0.95rem)',
                  padding: 'clamp(0.25rem, 0.6vw, 0.375rem) clamp(0.375rem, 0.8vw, 0.5rem)',
                  gap: 'clamp(0.125rem, 0.25vw, 0.25rem)',
                }}
                className="bg-[#C44747] hover:bg-[#EB6565] text-black rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#ccc] flex items-center justify-center cursor-pointer"
                aria-label="Restablecer sistema"
                title="Restablecer sistema"
              >
                <span style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>🔁</span>
                <span className="hidden sm:inline">ResetAll</span>
              </button>
            )}

            {/* Botón Voz */}
            {onVozToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVozToggle();
                }}
                style={{
                  fontSize: 'clamp(0.625rem, 1.3vw, 0.95rem)',
                  padding: 'clamp(0.25rem, 0.6vw, 0.375rem) clamp(0.375rem, 0.8vw, 0.5rem)',
                  gap: 'clamp(0.125rem, 0.25vw, 0.25rem)',
                }}
                className={`rounded-md font-medium transition-all focus:outline-none focus:ring-2 flex items-center justify-center cursor-pointer ${
                  vozActiva
                    ? "bg-[#C44747] hover:bg-[#EB6565] text-black focus:ring-[#ccc]"
                    : "bg-[#6A6CD4] hover:bg-[#6366F1] text-black focus:ring-[#ccc]"
                }`}
                aria-pressed={vozActiva}
                aria-label="Alternar narración por voz"
                title="Alternar narración por voz"
              >
                <span style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>🔊</span>
                <span className="hidden sm:inline">{vozActiva ? "ON" : "OFF"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


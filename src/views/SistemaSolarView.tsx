import { useState } from "react";
import SistemaSolar3D from "../components/SistemaSolar3D";
import FichaPlaneta from "../components/FichaPlaneta";
import planetasData from "../data/planetas.json";
import textosData from "../data/textos-interfaz.json";
import type { PlanetasData, TextosInterfaz } from "../types/planetas";
import { useVoz } from "../hooks/useVoz";

/**
 * Vista principal del módulo del Sistema Solar
 *
 * Gestiona el estado de la aplicación, controles de animación, selección de planetas,
 * modo fullscreen y la integración con el componente 3D y las fichas informativas.
 *
 * @returns Componente de la vista del sistema solar
 */
export default function SistemaSolarView() {
  const [velocidadAnimacion, setVelocidadAnimacion] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [planetaSeleccionado, setPlanetaSeleccionado] = useState<string | null>(
    null
  );
  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [resetVista, setResetVista] = useState(false);
  const [vistaGeneral, setVistaGeneral] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [veniaDeLista, setVeniaDeLista] = useState(false); // Para recordar si veníamos de la lista
  const [ayudaActiva, setAyudaActiva] = useState(false);
  const [vozActiva, setVozActiva] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const [resetTick, setResetTick] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const textos = (textosData as TextosInterfaz).sistemaSolar;
  const planetas = (planetasData as PlanetasData).planetas;

  const voz = useVoz(false, { lang: "es-ES", rate: 1 });

  // Detectar si es dispositivo móvil
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    ("ontouchstart" in window && window.innerWidth < 1024);

  // Frases de anuncio con fallback para evitar errores de tipado
  const anunciarSeleccion =
    (textos as any)?.anunciarSeleccion ?? "Planeta seleccionado";
  const anunciarCerrarFicha =
    (textos as any)?.anunciarCerrarFicha ?? "Ficha cerrada";
  const modoPantallaCompleta =
    (textos.controles as any)?.modoPantallaCompleta ?? "Modo pantalla completa";
  const salirPantallaCompleta =
    (textos.controles as any)?.salirPantallaCompleta ??
    "Salir de pantalla completa";

  const planetaActualIndex = planetaSeleccionado
    ? planetas.findIndex((p) => p.id === planetaSeleccionado)
    : -1;

  const handlePlanetaClick = (
    planetaId: string,
    isDoubleClick: boolean = false
  ) => {
    // En modo fullscreen móvil, solo responder a doble tap/clic
    // En desktop fullscreen: 1 clic muestra ficha, 2 clics muestra mensaje adicional
    if (isFullscreen && isMobile && !isDoubleClick) {
      return; // Ignorar clics simples en fullscreen móvil
    }

    // Guardar si veníamos de la lista antes de ocultarla
    const estabaEnLista = mostrarLista;
    setVeniaDeLista(estabaEnLista);

    setPlanetaSeleccionado(planetaId);
    setMostrarLista(false);
    // Siempre abrir la ficha para que el narrador funcione (pero solo se mostrará si no estamos en fullscreen)
    setFichaAbierta(true);

    // Solo decir "Planeta seleccionado" en doble clic
    // En clic simple, solo se abrirá la ficha y se leerá su contenido automáticamente
    if (vozActiva && isDoubleClick) {
      const p = planetas.find((pl) => pl.id === planetaId);
      if (p) {
        voz.speak(`${p.nombre}. ${anunciarSeleccion}.`);
      }
    }
  };

  const handleCerrarFicha = () => {
    // Mantener selección y reenfocar, pero cerrar ficha
    setFichaAbierta(false);
    // En modo fullscreen, también limpiar la selección para ocultar la ficha
    if (isFullscreen) {
      setPlanetaSeleccionado(null);
    } else {
      // Si veníamos de la lista, restaurar la vista de lista
      if (veniaDeLista) {
        setMostrarLista(true);
        setVeniaDeLista(false);
      }
    }
    setFocusTick((t) => t + 1);
    if (vozActiva) voz.speak(anunciarCerrarFicha);
  };

  const handleToggleFicha = () => {
    // Alternar visibilidad de la ficha sin modificar la selección ni fullscreen
    setFichaAbierta((prev) => !prev);
  };

  const planetaSeleccionadoData = planetaSeleccionado
    ? planetas.find((p) => p.id === planetaSeleccionado)
    : null;

  const handleAnterior = () => {
    if (planetaActualIndex > 0) {
      const nuevo = planetas[planetaActualIndex - 1].id;
      setPlanetaSeleccionado(nuevo);
      // Mantener la ficha abierta si ya estaba abierta
      if (fichaAbierta || isFullscreen) {
        setFichaAbierta(true);
      }
      if (vozActiva) voz.speak(`${planetas[planetaActualIndex - 1].nombre}`);
    }
  };

  const handleSiguiente = () => {
    if (planetaActualIndex < planetas.length - 1) {
      const nuevo = planetas[planetaActualIndex + 1].id;
      setPlanetaSeleccionado(nuevo);
      // Mantener la ficha abierta si ya estaba abierta
      if (fichaAbierta || isFullscreen) {
        setFichaAbierta(true);
      }
      if (vozActiva) voz.speak(`${planetas[planetaActualIndex + 1].nombre}`);
    }
  };

  const handleResetVista = () => {
    setResetVista((prev) => !prev);
    setPlanetaSeleccionado(null);
    if (vozActiva) voz.speak(textos.controles.resetVista);
  };

  const handleVistaGeneral = () => {
    setVistaGeneral((prev) => !prev);
    setPlanetaSeleccionado(null);
    if (vozActiva) voz.speak(textos.controles.vistaGeneral);
  };

  const handleRestablecerSistema = () => {
    // Mantener el estado de pausa actual y la posición de la cámara
    setVelocidadAnimacion(1);
    setVistaGeneral(false);
    setAyudaActiva(false);
    setMostrarLista(false);
    setFichaAbierta(false);
    setPlanetaSeleccionado(null);
    // NO resetear la cámara (setResetVista) - mantener la posición actual
    setResetTick((t) => t + 1); // Solo resetear las rotaciones de los planetas
    if (vozActiva)
      voz.speak(
        `Sistema restablecido, ${isPaused ? "en pausa" : "en movimiento"}`
      );
  };

  const handleFullscreenChange = (isFullscreenNow: boolean) => {
    setIsFullscreen(isFullscreenNow);
    if (vozActiva) {
      if (isFullscreenNow) {
        // Entrar en modo pantalla completa - usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
          voz.speak(modoPantallaCompleta);
        });
      } else {
        // Salir de modo pantalla completa
        voz.stop(); // Detener el narrador si está describiendo un planeta
        // Cerrar la ficha al salir de fullscreen
        setFichaAbierta(false);
        // Usar requestAnimationFrame doble para asegurar que el navegador procese el cambio
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (vozActiva) {
              voz.speak(salirPantallaCompleta);
            }
          });
        });
      }
    } else {
      // Aunque el narrador no esté activo, cerrar la ficha al salir de fullscreen
      if (!isFullscreenNow) {
        setFichaAbierta(false);
      }
    }
  };

  const labelVerLista = mostrarLista
    ? textos.menu.volverVisualizacion
    : textos.menu.verPlanetas;
  const labelAyuda = ayudaActiva ? "Ocultar ayuda" : "Mostrar ayuda";

  const handleAyudaToggle = () => {
    const nuevoEstado = !ayudaActiva;
    setAyudaActiva(nuevoEstado);

    if (vozActiva && nuevoEstado) {
      // Narrar las instrucciones de ayuda cuando se activa
      const instrucciones = `Guía informativa del sistema solar. ${textos.instrucciones.zoom}. ${textos.instrucciones.dobleClicPlaneta}. ${textos.instrucciones.clicPlaneta}. ${textos.instrucciones.rotar}.`;
      voz.speak(instrucciones);
    } else if (vozActiva && !nuevoEstado) {
      voz.speak("Ayuda ocultada");
    }
  };

  return (
    <div className="bkg-glaxy min-h-screen">
      <div className="space-y-2 sm:space-y-4 px-2 sm:px-4 py-">
        {/* Header */}
        <div className="mb-4 sm:mb-8 text-center">
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(16,185,129,0.25)] animate-fade-pulse text-outline-blue font-caveat"
            aria-label={textos.titulo}
          >
            <br />
            {textos.titulo}
          </h1>
          <p className="mx-auto max-w-3xl text-sm sm:text-2xl text-slate-200/90 leading-relaxed text-outline-blue font-caveat">
            {textos.subtitulo}
          </p>
        </div>

        {/* Controles principales (barra superior) */}
        <div
          className="gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg bg-[#DEF9] shadow-[0_10px_25px_-10px_#DEF]"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Botón Pausar/Reanudar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
              if (vozActiva)
                voz.speak(
                  isPaused ? textos.controles.reanudar : textos.controles.pausar
                );
            }}
            className="btn-1"
            style={{
              background: "#FBBF24",
              boxShadow: "0 6px 0px #B45309",
              flex: "1 1 auto",
              minWidth: "auto",
              order: 99,
            }}
            aria-label={
              isPaused ? textos.controles.reanudar : textos.controles.pausar
            }
          >
            <span className="hidden sm:inline">
              {isPaused ? textos.controles.reanudar : textos.controles.pausar}
            </span>
            <span className="sm:hidden">{isPaused ? "▶" : "⏸"}</span>
          </button>

          {/* Control de velocidad */}
          <div
            className="flex items-center justify-center gap-1 sm:gap-2"
            style={{ flex: "1 1 auto", minWidth: "auto", order: 1 }}
          >
            <label
              htmlFor="velocidad"
              className="text-sm sm:text-2xl font-medium text-black/90 hidden sm:inline font-caveat"
            >
              {textos.controles.velocidad}:
            </label>
            <input
              id="velocidad"
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={velocidadAnimacion}
              onChange={(e) => {
                e.stopPropagation();
                setVelocidadAnimacion(parseFloat(e.target.value));
                if (vozActiva)
                  voz.speak(
                    `${textos.controles.velocidad} ${parseFloat(e.target.value).toFixed(1)} x`
                  );
              }}
              className="w-20 sm:w-32 cursor-pointer"
              aria-label={`${textos.controles.velocidad}: ${velocidadAnimacion.toFixed(1)}x`}
            />
            <span className="text-sm sm:text-lg text-black/90 w-10 sm:w-14 font-caveat">
              {velocidadAnimacion.toFixed(1)}x
            </span>
          </div>

          {/* Botón Reset Vista */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetVista();
            }}
            className="btn-1"
            style={{
              background: "#EB6565",
              boxShadow: "0 6px 0px #DB1818",
              flex: "1 1 auto",
              minWidth: "auto",
              order: 6,
            }}
            aria-label={textos.controles.resetVista}
          >
            <span className="hidden sm:inline">
              {textos.controles.resetVista}
            </span>
            <span className="sm:hidden">Reset</span>
          </button>

          {/* Botón Vista General */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVistaGeneral();
            }}
            className="btn-1"
            style={{
              background: "#6366F1",
              boxShadow: "0 6px 0px #4338CA",
              flex: "1 1 auto",
              minWidth: "auto",
              order: 2,
            }}
            aria-label={textos.controles.vistaGeneral}
          >
            <span className="hidden sm:inline">
              {textos.controles.vistaGeneral}
            </span>
            <span className="sm:hidden">Vista</span>
          </button>

          {/* Botón Restablecer Sistema */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestablecerSistema();
            }}
            className="btn-1 justify-center"
            style={{
              background: "#EB6565",
              boxShadow: "0 6px 0px #DB1818 ",
              order: 5,
            }}
            aria-label="Restablecer sistema"
          >
            <span className="hidden sm:inline">Reiniciar</span>
            <span className="sm:hidden">Reset</span>
          </button>

          {/* Botón Ver Lista de Planetas */}
          <button
            onClick={() => {
              if (vozActiva) voz.speak(labelVerLista);
              setMostrarLista((prev) => {
                const nuevoEstado = !prev;
                // Si estamos cerrando la lista, limpiar el flag
                if (!nuevoEstado) {
                  setVeniaDeLista(false);
                }
                return nuevoEstado;
              });
            }}
            className="btn-1"
            style={{
              background: "#6366F1",
              boxShadow: "0 6px 0px #4338CA",
              flex: "1 1 auto",
              minWidth: "19%",
              gridColumn: "span 2 / span 2",
              order: 3,
            }}
            aria-label={labelVerLista}
          >
            <span className="hidden sm:inline">{labelVerLista}</span>
            <span className="sm:hidden">Lista</span>
          </button>

          {/* Ayuda interactiva */}
          <button
            onClick={handleAyudaToggle}
            className="btn-1"
            style={{
              background: "#6366F1",
              boxShadow: "0 6px 0px #4338CA",
              flex: "1 1 auto",
              minWidth: "15%",
              order: 4,
            }}
            aria-pressed={ayudaActiva}
            aria-label={labelAyuda}
          >
            <span className="hidden sm:inline">{labelAyuda}</span>
            <span className="sm:hidden">Ayuda</span>
          </button>

          {/* Accesibilidad: Voz */}
          <button
            onClick={() => {
              const nuevo = !vozActiva;
              setVozActiva(nuevo);
              voz.setEnabled(nuevo);
              if (nuevo) voz.speak("Narración activada");
              else voz.stop();
            }}
            className="btn-1"
            style={{
              background: vozActiva ? "#10B981" : "#EB6565",
              boxShadow: vozActiva ? "0 6px 0px #059669" : "0 6px 0px #DB1818",
              flex: "1 1 auto",
              minWidth: "11%",
              boxSizing: "border-box",
              order: 7,
            }}
            aria-pressed={vozActiva}
            aria-label="Alternar narración por voz"
          >
            {vozActiva ? (
              <span className="hidden sm:inline">Voz: ON</span>
            ) : (
              <span className="hidden sm:inline">Voz: OFF</span>
            )}
            <span className="sm:hidden">{vozActiva ? "ON" : "OFF"}</span>
          </button>
        </div>

        {/* Visualización 3D inmediatamente después de la barra */}
        {!mostrarLista && (
          <div
            className="w-full relative overflow-hidden"
            style={{
              minHeight: "40vh",
              height: "65vh",
              maxHeight: "90vh",
              maxWidth: "100%",
              aspectRatio: "16/9",
              borderRadius: "1rem",
            }}
          >
            {/* coach marks simples */}
            {ayudaActiva && (
              <div className="absolute z-10 top-3 left-3 bg-[#0F172A] border border-[#334155] rounded-lg p-2 text-sm text-[#bbb] font-caveat-lg max-w-xs text-justify">
                <div className="text-xl text-[#fff] mb-4 text-center">
                  Guia Informativa
                </div>
                <ul className="space-y-2 marker:text-[#334155]">
                  <li>- {textos.instrucciones.zoom}</li>
                  <li>- {textos.instrucciones.dobleClicPlaneta}</li>
                  <li>- {textos.instrucciones.clicPlaneta}</li>
                  <li>- {textos.instrucciones.rotar}</li>
                </ul>
              </div>
            )}
            <SistemaSolar3D
              velocidadAnimacion={velocidadAnimacion}
              isPaused={isPaused}
              onPlanetaClick={handlePlanetaClick}
              planetaSeleccionado={planetaSeleccionado}
              resetVista={resetVista}
              vistaGeneral={vistaGeneral}
              focusTick={focusTick}
              resetTick={resetTick}
              onFullscreenChange={handleFullscreenChange}
              onPauseToggle={() => {
                setIsPaused(!isPaused);
                if (vozActiva)
                  voz.speak(
                    isPaused
                      ? textos.controles.reanudar
                      : textos.controles.pausar
                  );
              }}
              onVelocidadChange={(vel) => {
                setVelocidadAnimacion(vel);
                if (vozActiva)
                  voz.speak(
                    `${textos.controles.velocidad} ${vel.toFixed(1)} x`
                  );
              }}
              onResetVista={handleResetVista}
              onVistaGeneral={handleVistaGeneral}
              onRestablecer={handleRestablecerSistema}
              onVozToggle={() => {
                const nuevo = !vozActiva;
                setVozActiva(nuevo);
                voz.setEnabled(nuevo);
                if (nuevo) voz.speak("Narración activada");
                else voz.stop();
              }}
              vozActiva={vozActiva}
              textos={textos}
              planetaData={
                isFullscreen && planetaSeleccionadoData
                  ? planetaSeleccionadoData
                  : null
              }
              planetaActualIndex={planetaActualIndex}
              onToggleFicha={handleToggleFicha}
              onCerrarFicha={handleCerrarFicha}
              onAnteriorPlaneta={handleAnterior}
              onSiguientePlaneta={handleSiguiente}
              autoLeerFicha={vozActiva && isFullscreen}
              fichaAbierta={fichaAbierta}
            />
          </div>
        )}

        {/* Ver Lista de planetas - Escluido al Sol */}
        {mostrarLista && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {planetas
              .filter((planeta) => planeta.id !== "sol")
              .map((planeta) => (
                <button
                  key={planeta.id}
                  onClick={() => handlePlanetaClick(planeta.id)}
                  className="  p-4 rounded-2xl bg-[#DEF9] text-slate-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 border-b-2 border-[#DEF] focus:outline-none focus:ring-2 focus:ring-black/40 flex flex-col items-center cursor-pointer font-caveat"
                >
                  <div className="w-32 h-42 mb-3 rounded-full flex items-center justify-center overflow-hidden">
                    {planeta.imagen ? (
                      <img
                        src={planeta.imagen}
                        alt={planeta.nombre}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector("span")) {
                            const span = document.createElement("span");
                            span.className =
                              "text-slate-200 text-xs text-center p-2 font-caveat";
                            span.textContent = "Imagen no disponible";
                            parent.appendChild(span);
                          }
                        }}
                      />
                    ) : (
                      <span className="text-[#222] text-xs text-center p-2 font-caveat">
                        Imagen no disponible
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-3xl text-[#222] text-center font-caveat">
                    {planeta.nombre}
                  </h3>
                </button>
              ))}
          </div>
        )}

        {/* Ficha del planeta - renderizar siempre para que el narrador funcione, pero ocultar visualmente en fullscreen */}
        {fichaAbierta && planetaSeleccionado && (
          <div style={{ display: isFullscreen ? "none" : "block" }}>
            <FichaPlaneta
              planetaId={planetaSeleccionado}
              onCerrar={handleCerrarFicha}
              onAnterior={handleAnterior}
              onSiguiente={handleSiguiente}
              planetaActualIndex={planetaActualIndex}
              autoLeer={vozActiva}
            />
          </div>
        )}
      </div>
    </div>
  );
}

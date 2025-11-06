import { useState, useMemo } from "react";
import SistemaSolar3D from "../components/SistemaSolar3D";
import FichaPlaneta from "../components/FichaPlaneta";
import planetasData from "../data/planetas.json";
import textosData from "../data/textos-interfaz.json";
import type { PlanetasData, TextosInterfaz } from "../types/planetas";
import { useVoz } from "../hooks/useVoz";

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
const [ayudaActiva, setAyudaActiva] = useState(false);
const [vozActiva, setVozActiva] = useState(false);
const [focusTick, setFocusTick] = useState(0);
const [resetTick, setResetTick] = useState(0);
const [isFullscreen, setIsFullscreen] = useState(false);

const textos = (textosData as TextosInterfaz).sistemaSolar;
const planetas = (planetasData as PlanetasData).planetas;

const voz = useMemo(() => useVoz(false, { lang: "es-ES", rate: 1 }), []);

// Frases de anuncio con fallback para evitar errores de tipado
const anunciarSeleccion = (textos as any)?.anunciarSeleccion ?? "Planeta seleccionado";
const anunciarCerrarFicha = (textos as any)?.anunciarCerrarFicha ?? "Ficha cerrada";
const modoPantallaCompleta = (textos.controles as any)?.modoPantallaCompleta ?? "Modo pantalla completa";
const salirPantallaCompleta = (textos.controles as any)?.salirPantallaCompleta ?? "Salir de pantalla completa";

const planetaActualIndex = planetaSeleccionado
    ? planetas.findIndex((p) => p.id === planetaSeleccionado)
    : -1;

const handlePlanetaClick = (planetaId: string) => {
    setPlanetaSeleccionado(planetaId);
    setMostrarLista(false);
    // Siempre abrir la ficha para que el narrador funcione (pero solo se mostrará si no estamos en fullscreen)
    setFichaAbierta(true);
    if (vozActiva) {
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
    }
    setFocusTick((t) => t + 1);
    if (vozActiva) voz.speak(anunciarCerrarFicha);
};

const planetaSeleccionadoData = planetaSeleccionado
    ? planetas.find((p) => p.id === planetaSeleccionado)
    : null;

const handleAnterior = () => {
    if (planetaActualIndex > 0) {
    const nuevo = planetas[planetaActualIndex - 1].id;
    setPlanetaSeleccionado(nuevo);
    if (vozActiva) voz.speak(`${planetas[planetaActualIndex - 1].nombre}`);
    }
};

const handleSiguiente = () => {
    if (planetaActualIndex < planetas.length - 1) {
    const nuevo = planetas[planetaActualIndex + 1].id;
    setPlanetaSeleccionado(nuevo);
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

const handleAcercarPlaneta = () => {
    if (planetaSeleccionado) {
    setFocusTick((t) => t + 1);
    if (vozActiva) voz.speak(`${textos.controles.acercar}: ${planetas.find((p) => p.id === planetaSeleccionado)?.nombre}`);
    }
};

const handleRestablecerSistema = () => {
    // Mantener el estado de pausa actual
    setVelocidadAnimacion(1);
    setVistaGeneral(false);
    setAyudaActiva(false);
    setMostrarLista(false);
    setFichaAbierta(false);
    setPlanetaSeleccionado(null);
    setResetVista((prev) => !prev);
    setResetTick((t) => t + 1);
    if (vozActiva) voz.speak(`Sistema restablecido, ${isPaused ? "en pausa" : "en movimiento"}`);
};

const handleFullscreenChange = (isFullscreenNow: boolean) => {
    setIsFullscreen(isFullscreenNow);
    if (vozActiva) {
        if (isFullscreenNow) {
            // Entrar en modo pantalla completa - pequeño delay para asegurar que el navegador procese el cambio
            setTimeout(() => {
                voz.speak(modoPantallaCompleta);
            }, 100);
        } else {
            // Salir de modo pantalla completa
            voz.stop(); // Detener el narrador si está describiendo un planeta
            // Cerrar la ficha al salir de fullscreen
            setFichaAbierta(false);
            // Delay para asegurar que el navegador procese el cambio de fullscreen antes de hablar
            setTimeout(() => {
                if (vozActiva) {
                    voz.speak(salirPantallaCompleta);
                }
            }, 200);
        }
    } else {
        // Aunque el narrador no esté activo, cerrar la ficha al salir de fullscreen
        if (!isFullscreenNow) {
            setFichaAbierta(false);
        }
    }
};

const labelVerLista = mostrarLista ? textos.menu.volverVisualizacion : textos.menu.verPlanetas;
const labelAyuda = ayudaActiva ? "Ocultar ayuda" : "Mostrar ayuda";

return (
    <div className="space-y-2 sm:space-y-4 px-2 sm:px-4">
    {/* Header */}
    <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {textos.titulo}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{textos.subtitulo}</p>
    </div>

    {/* Controles principales (barra superior) */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Botón Pausar/Reanudar */}
        <button
        onClick={() => { setIsPaused(!isPaused); if (vozActiva) voz.speak(isPaused ? textos.controles.reanudar : textos.controles.pausar); }}
        className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label={
            isPaused ? textos.controles.reanudar : textos.controles.pausar
        }
        >
        {isPaused ? textos.controles.reanudar : textos.controles.pausar}
        </button>

        {/* Control de velocidad */}
        <div className="flex items-center gap-1 sm:gap-2">
        <label
            htmlFor="velocidad"
            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline"
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
            onChange={(e) => { setVelocidadAnimacion(parseFloat(e.target.value)); if (vozActiva) voz.speak(`${textos.controles.velocidad} ${parseFloat(e.target.value).toFixed(1)} x`); }}
            className="w-20 sm:w-32"
            aria-label={`${textos.controles.velocidad}: ${velocidadAnimacion.toFixed(1)}x`}
        />
        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 w-8 sm:w-12">
            {velocidadAnimacion.toFixed(1)}x
        </span>
        </div>

        {/* Botón Reset Vista */}
        <button
        onClick={handleResetVista}
        className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        aria-label={textos.controles.resetVista}
        >
        <span className="hidden sm:inline">{textos.controles.resetVista}</span>
        <span className="sm:hidden">Reset</span>
        </button>

        {/* Botón Vista General */}
        <button
        onClick={handleVistaGeneral}
        className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={textos.controles.vistaGeneral}
        >
        <span className="hidden sm:inline">{textos.controles.vistaGeneral}</span>
        <span className="sm:hidden">Vista</span>
        </button>

        {/* Botón Acercar al Planeta */}
        {planetaSeleccionado && (
        <button
            onClick={handleAcercarPlaneta}
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={`${textos.controles.acercar} - ${planetas.find((p) => p.id === planetaSeleccionado)?.nombre}`}
        >
            <span className="hidden sm:inline">{textos.controles.acercar}</span>
            <span className="sm:hidden">Acercar</span>
        </button>
        )}

        {/* Botón Restablecer Sistema */}
        <button
        onClick={handleRestablecerSistema}
        className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Restablecer sistema"
        >
        <span className="hidden sm:inline">Restablecer</span>
        <span className="sm:hidden">Reset</span>
        </button>

        {/* Botón Ver Lista de Planetas */}
        <button
        onFocus={() => { if (vozActiva) voz.speak(labelVerLista); }}
        onClick={() => { if (vozActiva) voz.speak(labelVerLista); setMostrarLista((prev) => !prev); }}
        className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-auto"
        >
        <span className="hidden sm:inline">{labelVerLista}</span>
        <span className="sm:hidden">Lista</span>
        </button>

        {/* Ayuda interactiva */}
        <button
        onFocus={() => { if (vozActiva) voz.speak(labelAyuda); }}
        onClick={() => { if (vozActiva) voz.speak(labelAyuda); setAyudaActiva((prev) => !prev); }}
        className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-pressed={ayudaActiva}
        aria-label="Alternar ayuda interactiva"
        >
        <span className="hidden sm:inline">{labelAyuda}</span>
        <span className="sm:hidden">Ayuda</span>
        </button>

        {/* Accesibilidad: Voz */}
        <button
        onClick={() => { const nuevo = !vozActiva; setVozActiva(nuevo); voz.setEnabled(nuevo); if (nuevo) voz.speak("Narración activada"); else voz.stop(); }}
        className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        aria-pressed={vozActiva}
        aria-label="Alternar narración por voz"
        >
        {vozActiva ? <span className="hidden sm:inline">Voz: ON</span> : <span className="hidden sm:inline">Voz: OFF</span>}
        <span className="sm:hidden">{vozActiva ? "ON" : "OFF"}</span>
        </button>
    </div>

    {/* Visualización 3D inmediatamente después de la barra */}
    {!mostrarLista && (
        <div className="w-full relative overflow-hidden" style={{ 
            minHeight: "300px",
            height: "calc(100vh - 280px)",
            maxHeight: "600px", 
            maxWidth: "100%",
            aspectRatio: "16/9"
        }}>
        {/* coach marks simples */}
        {ayudaActiva && (
            <div className="absolute z-10 top-3 left-3 bg-white/90 dark:bg-slate-800/90 border border-amber-300 dark:border-amber-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 max-w-xs shadow">
            <div className="font-semibold mb-1">Consejos</div>
            <ul className="list-disc list-inside space-y-1">
                <li>{textos.instrucciones.clicPlaneta}</li>
                <li>{textos.instrucciones.zoom}</li>
                <li>{textos.instrucciones.rotar}</li>
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
            onPauseToggle={() => { setIsPaused(!isPaused); if (vozActiva) voz.speak(isPaused ? textos.controles.reanudar : textos.controles.pausar); }}
            onVelocidadChange={(vel) => { setVelocidadAnimacion(vel); if (vozActiva) voz.speak(`${textos.controles.velocidad} ${vel.toFixed(1)} x`); }}
            onResetVista={handleResetVista}
            onVistaGeneral={handleVistaGeneral}
            onRestablecer={handleRestablecerSistema}
            onVozToggle={() => { const nuevo = !vozActiva; setVozActiva(nuevo); voz.setEnabled(nuevo); if (nuevo) voz.speak("Narración activada"); else voz.stop(); }}
            vozActiva={vozActiva}
            textos={textos}
            planetaData={isFullscreen && planetaSeleccionadoData ? planetaSeleccionadoData : null}
            planetaActualIndex={planetaActualIndex}
            onCerrarFicha={handleCerrarFicha}
            onAnteriorPlaneta={handleAnterior}
            onSiguientePlaneta={handleSiguiente}
            autoLeerFicha={vozActiva && isFullscreen}
        />
        </div>
    )}

    {/* Lista de planetas (alterna con la simulación) */}
    {mostrarLista && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {planetas.map((planeta) => (
            <button
            key={planeta.id}
            onClick={() => handlePlanetaClick(planeta.id)}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {planeta.nombre}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {planeta.descripcion}
            </p>
            </button>
        ))}
        </div>
    )}

    {/* Ficha del planeta - renderizar siempre para que el narrador funcione, pero ocultar visualmente en fullscreen */}
    {fichaAbierta && planetaSeleccionado && (
        <div style={{ display: isFullscreen ? 'none' : 'block' }}>
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
);
}

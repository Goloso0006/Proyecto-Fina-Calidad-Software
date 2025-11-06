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

const textos = (textosData as TextosInterfaz).sistemaSolar;
const planetas = (planetasData as PlanetasData).planetas;

const voz = useMemo(() => useVoz(false, { lang: "es-ES", rate: 1 }), []);

// Frases de anuncio con fallback para evitar errores de tipado
const anunciarSeleccion = (textos as any)?.anunciarSeleccion ?? "Planeta seleccionado";
const anunciarCerrarFicha = (textos as any)?.anunciarCerrarFicha ?? "Ficha cerrada";

const planetaActualIndex = planetaSeleccionado
    ? planetas.findIndex((p) => p.id === planetaSeleccionado)
    : -1;

const handlePlanetaClick = (planetaId: string) => {
    setPlanetaSeleccionado(planetaId);
    setMostrarLista(false);
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
    setFocusTick((t) => t + 1);
    if (vozActiva) voz.speak(anunciarCerrarFicha);
};

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

const labelVerLista = mostrarLista ? textos.menu.volverVisualizacion : textos.menu.verPlanetas;
const labelAyuda = ayudaActiva ? "Ocultar ayuda" : "Mostrar ayuda";

return (
    <div className="space-y-4">
    {/* Header */}
    <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {textos.titulo}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{textos.subtitulo}</p>
    </div>

    {/* Controles principales (barra superior) */}
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Botón Pausar/Reanudar */}
        <button
        onClick={() => { setIsPaused(!isPaused); if (vozActiva) voz.speak(isPaused ? textos.controles.reanudar : textos.controles.pausar); }}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label={
            isPaused ? textos.controles.reanudar : textos.controles.pausar
        }
        >
        {isPaused ? textos.controles.reanudar : textos.controles.pausar}
        </button>

        {/* Control de velocidad */}
        <div className="flex items-center gap-2">
        <label
            htmlFor="velocidad"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
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
            className="w-32"
            aria-label={`${textos.controles.velocidad}: ${velocidadAnimacion.toFixed(1)}x`}
        />
        <span className="text-sm text-slate-600 dark:text-slate-400 w-12">
            {velocidadAnimacion.toFixed(1)}x
        </span>
        </div>

        {/* Botón Reset Vista */}
        <button
        onClick={handleResetVista}
        className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        aria-label={textos.controles.resetVista}
        >
        {textos.controles.resetVista}
        </button>

        {/* Botón Vista General */}
        <button
        onClick={handleVistaGeneral}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={textos.controles.vistaGeneral}
        >
        {textos.controles.vistaGeneral}
        </button>

        {/* Botón Acercar al Planeta */}
        {planetaSeleccionado && (
        <button
            onClick={handleAcercarPlaneta}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={`${textos.controles.acercar} - ${planetas.find((p) => p.id === planetaSeleccionado)?.nombre}`}
        >
            {textos.controles.acercar}
        </button>
        )}

        {/* Botón Restablecer Sistema */}
        <button
        onClick={handleRestablecerSistema}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Restablecer sistema"
        >
        Restablecer
        </button>

        {/* Botón Ver Lista de Planetas */}
        <button
        onFocus={() => { if (vozActiva) voz.speak(labelVerLista); }}
        onClick={() => { if (vozActiva) voz.speak(labelVerLista); setMostrarLista((prev) => !prev); }}
        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-auto"
        >
        {labelVerLista}
        </button>

        {/* Ayuda interactiva */}
        <button
        onFocus={() => { if (vozActiva) voz.speak(labelAyuda); }}
        onClick={() => { if (vozActiva) voz.speak(labelAyuda); setAyudaActiva((prev) => !prev); }}
        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-pressed={ayudaActiva}
        aria-label="Alternar ayuda interactiva"
        >
        {labelAyuda}
        </button>

        {/* Accesibilidad: Voz */}
        <button
        onClick={() => { const nuevo = !vozActiva; setVozActiva(nuevo); voz.setEnabled(nuevo); if (nuevo) voz.speak("Narración activada"); else voz.stop(); }}
        className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        aria-pressed={vozActiva}
        aria-label="Alternar narración por voz"
        >
        {vozActiva ? "Voz: ON" : "Voz: OFF"}
        </button>
    </div>

    {/* Visualización 3D inmediatamente después de la barra */}
    {!mostrarLista && (
        <div className="w-full relative" style={{ minHeight: "600px" }}>
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

    {/* Ficha del planeta */}
    {fichaAbierta && planetaSeleccionado && (
        <FichaPlaneta
        planetaId={planetaSeleccionado}
        onCerrar={handleCerrarFicha}
        onAnterior={handleAnterior}
        onSiguiente={handleSiguiente}
        planetaActualIndex={planetaActualIndex}
        autoLeer={vozActiva}
        />
    )}
    </div>
);
}

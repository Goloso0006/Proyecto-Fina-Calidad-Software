import { useState } from "react";
import SistemaSolar3D from "../components/SistemaSolar3D";
import FichaPlaneta from "../components/FichaPlaneta";
import planetasData from "../data/planetas.json";
import textosData from "../data/textos-interfaz.json";

export default function SistemaSolarView() {
const [velocidadAnimacion, setVelocidadAnimacion] = useState(1);
const [isPaused, setIsPaused] = useState(false);
const [planetaSeleccionado, setPlanetaSeleccionado] = useState<string | null>(null);
const [resetVista, setResetVista] = useState(false);
const [vistaGeneral, setVistaGeneral] = useState(false);
const [mostrarLista, setMostrarLista] = useState(false);

const textos = textosData.sistemaSolar;
const planetas = planetasData.planetas;

const planetaActualIndex = planetaSeleccionado
    ? planetas.findIndex((p) => p.id === planetaSeleccionado)
    : -1;

const handlePlanetaClick = (planetaId: string) => {
    setPlanetaSeleccionado(planetaId);
    setMostrarLista(false);
};

const handleCerrarFicha = () => {
    setPlanetaSeleccionado(null);
};

const handleAnterior = () => {
    if (planetaActualIndex > 0) {
    setPlanetaSeleccionado(planetas[planetaActualIndex - 1].id);
    }
};

const handleSiguiente = () => {
    if (planetaActualIndex < planetas.length - 1) {
    setPlanetaSeleccionado(planetas[planetaActualIndex + 1].id);
    }
};

const handleResetVista = () => {
    setResetVista((prev) => !prev);
    setPlanetaSeleccionado(null);
};

const handleVistaGeneral = () => {
    setVistaGeneral((prev) => !prev);
    setPlanetaSeleccionado(null);
};

const handleAcercarPlaneta = () => {
    if (planetaSeleccionado) {
    // El componente 3D ya maneja el enfoque cuando planetaSeleccionado cambia
    // Solo necesitamos asegurarnos de que la ficha esté cerrada si se quiere solo acercar
    }
};

return (
    <div className="space-y-4">
    {/* Header */}
    <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {textos.titulo}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{textos.subtitulo}</p>
    </div>

    {/* Controles principales */}
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Botón Pausar/Reanudar */}
        <button
        onClick={() => setIsPaused(!isPaused)}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label={isPaused ? textos.controles.reanudar : textos.controles.pausar}
        >
        {isPaused ? textos.controles.reanudar : textos.controles.pausar}
        </button>

        {/* Control de velocidad */}
        <div className="flex items-center gap-2">
        <label htmlFor="velocidad" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {textos.controles.velocidad}:
        </label>
        <input
            id="velocidad"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={velocidadAnimacion}
            onChange={(e) => setVelocidadAnimacion(parseFloat(e.target.value))}
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

        {/* Botón Ver Lista de Planetas */}
        <button
        onClick={() => setMostrarLista(!mostrarLista)}
        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-auto"
        >
        {mostrarLista ? textos.menu.volverVisualizacion : textos.menu.verPlanetas}
        </button>
    </div>

    {/* Instrucciones */}
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
        Instrucciones:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
        <li>{textos.instrucciones.clicPlaneta}</li>
        <li>{textos.instrucciones.zoom}</li>
        <li>{textos.instrucciones.rotar}</li>
        <li>{textos.instrucciones.velocidad}</li>
        </ul>
    </div>

    {/* Lista de planetas */}
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

    {/* Visualización 3D */}
    {!mostrarLista && (
        <div className="w-full" style={{ minHeight: "600px" }}>
        <SistemaSolar3D
            velocidadAnimacion={velocidadAnimacion}
            isPaused={isPaused}
            onPlanetaClick={handlePlanetaClick}
            planetaSeleccionado={planetaSeleccionado}
            resetVista={resetVista}
            vistaGeneral={vistaGeneral}
        />
        </div>
    )}

    {/* Ficha del planeta */}
    {planetaSeleccionado && (
        <FichaPlaneta
        planetaId={planetaSeleccionado}
        onCerrar={handleCerrarFicha}
        onAnterior={handleAnterior}
        onSiguiente={handleSiguiente}
        planetaActualIndex={planetaActualIndex}
        />
    )}
    </div>
);
}


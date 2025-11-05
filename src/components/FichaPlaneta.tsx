import { useEffect } from "react";
import planetasData from "../data/planetas.json";
import textosData from "../data/textos-interfaz.json";
import type { PlanetasData, TextosInterfaz } from "../types/planetas";

interface FichaPlanetaProps {
planetaId: string | null;
onCerrar: () => void;
onAnterior: () => void;
onSiguiente: () => void;
planetaActualIndex: number;
}

export default function FichaPlaneta({
planetaId,
onCerrar,
onAnterior,
onSiguiente,
planetaActualIndex,
}: FichaPlanetaProps) {
const textos = (textosData as TextosInterfaz).sistemaSolar.ficha;
const planetas = (planetasData as PlanetasData).planetas;

if (!planetaId) return null;

const planeta = planetas.find((p) => p.id === planetaId);
if (!planeta) return null;

const totalPlanetas = planetas.length;
const esPrimerPlaneta = planetaActualIndex === 0;
const esUltimoPlaneta = planetaActualIndex === totalPlanetas - 1;

// Navegación por teclado (accesibilidad)
useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        onCerrar();
    } else if (event.key === "ArrowLeft" && !esPrimerPlaneta) {
        onAnterior();
    } else if (event.key === "ArrowRight" && !esUltimoPlaneta) {
        onSiguiente();
    }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, [onCerrar, onAnterior, onSiguiente, esPrimerPlaneta, esUltimoPlaneta]);

return (
    <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onCerrar}
    role="dialog"
    aria-labelledby="ficha-titulo"
    aria-modal="true"
    >
    <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
    >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
        <h2 id="ficha-titulo" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {planeta.nombre}
        </h2>
        <button
            onClick={onCerrar}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold rounded-lg px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={textosData.sistemaSolar.controles.cerrarFicha}
        >
            ×
        </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
        {/* Imagen */}
        <div className="flex justify-center">
            <div className="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                {planeta.imagen && !planeta.imagen.startsWith("//") ? (
                    <img 
                        src={planeta.imagen} 
                        alt={planeta.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Si la imagen falla al cargar, mostrar mensaje
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                                const span = document.createElement("span");
                                span.className = "text-slate-500 dark:text-slate-400 text-sm text-center p-4";
                                span.textContent = "Imagen no disponible";
                                parent.appendChild(span);
                            }
                        }}
                    />
                ) : (
                    <span className="text-slate-500 dark:text-slate-400 text-sm text-center p-4">
                        {planeta.imagen || "Imagen no disponible"}
                    </span>
                )}
            </div>
        </div>

        {/* Descripción */}
        <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Descripción
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{planeta.descripcion}</p>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {textos.datos.diametro}
            </dt>
            <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {planeta.diametro}
            </dd>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {textos.datos.distanciaSol}
            </dt>
            <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {planeta.distanciaSol}
            </dd>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {textos.datos.periodoRotacion}
            </dt>
            <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {planeta.periodoRotacion}
            </dd>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {textos.datos.periodoOrbital}
            </dt>
            <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {planeta.periodoOrbital}
            </dd>
            </div>
        </div>

        {/* Datos curiosos */}
        <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            {textos.datos.datosCuriosos}
            </h3>
            <ul className="space-y-2">
            {planeta.datosCuriosos.map((dato, index) => (
                <li
                key={index}
                className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                <span className="text-emerald-500 mt-1">•</span>
                <span>{dato}</span>
                </li>
            ))}
            </ul>
        </div>
        </div>

        {/* Footer con navegación */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
        <button
            onClick={onAnterior}
            disabled={esPrimerPlaneta}
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            esPrimerPlaneta
                ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
            aria-label={`${textos.anterior}: ${esPrimerPlaneta ? planetas[planetaActualIndex - 1]?.nombre : ""}`}
        >
            {textos.anterior}
        </button>

        <span className="text-sm text-slate-500 dark:text-slate-400">
            {planetaActualIndex + 1} de {totalPlanetas}
        </span>

        <button
            onClick={onSiguiente}
            disabled={esUltimoPlaneta}
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            esUltimoPlaneta
                ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
            aria-label={`${textos.siguiente}: ${esUltimoPlaneta ? planetas[planetaActualIndex + 1]?.nombre : ""}`}
        >
            {textos.siguiente}
        </button>
        </div>
    </div>
    </div>
);
}


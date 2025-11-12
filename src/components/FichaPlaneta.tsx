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
autoLeer?: boolean;
}

export default function FichaPlaneta({
planetaId,
onCerrar,
onAnterior,
onSiguiente,
planetaActualIndex,
autoLeer = false,
}: FichaPlanetaProps) {
const textos = (textosData as TextosInterfaz).sistemaSolar.ficha;
const planetas = (planetasData as PlanetasData).planetas;

if (!planetaId) return null;

const planeta = planetas.find((p) => p.id === planetaId);
if (!planeta) return null;

const totalPlanetas = planetas.length;
const esPrimerPlaneta = planetaActualIndex === 0;
const esUltimoPlaneta = planetaActualIndex === totalPlanetas - 1;

const leerContenido = () => {
    if (!("speechSynthesis" in window)) return;
    try {
    window.speechSynthesis.cancel();
    let resumen = `${planeta.nombre}. ${planeta.descripcion}. ${textos.datos.diametro}: ${planeta.diametro}.`;
    if (planeta.distanciaSol) {
        resumen += ` ${textos.datos.distanciaSol}: ${planeta.distanciaSol}.`;
    }
    if (planeta.periodoRotacion) {
        resumen += ` ${textos.datos.periodoRotacion}: ${planeta.periodoRotacion}.`;
    }
    if (planeta.periodoOrbital) {
        resumen += ` ${textos.datos.periodoOrbital}: ${planeta.periodoOrbital}.`;
    }
    if (planeta.datosCuriosos.length > 0) {
        resumen += ` ${textos.datos.datosCuriosos}: ${planeta.datosCuriosos.join(", ")}.`;
    }
    const u = new SpeechSynthesisUtterance(resumen);
    u.lang = "es-ES";
    u.rate = 1;
    window.speechSynthesis.speak(u);
    } catch {
        // Ignorar errores de síntesis de voz
    }
};

// Cancelar TTS al desmontar
useEffect(() => {
    return () => {
    try { 
        if ("speechSynthesis" in window) window.speechSynthesis.cancel(); 
    } catch {
        // Ignorar errores al cancelar síntesis de voz
    }
    };
}, []);

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

// Lectura automática al abrir, solo si autoLeer está activo
useEffect(() => {
    if (autoLeer) {
    leerContenido();
    }
}, [planetaId, autoLeer]);

return (
    <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onCerrar}
    role="dialog"
    aria-labelledby="ficha-titulo"
    aria-modal="true"
    >
    <div
    className="bg-blue-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
    >
        {/* Header */}
    <div className="sticky top-0 bg-blue-200 border-b border-blue-300 px-6 py-4 flex justify-between items-center">
        <h2
            id="ficha-titulo"
            className="text-2xl font-bold text-slate-900"
        >
            {planeta.nombre}
        </h2>
        <div className="flex items-center gap-2">
            <button
            onClick={leerContenido}
            className="px-3 py-1 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Escuchar descripción"
            >
            🔊 Escuchar
            </button>
            <button
            onClick={onCerrar}
            className="text-slate-700 hover:text-slate-900 text-2xl font-bold rounded-lg px-3 py-1 hover:bg-blue-300/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={textosData.sistemaSolar.controles.cerrarFicha}
            >
            ×
            </button>
        </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6" aria-live="polite">
        {/* Imagen */}
        <div className="flex justify-center">
            <div className="w-64 h-85 rounded-full flex items-center justify-center overflow-hidden">
            {planeta.imagen && !planeta.imagen.startsWith("//") ? (
                <img
                src={planeta.imagen}
                alt={planeta.nombre}
                className="w-full h-full object-contain"
                onError={(e) => {
                    // Si la imagen falla al cargar, mostrar mensaje
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                    const span = document.createElement("span");
                    span.className =
                        "text-slate-500 text-sm text-center p-4";
                    span.textContent = "Imagen no disponible";
                    parent.appendChild(span);
                    }
                }}
                />
            ) : (
                <span className="text-slate-500 text-sm text-center p-4">
                {planeta.imagen || "Imagen no disponible"}
                </span>
            )}
            </div>
        </div>

        {/* Descripción */}
        <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Descripción
            </h3>
            <p className="text-slate-700 leading-relaxed">
            {planeta.descripcion}
            </p>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
            <dt className="text-sm font-medium text-blue-700 mb-1">
                {textos.datos.diametro}
            </dt>
            <dd className="text-lg font-semibold text-blue-900">
                {planeta.diametro}
            </dd>
            </div>

            {planeta.distanciaSol && (
                <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
                <dt className="text-sm font-medium text-blue-700 mb-1">
                    {textos.datos.distanciaSol}
                </dt>
                <dd className="text-lg font-semibold text-blue-900">
                    {planeta.distanciaSol}
                </dd>
                </div>
            )}

            <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
            <dt className="text-sm font-medium text-blue-700 mb-1">
                {textos.datos.periodoRotacion}
            </dt>
            <dd className="text-lg font-semibold text-blue-900">
                {planeta.periodoRotacion}
            </dd>
            </div>

            {planeta.periodoOrbital && (
                <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
                <dt className="text-sm font-medium text-blue-700 mb-1">
                    {textos.datos.periodoOrbital}
                </dt>
                <dd className="text-lg font-semibold text-blue-900">
                    {planeta.periodoOrbital}
                </dd>
                </div>
            )}
        </div>

        {/* Datos curiosos */}
        <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
            {textos.datos.datosCuriosos}
            </h3>
            <ul className="space-y-2">
            {planeta.datosCuriosos.map((dato, index) => (
                <li
                key={index}
                className="flex items-start gap-2 text-slate-700"
                >
                <span className="text-pink-500 mt-1 text-xl">👽</span>
                <span>{dato}</span>
                </li>
            ))}
            </ul>
        </div>
        </div>

        {/* Footer con navegación */}
    <div className="sticky bottom-0 bg-blue-200 border-t border-blue-300 px-6 py-4 flex justify-between items-center">
        <button
            onClick={onAnterior}
            disabled={esPrimerPlaneta}
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            esPrimerPlaneta
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
            aria-label={`${textos.anterior}: ${esPrimerPlaneta ? planetas[planetaActualIndex - 1]?.nombre : ""}`}
        >
            {textos.anterior}
        </button>

    <span className="text-sm text-slate-700">
            {planetaActualIndex + 1} de {totalPlanetas}
        </span>

        <button
            onClick={onSiguiente}
            disabled={esUltimoPlaneta}
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            esUltimoPlaneta
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
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

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
    className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/80 backdrop-blur-sm"
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
    <div className="sticky top-0 bg-[#777FE0] px-6 py-4 flex justify-between items-center">
        <h2
            id="ficha-titulo"
            className="text-3xl font-bold text-slate-900 font-caveat-lg"
        >
            {planeta.nombre}
        </h2>
        <div className="flex items-center gap-2">
            <button
            onClick={leerContenido}
            className="px-3 py-1 bg-gradient-to-r from-[#61A4FF] to-[#60A5FA] hover:from-[#3B82F6] hover:to-[#61A4FF] text-white text-xl rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 font-caveat-lg"
            aria-label="Escuchar descripción"
            >
            🔊 Escuchar
            </button>
            <button
            onClick={onCerrar}
            className="relative group w-8 h-8 duration-500 overflow-hidden cursor-pointer rounded-lg shadow-[0_0_8px_#ddd] hover:shadow-[0_0_7px_#222] transition-shadow"
            aria-label={textosData.sistemaSolar.controles.cerrarFicha}
            type="button"
            >
            <p className="font-Manrope text-3xl h-full w-full flex items-center justify-center text-blue-100 duration-500 relative z-10 group-hover:scale-0 -mt-[6px]">
                ×
            </p>
            {/* Barras animadas */}
            <span className="absolute w-full h-full bg-blue-100 rotate-45 top-8 left-0 group-hover:top-[27px] group-hover:bg-[#222] duration-500" />
            <span className="absolute w-full h-full bg-blue-100 rotate-45 top-0 left-8 group-hover:left-[27px] group-hover:bg-[#222] duration-500" />
            <span className="absolute w-full h-full bg-blue-100 rotate-45 top-0 right-8 group-hover:right-[27px] group-hover:bg-[#222] duration-500" />
            <span className="absolute w-full h-full bg-blue-100 rotate-45 bottom-8 right-0 group-hover:bottom-[27px] group-hover:bg-[#222] duration-500" />
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
            <h3 className="text-3xl font-semibold text-slate-900 mb-2 font-caveat-lg">
            Descripción
            </h3>
            <p className="text-slate-700 leading-relaxed font-caveat-lg text-2xl">
            {planeta.descripcion}
            </p>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
            <dt className="text-2xl font-medium text-blue-700 mb-1 font-caveat-lg">
                {textos.datos.diametro}
            </dt>
            <dd className="text-xl font-semibold text-blue-900 font-caveat-lg">
                {planeta.diametro}
            </dd>
            </div>

            {planeta.distanciaSol && (
                <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
                <dt className="text-2xl font-medium text-blue-700 mb-1 font-caveat-lg">
                    {textos.datos.distanciaSol}
                </dt>
                <dd className="text-xl font-semibold text-blue-900 font-caveat-lg">
                    {planeta.distanciaSol}
                </dd>
                </div>
            )}

            <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
            <dt className="text-2xl font-medium text-blue-700 mb-1 font-caveat-lg">
                {textos.datos.periodoRotacion}
            </dt>
            <dd className="text-xl font-semibold text-blue-900 font-caveat-lg">
                {planeta.periodoRotacion}
            </dd>
            </div>

            {planeta.periodoOrbital && (
                <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50 shadow-sm">
                <dt className="text-2xl font-medium text-blue-700 mb-1 font-caveat-lg">
                    {textos.datos.periodoOrbital}
                </dt>
                <dd className="text-xl font-semibold text-blue-900 font-caveat-lg">
                    {planeta.periodoOrbital}
                </dd>
                </div>
            )}
        </div>

        {/* Datos curiosos */}
        <div>
            <h3 className="text-3xl font-semibold text-slate-900 mb-3 font-caveat-lg">
            {textos.datos.datosCuriosos}
            </h3>
            <ul className="space-y-2 text-2xl">
            {planeta.datosCuriosos.map((dato, index) => (
                <li
                key={index}
                className="flex items-start gap-2 text-slate-700 font-caveat-lg"
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
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 font-caveat-lg text-xl ${
            esPrimerPlaneta
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
            aria-label={`${textos.anterior}: ${esPrimerPlaneta ? planetas[planetaActualIndex - 1]?.nombre : ""}`}
        >
            {textos.anterior}
        </button>

    <span className="text-sm text-slate-700 font-caveat-lg">
            {planetaActualIndex + 1} de {totalPlanetas}
        </span>

        <button
            onClick={onSiguiente}
            disabled={esUltimoPlaneta}
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 font-caveat-lg text-xl ${
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

import { useState } from "react";
import GeometriaFiguras3D from "../components/GeometriaFiguras3D";
import figurasData from "../data/figuras-geometricas.json";
import type { FigurasData, Figura } from "../types/figuras";

export default function GeometriaView() {
  const [figuraSeleccionada, setFiguraSeleccionada] = useState<Figura>(
    (figurasData as FigurasData).figuras[0]
  );
  const [velocidadRotacion, setVelocidadRotacion] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [mostrarCaras, setMostrarCaras] = useState(true);
  const [mostrarAristas, setMostrarAristas] = useState(false);
  const [mostrarVertices, setMostrarVertices] = useState(false);
  const [isDescompuesta, setIsDescompuesta] = useState(false);

  const data = figurasData as FigurasData;
  const { figuras, textos } = data;

  // Calcular la fórmula de Euler
  const calcularEuler = (figura: Figura) => {
    const resultado = figura.vertices - figura.aristas + figura.caras;
    return {
      resultado,
      cumple: resultado === 2,
      formula: `${figura.vertices} - ${figura.aristas} + ${figura.caras} = ${resultado}`,
    };
  };

  const euler = calcularEuler(figuraSeleccionada);

  // Reproducir audio descriptivo (simulado con síntesis de voz)
  const reproducirAudio = () => {
    if ('speechSynthesis' in window) {
      // Cancelar cualquier síntesis previa
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(figuraSeleccionada.audioDescripcion);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFiguraChange = (figuraId: string) => {
    const figura = figuras.find((f) => f.id === figuraId);
    if (figura) {
      setFiguraSeleccionada(figura);
      setIsDescompuesta(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {textos.titulo}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{textos.subtitulo}</p>
      </div>

      {/* Layout principal: 2 columnas en desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Visualización 3D y controles */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selector de figuras */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Selecciona una Figura
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {figuras.map((figura) => (
                <button
                  key={figura.id}
                  onClick={() => handleFiguraChange(figura.id)}
                  className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                    figuraSeleccionada.id === figura.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {figura.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Visualización 3D */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <GeometriaFiguras3D
              figuraId={figuraSeleccionada.id}
              velocidadRotacion={velocidadRotacion}
              isPaused={isPaused}
              mostrarCaras={mostrarCaras}
              mostrarAristas={mostrarAristas}
              mostrarVertices={mostrarVertices}
              isDescompuesta={isDescompuesta}
              color={figuraSeleccionada.color}
            />
          </div>

          {/* Controles */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Controles
            </h3>

            {/* Fila 1: Pausar y Velocidad */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                {isPaused ? textos.controles.reanudar : textos.controles.pausar}
              </button>

              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {textos.controles.velocidad}:
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={velocidadRotacion}
                  onChange={(e) => setVelocidadRotacion(parseFloat(e.target.value))}
                  className="flex-1"
                  disabled={isPaused}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 w-12">
                  {velocidadRotacion.toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Fila 2: Checkboxes de visualización */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarCaras}
                  onChange={(e) => setMostrarCaras(e.target.checked)}
                  disabled={isDescompuesta}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {textos.controles.mostrarCaras}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarAristas}
                  onChange={(e) => setMostrarAristas(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {textos.controles.mostrarAristas}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarVertices}
                  onChange={(e) => setMostrarVertices(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {textos.controles.mostrarVertices}
                </span>
              </label>
            </div>

            {/* Fila 3: Botones de acción */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsDescompuesta(!isDescompuesta)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                {isDescompuesta ? textos.controles.armar : textos.controles.descomponer}
              </button>

              <button
                onClick={reproducirAudio}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                🔊 {textos.controles.reproducirAudio}
              </button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Instrucciones:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>{textos.instrucciones.seleccionar}</li>
              <li>{textos.instrucciones.rotar}</li>
              <li>{textos.instrucciones.zoom}</li>
              <li>{textos.instrucciones.descomponer}</li>
            </ul>
          </div>
        </div>

        {/* Columna derecha: Información */}
        <div className="space-y-4">
          {/* Información de la figura */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {figuraSeleccionada.nombre}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {figuraSeleccionada.descripcion}
            </p>

            {/* Datos numéricos */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {figuraSeleccionada.vertices}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Vértices
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {figuraSeleccionada.aristas}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Aristas
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {figuraSeleccionada.caras}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Caras
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Tipo de caras:
              </div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {figuraSeleccionada.tipoCaras}
              </div>
            </div>
          </div>

          {/* Fórmula de Euler */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-5">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
              📐 {textos.formuraEuler.titulo}
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              {textos.formuraEuler.descripcion}
            </p>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-3">
              <div className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {textos.formuraEuler.formula}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>{textos.formuraEuler.leyenda.v}</div>
                <div>{textos.formuraEuler.leyenda.a}</div>
                <div>{textos.formuraEuler.leyenda.c}</div>
              </div>
            </div>

            <div className={`rounded-lg p-3 ${
              euler.cumple 
                ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" 
                : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
            }`}>
              <div className="text-sm font-semibold mb-1">
                Para {figuraSeleccionada.nombre}:
              </div>
              <div className="text-lg font-bold">
                {euler.formula}
              </div>
              <div className="text-sm mt-1">
                {euler.cumple 
                  ? "✓ ¡Cumple la fórmula de Euler!" 
                  : "✗ No cumple (podría ser un error)"}
              </div>
            </div>
          </div>

          {/* Datos curiosos */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🌟 Datos Curiosos
            </h3>
            <ul className="space-y-2">
              {figuraSeleccionada.datosCuriosos.map((dato, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{dato}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ejemplos de la vida real */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🌍 En la Vida Real
            </h3>
            <div className="flex flex-wrap gap-2">
              {figuraSeleccionada.ejemplosVidaReal.map((ejemplo, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                >
                  {ejemplo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
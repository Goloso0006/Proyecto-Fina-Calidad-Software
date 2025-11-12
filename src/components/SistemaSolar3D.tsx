import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { PLANET_CONFIGS, CAMERA_CONFIG } from "../utils/solar-system/planetConfig";
import { setupLighting } from "./solar-system/LightingSetup";
import { createSun } from "./solar-system/Sun3D";
import { createPlanet, type Planeta3D } from "./solar-system/Planet3D";
import { useCameraControls } from "../hooks/solar-system/useCameraControls";
import { usePlanetAnimation } from "../hooks/solar-system/usePlanetAnimation";
import { useResizeHandler } from "../hooks/solar-system/useResizeHandler";
import { usePlanetInteraction } from "../hooks/solar-system/usePlanetInteraction";
import { SolarSystemControls } from "./solar-system/SolarSystemControls";
import { PlanetCardFullscreen } from "./solar-system/PlanetCardFullscreen";
import {
  setPlanetFocusControls,
  setSunFocusControls,
  getPlanetFocusDistance,
  getSunFocusDistance,
} from "../utils/solar-system/cameraHelpers";
import { CAMERA_CONTROLS_CONFIG } from "../utils/solar-system/planetConfig";
import planetasData from "../data/planetas.json";
import type { PlanetasData } from "../types/planetas";

/**
 * Props del componente SistemaSolar3D
 */
interface SistemaSolar3DProps {
  velocidadAnimacion: number;
  isPaused: boolean;
  // eslint-disable-next-line no-unused-vars
  onPlanetaClick: (planetaId: string, isDoubleClick?: boolean) => void;
  planetaSeleccionado: string | null;
  resetVista: boolean;
  vistaGeneral: boolean;
  focusTick?: number;
  resetTick?: number;
  // eslint-disable-next-line no-unused-vars
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onPauseToggle?: () => void;
  // eslint-disable-next-line no-unused-vars
  onVelocidadChange?: (velocidad: number) => void;
  onResetVista?: () => void;
  onVistaGeneral?: () => void;
  onRestablecer?: () => void;
  onVozToggle?: () => void;
  vozActiva?: boolean;
  textos?: {
    controles: {
      pausar: string;
      reanudar: string;
      resetVista: string;
      vistaGeneral: string;
      velocidad: string;
    };
    ficha?: {
      datos: {
        diametro: string;
        distanciaSol: string;
        periodoRotacion: string;
        periodoOrbital: string;
        datosCuriosos: string;
      };
      anterior: string;
      siguiente: string;
    };
  };
  planetaData?: {
    id: string;
    nombre: string;
    descripcion: string;
    diametro: string;
    distanciaSol?: string;
    periodoRotacion: string;
    periodoOrbital?: string;
    datosCuriosos: string[];
  } | null;
  planetaActualIndex?: number;
  onCerrarFicha?: () => void;
  onAnteriorPlaneta?: () => void;
  onSiguientePlaneta?: () => void;
  autoLeerFicha?: boolean;
  fichaAbierta?: boolean;
}

/**
 * Componente principal del Sistema Solar 3D
 * Renderiza una visualización interactiva del sistema solar con controles de cámara,
 * animación de planetas y soporte para modo fullscreen.
 */
export default function SistemaSolar3D({
  velocidadAnimacion,
  isPaused,
  onPlanetaClick,
  planetaSeleccionado,
  resetVista,
  vistaGeneral,
  focusTick = 0,
  resetTick = 0,
  onFullscreenChange,
  onPauseToggle,
  onVelocidadChange,
  onResetVista,
  onVistaGeneral,
  onRestablecer,
  onVozToggle,
  vozActiva = false,
  textos,
  planetaData,
  planetaActualIndex = -1,
  onCerrarFicha,
  onAnteriorPlaneta,
  onSiguientePlaneta,
  autoLeerFicha = false,
  fichaAbierta = false,
}: SistemaSolar3DProps) {
  // Refs para elementos DOM y Three.js
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetasRef = useRef<Planeta3D[]>([]);
  const sunRef = useRef<THREE.Mesh | null>(null);

  // Estados de UI
  const [cursor, setCursor] = useState<"grab" | "grabbing" | "pointer">("grab");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mostrarControles, setMostrarControles] = useState(true);
  const [mostrarFicha, setMostrarFicha] = useState(true);
  const [mensajeSeleccion, setMensajeSeleccion] = useState<string | null>(null);
  const followFramesRef = useRef(0);
  const selectedPlanetRef = useRef<string | null>(planetaSeleccionado);
  const onPlanetaClickRef = useRef(onPlanetaClick);
  // eslint-disable-next-line no-unused-vars
  const handlePlanetHoverRef = useRef<(planetaId: string | null) => void>(() => {});
  
  // Datos de planetas para obtener nombres
  const planetas = (planetasData as PlanetasData).planetas;

  // Actualizar refs directamente (sin useEffect para evitar ejecuciones innecesarias)
  selectedPlanetRef.current = planetaSeleccionado;
  onPlanetaClickRef.current = onPlanetaClick;

  // Callbacks estables usando useCallback
  const handlePlanetClick = useCallback((id: string, isDoubleClick: boolean = false) => {
    onPlanetaClickRef.current(id, isDoubleClick);
    
    // Mostrar mensaje visual cuando hay doble clic
    if (isDoubleClick) {
      const planeta = planetas.find((p) => p.id === id);
      if (planeta) {
        const anunciarSeleccion = (textos as any)?.anunciarSeleccion ?? "Planeta seleccionado";
        setMensajeSeleccion(`${anunciarSeleccion}: ${planeta.nombre}`);
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensajeSeleccion(null);
        }, 3000);
      }
    }
  }, [planetas, textos]); // Incluir dependencias necesarias

  const handleDragStart = useCallback(() => {
    setCursor("grabbing");
  }, []);

  const handleDragEnd = useCallback(() => {
    setCursor("grab");
  }, []);

  // Callback para manejar hover de planetas y el Sol
  const handlePlanetHover = useCallback((planetaId: string | null) => {
    // Restaurar escala de todos los planetas
    planetasRef.current.forEach((planeta) => {
      planeta.mesh.scale.set(1, 1, 1);
    });

    // Restaurar escala del Sol
    if (sunRef.current) {
      sunRef.current.scale.set(1, 1, 1);
    }

    // Si hay un planeta o el Sol en hover, aumentar su escala y cambiar cursor
    if (planetaId) {
      if (planetaId === "sol" && sunRef.current) {
        // Aumentar escala del Sol
        sunRef.current.scale.set(1.15, 1.15, 1.15);
      } else {
        // Aumentar escala del planeta
        const planeta = planetasRef.current.find((p) => p.id === planetaId);
        if (planeta) {
          planeta.mesh.scale.set(1.2, 1.2, 1.2);
        }
      }
      // Cambiar cursor a pointer solo si no se está arrastrando
      setCursor((current) => (current === "grabbing" ? "grabbing" : "pointer"));
    } else {
      // Restaurar cursor cuando no hay hover (solo si no se está arrastrando)
      setCursor((current) => (current === "grabbing" ? "grabbing" : "grab"));
    }
  }, []);

  // Actualizar ref del callback de hover
  handlePlanetHoverRef.current = handlePlanetHover;

  // Hooks personalizados - siempre se llaman (reglas de hooks)
  const cameraControls = useCameraControls(cameraRef);
  const planetAnimation = usePlanetAnimation(planetasRef, sunRef);
  const planetInteraction = usePlanetInteraction(
    containerRef,
    cameraRef,
    sceneRef,
    handlePlanetClick,
    handleDragStart,
    handleDragEnd
  );

  // Refs para almacenar los hooks y evitar recreaciones en el loop de animación
  // Los hooks se actualizan directamente en el ref sin necesidad de useEffect
  const cameraControlsRef = useRef(cameraControls);
  const planetAnimationRef = useRef(planetAnimation);
  const planetInteractionRef = useRef(planetInteraction);

  // Actualizar refs directamente (sin useEffect para evitar loops)
  cameraControlsRef.current = cameraControls;
  planetAnimationRef.current = planetAnimation;
  planetInteractionRef.current = planetInteraction;

  // Configurar textos por defecto
  const textosControles = textos?.controles || {
    pausar: "Pausar",
    reanudar: "Reanudar",
    resetVista: "Reset Vista",
    vistaGeneral: "Vista General",
    velocidad: "Velocidad",
  };

  const textosFicha = textos?.ficha || {
    datos: {
      diametro: "Diámetro",
      distanciaSol: "Distancia al Sol",
      periodoRotacion: "Período de Rotación",
      periodoOrbital: "Período Orbital",
      datosCuriosos: "Datos Curiosos",
    },
    anterior: "Anterior",
    siguiente: "Siguiente",
  };

  // Inicialización de la escena 3D - SOLO UNA VEZ
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Crear cámara
    const camera = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.fov,
      width / height,
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far
    );
    camera.position.set(
      CAMERA_CONFIG.initialPosition.x,
      CAMERA_CONFIG.initialPosition.y,
      CAMERA_CONFIG.initialPosition.z
    );
    camera.lookAt(
      CAMERA_CONFIG.initialTarget.x,
      CAMERA_CONFIG.initialTarget.y,
      CAMERA_CONFIG.initialTarget.z
    );
    cameraRef.current = camera;

    // Crear renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Configurar iluminación
    setupLighting(scene);

    // Crear sol
    const sun = createSun(scene);
    sunRef.current = sun;

    // Crear planetas
    const planetas: Planeta3D[] = [];
    PLANET_CONFIGS.forEach((config) => {
      const planeta = createPlanet(scene, config);
      planetas.push(planeta);
    });
    planetasRef.current = planetas;

    // Inicializar raycaster después de un pequeño delay para asegurar que los hooks estén listos
    // Usar setTimeout para que se ejecute después de que los refs estén actualizados
    setTimeout(() => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.initRaycaster();
      }
    }, 0);

    // Configurar eventos de interacción - usar refs para evitar recreaciones
    const handleMouseDown = (e: MouseEvent) => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleMouseDown(e);
      }
    };
    const handleMouseUp = () => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleMouseUp();
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (planetInteractionRef.current && cameraControlsRef.current) {
        planetInteractionRef.current.handleMouseMove(
          e, 
          cameraControlsRef.current.rotateCamera,
          handlePlanetHoverRef.current
        );
      }
    };
    const handleMouseLeave = () => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleMouseLeave(handlePlanetHoverRef.current);
      }
    };
    const handleWheel = (e: WheelEvent) => {
      if (planetInteractionRef.current && cameraControlsRef.current) {
        planetInteractionRef.current.handleWheel(e, cameraControlsRef.current.zoomCamera);
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleClick(e);
      }
    };

    // Manejadores de eventos táctiles para soporte móvil
    const handleTouchStart = (e: TouchEvent) => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleTouchStart(e);
      }
    };

    const handleTouchEnd = () => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleTouchEnd();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (planetInteractionRef.current && cameraControlsRef.current) {
        planetInteractionRef.current.handleTouchMove(
          e, 
          cameraControlsRef.current.rotateCamera,
          cameraControlsRef.current.zoomCamera
        );
      }
    };

    const handleTap = (e: TouchEvent) => {
      if (planetInteractionRef.current) {
        planetInteractionRef.current.handleTap(e);
      }
    };

    // Registrar eventos del mouse
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("wheel", handleWheel, { passive: false as unknown as boolean });
    container.addEventListener("click", handleClick);

    // Registrar eventos táctiles para soporte móvil
    container.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    // passive: false permite llamar preventDefault() para evitar el scroll
    container.addEventListener("touchmove", handleTouchMove, { passive: false as unknown as boolean });
    container.addEventListener("touchend", handleTap);

    // Loop de animación
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Animar planetas - usar ref para evitar problemas de captura
      if (planetAnimationRef.current) {
        planetAnimationRef.current.animateFrame();
      }

      // Seguir planeta seleccionado suavemente
      const currentSelected = selectedPlanetRef.current;
      if (currentSelected && followFramesRef.current > 0 && cameraControlsRef.current) {
        if (currentSelected === "sol" && sunRef.current) {
          sunRef.current.getWorldPosition(cameraControlsRef.current.tempVec.current);
          cameraControlsRef.current.focusOnPosition(
            cameraControlsRef.current.tempVec.current,
            getSunFocusDistance(),
            true
          );
        } else {
          const planeta = planetasRef.current.find((p) => p.id === currentSelected);
          if (planeta && cameraControlsRef.current) {
            planeta.mesh.getWorldPosition(cameraControlsRef.current.tempVec.current);
            cameraControlsRef.current.focusOnPosition(
              cameraControlsRef.current.tempVec.current,
              getPlanetFocusDistance(planeta.distancia),
              true
            );
          }
        }
        followFramesRef.current -= 1;
      }

      // Actualizar posición de cámara
      if (cameraControlsRef.current) {
        cameraControlsRef.current.updateCameraPosition();
      }

      // Renderizar
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      // Remover eventos del mouse
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("wheel", handleWheel as unknown as EventListener);
      container.removeEventListener("click", handleClick);
      
      // Remover eventos táctiles
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove as unknown as EventListener);
      container.removeEventListener("touchend", handleTap);
      
      if (renderer) {
        renderer.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // SOLO ejecutar una vez al montar - sin dependencias

  // Hook para manejar resize
  useResizeHandler(containerRef, cameraRef, rendererRef);

  // Actualizar estado de animación - usar refs para evitar ejecuciones innecesarias
  useEffect(() => {
    if (planetAnimationRef.current) {
      planetAnimationRef.current.setPaused(isPaused);
    }
  }, [isPaused]);

  useEffect(() => {
    if (planetAnimationRef.current) {
      planetAnimationRef.current.setSpeed(velocidadAnimacion);
    }
  }, [velocidadAnimacion]);

  // Enfocar planeta seleccionado - usar refs para evitar ejecuciones innecesarias
  useEffect(() => {
    if (!planetaSeleccionado || !cameraControlsRef.current) return;

    if (planetaSeleccionado === "sol") {
      if (!sunRef.current) return;
      sunRef.current.getWorldPosition(cameraControlsRef.current.tempVec.current);
      const controls = setSunFocusControls(cameraControlsRef.current.tempVec.current);
      cameraControlsRef.current.controlsRef.current = controls;
      followFramesRef.current = CAMERA_CONTROLS_CONFIG.followFrames;
      return;
    }

    if (!planetasRef.current.length) return;
    const planeta = planetasRef.current.find((p) => p.id === planetaSeleccionado);
    if (!planeta) return;

    planeta.mesh.getWorldPosition(cameraControlsRef.current.tempVec.current);
    const controls = setPlanetFocusControls(
      cameraControlsRef.current.tempVec.current,
      planeta.distancia
    );
    cameraControlsRef.current.controlsRef.current = controls;
    followFramesRef.current = CAMERA_CONTROLS_CONFIG.followFrames;
  }, [planetaSeleccionado, focusTick]);

  // Refs para rastrear valores anteriores y evitar ejecuciones innecesarias
  const prevResetVistaRef = useRef(resetVista);
  const prevVistaGeneralRef = useRef(vistaGeneral);

  // Reset de vista - solo ejecutar cuando cambia de false a true
  useEffect(() => {
    if (resetVista && !prevResetVistaRef.current && cameraControlsRef.current) {
      cameraControlsRef.current.resetCamera();
    }
    prevResetVistaRef.current = resetVista;
  }, [resetVista]);

  // Vista general - solo ejecutar cuando cambia de false a true
  useEffect(() => {
    if (vistaGeneral && !prevVistaGeneralRef.current && cameraControlsRef.current) {
      cameraControlsRef.current.setGeneralView();
    }
    prevVistaGeneralRef.current = vistaGeneral;
  }, [vistaGeneral]);

  // Reset completo de rotaciones - usar refs para evitar ejecuciones innecesarias
  useEffect(() => {
    if (!planetasRef.current.length) return;
    if (planetAnimationRef.current) {
      planetAnimationRef.current.resetRotations();
    }
  }, [resetTick]);

  // Manejo de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenNow);
      if (onFullscreenChange) {
        onFullscreenChange(isFullscreenNow);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onFullscreenChange]);

  // Mostrar/ocultar ficha en fullscreen
  useEffect(() => {
    if (isFullscreen && planetaData) {
      if (fichaAbierta) {
        setMostrarFicha(true);
      } else {
        setMostrarFicha(false);
      }
    } else if (!isFullscreen) {
      setMostrarFicha(true);
    }
  }, [isFullscreen, planetaData?.id, fichaAbierta]);

  // Lectura automática de ficha en fullscreen
  useEffect(() => {
    if (isFullscreen && planetaData && autoLeerFicha && vozActiva && fichaAbierta) {
      let resumen = `${planetaData.nombre}. ${planetaData.descripcion}. ${textosFicha.datos.diametro}: ${planetaData.diametro}.`;
      if (planetaData.distanciaSol) {
        resumen += ` ${textosFicha.datos.distanciaSol}: ${planetaData.distanciaSol}.`;
      }
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(resumen);
          u.lang = "es-ES";
          u.rate = 1;
          window.speechSynthesis.speak(u);
        } catch {
          // Ignorar errores
        }
      }
    }
    return () => {
      if (isFullscreen && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignorar errores
        }
      }
    };
  }, [
    isFullscreen,
    planetaData?.id,
    autoLeerFicha,
    vozActiva,
    fichaAbierta,
    planetaData?.nombre,
    planetaData?.descripcion,
    planetaData?.diametro,
    planetaData?.distanciaSol,
    textosFicha,
  ]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const el = outerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={outerRef}
      className="relative w-full h-full"
      style={{ maxWidth: "100%", overflow: "hidden", width: "100%", height: "100%" }}
    >
      <div
        ref={containerRef}
        className="w-full h-full rounded-lg bg-black"
        style={{
          cursor,
          maxWidth: "100%",
          maxHeight: "100%",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Mensaje de planeta seleccionado (doble clic) */}
      {mensajeSeleccion && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 bg-emerald-500/90 text-white rounded-lg shadow-lg backdrop-blur-sm animate-fade-in">
          <p className="text-sm font-medium whitespace-nowrap">{mensajeSeleccion}</p>
        </div>
      )}

      {/* Botón de pantalla completa */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800/70 text-white hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? "Salir" : "Pantalla completa"}
      </button>

      {/* Controles en modo fullscreen */}
      {isFullscreen && onPauseToggle && (
        <SolarSystemControls
          isPaused={isPaused}
          velocidadAnimacion={velocidadAnimacion}
          mostrarControles={mostrarControles}
          vozActiva={vozActiva}
          textos={{ controles: textosControles }}
          onToggleControles={() => setMostrarControles(!mostrarControles)}
          onPauseToggle={onPauseToggle}
          onVelocidadChange={onVelocidadChange}
          onResetVista={onResetVista}
          onVistaGeneral={onVistaGeneral}
          onRestablecer={onRestablecer}
          onVozToggle={onVozToggle}
        />
      )}

      {/* Ficha del planeta en modo fullscreen */}
      {isFullscreen && planetaData && (
        <PlanetCardFullscreen
          planetaData={planetaData}
          planetaActualIndex={planetaActualIndex}
          mostrarFicha={mostrarFicha}
          textos={{ ficha: textosFicha }}
          onToggleFicha={() => setMostrarFicha(!mostrarFicha)}
          onCerrarFicha={onCerrarFicha}
          onAnteriorPlaneta={onAnteriorPlaneta}
          onSiguientePlaneta={onSiguientePlaneta}
        />
      )}
    </div>
  );
}

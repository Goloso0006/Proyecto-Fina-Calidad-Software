import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface SistemaSolar3DProps {
velocidadAnimacion: number;
isPaused: boolean;
// eslint-disable-next-line no-unused-vars
onPlanetaClick: (planetaId: string) => void;
planetaSeleccionado: string | null;
resetVista: boolean;
vistaGeneral: boolean;
focusTick?: number;
resetTick?: number;
// eslint-disable-next-line no-unused-vars
onFullscreenChange?: (isFullscreen: boolean) => void;
// Controles para modo fullscreen
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
// Datos del planeta para ficha en fullscreen
planetaData?: {
    id: string;
    nombre: string;
    descripcion: string;
    diametro: string;
    distanciaSol: string;
    periodoRotacion: string;
    periodoOrbital: string;
    datosCuriosos: string[];
} | null;
planetaActualIndex?: number;
onCerrarFicha?: () => void;
onAnteriorPlaneta?: () => void;
onSiguientePlaneta?: () => void;
autoLeerFicha?: boolean;
}

interface Planeta3D {
mesh: THREE.Mesh;
orbita: THREE.Group;
distancia: number;
velocidadOrbital: number;
velocidadRotacion: number;
id: string;
}

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
}: SistemaSolar3DProps) {
const outerRef = useRef<HTMLDivElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const sceneRef = useRef<THREE.Scene | null>(null);
const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
const planetasRef = useRef<Planeta3D[]>([]);
const sunRef = useRef<THREE.Mesh | null>(null);
const raycasterRef = useRef<THREE.Raycaster | null>(null);
const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
const isDraggingRef = useRef(false);
const previousMousePositionRef = useRef({ x: 0, y: 0 });
const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");
const [isFullscreen, setIsFullscreen] = useState(false);
const [mostrarControles, setMostrarControles] = useState(true);
const [mostrarFicha, setMostrarFicha] = useState(true);

// Mostrar ficha automáticamente cuando se selecciona un planeta en fullscreen
useEffect(() => {
    if (isFullscreen && planetaData) {
        setMostrarFicha(true);
    }
}, [isFullscreen, planetaData?.id]);
const cameraControlsRef = useRef({
    rotationX: 0,
    rotationY: 0,
    distance: 50,
    target: new THREE.Vector3(0, 0, 0),
});

// Refs reactivas para evitar re-montajes
const pausedRef = useRef(isPaused);
const speedRef = useRef(velocidadAnimacion);
const clickHandlerRef = useRef(onPlanetaClick);
const selectedIdRef = useRef<string | null>(planetaSeleccionado);
const followFramesRef = useRef(0);
const tempVec = useRef(new THREE.Vector3());

useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);
useEffect(() => { speedRef.current = velocidadAnimacion; }, [velocidadAnimacion]);
useEffect(() => { clickHandlerRef.current = onPlanetaClick; }, [onPlanetaClick]);
useEffect(() => { selectedIdRef.current = planetaSeleccionado; }, [planetaSeleccionado]);

// Configuración de planetas (proporciones educativas)
const configPlanetas = [
    { id: "mercurio", distancia: 8, velocidadOrbital: 4.15, velocidadRotacion: 0.02, tamaño: 0.4, color: 0x8c7853 },
    { id: "venus", distancia: 11, velocidadOrbital: 1.6, velocidadRotacion: 0.01, tamaño: 0.6, color: 0xffc649 },
    { id: "tierra", distancia: 14, velocidadOrbital: 1.0, velocidadRotacion: 0.03, tamaño: 0.6, color: 0x4a90e2 },
    { id: "marte", distancia: 18, velocidadOrbital: 0.53, velocidadRotacion: 0.03, tamaño: 0.5, color: 0xcd5c5c },
    { id: "jupiter", distancia: 28, velocidadOrbital: 0.08, velocidadRotacion: 0.04, tamaño: 1.2, color: 0xd8ca9d },
    { id: "saturno", distancia: 38, velocidadOrbital: 0.03, velocidadRotacion: 0.035, tamaño: 1.0, color: 0xfad5a5 },
    { id: "urano", distancia: 48, velocidadOrbital: 0.01, velocidadRotacion: 0.025, tamaño: 0.8, color: 0x4fd0e7 },
    { id: "neptuno", distancia: 58, velocidadOrbital: 0.006, velocidadRotacion: 0.025, tamaño: 0.8, color: 0x4b70dd },
];

useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // Usar el tamaño real del contenedor (se adapta con flexbox)
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(50, 50, 50);
    scene.add(dirLight);

    // Sol
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunRef.current = sun;

    // Raycaster para detección de clics
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Crear planetas
    const planetas: Planeta3D[] = [];
    configPlanetas.forEach((config) => {
    const orbitaGroup = new THREE.Group();
    scene.add(orbitaGroup);

    const geometry = new THREE.SphereGeometry(config.tamaño, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: config.color });
    const planetaMesh = new THREE.Mesh(geometry, material);
    planetaMesh.position.x = config.distancia;
    planetaMesh.userData.planetaId = config.id;
    planetaMesh.userData.esPlaneta = true;

    orbitaGroup.add(planetaMesh);

    const orbitaGeometry = new THREE.RingGeometry(
        config.distancia - 0.1,
        config.distancia + 0.1,
        64
    );
    const orbitaMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
    });
    const orbitaLine = new THREE.Mesh(orbitaGeometry, orbitaMaterial);
    orbitaLine.rotation.x = -Math.PI / 2;
    scene.add(orbitaLine);

    planetas.push({
        mesh: planetaMesh,
        orbita: orbitaGroup,
        distancia: config.distancia,
        velocidadOrbital: config.velocidadOrbital,
        velocidadRotacion: config.velocidadRotacion,
        id: config.id,
    });
    });

    planetasRef.current = planetas;

    // Controles de mouse
    let mouseDownTime = 0;
    let mouseDownPosition = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
    isDraggingRef.current = true;
    setCursor("grabbing");
    mouseDownTime = Date.now();
    mouseDownPosition = { x: event.clientX, y: event.clientY };
    previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
    };
    };

    const onMouseUp = () => {
    isDraggingRef.current = false;
    setCursor("grab");
    };

    const onMouseMove = (event: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = event.clientX - previousMousePositionRef.current.x;
    const deltaY = event.clientY - previousMousePositionRef.current.y;

    cameraControlsRef.current.rotationY += deltaX * 0.01;
    cameraControlsRef.current.rotationX += deltaY * 0.01;

    cameraControlsRef.current.rotationX = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, cameraControlsRef.current.rotationX)
    );

    previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
    };
    };

    const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY * 0.01;
    cameraControlsRef.current.distance = Math.max(
        10,
        Math.min(150, cameraControlsRef.current.distance + delta)
    );
    };

    const onMouseClick = (event: MouseEvent) => {
    const timeSinceMouseDown = Date.now() - mouseDownTime;
    const distanceMoved = Math.sqrt(
        Math.pow(event.clientX - mouseDownPosition.x, 2) +
        Math.pow(event.clientY - mouseDownPosition.y, 2)
    );

    if (timeSinceMouseDown > 300 || distanceMoved > 5) {
        return;
    }

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouseRef.current, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
        if (intersect.object.userData.esPlaneta) {
        clickHandlerRef.current(intersect.object.userData.planetaId);
        break;
        }
    }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("wheel", onWheel, { passive: false as unknown as boolean });
    container.addEventListener("click", onMouseClick);

    // Animación
    let animationId: number;
    const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (!pausedRef.current) {
        planetas.forEach((planeta) => {
        planeta.orbita.rotation.y +=
            planeta.velocidadOrbital * speedRef.current * 0.01;
        planeta.mesh.rotation.y +=
            planeta.velocidadRotacion * speedRef.current;
        });

        if (sunRef.current) sunRef.current.rotation.y += 0.01 * speedRef.current;
    }

    // Seguir al planeta seleccionado por varios frames usando su posición mundial
    if (selectedIdRef.current && followFramesRef.current > 0) {
        const p = planetasRef.current.find((x) => x.id === selectedIdRef.current);
        if (p) {
        p.mesh.getWorldPosition(tempVec.current);
        cameraControlsRef.current.target.lerp(tempVec.current, 0.25);
        const desiredDist = p.distancia + 5;
        cameraControlsRef.current.distance = THREE.MathUtils.lerp(
            cameraControlsRef.current.distance,
            desiredDist,
            0.2
        );
        }
        followFramesRef.current -= 1;
    }

    const controls = cameraControlsRef.current;
    const spherical = new THREE.Spherical(
        controls.distance,
        Math.PI / 2 - controls.rotationX,
        controls.rotationY
    );
    camera.position.setFromSpherical(spherical);
    camera.lookAt(controls.target);

    renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    // Usar siempre el tamaño real del contenedor (se adapta con flexbox)
    // Usar requestAnimationFrame para asegurar que el DOM se haya actualizado
    requestAnimationFrame(() => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        // Obtener el tamaño del contenedor, pero limitarlo al tamaño máximo disponible
        const container = containerRef.current;
        const parent = container.parentElement;
        const maxWidth = parent ? Math.min(parent.clientWidth, window.innerWidth) : window.innerWidth;
        const maxHeight = parent ? Math.min(parent.clientHeight, window.innerHeight) : window.innerHeight;
        
        const newWidth = Math.min(container.clientWidth, maxWidth);
        const newHeight = Math.min(container.clientHeight, maxHeight);

        if (newWidth > 0 && newHeight > 0) {
            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
        }
    });
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // También escuchar cambios de tamaño de la ventana (para detectar zoom)
    const onWindowResize = () => {
        // Pequeño delay para asegurar que el DOM se haya actualizado después del zoom
        setTimeout(() => {
            onResize();
        }, 100);
    };
    window.addEventListener("resize", onWindowResize);

    const onFsChange = () => {
    const isFullscreenNow = !!document.fullscreenElement;
    setIsFullscreen(isFullscreenNow);
    // Actualizar el tamaño cuando cambia el modo fullscreen
    // Usar múltiples requestAnimationFrame para asegurar que el DOM se haya actualizado completamente
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (containerRef.current && cameraRef.current && rendererRef.current) {
                // Usar siempre el tamaño real del contenedor, limitado al tamaño máximo disponible
                const container = containerRef.current;
                const parent = container.parentElement;
                const maxWidth = parent ? Math.min(parent.clientWidth, window.innerWidth) : window.innerWidth;
                const maxHeight = parent ? Math.min(parent.clientHeight, window.innerHeight) : window.innerHeight;
                
                const newWidth = Math.min(container.clientWidth, maxWidth);
                const newHeight = Math.min(container.clientHeight, maxHeight);
                
                if (newWidth > 0 && newHeight > 0) {
                    cameraRef.current.aspect = newWidth / newHeight;
                    cameraRef.current.updateProjectionMatrix();
                    rendererRef.current.setSize(newWidth, newHeight);
                }
            }
        });
    });
    if (onFullscreenChange) {
        onFullscreenChange(isFullscreenNow);
    }
    };
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
    cancelAnimationFrame(animationId);
    container.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("wheel", onWheel as unknown as EventListener);
    container.removeEventListener("click", onMouseClick);
    resizeObserver.disconnect();
    window.removeEventListener("resize", onWindowResize);
    document.removeEventListener("fullscreenchange", onFsChange);
    renderer.dispose();
    container.removeChild(renderer.domElement);
    };
}, []);

// Enfocar cuando cambia selección o focusTick
useEffect(() => {
    if (!planetaSeleccionado || !planetasRef.current.length) return;

    const planeta = planetasRef.current.find((p) => p.id === planetaSeleccionado);
    if (!planeta) return;

    // Usar posición mundial para el objetivo inicial
    planeta.mesh.getWorldPosition(tempVec.current);
    cameraControlsRef.current.target.copy(tempVec.current);
    cameraControlsRef.current.distance = planeta.distancia + 5;
    cameraControlsRef.current.rotationX = 0.3;
    cameraControlsRef.current.rotationY = 0; // mantener yaw actual si se desea

    // Seguir más tiempo para asegurar enfoque
    followFramesRef.current = 180;
}, [planetaSeleccionado, focusTick]);

// Reset de vista (cámara)
useEffect(() => {
    if (resetVista) {
    cameraControlsRef.current = {
        rotationX: 0,
        rotationY: 0,
        distance: 50,
        target: new THREE.Vector3(0, 0, 0),
    };
    }
}, [resetVista]);

// Vista general
useEffect(() => {
    if (vistaGeneral) {
    cameraControlsRef.current = {
        rotationX: 0,
        rotationY: 0,
        distance: 80,
        target: new THREE.Vector3(0, 0, 0),
    };
    }
}, [vistaGeneral]);

// Reset completo
useEffect(() => {
    if (!planetasRef.current.length) return;
    planetasRef.current.forEach((p) => {
    p.orbita.rotation.set(0, 0, 0);
    p.mesh.rotation.set(0, 0, 0);
    });
    if (sunRef.current) sunRef.current.rotation.set(0, 0, 0);
}, [resetTick]);

const toggleFullscreen = () => {
    const el = outerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
    el.requestFullscreen().catch(() => {});
    } else {
    document.exitFullscreen().catch(() => {});
    }
};

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

// Lectura automática de la ficha en fullscreen
useEffect(() => {
    if (isFullscreen && planetaData && autoLeerFicha && vozActiva) {
        const resumen = `${planetaData.nombre}. ${planetaData.descripcion}. ${textosFicha.datos.diametro}: ${planetaData.diametro}. ${textosFicha.datos.distanciaSol}: ${planetaData.distanciaSol}.`;
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
}, [isFullscreen, planetaData?.id, autoLeerFicha, vozActiva, planetaData?.nombre, planetaData?.descripcion, planetaData?.diametro, planetaData?.distanciaSol, textosFicha]);

return (
    <div ref={outerRef} className="relative w-full h-full" style={{ maxWidth: "100%", overflow: "hidden", width: "100%", height: "100%" }}>
    <div
        ref={containerRef}
        className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-800 bg-black"
        style={{ cursor, maxWidth: "100%", maxHeight: "100%", boxSizing: "border-box", width: "100%", height: "100%" }}
    />

    {/* Botón de pantalla completa - Movido abajo a la derecha */}
    <button
        onClick={toggleFullscreen}
        className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800/70 text-white hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
    >
        {isFullscreen ? "Salir" : "Pantalla completa"}
    </button>

    {/* Controles en modo fullscreen */}
    {isFullscreen && onPauseToggle && (
        <div className="absolute top-3 left-3 z-20">
            {/* Botón para ocultar/mostrar controles */}
            <button
                onClick={() => setMostrarControles(!mostrarControles)}
                className="mb-1 px-2 py-1 text-xs bg-slate-900/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-800/90 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={mostrarControles ? "Ocultar controles" : "Mostrar controles"}
                title={mostrarControles ? "Ocultar controles" : "Mostrar controles"}
            >
                {mostrarControles ? "◄" : "►"}
            </button>

            {/* Panel de controles */}
            {mostrarControles && (
                <div className="bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl p-2.5 flex flex-col gap-1.5 min-w-[180px]">
                    {/* Botón Pausar/Reanudar */}
                    <button
                        onClick={onPauseToggle}
                        className="px-2.5 py-1.5 text-xs bg-emerald-500/90 hover:bg-emerald-500 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-1.5"
                        aria-label={isPaused ? textosControles.reanudar : textosControles.pausar}
                    >
                        <span>{isPaused ? "▶" : "⏸"}</span>
                        <span>{isPaused ? textosControles.reanudar : textosControles.pausar}</span>
                    </button>

                    {/* Control de velocidad */}
                    {onVelocidadChange && (
                        <div className="flex items-center gap-1.5 px-1 py-1">
                            <label htmlFor="velocidad-fs" className="text-xs text-white/90 w-12 shrink-0">
                                {textosControles.velocidad}:
                            </label>
                            <input
                                id="velocidad-fs"
                                type="range"
                                min="0"
                                max="5"
                                step="0.1"
                                value={velocidadAnimacion}
                                onChange={(e) => onVelocidadChange(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                style={{
                                    background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${(velocidadAnimacion / 5) * 100}%, rgb(51 65 85) ${(velocidadAnimacion / 5) * 100}%, rgb(51 65 85) 100%)`
                                }}
                                aria-label={`${textosControles.velocidad}: ${velocidadAnimacion.toFixed(1)}x`}
                            />
                            <span className="text-xs text-white/90 w-8 text-right shrink-0">
                                {velocidadAnimacion.toFixed(1)}x
                            </span>
                        </div>
                    )}

                    {/* Botones en fila compacta */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {/* Botón Reset Vista */}
                        {onResetVista && (
                            <button
                                onClick={onResetVista}
                                className="px-2 py-1.5 text-xs bg-slate-600/80 hover:bg-slate-600 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 flex items-center justify-center gap-1"
                                aria-label={textosControles.resetVista}
                                title={textosControles.resetVista}
                            >
                                <span>🔄</span>
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                        )}

                        {/* Botón Vista General */}
                        {onVistaGeneral && (
                            <button
                                onClick={onVistaGeneral}
                                className="px-2 py-1.5 text-xs bg-blue-500/90 hover:bg-blue-500 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-1"
                                aria-label={textosControles.vistaGeneral}
                                title={textosControles.vistaGeneral}
                            >
                                <span>👁️</span>
                                <span className="hidden sm:inline">Vista</span>
                            </button>
                        )}
                    </div>

                    {/* Botones en fila compacta */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {/* Botón Restablecer */}
                        {onRestablecer && (
                            <button
                                onClick={onRestablecer}
                                className="px-2 py-1.5 text-xs bg-red-500/90 hover:bg-red-500 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-1"
                                aria-label="Restablecer sistema"
                                title="Restablecer sistema"
                            >
                                <span>🔁</span>
                                <span>Reset</span>
                            </button>
                        )}

                        {/* Botón Voz */}
                        {onVozToggle && (
                            <button
                                onClick={onVozToggle}
                                className={`px-2 py-1.5 text-xs rounded-md font-medium transition-all focus:outline-none focus:ring-2 flex items-center justify-center gap-1 ${
                                    vozActiva 
                                        ? 'bg-rose-500/90 hover:bg-rose-500 text-white focus:ring-rose-500' 
                                        : 'bg-slate-600/80 hover:bg-slate-600 text-white focus:ring-slate-500'
                                }`}
                                aria-pressed={vozActiva}
                                aria-label="Alternar narración por voz"
                                title="Alternar narración por voz"
                            >
                                <span>🔊</span>
                                <span>{vozActiva ? "ON" : "OFF"}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )}

    {/* Ficha del planeta en modo fullscreen - Movida arriba a la derecha */}
    {isFullscreen && planetaData && (
        <div className="absolute top-3 right-3 z-20">
            {/* Botón para ocultar/mostrar ficha */}
            <button
                onClick={() => setMostrarFicha(!mostrarFicha)}
                className="mb-1 px-2 py-1 text-xs bg-slate-900/80 backdrop-blur-sm text-white rounded-md hover:bg-slate-800/90 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={mostrarFicha ? "Ocultar ficha" : "Mostrar ficha"}
                title={mostrarFicha ? "Ocultar ficha" : "Mostrar ficha"}
            >
                {mostrarFicha ? "▼" : "▲"}
            </button>

            {/* Panel de ficha */}
            {mostrarFicha && (
                <div className="bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl p-5 max-w-[520px] max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-700/50">
                        <h3 className="text-lg font-bold text-white">{planetaData.nombre}</h3>
                        {onCerrarFicha && (
                            <button
                                onClick={onCerrarFicha}
                                className="text-white/70 hover:text-white text-lg leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                                aria-label="Cerrar ficha"
                                title="Cerrar ficha"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Descripción */}
                    <p className="text-base text-white/90 mb-5 leading-relaxed">
                        {planetaData.descripcion}
                    </p>

                    {/* Datos básicos - Grid compacto */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <div className="text-sm text-white/70 mb-1.5">{textosFicha.datos.diametro}</div>
                            <div className="text-base font-semibold text-white">{planetaData.diametro}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <div className="text-sm text-white/70 mb-1.5">{textosFicha.datos.distanciaSol}</div>
                            <div className="text-base font-semibold text-white">{planetaData.distanciaSol}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <div className="text-sm text-white/70 mb-1.5">{textosFicha.datos.periodoRotacion}</div>
                            <div className="text-base font-semibold text-white">{planetaData.periodoRotacion}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <div className="text-sm text-white/70 mb-1.5">{textosFicha.datos.periodoOrbital}</div>
                            <div className="text-base font-semibold text-white">{planetaData.periodoOrbital}</div>
                        </div>
                    </div>

                    {/* Datos curiosos - Compacto */}
                    {planetaData.datosCuriosos && planetaData.datosCuriosos.length > 0 && (
                        <div className="mb-5">
                            <h4 className="text-base font-semibold text-white/90 mb-3">{textosFicha.datos.datosCuriosos}</h4>
                            <ul className="space-y-2.5">
                                {planetaData.datosCuriosos.slice(0, 3).map((dato, index) => (
                                    <li key={index} className="flex items-start gap-2.5 text-sm text-white/80">
                                        <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                                        <span>{dato}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Navegación */}
                    {(onAnteriorPlaneta || onSiguientePlaneta) && (
                        <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-700/50">
                            {onAnteriorPlaneta && (
                                <button
                                    onClick={onAnteriorPlaneta}
                                    disabled={planetaActualIndex <= 0}
                                    className={`px-4 py-2 text-sm rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        planetaActualIndex <= 0
                                            ? "bg-slate-700/50 text-white/40 cursor-not-allowed"
                                            : "bg-emerald-500/90 hover:bg-emerald-500 text-white"
                                    }`}
                                    aria-label={textosFicha.anterior}
                                >
                                    ← {textosFicha.anterior}
                                </button>
                            )}
                            <span className="text-sm text-white/60">
                                {planetaActualIndex >= 0 ? `${planetaActualIndex + 1} / 8` : ""}
                            </span>
                            {onSiguientePlaneta && (
                                <button
                                    onClick={onSiguientePlaneta}
                                    disabled={planetaActualIndex >= 7}
                                    className={`px-4 py-2 text-sm rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        planetaActualIndex >= 7
                                            ? "bg-slate-700/50 text-white/40 cursor-not-allowed"
                                            : "bg-emerald-500/90 hover:bg-emerald-500 text-white"
                                    }`}
                                    aria-label={textosFicha.siguiente}
                                >
                                    {textosFicha.siguiente} →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )}
    </div>
);
}

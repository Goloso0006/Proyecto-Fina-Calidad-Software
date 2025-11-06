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
    if (!containerRef.current) return;
    const newWidth = containerRef.current.clientWidth;
    const newHeight = containerRef.current.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    const onFsChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
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

return (
    <div ref={outerRef} className="relative w-full h-full">
    <div
        ref={containerRef}
        className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-800 bg-black"
        style={{ minHeight: "600px", cursor }}
    />

    <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800/70 text-white hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
    >
        {isFullscreen ? "Salir" : "Pantalla completa"}
    </button>
    </div>
);
}

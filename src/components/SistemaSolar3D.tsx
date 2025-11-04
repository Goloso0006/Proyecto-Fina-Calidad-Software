import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface SistemaSolar3DProps {
velocidadAnimacion: number;
isPaused: boolean;
onPlanetaClick: (planetaId: string) => void;
planetaSeleccionado: string | null;
resetVista: boolean;
vistaGeneral: boolean;
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
}: SistemaSolar3DProps) {
const containerRef = useRef<HTMLDivElement>(null);
const sceneRef = useRef<THREE.Scene | null>(null);
const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
const planetasRef = useRef<Planeta3D[]>([]);
const raycasterRef = useRef<THREE.Raycaster | null>(null);
const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
const isDraggingRef = useRef(false);
const previousMousePositionRef = useRef({ x: 0, y: 0 });
const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");
const cameraControlsRef = useRef({
    rotationX: 0,
    rotationY: 0,
    distance: 50,
    target: new THREE.Vector3(0, 0, 0),
});

// Configuración de planetas con datos reales aproximados (proporciones educativas)
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

    // Raycaster para detección de clics
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Crear planetas
    const planetas: Planeta3D[] = [];
    configPlanetas.forEach((config) => {
    // Grupo para órbita (permite rotación alrededor del sol)
    const orbitaGroup = new THREE.Group();
    scene.add(orbitaGroup);

    // Geometría y material del planeta
    const geometry = new THREE.SphereGeometry(config.tamaño, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: config.color });
    const planetaMesh = new THREE.Mesh(geometry, material);
    planetaMesh.position.x = config.distancia;
    planetaMesh.userData.planetaId = config.id;
    planetaMesh.userData.esPlaneta = true;

    orbitaGroup.add(planetaMesh);

    // Línea de órbita (opcional, para visualización)
    const orbitaGeometry = new THREE.RingGeometry(config.distancia - 0.1, config.distancia + 0.1, 64);
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

    // Limitar rotación vertical
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

    // Solo hacer clic si no se movió mucho el mouse (arrastre) y fue un clic rápido
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
        onPlanetaClick(intersect.object.userData.planetaId);
        break;
        }
    }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("wheel", onWheel);
    container.addEventListener("click", onMouseClick);

    // Animación
    let animationId: number;
    const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (!isPaused) {
        // Animar planetas
        planetas.forEach((planeta) => {
        // Rotación alrededor del sol (traslación)
        planeta.orbita.rotation.y += planeta.velocidadOrbital * velocidadAnimacion * 0.01;
        // Rotación sobre su propio eje
        planeta.mesh.rotation.y += planeta.velocidadRotacion * velocidadAnimacion;
        });

        // Rotar el sol
        sun.rotation.y += 0.01 * velocidadAnimacion;
    }

    // Actualizar posición de cámara basada en controles
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

    // Manejar resize
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

    // Cleanup
    return () => {
    cancelAnimationFrame(animationId);
    container.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("wheel", onWheel);
    container.removeEventListener("click", onMouseClick);
    resizeObserver.disconnect();
    renderer.dispose();
    container.removeChild(renderer.domElement);
    };
}, [isPaused, velocidadAnimacion, onPlanetaClick]);

// Efecto para enfocar planeta seleccionado
useEffect(() => {
    if (!planetaSeleccionado || !cameraRef.current || !planetasRef.current.length) return;

    const planeta = planetasRef.current.find((p) => p.id === planetaSeleccionado);
    if (!planeta) return;

    // Obtener posición del planeta en la órbita
    const angulo = planeta.orbita.rotation.y;
    const x = Math.cos(angulo) * planeta.distancia;
    const z = Math.sin(angulo) * planeta.distancia;
    const posicionPlaneta = new THREE.Vector3(x, 0, z);

    cameraControlsRef.current.target.copy(posicionPlaneta);
    cameraControlsRef.current.distance = planeta.distancia + 5;
    cameraControlsRef.current.rotationY = Math.atan2(posicionPlaneta.x, posicionPlaneta.z);
    cameraControlsRef.current.rotationX = 0.3;
}, [planetaSeleccionado]);

// Efecto para reset de vista
useEffect(() => {
    if (resetVista && cameraControlsRef.current) {
    cameraControlsRef.current = {
        rotationX: 0,
        rotationY: 0,
        distance: 50,
        target: new THREE.Vector3(0, 0, 0),
    };
    }
}, [resetVista]);

// Efecto para vista general
useEffect(() => {
    if (vistaGeneral && cameraControlsRef.current) {
    cameraControlsRef.current = {
        rotationX: 0,
        rotationY: 0,
        distance: 80,
        target: new THREE.Vector3(0, 0, 0),
    };
    }
}, [vistaGeneral]);

return (
    <div
    ref={containerRef}
    className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-800 bg-black"
    style={{ minHeight: "600px", cursor }}
    />
);
}


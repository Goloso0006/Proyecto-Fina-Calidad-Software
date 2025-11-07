import { useRef, useCallback } from "react";
import * as THREE from "three";
import { CLICK_DETECTION_CONFIG } from "../../utils/solar-system/planetConfig";

/**
 * Hook para manejar las interacciones con los planetas (clics, arrastre)
 * 
 * @param containerRef - Referencia al contenedor del canvas
 * @param cameraRef - Referencia a la cámara de Three.js
 * @param sceneRef - Referencia a la escena de Three.js
 * @param onPlanetClick - Callback cuando se hace clic en un planeta
 * @param onDragStart - Callback cuando comienza el arrastre
 * @param onDragEnd - Callback cuando termina el arrastre
 * @returns Funciones y estado para manejar interacciones
 */
export function usePlanetInteraction(
  containerRef: React.RefObject<HTMLDivElement | null>,
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>,
  sceneRef: React.RefObject<THREE.Scene | null>,
  // eslint-disable-next-line no-unused-vars
  onPlanetClick: (planetaId: string, isDoubleClick: boolean) => void,
  onDragStart?: () => void,
  onDragEnd?: () => void
) {
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseDownTimeRef = useRef(0);
  const mouseDownPositionRef = useRef({ x: 0, y: 0 });
  const lastClickTimeRef = useRef(0);
  const lastClickPlanetRef = useRef<string | null>(null);
  // Refs para callbacks para evitar recreaciones
  const onPlanetClickRef = useRef(onPlanetClick);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);
  
  // Actualizar refs cuando cambian los callbacks
  onPlanetClickRef.current = onPlanetClick;
  onDragStartRef.current = onDragStart;
  onDragEndRef.current = onDragEnd;

  /**
   * Inicializa el raycaster si no existe
   */
  const initRaycaster = useCallback(() => {
    if (!raycasterRef.current) {
      raycasterRef.current = new THREE.Raycaster();
    }
  }, []);

  /**
   * Maneja el evento de mouse down
   */
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current) return;

      isDraggingRef.current = true;
      mouseDownTimeRef.current = Date.now();
      mouseDownPositionRef.current = { x: event.clientX, y: event.clientY };
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };

      if (onDragStartRef.current) {
        onDragStartRef.current();
      }
    },
    [containerRef]
  );

  /**
   * Maneja el evento de mouse up
   */
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (onDragEndRef.current) {
      onDragEndRef.current();
    }
  }, []);

  /**
   * Maneja el evento de mouse move (para arrastre)
   */
  const handleMouseMove = useCallback(
    // eslint-disable-next-line no-unused-vars
    (event: MouseEvent, onRotate?: (deltaX: number, deltaY: number) => void) => {
      if (!isDraggingRef.current || !onRotate) return;

      const deltaX = event.clientX - previousMousePositionRef.current.x;
      const deltaY = event.clientY - previousMousePositionRef.current.y;

      onRotate(deltaX, deltaY);

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    },
    []
  );

  /**
   * Maneja el evento de click en un planeta
   */
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (!containerRef.current || !camera || !scene || !raycasterRef.current) return;

      const timeSinceMouseDown = Date.now() - mouseDownTimeRef.current;
      const distanceMoved = Math.sqrt(
        Math.pow(event.clientX - mouseDownPositionRef.current.x, 2) +
          Math.pow(event.clientY - mouseDownPositionRef.current.y, 2)
      );

      // Ignorar si fue un arrastre, no un clic
      if (
        timeSinceMouseDown > CLICK_DETECTION_CONFIG.maxClickTime ||
        distanceMoved > CLICK_DETECTION_CONFIG.maxClickDistance
      ) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      for (const intersect of intersects) {
        if (intersect.object.userData.esPlaneta) {
          const planetaId = intersect.object.userData.planetaId;
          const currentTime = Date.now();
          const timeSinceLastClick = currentTime - lastClickTimeRef.current;
          const isDoubleClick = 
            timeSinceLastClick < 500 && // Menos de 500ms desde el último clic
            lastClickPlanetRef.current === planetaId; // Mismo planeta
          
          // Actualizar referencias para el próximo clic
          lastClickTimeRef.current = currentTime;
          lastClickPlanetRef.current = planetaId;
          
          // Usar el ref para evitar recreaciones del callback
          onPlanetClickRef.current(planetaId, isDoubleClick);
          break;
        }
      }
    },
    [containerRef, cameraRef, sceneRef] // onPlanetClick no en dependencias - se usa ref
  );

  /**
   * Maneja el evento de wheel (zoom)
   */
  const handleWheel = useCallback(
    // eslint-disable-next-line no-unused-vars
    (event: WheelEvent, onZoom?: (delta: number) => void) => {
      if (!onZoom) return;
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      onZoom(delta);
    },
    []
  );

  return {
    raycasterRef,
    mouseRef,
    isDraggingRef,
    initRaycaster,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleClick,
    handleWheel,
  };
}
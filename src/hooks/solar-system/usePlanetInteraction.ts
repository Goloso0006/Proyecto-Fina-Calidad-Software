import { useRef, useCallback } from "react";
import * as THREE from "three";
import { CLICK_DETECTION_CONFIG } from "../../utils/solar-system/planetConfig";

/**
 * Hook para manejar las interacciones con los planetas (clics, arrastre, toques)
 * Soporta tanto dispositivos de escritorio (mouse) como móviles (touch)
 * 
 * @param containerRef - Referencia al contenedor del canvas
 * @param cameraRef - Referencia a la cámara de Three.js
 * @param sceneRef - Referencia a la escena de Three.js
 * @param onPlanetClick - Callback cuando se hace clic/tap en un planeta
 * @param onDragStart - Callback cuando comienza el arrastre/deslizamiento
 * @param onDragEnd - Callback cuando termina el arrastre/deslizamiento
 * @returns Funciones y estado para manejar interacciones de mouse y touch
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
  // ============================================
  // REFS COMPARTIDOS (Mouse y Touch)
  // ============================================
  
  /** Raycaster para detectar intersecciones con objetos 3D */
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  
  /** Vector 2D normalizado para coordenadas de mouse/touch */
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  /** Flag para saber si se está arrastrando (mouse o touch) */
  const isDraggingRef = useRef(false);
  
  /** Tiempo del último clic/tap para detectar doble clic/tap */
  const lastClickTimeRef = useRef(0);
  
  /** ID del último planeta clickeado/tapeado */
  const lastClickPlanetRef = useRef<string | null>(null);

  // ============================================
  // REFS PARA EVENTOS DE MOUSE (Escritorio)
  // ============================================
  
  /** Posición anterior del mouse para calcular deltas de movimiento */
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  
  /** Timestamp cuando se presionó el botón del mouse */
  const mouseDownTimeRef = useRef(0);
  
  /** Posición donde se presionó el botón del mouse */
  const mouseDownPositionRef = useRef({ x: 0, y: 0 });

  // ============================================
  // REFS PARA EVENTOS TÁCTILES (Móviles/Tablets)
  // ============================================
  
  /** Timestamp cuando se inició el toque */
  const touchStartTimeRef = useRef(0);
  
  /** Posición donde se inició el toque */
  const touchStartPositionRef = useRef({ x: 0, y: 0 });
  
  /** Posición anterior del toque para calcular deltas de movimiento */
  const previousTouchPositionRef = useRef({ x: 0, y: 0 });

  // ============================================
  // REFS PARA CALLBACKS
  // ============================================
  
  /** Refs para callbacks para evitar recreaciones innecesarias */
  const onPlanetClickRef = useRef(onPlanetClick);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);
  
  // Actualizar refs cuando cambian los callbacks
  onPlanetClickRef.current = onPlanetClick;
  onDragStartRef.current = onDragStart;
  onDragEndRef.current = onDragEnd;

  // ============================================
  // INICIALIZACIÓN
  // ============================================

  /**
   * Inicializa el raycaster si no existe
   * El raycaster se usa para detectar qué objetos 3D están bajo el cursor/dedo
   */
  const initRaycaster = useCallback(() => {
    if (!raycasterRef.current) {
      raycasterRef.current = new THREE.Raycaster();
    }
  }, []);

  // ============================================
  // MANEJADORES DE EVENTOS DE MOUSE (Escritorio)
  // ============================================

  /**
   * Maneja el evento de mouse down (presionar botón del mouse)
   * Se ejecuta cuando el usuario presiona el botón del mouse sobre el canvas
   */
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current) return;

      // Iniciar arrastre y guardar posición/tiempo inicial
      isDraggingRef.current = true;
      mouseDownTimeRef.current = Date.now();
      mouseDownPositionRef.current = { x: event.clientX, y: event.clientY };
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };

      // Notificar que comenzó el arrastre (cambia cursor a "grabbing")
      if (onDragStartRef.current) {
        onDragStartRef.current();
      }
    },
    [containerRef]
  );

  /**
   * Maneja el evento de mouse up (soltar botón del mouse)
   * Se ejecuta cuando el usuario suelta el botón del mouse
   */
  const handleMouseUp = useCallback(() => {
    // Terminar arrastre
    isDraggingRef.current = false;
    
    // Notificar que terminó el arrastre (cambia cursor a "grab")
    if (onDragEndRef.current) {
      onDragEndRef.current();
    }
  }, []);

  /**
   * Maneja el evento de mouse move (movimiento del mouse mientras está presionado)
   * Permite rotar la cámara arrastrando con el mouse
   */
  const handleMouseMove = useCallback(
    // eslint-disable-next-line no-unused-vars
    (event: MouseEvent, onRotate?: (deltaX: number, deltaY: number) => void) => {
      // Solo procesar si se está arrastrando
      if (!isDraggingRef.current || !onRotate) return;

      // Calcular cuánto se movió el mouse desde la última posición
      const deltaX = event.clientX - previousMousePositionRef.current.x;
      const deltaY = event.clientY - previousMousePositionRef.current.y;

      // Rotar la cámara según el movimiento
      onRotate(deltaX, deltaY);

      // Actualizar posición anterior para el próximo frame
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    },
    []
  );

  /**
   * Maneja el evento de click en un planeta
   * Detecta si fue un clic simple o doble clic
   */
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (!containerRef.current || !camera || !scene || !raycasterRef.current) return;

      // Calcular tiempo y distancia desde mouseDown
      const timeSinceMouseDown = Date.now() - mouseDownTimeRef.current;
      const distanceMoved = Math.sqrt(
        Math.pow(event.clientX - mouseDownPositionRef.current.x, 2) +
          Math.pow(event.clientY - mouseDownPositionRef.current.y, 2)
      );

      // Ignorar si fue un arrastre largo, no un clic rápido
      if (
        timeSinceMouseDown > CLICK_DETECTION_CONFIG.maxClickTime ||
        distanceMoved > CLICK_DETECTION_CONFIG.maxClickDistance
      ) {
        return;
      }

      // Convertir coordenadas de pantalla a coordenadas normalizadas (-1 a 1)
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Configurar raycaster desde la cámara hacia la posición del mouse
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Obtener todos los objetos que intersectan con el rayo
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      // Buscar si se clickeó un planeta
      for (const intersect of intersects) {
        if (intersect.object.userData.esPlaneta) {
          const planetaId = intersect.object.userData.planetaId;
          const currentTime = Date.now();
          const timeSinceLastClick = currentTime - lastClickTimeRef.current;
          
          // Detectar doble clic (dos clics rápidos en el mismo planeta)
          const isDoubleClick = 
            timeSinceLastClick < 500 && // Menos de 500ms desde el último clic
            lastClickPlanetRef.current === planetaId; // Mismo planeta
          
          // Actualizar referencias para el próximo clic
          lastClickTimeRef.current = currentTime;
          lastClickPlanetRef.current = planetaId;
          
          // Notificar que se clickeó un planeta
          onPlanetClickRef.current(planetaId, isDoubleClick);
          break;
        }
      }
    },
    [containerRef, cameraRef, sceneRef]
  );

  /**
   * Maneja el evento de wheel (rueda del mouse)
   * Permite hacer zoom con la rueda del mouse
   */
  const handleWheel = useCallback(
    // eslint-disable-next-line no-unused-vars
    (event: WheelEvent, onZoom?: (delta: number) => void) => {
      if (!onZoom) return;
      
      // Prevenir scroll de la página
      event.preventDefault();
      
      // Calcular delta de zoom (positivo = alejar, negativo = acercar)
      const delta = event.deltaY * 0.01;
      onZoom(delta);
    },
    []
  );

  // ============================================
  // MANEJADORES DE EVENTOS TÁCTILES (Móviles/Tablets)
  // ============================================

  /**
   * Maneja el evento de touch start (inicio de toque en pantalla táctil)
   * Similar a handleMouseDown pero para dispositivos móviles
   * Se ejecuta cuando el usuario toca la pantalla
   */
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!containerRef.current || event.touches.length === 0) return;

      // Obtener el primer punto de toque (ignorar multi-touch por ahora)
      const touch = event.touches[0];
      
      // Iniciar arrastre y guardar posición/tiempo inicial
      isDraggingRef.current = true;
      touchStartTimeRef.current = Date.now();
      touchStartPositionRef.current = { x: touch.clientX, y: touch.clientY };
      previousTouchPositionRef.current = { x: touch.clientX, y: touch.clientY };

      // Notificar que comenzó el arrastre
      if (onDragStartRef.current) {
        onDragStartRef.current();
      }
    },
    [containerRef]
  );

  /**
   * Maneja el evento de touch end (fin de toque en pantalla táctil)
   * Similar a handleMouseUp pero para dispositivos móviles
   * Se ejecuta cuando el usuario deja de tocar la pantalla
   */
  const handleTouchEnd = useCallback(() => {
    // Terminar arrastre
    isDraggingRef.current = false;
    
    // Notificar que terminó el arrastre
    if (onDragEndRef.current) {
      onDragEndRef.current();
    }
  }, []);

  /**
   * Maneja el evento de touch move (movimiento del dedo en pantalla táctil)
   * Permite rotar la cámara deslizando el dedo por la pantalla
   * CLAVE: Previene el scroll predeterminado para permitir la rotación de cámara
   */
  const handleTouchMove = useCallback(
    // eslint-disable-next-line no-unused-vars
    (event: TouchEvent, onRotate?: (deltaX: number, deltaY: number) => void) => {
      // Solo procesar si se está arrastrando
      if (!isDraggingRef.current || !onRotate || event.touches.length === 0) return;

      // IMPORTANTE: Prevenir el comportamiento predeterminado (scroll de página)
      // Esto permite que el usuario pueda mover la cámara sin que la página se desplace
      event.preventDefault();

      // Obtener el primer punto de toque
      const touch = event.touches[0];
      
      // Calcular cuánto se movió el dedo desde la última posición
      const deltaX = touch.clientX - previousTouchPositionRef.current.x;
      const deltaY = touch.clientY - previousTouchPositionRef.current.y;

      // Rotar la cámara según el movimiento del dedo
      onRotate(deltaX, deltaY);

      // Actualizar posición anterior para el próximo frame
      previousTouchPositionRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    },
    []
  );

  /**
   * Maneja el evento de tap (toque rápido) en un planeta
   * Detecta si fue un tap simple o doble tap
   * Similar a handleClick pero para dispositivos táctiles
   */
  const handleTap = useCallback(
    (event: TouchEvent) => {
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (!containerRef.current || !camera || !scene || !raycasterRef.current) return;
      if (event.changedTouches.length === 0) return;

      // Obtener el último punto de toque
      const touch = event.changedTouches[0];
      
      // Calcular tiempo y distancia desde touchStart
      const timeSinceTouchStart = Date.now() - touchStartTimeRef.current;
      const distanceMoved = Math.sqrt(
        Math.pow(touch.clientX - touchStartPositionRef.current.x, 2) +
          Math.pow(touch.clientY - touchStartPositionRef.current.y, 2)
      );

      // Ignorar si fue un arrastre largo, no un tap rápido
      if (
        timeSinceTouchStart > CLICK_DETECTION_CONFIG.maxClickTime ||
        distanceMoved > CLICK_DETECTION_CONFIG.maxClickDistance
      ) {
        return;
      }

      // Convertir coordenadas de pantalla a coordenadas normalizadas (-1 a 1)
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      // Configurar raycaster desde la cámara hacia la posición del toque
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Obtener todos los objetos que intersectan con el rayo
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      // Buscar si se tocó un planeta
      for (const intersect of intersects) {
        if (intersect.object.userData.esPlaneta) {
          const planetaId = intersect.object.userData.planetaId;
          const currentTime = Date.now();
          const timeSinceLastClick = currentTime - lastClickTimeRef.current;
          
          // Detectar doble tap (dos toques rápidos en el mismo planeta)
          const isDoubleClick = 
            timeSinceLastClick < 500 && // Menos de 500ms desde el último tap
            lastClickPlanetRef.current === planetaId; // Mismo planeta
          
          // Actualizar referencias para el próximo tap
          lastClickTimeRef.current = currentTime;
          lastClickPlanetRef.current = planetaId;
          
          // Notificar que se tocó un planeta
          onPlanetClickRef.current(planetaId, isDoubleClick);
          break;
        }
      }
    },
    [containerRef, cameraRef, sceneRef]
  );

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  
  return {
    // Refs y utilidades compartidas
    raycasterRef,
    mouseRef,
    isDraggingRef,
    initRaycaster,
    
    // Eventos de MOUSE (escritorio)
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleClick,
    handleWheel,
    
    // Eventos TÁCTILES (móviles y tablets)
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleTap,
  };
}

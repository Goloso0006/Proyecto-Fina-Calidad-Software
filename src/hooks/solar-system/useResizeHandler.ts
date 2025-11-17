import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hook para manejar el redimensionamiento del canvas 3D
 * 
 * @param containerRef - Referencia al contenedor del canvas
 * @param cameraRef - Referencia a la cámara de Three.js
 * @param rendererRef - Referencia al renderer de Three.js
 */
export function useResizeHandler(
  containerRef: React.RefObject<HTMLDivElement | null>,
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>,
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>
) {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!containerRef.current || !camera || !renderer) return;

    const container = containerRef.current;

    /**
     * Función para actualizar el tamaño del canvas
     */
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (!containerRef.current || !camera || !renderer) return;

        const container = containerRef.current;
        const parent = container.parentElement;
        const maxWidth = parent
          ? Math.min(parent.clientWidth, window.innerWidth)
          : window.innerWidth;
        const maxHeight = parent
          ? Math.min(parent.clientHeight, window.innerHeight)
          : window.innerHeight;

        const newWidth = Math.min(container.clientWidth, maxWidth);
        const newHeight = Math.min(container.clientHeight, maxHeight);

        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      });
    };

    // Observador de cambios de tamaño
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    // Listener para cambios de tamaño de ventana (zoom del navegador)
    const handleWindowResize = () => {
      setTimeout(() => {
        handleResize();
      }, 100);
    };
    window.addEventListener("resize", handleWindowResize);

    // Listener para cambios de fullscreen - con debounce para evitar parpadeos
    let fullscreenResizeTimeout: number | null = null;
    const handleFullscreenChange = () => {
      // Cancelar timeout anterior si existe
      if (fullscreenResizeTimeout !== null) {
        clearTimeout(fullscreenResizeTimeout);
      }
      // Usar timeout para evitar múltiples llamadas
      fullscreenResizeTimeout = window.setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            handleResize();
          });
        });
      }, 100);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      if (fullscreenResizeTimeout !== null) {
        clearTimeout(fullscreenResizeTimeout);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [containerRef, cameraRef, rendererRef]);
}
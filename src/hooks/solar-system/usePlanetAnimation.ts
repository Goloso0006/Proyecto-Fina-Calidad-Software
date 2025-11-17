import { useRef, useCallback } from "react";
import * as THREE from "three";

/**
 * Interfaz para un planeta 3D
 */
export interface Planeta3D {
  mesh: THREE.Mesh;
  orbita: THREE.Group;
  distancia: number;
  velocidadOrbital: number;
  velocidadRotacion: number;
  id: string;
}

/**
 * Hook para manejar la animación de los planetas
 * 
 * @param planetas - Array de referencias a los planetas
 * @param sunRef - Referencia al sol
 * @returns Funciones para controlar la animación
 */
export function usePlanetAnimation(
  planetas: React.MutableRefObject<Planeta3D[]>,
  sunRef: React.MutableRefObject<THREE.Mesh | null>
) {
  const pausedRef = useRef(false);
  const speedRef = useRef(1);

  /**
   * Actualiza el estado de pausa
   */
  const setPaused = useCallback((paused: boolean) => {
    pausedRef.current = paused;
  }, []);

  /**
   * Actualiza la velocidad de animación
   */
  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
  }, []);

  /**
   * Anima un frame de los planetas
   */
  const animateFrame = useCallback(() => {
    if (pausedRef.current) return;

    const speed = speedRef.current;
    planetas.current.forEach((planeta) => {
      planeta.orbita.rotation.y += planeta.velocidadOrbital * speed * 0.01;
      planeta.mesh.rotation.y += planeta.velocidadRotacion * speed;
    });

    if (sunRef.current) {
      sunRef.current.rotation.y += 0.01 * speed;
    }
  }, []); // Sin dependencias - usa refs directamente

  /**
   * Resetea todas las rotaciones a cero
   */
  const resetRotations = useCallback(() => {
    planetas.current.forEach((p) => {
      p.orbita.rotation.set(0, 0, 0);
      p.mesh.rotation.set(0, 0, 0);
    });
    if (sunRef.current) {
      sunRef.current.rotation.set(0, 0, 0);
    }
  }, []); // Sin dependencias - usa refs directamente

  return {
    setPaused,
    setSpeed,
    animateFrame,
    resetRotations,
  };
}
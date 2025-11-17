import { useRef, useCallback } from "react";
import * as THREE from "three";
import {
  createDefaultCameraControls,
  clampRotationX,
  clampDistance,
  type CameraControls,
} from "../../utils/solar-system/cameraHelpers";
import { CAMERA_CONTROLS_CONFIG } from "../../utils/solar-system/planetConfig";
import { setCameraPositionFromSpherical } from "../../utils/solar-system/threeHelpers";

/**
 * Hook para manejar los controles de la cámara en el sistema solar 3D
 * 
 * @param cameraRef - Referencia a la cámara de Three.js
 * @returns Objeto con funciones y estado para controlar la cámara
 */
export function useCameraControls(cameraRef: React.RefObject<THREE.PerspectiveCamera | null>) {
  const controlsRef = useRef<CameraControls>(createDefaultCameraControls());
  const tempVec = useRef(new THREE.Vector3());

  /**
   * Actualiza la posición de la cámara basándose en los controles actuales
   */
  const updateCameraPosition = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const controls = controlsRef.current;
    setCameraPositionFromSpherical(
      camera,
      controls.distance,
      controls.rotationX,
      controls.rotationY,
      controls.target
    );
  }, [cameraRef]);

  /**
   * Rota la cámara en los ejes X e Y
   */
  const rotateCamera = useCallback((deltaX: number, deltaY: number) => {
    controlsRef.current.rotationY += deltaX * CAMERA_CONTROLS_CONFIG.rotationSpeed;
    controlsRef.current.rotationX = clampRotationX(
      controlsRef.current.rotationX + deltaY * CAMERA_CONTROLS_CONFIG.rotationSpeed
    );
    updateCameraPosition();
  }, [updateCameraPosition]);

  /**
   * Ajusta el zoom de la cámara
   */
  const zoomCamera = useCallback((delta: number) => {
    controlsRef.current.distance = clampDistance(
      controlsRef.current.distance + delta
    );
    updateCameraPosition();
  }, [updateCameraPosition]);

  /**
   * Enfoca la cámara en una posición específica
   */
  const focusOnPosition = useCallback(
    (position: THREE.Vector3, distance: number, smooth: boolean = true) => {
      if (smooth) {
        controlsRef.current.target.lerp(position, 0.25);
        controlsRef.current.distance = THREE.MathUtils.lerp(
          controlsRef.current.distance,
          distance,
          0.2
        );
      } else {
        controlsRef.current.target.copy(position);
        controlsRef.current.distance = distance;
      }
      updateCameraPosition();
    },
    [updateCameraPosition]
  );

  /**
   * Resetea la cámara a la posición inicial
   */
  const resetCamera = useCallback(() => {
    controlsRef.current = createDefaultCameraControls();
    updateCameraPosition();
  }, [updateCameraPosition]);

  /**
   * Configura la vista general del sistema
   */
  const setGeneralView = useCallback(() => {
    controlsRef.current = {
      rotationX: 0,
      rotationY: 0,
      distance: 80,
      target: new THREE.Vector3(0, 0, 0),
    };
    updateCameraPosition();
  }, [updateCameraPosition]);

  return {
    controlsRef,
    tempVec,
    rotateCamera,
    zoomCamera,
    focusOnPosition,
    resetCamera,
    setGeneralView,
    updateCameraPosition,
  };
}
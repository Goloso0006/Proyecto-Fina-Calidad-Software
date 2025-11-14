import * as THREE from "three";
import { CAMERA_CONTROLS_CONFIG } from "./planetConfig";

/**
 * Utilidades para el control de la cámara
 */

export interface CameraControls {
  rotationX: number;
  rotationY: number;
  distance: number;
  target: THREE.Vector3;
}

/**
 * Crea controles de cámara con valores por defecto
 */
export function createDefaultCameraControls(): CameraControls {
  return {
    rotationX: CAMERA_CONTROLS_CONFIG.defaultRotationX,
    rotationY: CAMERA_CONTROLS_CONFIG.defaultRotationY,
    distance: CAMERA_CONTROLS_CONFIG.defaultDistance,
    target: new THREE.Vector3(0, 0, 0),
  };
}

/**
 * Limita la rotación X dentro de los rangos permitidos
 */
export function clampRotationX(rotationX: number): number {
  return Math.max(
    CAMERA_CONTROLS_CONFIG.minRotationX,
    Math.min(CAMERA_CONTROLS_CONFIG.maxRotationX, rotationX)
  );
}

/**
 * Limita la distancia de la cámara dentro de los rangos permitidos
 */
export function clampDistance(distance: number): number {
  return Math.max(
    CAMERA_CONTROLS_CONFIG.minDistance,
    Math.min(CAMERA_CONTROLS_CONFIG.maxDistance, distance)
  );
}

/**
 * Calcula la distancia deseada para enfocar un planeta
 */
export function getPlanetFocusDistance(planetaDistancia: number): number {
  // Base: distancia del planeta + margen estándar
  let desired = planetaDistancia + CAMERA_CONTROLS_CONFIG.focusDistance;

  // Acercar más para los planetas exteriores (4 últimos):
  // júpiter (>=28), saturno (>=38), urano (>=48), neptuno (>=58)
  if (planetaDistancia >= 58) {
    desired -= 12; // Neptuno: acercar bastante
  } else if (planetaDistancia >= 48) {
    desired -= 10; // Urano
  } else if (planetaDistancia >= 38) {
    desired -= 8; // Saturno
  } else if (planetaDistancia >= 28) {
    desired -= 6; // Júpiter
  }

  return clampDistance(desired);
}

/**
 * Calcula la distancia deseada para enfocar el sol
 */
export function getSunFocusDistance(): number {
  return CAMERA_CONTROLS_CONFIG.focusDistance;
}

/**
 * Resetea los controles de cámara a la vista inicial
 */
export function resetCameraControls(): CameraControls {
  return createDefaultCameraControls();
}

/**
 * Configura los controles de cámara para vista general
 */
export function setGeneralViewControls(): CameraControls {
  return {
    rotationX: 0,
    rotationY: 0,
    distance: 80,
    target: new THREE.Vector3(0, 0, 0),
  };
}

/**
 * Configura los controles de cámara para enfocar un planeta
 */
export function setPlanetFocusControls(
  targetPosition: THREE.Vector3,
  planetaDistancia: number
): CameraControls {
  return {
    rotationX: 0.3,
    rotationY: 0,
    distance: getPlanetFocusDistance(planetaDistancia),
    target: targetPosition.clone(),
  };
}

/**
 * Configura los controles de cámara para enfocar el sol
 */
export function setSunFocusControls(targetPosition: THREE.Vector3): CameraControls {
  return {
    rotationX: 0.3,
    rotationY: 0,
    distance: getSunFocusDistance(),
    target: targetPosition.clone(),
  };
}


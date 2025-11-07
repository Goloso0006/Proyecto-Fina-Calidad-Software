import * as THREE from "three";

/**
 * Utilidades para trabajar con Three.js
 */

/**
 * Crea una geometría de esfera con parámetros estándar
 */
export function createSphereGeometry(radius: number, segments: number = 32): THREE.SphereGeometry {
  return new THREE.SphereGeometry(radius, segments, segments);
}

/**
 * Crea un material estándar para planetas
 */
export function createPlanetMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color });
}

/**
 * Crea un material básico para el sol (sin iluminación)
 */
export function createSunMaterial(color: number): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({ color });
}

/**
 * Crea un anillo de órbita
 */
export function createOrbitRing(
  radius: number,
  thickness: number = 0.2,
  color: number = 0x444444,
  opacity: number = 0.3,
  segments: number = 64
): THREE.Mesh {
  const geometry = new THREE.RingGeometry(radius - thickness, radius + thickness, segments);
  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = -Math.PI / 2;
  return ring;
}

/**
 * Configura un objeto 3D como planeta para detección de clics
 */
export function setupPlanetUserData(object: THREE.Object3D, planetaId: string): void {
  object.userData.planetaId = planetaId;
  object.userData.esPlaneta = true;
}

/**
 * Calcula la posición de la cámara usando coordenadas esféricas
 */
export function setCameraPositionFromSpherical(
  camera: THREE.PerspectiveCamera,
  distance: number,
  rotationX: number,
  rotationY: number,
  target: THREE.Vector3
): void {
  const spherical = new THREE.Spherical(
    distance,
    Math.PI / 2 - rotationX,
    rotationY
  );
  camera.position.setFromSpherical(spherical);
  camera.lookAt(target);
}

/**
 * Limpia recursos de Three.js de forma segura
 */
export function disposeThreeObject(object: THREE.Object3D): void {
  if (!object) return;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}


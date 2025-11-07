import * as THREE from "three";
import { SUN_CONFIG } from "../../utils/solar-system/planetConfig";
import {
  createSphereGeometry,
  createSunMaterial,
  setupPlanetUserData,
} from "../../utils/solar-system/threeHelpers";

/**
 * Crea y configura el Sol en la escena 3D
 * 
 * @param scene - Escena de Three.js donde se agregará el sol
 * @returns Referencia al mesh del sol
 */
export function createSun(scene: THREE.Scene): THREE.Mesh {
  const geometry = createSphereGeometry(SUN_CONFIG.tamaño);
  const material = createSunMaterial(SUN_CONFIG.color);
  const sun = new THREE.Mesh(geometry, material);

  setupPlanetUserData(sun, "sol");

  scene.add(sun);
  return sun;
}


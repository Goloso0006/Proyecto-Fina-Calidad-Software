import * as THREE from "three";
import { LIGHTING_CONFIG } from "../../utils/solar-system/planetConfig";

/**
 * Configura la iluminación de la escena 3D
 * 
 * @param scene - Escena de Three.js donde se agregarán las luces
 * @returns Objeto con referencias a las luces creadas
 */
export function setupLighting(scene: THREE.Scene) {
  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(
    LIGHTING_CONFIG.ambient.color,
    LIGHTING_CONFIG.ambient.intensity
  );
  scene.add(ambientLight);

  // Luz del sol (puntual)
  const sunLight = new THREE.PointLight(
    LIGHTING_CONFIG.sun.color,
    LIGHTING_CONFIG.sun.intensity,
    LIGHTING_CONFIG.sun.distance
  );
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Luz direccional
  const dirLight = new THREE.DirectionalLight(
    LIGHTING_CONFIG.directional.color,
    LIGHTING_CONFIG.directional.intensity
  );
  dirLight.position.set(
    LIGHTING_CONFIG.directional.position.x,
    LIGHTING_CONFIG.directional.position.y,
    LIGHTING_CONFIG.directional.position.z
  );
  scene.add(dirLight);

  return {
    ambientLight,
    sunLight,
    dirLight,
  };
}
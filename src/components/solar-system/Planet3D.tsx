import * as THREE from "three";
import type { PlanetConfig } from "../../utils/solar-system/planetConfig";
import {
  createSphereGeometry,
  createPlanetMaterial,
  setupPlanetUserData,
  createOrbitRing,
} from "../../utils/solar-system/threeHelpers";
import { ORBIT_CONFIG } from "../../utils/solar-system/planetConfig";

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
 * Crea un planeta 3D con su órbita
 * 
 * @param scene - Escena de Three.js donde se agregará el planeta
 * @param config - Configuración del planeta
 * @returns Objeto Planeta3D con referencias al mesh y grupo de órbita
 */
export function createPlanet(
  scene: THREE.Scene,
  config: PlanetConfig
): Planeta3D {
  // Grupo para la órbita (rotación orbital)
  const orbitaGroup = new THREE.Group();
  scene.add(orbitaGroup);

  // Geometría y material del planeta
  const geometry = createSphereGeometry(config.tamaño);
  const material = createPlanetMaterial(config.color);
  const planetaMesh = new THREE.Mesh(geometry, material);

  // Posicionar el planeta en su distancia orbital
  planetaMesh.position.x = config.distancia;
  setupPlanetUserData(planetaMesh, config.id);

  orbitaGroup.add(planetaMesh);

  // Agregar anillos a Saturno
  if (config.id === "saturno") {
    const ringGeometry = new THREE.RingGeometry(
      config.tamaño * 1.5,  // Radio interior
      config.tamaño * 2.5,  // Radio exterior
      64                     // Segmentos
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9b182,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Rotar los anillos para que estén horizontales
    ringMesh.rotation.x = Math.PI / 2;
    
    // Agregar los anillos al planeta
    planetaMesh.add(ringMesh);
  }

  // Crear anillo de órbita visual
  const orbitRing = createOrbitRing(
    config.distancia,
    ORBIT_CONFIG.thickness,
    ORBIT_CONFIG.color,
    ORBIT_CONFIG.opacity,
    ORBIT_CONFIG.segments
  );
  scene.add(orbitRing);

  return {
    mesh: planetaMesh,
    orbita: orbitaGroup,
    distancia: config.distancia,
    velocidadOrbital: config.velocidadOrbital,
    velocidadRotacion: config.velocidadRotacion,
    id: config.id,
  };
}
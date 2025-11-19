// src/components/solar-system/Planet3D.test.tsx
import * as THREE from "three";
import { createPlanet } from "./Planet3D";
import type { PlanetConfig } from "../../utils/solar-system/planetConfig";

// Configuración de prueba para un planeta
const mockPlanetConfig: PlanetConfig = {
  id: "tierra",
  tamaño: 1.2,
  color: 0x0077be,
  distancia: 50,
  velocidadOrbital: 0.02,
  velocidadRotacion: 0.01,
};

// Configuración de prueba para Saturno (con anillos)
const mockSaturnConfig: PlanetConfig = {
  id: "saturno",
  tamaño: 9.5,
  color: 0xc9b382,
  distancia: 143,
  velocidadOrbital: 0.008,
  velocidadRotacion: 0.005,
};

describe("Planet3D - Creación de planetas", () => {
  /**
   * Test 1: Verifica que se cree correctamente un planeta con todos sus componentes
   * Importancia: Un planeta debe tener mesh, órbita y propiedades configuradas
   */
  test("crea un planeta completo con mesh, órbita y propiedades", () => {
    const scene = new THREE.Scene();
    const planet = createPlanet(scene, mockPlanetConfig);

    // Verifica que retorne un objeto con todas las propiedades necesarias
    expect(planet).toBeDefined();
    expect(planet.mesh).toBeInstanceOf(THREE.Mesh);
    expect(planet.orbita).toBeInstanceOf(THREE.Group);
    expect(planet.id).toBe("tierra");
    expect(planet.distancia).toBe(50);
    expect(planet.velocidadOrbital).toBe(0.02);
    expect(planet.velocidadRotacion).toBe(0.01);
  });

  /**
   * Test 2: Verifica que el planeta se posicione a la distancia correcta
   * Importancia: La posición orbital debe ser precisa para la visualización
   */
  test("posiciona el planeta a la distancia orbital configurada", () => {
    const scene = new THREE.Scene();
    const planet = createPlanet(scene, mockPlanetConfig);

    // El mesh debe estar posicionado en la distancia correcta en el eje X
    expect(planet.mesh.position.x).toBe(mockPlanetConfig.distancia);
    expect(planet.mesh.position.y).toBe(0);
    expect(planet.mesh.position.z).toBe(0);
  });

  /**
   * Test 3: Verifica que se creen el grupo de órbita y elementos en la escena
   * Importancia: El grupo de órbita permite el movimiento orbital del planeta
   */
  test("agrega el grupo de órbita y elementos a la escena", () => {
    const scene = new THREE.Scene();
    const planet = createPlanet(scene, mockPlanetConfig);

    // La escena debe tener al menos 2 hijos:
    // 1. El grupo de órbita (orbitaGroup)
    // 2. El anillo de órbita visual (orbitRing u otro elemento)
    expect(scene.children.length).toBeGreaterThanOrEqual(2);

    // Verifica que el grupo de órbita esté en la escena
    expect(scene.children).toContain(planet.orbita);

    // Verifica que el mesh del planeta esté dentro del grupo de órbita
    expect(planet.orbita.children).toContain(planet.mesh);
  });

  /**
   * Test 4: Verifica que Saturno tenga anillos adicionales
   * Importancia: Saturno es especial y debe tener sus anillos característicos
   */
  test("agrega anillos visuales a Saturno", () => {
    const scene = new THREE.Scene();
    const saturn = createPlanet(scene, mockSaturnConfig);

    // El mesh de Saturno debe tener hijos (los anillos)
    expect(saturn.mesh.children.length).toBeGreaterThan(0);

    // Verifica que el hijo sea un mesh de tipo Ring
    const ring = saturn.mesh.children[0];
    expect(ring).toBeInstanceOf(THREE.Mesh);

    const ringGeometry = (ring as THREE.Mesh).geometry;
    expect(ringGeometry).toBeInstanceOf(THREE.RingGeometry);
  });
});

// src/components/solar-system/Sun3D.test.tsx
import * as THREE from "three";
import { createSun } from "./Sun3D";
import { SUN_CONFIG } from "../../utils/solar-system/planetConfig";

describe("Sun3D - Creación del Sol", () => {
  /**
   * Test 1: Verifica que se cree el mesh del sol correctamente
   * Importancia: El sol es el centro del sistema solar y debe existir
   */
  test("crea y retorna un mesh de tipo THREE.Mesh", () => {
    const scene = new THREE.Scene();
    const sun = createSun(scene);

    // Verifica que retorne un mesh válido
    expect(sun).toBeDefined();
    expect(sun).toBeInstanceOf(THREE.Mesh);
  });

  /**
   * Test 2: Verifica que el sol se agregue a la escena
   * Importancia: Sin agregarse a la escena, el sol no sería visible
   */
  test("agrega el sol a la escena", () => {
    const scene = new THREE.Scene();
    const sun = createSun(scene);

    // Verifica que la escena tenga un hijo
    expect(scene.children.length).toBe(1);
    expect(scene.children[0]).toBe(sun);
  });

  /**
   * Test 3: Verifica que se use el tamaño correcto de la configuración
   * Importancia: El tamaño del sol debe coincidir con el resto del sistema
   */
  test("aplica el tamaño configurado del sol", () => {
    const scene = new THREE.Scene();
    const sun = createSun(scene);

    // Verifica que la geometría sea una esfera con el tamaño correcto
    const geometry = sun.geometry as THREE.SphereGeometry;
    expect(geometry).toBeInstanceOf(THREE.SphereGeometry);

    // El radio de la esfera debe coincidir con la configuración
    const parameters = geometry.parameters;
    expect(parameters.radius).toBe(SUN_CONFIG.tamaño);
  });

  /**
   * Test 4: Verifica que se configure el userData correctamente
   * Importancia: El userData permite identificar el sol en interacciones
   */
  test("configura el userData con el ID correcto", () => {
    const scene = new THREE.Scene();
    const sun = createSun(scene);

    // Verifica que el userData tenga el planetaId correcto
    expect(sun.userData).toBeDefined();
    expect(sun.userData.planetaId).toBe("sol");
  });
});

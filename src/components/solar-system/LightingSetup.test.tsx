// src/components/solar-system/LightingSetup.test.tsx
import * as THREE from "three";
import { setupLighting } from "./LightingSetup";
import { LIGHTING_CONFIG } from "../../utils/solar-system/planetConfig";

describe("LightingSetup - Configuración de escena", () => {
  /**
   * Test 1: Verifica que se creen las tres luces principales
   * Importancia: Asegura que la iluminación completa esté presente
   */
  test("crea los tres tipos de luces (ambient, sun, directional)", () => {
    const scene = new THREE.Scene();
    const lights = setupLighting(scene);

    // Verifica que retorne los tres objetos de luz
    expect(lights.ambientLight).toBeDefined();
    expect(lights.sunLight).toBeDefined();
    expect(lights.dirLight).toBeDefined();

    // Verifica que sean instancias de los tipos correctos
    expect(lights.ambientLight).toBeInstanceOf(THREE.AmbientLight);
    expect(lights.sunLight).toBeInstanceOf(THREE.PointLight);
    expect(lights.dirLight).toBeInstanceOf(THREE.DirectionalLight);
  });

  /**
   * Test 2: Verifica que las luces se agreguen a la escena
   * Importancia: Sin esto, las luces no tendrían efecto visual
   */
  test("agrega todas las luces a la escena", () => {
    const scene = new THREE.Scene();
    setupLighting(scene);

    // Verifica que la escena tenga 3 hijos (las 3 luces)
    expect(scene.children.length).toBe(3);

    // Verifica que los hijos sean luces
    expect(scene.children[0]).toBeInstanceOf(THREE.AmbientLight);
    expect(scene.children[1]).toBeInstanceOf(THREE.PointLight);
    expect(scene.children[2]).toBeInstanceOf(THREE.DirectionalLight);
  });

  /**
   * Test 3: Verifica que se apliquen las configuraciones correctas
   * Importancia: Asegura que los valores de intensidad y color sean los esperados
   */
  test("aplica la configuración correcta de intensidad y color", () => {
    const scene = new THREE.Scene();
    const lights = setupLighting(scene);

    // Verifica luz ambiental
    expect(lights.ambientLight.color.getHex()).toBe(
      LIGHTING_CONFIG.ambient.color
    );
    expect(lights.ambientLight.intensity).toBe(
      LIGHTING_CONFIG.ambient.intensity
    );

    // Verifica luz del sol
    expect(lights.sunLight.color.getHex()).toBe(LIGHTING_CONFIG.sun.color);
    expect(lights.sunLight.intensity).toBe(LIGHTING_CONFIG.sun.intensity);
    expect(lights.sunLight.distance).toBe(LIGHTING_CONFIG.sun.distance);

    // Verifica luz direccional
    expect(lights.dirLight.color.getHex()).toBe(
      LIGHTING_CONFIG.directional.color
    );
    expect(lights.dirLight.intensity).toBe(
      LIGHTING_CONFIG.directional.intensity
    );
  });

  /**
   * Test 4: Verifica posicionamiento de las luces
   * Importancia: La posición correcta de las luces afecta cómo se ilumina la escena
   */
  test("posiciona correctamente la luz del sol y la luz direccional", () => {
    const scene = new THREE.Scene();
    const lights = setupLighting(scene);

    // La luz del sol debe estar en el origen (0, 0, 0)
    expect(lights.sunLight.position.x).toBe(0);
    expect(lights.sunLight.position.y).toBe(0);
    expect(lights.sunLight.position.z).toBe(0);

    // La luz direccional debe estar en la posición configurada
    expect(lights.dirLight.position.x).toBe(
      LIGHTING_CONFIG.directional.position.x
    );
    expect(lights.dirLight.position.y).toBe(
      LIGHTING_CONFIG.directional.position.y
    );
    expect(lights.dirLight.position.z).toBe(
      LIGHTING_CONFIG.directional.position.z
    );
  });
});

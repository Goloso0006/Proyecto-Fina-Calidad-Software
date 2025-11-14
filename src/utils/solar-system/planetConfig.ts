/**
 * Configuración de los planetas del sistema solar
 * Proporciones educativas para visualización 3D
 */

export interface PlanetConfig {
  id: string;
  distancia: number;
  velocidadOrbital: number;
  velocidadRotacion: number;
  tamaño: number;
  color: number;
}

/**
 * Configuración de los 8 planetas del sistema solar
 * Valores ajustados para visualización educativa
 */
export const PLANET_CONFIGS: PlanetConfig[] = [
  { id: "mercurio", distancia: 8, velocidadOrbital: 4.15, velocidadRotacion: 0.02, tamaño: 0.4, color: 0x1118c7853 },
  { id: "venus", distancia: 11, velocidadOrbital: 1.6, velocidadRotacion: 0.01, tamaño: 0.6, color: 0xffc649 },
  { id: "tierra", distancia: 14, velocidadOrbital: 1.0, velocidadRotacion: 0.03, tamaño: 0.6, color: 0x4a90e2 },
  { id: "marte", distancia: 18, velocidadOrbital: 0.53, velocidadRotacion: 0.03, tamaño: 0.5, color: 0xcd5c5c },
  { id: "jupiter", distancia: 28, velocidadOrbital: 0.08, velocidadRotacion: 0.04, tamaño: 1.2, color: 0xd8ca9d },
  { id: "saturno", distancia: 38, velocidadOrbital: 0.03, velocidadRotacion: 0.035, tamaño: 1.0, color: 0xfad5a5 },
  { id: "urano", distancia: 48, velocidadOrbital: 0.01, velocidadRotacion: 0.025, tamaño: 0.8, color: 0x4fd0e7 },
  { id: "neptuno", distancia: 58, velocidadOrbital: 0.006, velocidadRotacion: 0.025, tamaño: 0.8, color: 0x4b70dd },
];

/**
 * Configuración del Sol
 */
export const SUN_CONFIG = {
  tamaño: 1.5,
  color: 0xffff00,
  distancia: 0, // El sol está en el origen
};

/**
 * Configuración de la órbita visual
 */
export const ORBIT_CONFIG = {
  color: 0x444444,
  opacity: 0.3,
  thickness: 0.2,
  segments: 64,
};

/**
 * Configuración de la cámara inicial
 */
export const CAMERA_CONFIG = {
  fov: 50,
  near: 0.1,
  far: 1000,
  initialPosition: { x: 0, y: 30, z: 80 },
  initialTarget: { x: 0, y: 0, z: 0 },
};

/**
 * Configuración de iluminación
 */
export const LIGHTING_CONFIG = {
  ambient: {
    color: 0xffffff,
    intensity: 0.5,
  },
  sun: {
    color: 0xffffff,
    intensity: 1.5,
    distance: 1000,
  },
  directional: {
    color: 0xffffff,
    intensity: 0.5,
    position: { x: 50, y: 50, z: 50 },
  },
};

/**
 * Configuración de controles de cámara
 */
export const CAMERA_CONTROLS_CONFIG = {
  minDistance: 10,
  maxDistance: 150,
  rotationSpeed: 0.01,
  zoomSpeed: 0.05, // Aumentado de 0.01 a 0.05 para zoom más rápido
  minRotationX: -Math.PI / 2,
  maxRotationX: Math.PI / 2,
  defaultDistance: 50,
  defaultRotationX: 0,
  defaultRotationY: 0,
  focusDistance: 5, // Distancia adicional al enfocar un planeta
  followFrames: 180, // Frames para seguir un planeta
};

/**
 * Configuración de detección de clics
 */
export const CLICK_DETECTION_CONFIG = {
  maxClickTime: 300, // ms
  maxClickDistance: 5, // píxeles
};


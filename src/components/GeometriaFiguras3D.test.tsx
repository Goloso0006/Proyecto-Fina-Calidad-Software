// src/components/GeometriaFiguras3D.test.tsx
import { render, fireEvent } from "@testing-library/react";
import GeometriaFiguras3D from "./GeometriaFiguras3D";

// Referencias para inspeccionar visibilidad de aristas y vértices creados
let lastLineSegmentsInstance: any;
let lastPointsInstance: any;

// Mock de Three.js adaptado al componente GeometriaFiguras3D
jest.mock("three", () => {
  // Vector3 con operaciones básicas usadas en el componente
  const createMockVector3 = (x = 0, y = 0, z = 0): any => ({
    x,
    y,
    z,
    add: jest.fn(function (other: any) {
      this.x += other.x;
      this.y += other.y;
      this.z += other.z;
      return this;
    }),
    divideScalar: jest.fn(function (s: number) {
      this.x /= s;
      this.y /= s;
      this.z /= s;
      return this;
    }),
    clone: jest.fn(function () {
      return createMockVector3(this.x, this.y, this.z);
    }),
    normalize: jest.fn(function () {
      const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z) || 1;
      this.x /= len;
      this.y /= len;
      this.z /= len;
      return this;
    }),
  });

  // Geometría básica con atributos mínimos
  const makeGeometry = () => {
    const posArray = new Float32Array([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
    ]);
    const positionAttr: any = {
      array: posArray,
      getX: jest.fn((i: number) => posArray[i * 3] ?? 0),
      getY: jest.fn((i: number) => posArray[i * 3 + 1] ?? 0),
      getZ: jest.fn((i: number) => posArray[i * 3 + 2] ?? 0),
    };
    return {
      attributes: { position: positionAttr },
      index: { array: [0, 1, 2] },
    } as any;
  };

  return {
    Scene: jest.fn(() => ({ add: jest.fn(), background: null, children: [] })),
    PerspectiveCamera: jest.fn(() => ({
      position: { set: jest.fn() },
      lookAt: jest.fn(),
      aspect: 1,
      updateProjectionMatrix: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => ({
      setSize: jest.fn(),
      setPixelRatio: jest.fn(),
      render: jest.fn(),
      domElement: document.createElement("canvas"),
      dispose: jest.fn(),
    })),
    Color: jest.fn(),
    AmbientLight: jest.fn(() => ({})),
    DirectionalLight: jest.fn(() => ({ position: { set: jest.fn() } })),
    GridHelper: jest.fn(() => ({ position: { y: 0 } })),
    Group: jest.fn(() => {
      const children: any[] = [];
      return {
        add: jest.fn((obj: any) => children.push(obj)),
        children,
        rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
      };
    }),
    BoxGeometry: jest.fn(() => makeGeometry()),
    TetrahedronGeometry: jest.fn(() => makeGeometry()),
    OctahedronGeometry: jest.fn(() => makeGeometry()),
    DodecahedronGeometry: jest.fn(() => makeGeometry()),
    IcosahedronGeometry: jest.fn(() => makeGeometry()),
    MeshStandardMaterial: jest.fn(() => ({})),
    Mesh: jest.fn((geometry: any, material: any) => ({
      geometry,
      material,
      visible: true,
      position: { set: jest.fn() },
      rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
    })),
    EdgesGeometry: jest.fn((geometry: any) => ({ geometry })),
    LineBasicMaterial: jest.fn(() => ({})),
    LineSegments: jest.fn(() => (lastLineSegmentsInstance = { visible: false })),
    BufferGeometry: jest.fn(() => {
      const attrs: Record<string, any> = {};
      return {
        setAttribute: jest.fn((name: string, attr: any) => {
          attrs[name] = attr;
        }),
        attributes: attrs,
      } as any;
    }),
    Float32BufferAttribute: jest.fn((arr: Float32Array | number[], itemSize: number) => ({ array: arr, itemSize })),
    BufferAttribute: jest.fn((arr: Float32Array | number[], itemSize: number) => ({ array: arr, itemSize })),
    PointsMaterial: jest.fn(() => ({})),
    Points: jest.fn((geometry: any, material: any) => (lastPointsInstance = { geometry, material, visible: false })),
    Vector3: jest.fn((x?: number, y?: number, z?: number) => createMockVector3(x, y, z)),
    DoubleSide: 2,
  };
});

// Mock de requestAnimationFrame y cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 0);
  return 1;
}) as any;
global.cancelAnimationFrame = jest.fn();

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Limpia los mocks antes de cada prueba
beforeEach(() => {
  jest.clearAllMocks();
  lastLineSegmentsInstance = undefined;
  lastPointsInstance = undefined;
});

const baseProps = {
  figuraId: "cubo",
  velocidadRotacion: 1,
  isPaused: false,
  mostrarCaras: true,
  mostrarAristas: false,
  mostrarVertices: false,
  isDescompuesta: false,
  color: "#3b82f6",
};

describe("GeometriaFiguras3D - Renderizado", () => {
  test("renderiza el contenedor con clases y cursor por defecto", () => {
    const { container } = render(<GeometriaFiguras3D {...baseProps} />);
    const div = container.querySelector("div.rounded-lg");
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass("w-full", "h-full", "rounded-lg");
    expect(div).toHaveStyle({ cursor: "grab" });
  });
});

describe("GeometriaFiguras3D - Interacciones", () => {
  test("cambia el cursor a 'grabbing' en mousedown y vuelve a 'grab' en mouseup", () => {
    const { container } = render(<GeometriaFiguras3D {...baseProps} />);
    const div = container.querySelector("div.rounded-lg")!;
    fireEvent.mouseDown(div);
    expect(div).toHaveStyle({ cursor: "grabbing" });
    // mouseup se escucha en window
    fireEvent.mouseUp(window);
    expect(div).toHaveStyle({ cursor: "grab" });
  });
});

describe("GeometriaFiguras3D - Props de visibilidad", () => {
  test("mostrarAristas=true establece visible en aristas", () => {
    const { rerender } = render(
      <GeometriaFiguras3D {...baseProps} mostrarAristas={true} />
    );
    expect(lastLineSegmentsInstance).toBeDefined();
    expect(lastLineSegmentsInstance.visible).toBe(true);

    // Cambiar a false
    rerender(<GeometriaFiguras3D {...baseProps} mostrarAristas={false} />);
    expect(lastLineSegmentsInstance.visible).toBe(false);
  });

  test("mostrarVertices=true establece visible en puntos", () => {
    render(<GeometriaFiguras3D {...baseProps} mostrarVertices={true} />);
    expect(lastPointsInstance).toBeDefined();
    expect(lastPointsInstance.visible).toBe(true);
  });
});

describe("GeometriaFiguras3D - Estados", () => {
  test("se renderiza correctamente cuando está descompuesta", () => {
    render(<GeometriaFiguras3D {...baseProps} isDescompuesta={true} />);
    // Cuando está descompuesta las aristas se ocultan
    expect(lastLineSegmentsInstance).toBeDefined();
    expect(lastLineSegmentsInstance.visible).toBe(false);
  });

  test("acepta cambios de figuraId sin fallar", () => {
    const { rerender, container } = render(
      <GeometriaFiguras3D {...baseProps} figuraId="cubo" />
    );
    const div = container.querySelector("div.rounded-lg");
    expect(div).toBeInTheDocument();

    rerender(<GeometriaFiguras3D {...baseProps} figuraId="tetraedro" />);
    expect(div).toBeInTheDocument();
  });
});
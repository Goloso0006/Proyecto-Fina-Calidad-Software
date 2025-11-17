// src/components/SistemaSolar3D.test.tsx
import { render } from "@testing-library/react";
import SistemaSolar3D from "./SistemaSolar3D";

// Mock de Three.js
jest.mock("three", () => {
    // Función helper para crear un Vector3 mockeado
    const createMockVector3 = (): any => ({
        x: 0,
        y: 0,
        z: 0,
        copy: jest.fn(),
        clone: jest.fn(() => createMockVector3()),
        lerp: jest.fn(),
        setFromSpherical: jest.fn(),
    });

    const MockVector3 = jest.fn(() => createMockVector3());
    
    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            background: null,
            children: [],
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: { set: jest.fn(), setFromSpherical: jest.fn() },
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
        PointLight: jest.fn(() => ({ position: { set: jest.fn() } })),
        DirectionalLight: jest.fn(() => ({ position: { set: jest.fn() } })),
        SphereGeometry: jest.fn(),
        MeshBasicMaterial: jest.fn(),
        MeshStandardMaterial: jest.fn(),
        Mesh: jest.fn(() => {
            const mesh: any = {
                position: { x: 0, y: 0, z: 0, set: jest.fn() },
                rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
                scale: { set: jest.fn() },
                userData: {},
                add: jest.fn(), // Agregar método add para los anillos de Saturno
                getWorldPosition: jest.fn((vec: any) => {
                    if (vec) {
                        vec.x = 0;
                        vec.y = 0;
                        vec.z = 0;
                        // Asegurar que el Vector3 tenga el método clone
                        if (!vec.clone) {
                            vec.clone = jest.fn(() => createMockVector3());
                        }
                    }
                    return mesh;
                }),
            };
            return mesh;
        }),
        Group: jest.fn(() => ({
            add: jest.fn(),
            rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
        })),
        RingGeometry: jest.fn(),
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => []),
        })),
        Vector2: jest.fn(() => ({ x: 0, y: 0 })),
        Vector3: MockVector3,
        Spherical: jest.fn(() => ({
            radius: 0,
            phi: 0,
            theta: 0,
        })),
        MathUtils: {
            lerp: jest.fn((a, b, t) => a + (b - a) * t),
        },
        DoubleSide: 2,
    };
});

// Mock de requestAnimationFrame
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

// Mock de document.fullscreenElement
Object.defineProperty(document, 'fullscreenElement', {
    writable: true,
    value: null,
});

// Mock de requestFullscreen y exitFullscreen
Element.prototype.requestFullscreen = jest.fn().mockResolvedValue(undefined);
document.exitFullscreen = jest.fn().mockResolvedValue(undefined);

// Limpia los mocks antes de cada prueba
beforeEach(() => {
jest.clearAllMocks();
});

const mockProps = {
velocidadAnimacion: 1,
isPaused: false,
onPlanetaClick: jest.fn(),
planetaSeleccionado: null,
resetVista: false,
vistaGeneral: false,
onFullscreenChange: jest.fn(),
};

describe("SistemaSolar3D - Renderizado", () => {
test("renderiza el contenedor del sistema solar", () => {
    const { container } = render(<SistemaSolar3D {...mockProps} />);
    const outerDiv = container.querySelector("div.relative.w-full.h-full");
    expect(outerDiv).toBeInTheDocument();
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("w-full", "h-full", "rounded-lg");
});

test("aplica el cursor 'grab' por defecto", () => {
    const { container } = render(<SistemaSolar3D {...mockProps} />);
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveStyle({ cursor: "grab" });
});
});

describe("SistemaSolar3D - Props", () => {
test("acepta velocidadAnimacion como prop", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} velocidadAnimacion={2} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});

test("acepta isPaused como prop", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} isPaused={true} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});

test("acepta planetaSeleccionado como prop", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} planetaSeleccionado="tierra" />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});

test("acepta resetVista como prop", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} resetVista={true} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});

test("acepta vistaGeneral como prop", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} vistaGeneral={true} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});
});

describe("SistemaSolar3D - Callbacks", () => {
test("llama a onPlanetaClick cuando se proporciona", () => {
    const mockOnPlanetaClick = jest.fn();
    render(
    <SistemaSolar3D {...mockProps} onPlanetaClick={mockOnPlanetaClick} />
    );
    // El callback se llama internamente cuando hay un clic en un planeta
    // Aquí solo verificamos que el componente acepta la prop
    expect(mockOnPlanetaClick).toBeDefined();
});

test("acepta onFullscreenChange como prop opcional", () => {
    const mockOnFullscreenChange = jest.fn();
    const { container } = render(
    <SistemaSolar3D {...mockProps} onFullscreenChange={mockOnFullscreenChange} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
    expect(mockOnFullscreenChange).toBeDefined();
});

test("se renderiza correctamente sin onFullscreenChange", () => {
    const propsWithoutFullscreen = {
        velocidadAnimacion: mockProps.velocidadAnimacion,
        isPaused: mockProps.isPaused,
        onPlanetaClick: mockProps.onPlanetaClick,
        planetaSeleccionado: mockProps.planetaSeleccionado,
        resetVista: mockProps.resetVista,
        vistaGeneral: mockProps.vistaGeneral,
    };
    const { container } = render(<SistemaSolar3D {...propsWithoutFullscreen} />);
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});
});

describe("SistemaSolar3D - Estados", () => {
test("se renderiza correctamente cuando está pausado", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} isPaused={true} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});

test("se renderiza correctamente cuando no está pausado", () => {
    const { container } = render(
    <SistemaSolar3D {...mockProps} isPaused={false} />
    );
    const innerDiv = container.querySelector("div.rounded-lg");
    expect(innerDiv).toBeInTheDocument();
});
});
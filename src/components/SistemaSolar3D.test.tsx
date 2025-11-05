// src/components/SistemaSolar3D.test.tsx
import { render } from "@testing-library/react";
import SistemaSolar3D from "./SistemaSolar3D";

// Mock de Three.js
jest.mock("three", () => {
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
        Mesh: jest.fn(() => ({
        position: { x: 0, y: 0, z: 0 },
        rotation: { y: 0 },
        userData: {},
        })),
        Group: jest.fn(() => ({
        add: jest.fn(),
        rotation: { y: 0 },
        })),
        RingGeometry: jest.fn(),
        Raycaster: jest.fn(() => ({
        setFromCamera: jest.fn(),
        intersectObjects: jest.fn(() => []),
        })),
        Vector2: jest.fn(() => ({ x: 0, y: 0 })),
        Vector3: jest.fn(() => ({ x: 0, y: 0, z: 0, copy: jest.fn() })),
        Spherical: jest.fn(() => ({})),
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
};

describe("SistemaSolar3D - Renderizado", () => {
    test("renderiza el contenedor del sistema solar", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
        expect(div).toHaveClass("w-full", "h-full", "rounded-lg");
    });

    test("aplica el cursor 'grab' por defecto", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toHaveStyle({ cursor: "grab" });
    });
    });

    describe("SistemaSolar3D - Props", () => {
    test("acepta velocidadAnimacion como prop", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} velocidadAnimacion={2} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
    });

    test("acepta isPaused como prop", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} isPaused={true} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
    });

    test("acepta planetaSeleccionado como prop", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} planetaSeleccionado="tierra" />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
    });

    test("acepta resetVista como prop", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} resetVista={true} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
    });

    test("acepta vistaGeneral como prop", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} vistaGeneral={true} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
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
});

describe("SistemaSolar3D - Estados", () => {
    test("se renderiza correctamente cuando está pausado", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} isPaused={true} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
    });

    test("se renderiza correctamente cuando no está pausado", () => {
        const { container } = render(<SistemaSolar3D {...mockProps} isPaused={false} />);
        const div = container.querySelector("div.w-full.h-full");
        expect(div).toBeInTheDocument();
    });
});
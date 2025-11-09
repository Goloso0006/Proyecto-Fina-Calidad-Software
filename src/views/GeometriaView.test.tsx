// src/views/GeometriaView.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import GeometriaView from "./GeometriaView";

// Evita cargas pesadas: mock de componentes hijos principales
jest.mock("../components/GeometriaFiguras3D", () => () => (
  <div data-testid="geom3d" />
));

jest.mock("../components/InfoPanel", () => ({ InfoPanel: ({ figura }: any) => (
  <div data-testid="info-panel">{figura?.nombre}</div>
)}));

jest.mock("../components/ControlPanel", () => ({
  ControlPanel: ({ onAyuda, ayudaActiva }: any) => (
    <button onClick={onAyuda}>{ayudaActiva ? "Ocultar" : "Ayuda"}</button>
  ),
}));

jest.mock("../components/FiguraCard", () => (props: any) => (
  <button onClick={props.onClick}>
    {props.figura?.nombre}
    {props.isSelected ? " ✓" : ""}
  </button>
));

describe("GeometriaView - render inicial", () => {
  test("muestra el título y subtítulo y la vista 3D", () => {
    render(<GeometriaView />);
    expect(
      screen.getByText(/Explorando Figuras Geométricas 3D/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Aprende sobre caras, aristas y vértices/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("geom3d")).toBeInTheDocument();
  });
});

describe("GeometriaView - cambiar de vista entre 3D y Galería", () => {
  test("al pulsar Galería aparece la cuadrícula y 'Ver detalles'", () => {
    render(<GeometriaView />);
    fireEvent.click(screen.getByRole("button", { name: /Galería/i }));
    const detalles = screen.getAllByText("✓ Ver detalles");
    expect(detalles.length).toBeGreaterThan(0);
  });

  test("al seleccionar una figura en Galería vuelve a 3D", () => {
    render(<GeometriaView />);
    fireEvent.click(screen.getByRole("button", { name: /Galería/i }));
    // Selecciona la primera figura: Cubo
    fireEvent.click(screen.getByRole("button", { name: /Cubo/i }));
    expect(screen.getByTestId("geom3d")).toBeInTheDocument();
  });
});

describe("GeometriaView - ayuda", () => {
  test("toggle de ayuda muestra/oculta el panel", () => {
    render(<GeometriaView />);
    expect(screen.queryByRole("heading", { name: "¿Cómo Usar?" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ayuda/i }));
    expect(screen.getByRole("heading", { name: "¿Cómo Usar?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ocultar/i }));
    expect(screen.queryByRole("heading", { name: "¿Cómo Usar?" })).not.toBeInTheDocument();
  });
});

describe("GeometriaView - cambio de figura seleccionada", () => {
  test("al pulsar el botón de 'Tetraedro' el InfoPanel muestra ese nombre", () => {
    render(<GeometriaView />);
    // En el selector inicial de figuras, pulsa 'Tetraedro'
    fireEvent.click(screen.getByRole("button", { name: /Tetraedro/i }));
    expect(screen.getByTestId("info-panel")).toHaveTextContent(/Tetraedro/i);
  });
});
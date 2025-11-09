// src/components/InfoPanel.test.tsx
import { render, screen } from "@testing-library/react";
import { InfoPanel } from "./InfoPanel";
import type { Figura } from "../types/figuras";

const mockFigura: Figura = {
  id: "cubo",
  nombre: "Cubo",
  descripcion: "El cubo es un poliedro regular con 6 caras cuadradas.",
  vertices: 8,
  aristas: 12,
  caras: 6,
  tipoCaras: "Cuadrados",
  color: "#3b82f6",
  audioDescripcion: "Descripción del cubo",
  ejemplosVidaReal: ["Dado de juego", "Caja de regalo"],
  datosCuriosos: [
    "Todas sus caras son cuadrados",
    "Tiene 8 vértices",
  ],
};

const mockEuler = {
  resultado: 2,
  cumple: true,
  formula: "8 - 12 + 6 = 2",
};

describe("InfoPanel - Renderizado básico", () => {
  test("muestra nombre y descripción de la figura", () => {
    render(<InfoPanel figura={mockFigura} euler={mockEuler} />);
    expect(screen.getByRole("heading", { name: "Cubo" })).toBeInTheDocument();
    expect(
      screen.getByText(/El cubo es un poliedro regular/i)
    ).toBeInTheDocument();
  });
});

describe("InfoPanel - Métricas y tipo de caras", () => {
  test("muestra valores de vértices, aristas y caras", () => {
    render(<InfoPanel figura={mockFigura} euler={mockEuler} />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  test("muestra el rótulo de tipo de caras", () => {
    render(<InfoPanel figura={mockFigura} euler={mockEuler} />);
    expect(screen.getByText(/Tipo de caras:/i)).toBeInTheDocument();
  });
});

describe("InfoPanel - Fórmula de Euler", () => {
  test("muestra fórmula general y verificación positiva", () => {
    render(<InfoPanel figura={mockFigura} euler={mockEuler} />);
    // Verifica la fórmula grande
    expect(screen.getByText("V - A + C = 2")).toBeInTheDocument();
    // Verifica la fórmula específica calculada para la figura
    expect(screen.getByText(mockEuler.formula)).toBeInTheDocument();
    // Verifica icono positivo de cumplimiento
    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  test("muestra verificación negativa cuando no cumple", () => {
    const eulerNeg = { resultado: 3, cumple: false, formula: "8 - 12 + 7 = 3" };
    render(<InfoPanel figura={mockFigura} euler={eulerNeg} />);
    expect(screen.getByText(eulerNeg.formula)).toBeInTheDocument();
    // Verifica icono negativo de incumplimiento
    expect(screen.getByText("❌")).toBeInTheDocument();
  });
});

describe("InfoPanel - Datos curiosos y ejemplos", () => {
  test("muestra lista de datos curiosos", () => {
    render(<InfoPanel figura={mockFigura} euler={mockEuler} />);
    for (const dato of mockFigura.datosCuriosos) {
      expect(screen.getByText(dato)).toBeInTheDocument();
    }
  });

  test("muestra ejemplos de vida real", () => {
    render(<InfoPanel figura={mockFigura} euler={mockEuler} />);
    for (const ejemplo of mockFigura.ejemplosVidaReal) {
      expect(screen.getByText(ejemplo)).toBeInTheDocument();
    }
  });
});
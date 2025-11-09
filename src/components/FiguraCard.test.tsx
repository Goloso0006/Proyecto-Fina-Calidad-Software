// src/components/FiguraCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import FiguraCard from "./FiguraCard";

const mockFiguraBase = {
  id: "cubo",
  nombre: "Cubo",
  color: "#3b82f6",
  vertices: 8,
  aristas: 12,
  caras: 6,
};

describe("FiguraCard - Render básico", () => {
  test("muestra nombre y métricas V/A/C", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard figura={mockFiguraBase} isSelected={false} onClick={onClick} emoji={""} />
    );

    // Nombre
    expect(screen.getByRole("heading", { name: /Cubo/i })).toBeInTheDocument();
    // Métricas
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    // Etiquetas V/A/C
    expect(screen.getByText("V")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

describe("FiguraCard - Emoji", () => {
  test("usa emoji proporcionado cuando se pasa por prop", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard
        figura={{ ...mockFiguraBase, id: "desconocido", nombre: "Figura X" }}
        isSelected={false}
        onClick={onClick}
        emoji={"✨"}
      />
    );
    expect(screen.getByText("✨")).toBeInTheDocument();
  });

  test("usa emoji por id cuando no se proporciona prop", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard figura={mockFiguraBase} isSelected={false} onClick={onClick} emoji={undefined as any} />
    );
    // Para id "cubo" usa 🟦
    expect(screen.getByText("🟦")).toBeInTheDocument();
  });

  test("usa emoji genérico cuando id no está mapeado y no hay prop", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard
        figura={{ ...mockFiguraBase, id: "prisma", nombre: "Prisma" }}
        isSelected={false}
        onClick={onClick}
        emoji={undefined as any}
      />
    );
    expect(screen.getByText("🔷")).toBeInTheDocument();
  });
});

describe("FiguraCard - Selección y estilos", () => {
  test("muestra indicador cuando está seleccionado y clases activas", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard figura={mockFiguraBase} isSelected={true} onClick={onClick} emoji={""} />
    );
    // Indicador de selección
    expect(screen.getByText(/Seleccionada/i)).toBeInTheDocument();
    // Clases activas de selección en el botón
    const button = screen.getByRole("button");
    expect(button).toHaveClass("scale-105");
    expect(button).toHaveClass("shadow-2xl");
  });

  test("no muestra indicador y usa clases de estado no seleccionado", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard figura={mockFiguraBase} isSelected={false} onClick={onClick} emoji={""} />
    );
    expect(screen.queryByText(/Seleccionada/i)).not.toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-white/50");
    expect(button).toHaveClass("hover:border-white");
  });
});

describe("FiguraCard - Interacción", () => {
  test("dispara onClick al pulsar el botón", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard figura={mockFiguraBase} isSelected={false} onClick={onClick} emoji={""} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("FiguraCard - Decoración y estilo", () => {
  test("renderiza 8 partículas decorativas de fondo", () => {
    const onClick = jest.fn();
    const { container } = render(
      <FiguraCard figura={mockFiguraBase} isSelected={false} onClick={onClick} emoji={""} />
    );
    const dots = container.querySelectorAll(
      "div.absolute.w-2.h-2.bg-white.rounded-full.opacity-60"
    );
    expect(dots.length).toBe(8);
  });

  test("aplica gradiente de fondo basado en el color de la figura", () => {
    const onClick = jest.fn();
    render(
      <FiguraCard figura={mockFiguraBase} isSelected={false} onClick={onClick} emoji={""} />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveStyle(
      {
        background: `linear-gradient(135deg, ${mockFiguraBase.color}DD 0%, ${mockFiguraBase.color} 100%)`,
      }
    );
  });
});
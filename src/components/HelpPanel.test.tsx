// src/components/HelpPanel.test.tsx
import { render, screen } from "@testing-library/react";
import { HelpPanel } from "./HelpPanel";

describe("HelpPanel - visibilidad", () => {
  test("no renderiza nada cuando isActive es false", () => {
    const { container } = render(<HelpPanel isActive={false} />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/¿Cómo Usar\?/i)).not.toBeInTheDocument();
  });

  test("muestra el panel y el encabezado cuando isActive es true", () => {
    render(<HelpPanel isActive={true} />);
    expect(screen.getByRole("heading", { name: "¿Cómo Usar?" })).toBeInTheDocument();
  });
});

describe("HelpPanel - contenido de tips", () => {
  test("incluye los títulos principales de los consejos", () => {
    render(<HelpPanel isActive={true} />);
    expect(screen.getByText("Rota la Figura")).toBeInTheDocument();
    expect(screen.getByText("Zoom")).toBeInTheDocument();
    expect(screen.getByText("Pausa/Reanuda")).toBeInTheDocument();
    expect(screen.getByText("Descompon")).toBeInTheDocument();
    expect(screen.getByText("Visualiza")).toBeInTheDocument();
    expect(screen.getByText("Escucha")).toBeInTheDocument();
  });
});
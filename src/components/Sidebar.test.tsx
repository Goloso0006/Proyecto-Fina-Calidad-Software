// src/components/Sidebar.test.tsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

const mockOnClose = jest.fn();

const renderWithRouter = (initialEntries: string[] = ["/"], isOpen: boolean = true) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Sidebar isOpen={isOpen} onClose={mockOnClose} />
    </MemoryRouter>
  );

describe("Sidebar - estados por defecto", () => {
  test("Matemáticas inicia abierto y Ciencias cerrado", () => {
    renderWithRouter();

    const btnMat = screen.getByRole("button", { name: /Matemáticas/i });
    const btnCien = screen.getByRole("button", { name: /Naturales/i });

    expect(within(btnMat).getByText("▲")).toBeInTheDocument();
    expect(within(btnCien).getByText("▼")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Geometría 3D/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Sistema Solar Interactivo/i })).not.toBeInTheDocument();
  });
});

describe("Sidebar - toggles de acordeón", () => {
  test("cerrar Matemáticas oculta sus enlaces", async () => {
    renderWithRouter();
    const btnMat = screen.getByRole("button", { name: /Matemáticas/i });
    fireEvent.click(btnMat);

    // Esperar a que la animación termine y el elemento desaparezca
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(screen.queryByRole("link", { name: /Geometría 3D/i })).not.toBeInTheDocument();
    expect(within(btnMat).getByText("▼")).toBeInTheDocument();
  });

  test("abrir Ciencias muestra 'Sistema Solar Interactivo'", () => {
    renderWithRouter();
    const btnCien = screen.getByRole("button", { name: /Naturales/i });
    fireEvent.click(btnCien);

    expect(screen.getByRole("link", { name: /Sistema Solar Interactivo/i })).toBeInTheDocument();
    expect(within(btnCien).getByText("▲")).toBeInTheDocument();
  });
});

describe("Sidebar - enlaces y estado activo", () => {
  test("el enlace de Geometría 3D tiene href correcto", () => {
    renderWithRouter();
    const enlaceGeo = screen.getByRole("link", { name: /Geometría 3D/i });
    expect(enlaceGeo).toHaveAttribute("href", expect.stringContaining("/geometria"));
  });

  test("marca aria-current en la ruta activa", () => {
    renderWithRouter(["/geometria"]);
    const enlaceGeo = screen.getByRole("link", { name: /Geometría 3D/i });
    expect(enlaceGeo).toHaveAttribute("aria-current", "page");
  });
});
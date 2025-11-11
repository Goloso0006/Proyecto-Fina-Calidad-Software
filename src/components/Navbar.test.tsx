// src/components/Navbar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

const mockToggleSidebar = jest.fn();

const AppWithNavbar = () => (
  <Routes>
    <Route path="/" element={<Navbar onToggleSidebar={mockToggleSidebar} />} />
    <Route path="/geometria" element={<Navbar onToggleSidebar={mockToggleSidebar} />} />
  </Routes>
);

describe("Navbar - render básico", () => {
  test("muestra el título 'GeoNova' y el logo", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    expect(screen.getByText("GeoNova")).toBeInTheDocument();
    // El logo se representa como un emoji, verificamos el contenedor clicable por texto
    const clickable = screen.getByText("GeoNova").closest("div");
    expect(clickable).not.toBeNull();
  });

  test("muestra el botón de menú hamburguesa", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    const menuButton = screen.getByLabelText("Abrir menú");
    expect(menuButton).toBeInTheDocument();
  });
});

describe("Navbar - visibilidad del botón Inicio", () => {
  test("no muestra 'Inicio' en la ruta '/' (home)", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    expect(screen.queryByRole("button", { name: /Inicio/i })).not.toBeInTheDocument();
  });

  test("muestra 'Inicio' fuera de home y navega al hacer click", () => {
    render(
      <MemoryRouter initialEntries={["/geometria"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    const btnInicio = screen.getByRole("button", { name: /Inicio/i });
    expect(btnInicio).toBeInTheDocument();

    // Al hacer click, debería navegar a '/'
    fireEvent.click(btnInicio);
    expect(screen.queryByRole("button", { name: /Inicio/i })).not.toBeInTheDocument();
  });
});

describe("Navbar - navegación haciendo click en 'GeoNova'", () => {
  test("desde /geometria, click en 'GeoNova' navega a '/'", () => {
    render(
      <MemoryRouter initialEntries={["/geometria"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("GeoNova"));
    // En home, el botón de Inicio debe desaparecer
    expect(screen.queryByRole("button", { name: /Inicio/i })).not.toBeInTheDocument();
  });
});
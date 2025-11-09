// src/components/Navbar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

const AppWithNavbar = () => (
  <Routes>
    <Route path="/" element={<Navbar />} />
    <Route path="/geometria" element={<Navbar />} />
  </Routes>
);

describe("Navbar - render básico", () => {
  test("muestra el título 'Panel principal' y el logo", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Panel principal")).toBeInTheDocument();
    // El logo se representa como un emoji, verificamos el contenedor clicable por texto
    const clickable = screen.getByText("Panel principal").closest("div");
    expect(clickable).not.toBeNull();
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

describe("Navbar - navegación haciendo click en 'Panel principal'", () => {
  test("desde /geometria, click en 'Panel principal' navega a '/'", () => {
    render(
      <MemoryRouter initialEntries={["/geometria"]}>
        <AppWithNavbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Panel principal"));
    // En home, el botón de Inicio debe desaparecer
    expect(screen.queryByRole("button", { name: /Inicio/i })).not.toBeInTheDocument();
  });
});
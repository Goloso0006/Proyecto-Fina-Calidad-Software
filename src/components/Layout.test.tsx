// src/components/Layout.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

const AppWithLayout = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<div>Inicio contenido</div>} />
      <Route path="/geometria" element={<div>Geometría contenido</div>} />
    </Route>
  </Routes>
);

describe("Layout - renderiza Sidebar y Navbar", () => {
  test("en home muestra 'Panel principal' y el botón 'Matemáticas' del Sidebar", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithLayout />
      </MemoryRouter>
    );

    // Navbar
    expect(screen.getByText("Panel principal")).toBeInTheDocument();
    // Sidebar
    expect(screen.getByRole("button", { name: /Matemáticas/i })).toBeInTheDocument();

    // Outlet
    expect(screen.getByText("Inicio contenido")).toBeInTheDocument();
  });
});

describe("Layout - cambia contenido según ruta (Outlet)", () => {
  test("en /geometria muestra el contenido de esa ruta", () => {
    render(
      <MemoryRouter initialEntries={["/geometria"]}>
        <AppWithLayout />
      </MemoryRouter>
    );
    expect(screen.getByText("Geometría contenido")).toBeInTheDocument();
  });
});
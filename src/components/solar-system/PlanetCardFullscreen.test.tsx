// src/components/solar-system/PlanetCardFullscreen.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { PlanetCardFullscreen } from "./PlanetCardFullscreen";

// Datos mock para un planeta
const mockPlanetaData = {
  id: "tierra",
  nombre: "Tierra",
  descripcion: "Nuestro hogar en el universo",
  diametro: "12,742 km",
  distanciaSol: "149.6 millones de km",
  periodoRotacion: "24 horas",
  periodoOrbital: "365.25 días",
  datosCuriosos: [
    "Es el único planeta con vida conocida",
    "Tiene un satélite natural: la Luna",
    "71% de su superficie es agua",
  ],
};

const mockTextos = {
  ficha: {
    datos: {
      diametro: "Diámetro",
      distanciaSol: "Distancia al Sol",
      periodoRotacion: "Periodo de Rotación",
      periodoOrbital: "Periodo Orbital",
      datosCuriosos: "Datos Curiosos",
    },
    anterior: "Anterior",
    siguiente: "Siguiente",
  },
};

describe("PlanetCardFullscreen - Renderizado básico", () => {
  /**
   * Test 1: Verifica que se muestre la información completa del planeta
   * Importancia: El usuario debe ver todos los datos del planeta seleccionado
   */
  test("muestra todos los datos principales del planeta", () => {
    const mockToggle = jest.fn();

    render(
      <PlanetCardFullscreen
        planetaData={mockPlanetaData}
        planetaActualIndex={2}
        mostrarFicha={true}
        textos={mockTextos}
        onToggleFicha={mockToggle}
      />
    );

    // Verifica que se muestren los datos principales
    expect(screen.getByText("Tierra")).toBeInTheDocument();
    expect(
      screen.getByText("Nuestro hogar en el universo")
    ).toBeInTheDocument();
    expect(screen.getByText("12,742 km")).toBeInTheDocument();
    expect(screen.getByText("149.6 millones de km")).toBeInTheDocument();
    expect(screen.getByText("24 horas")).toBeInTheDocument();
    expect(screen.getByText("365.25 días")).toBeInTheDocument();
  });

  /**
   * Test 2: Verifica el comportamiento de mostrar/ocultar la ficha
   * Importancia: El usuario debe poder controlar la visibilidad de la ficha
   */
  test("permite ocultar y mostrar la ficha con el botón toggle", () => {
    const mockToggle = jest.fn();

    const { rerender } = render(
      <PlanetCardFullscreen
        planetaData={mockPlanetaData}
        planetaActualIndex={2}
        mostrarFicha={true}
        textos={mockTextos}
        onToggleFicha={mockToggle}
      />
    );

    // Verifica que la ficha esté visible
    expect(screen.getByText("Tierra")).toBeInTheDocument();

    // Click en el botón de toggle
    const toggleButton = screen.getByLabelText("Ocultar ficha");
    fireEvent.click(toggleButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);

    // Simula ocultar la ficha
    rerender(
      <PlanetCardFullscreen
        planetaData={mockPlanetaData}
        planetaActualIndex={2}
        mostrarFicha={false}
        textos={mockTextos}
        onToggleFicha={mockToggle}
      />
    );

    // Verifica que el contenido de la ficha no esté visible
    expect(screen.queryByText("Tierra")).not.toBeInTheDocument();
  });

  /**
   * Test 3: Verifica la navegación entre planetas
   * Importancia: El usuario debe poder navegar fácilmente entre planetas
   */
  test("navega correctamente entre planetas con los botones", () => {
    const mockAnterior = jest.fn();
    const mockSiguiente = jest.fn();

    render(
      <PlanetCardFullscreen
        planetaData={mockPlanetaData}
        planetaActualIndex={4}
        mostrarFicha={true}
        textos={mockTextos}
        onToggleFicha={jest.fn()}
        onAnteriorPlaneta={mockAnterior}
        onSiguientePlaneta={mockSiguiente}
      />
    );

    // Click en botón anterior
    const anteriorBtn = screen.getByLabelText("Anterior");
    fireEvent.click(anteriorBtn);
    expect(mockAnterior).toHaveBeenCalledTimes(1);

    // Click en botón siguiente
    const siguienteBtn = screen.getByLabelText("Siguiente");
    fireEvent.click(siguienteBtn);
    expect(mockSiguiente).toHaveBeenCalledTimes(1);

    // Verifica que se muestre el índice correcto
    expect(screen.getByText("5 / 9")).toBeInTheDocument();
  });

  /**
   * Test 4: Verifica que los botones de navegación se deshabiliten en los límites
   * Importancia: Previene errores al intentar navegar fuera de los límites
   */
  test("deshabilita botones en los límites del sistema solar", () => {
    const mockAnterior = jest.fn();
    const mockSiguiente = jest.fn();

    // Prueba en el primer planeta (índice 0)
    const { rerender } = render(
      <PlanetCardFullscreen
        planetaData={mockPlanetaData}
        planetaActualIndex={0}
        mostrarFicha={true}
        textos={mockTextos}
        onToggleFicha={jest.fn()}
        onAnteriorPlaneta={mockAnterior}
        onSiguientePlaneta={mockSiguiente}
      />
    );

    // El botón anterior debe estar deshabilitado
    const anteriorBtn = screen.getByLabelText("Anterior");
    expect(anteriorBtn).toBeDisabled();

    // Prueba en el último planeta (índice 8)
    rerender(
      <PlanetCardFullscreen
        planetaData={mockPlanetaData}
        planetaActualIndex={8}
        mostrarFicha={true}
        textos={mockTextos}
        onToggleFicha={jest.fn()}
        onAnteriorPlaneta={mockAnterior}
        onSiguientePlaneta={mockSiguiente}
      />
    );

    // El botón siguiente debe estar deshabilitado
    const siguienteBtn = screen.getByLabelText("Siguiente");
    expect(siguienteBtn).toBeDisabled();
  });
});

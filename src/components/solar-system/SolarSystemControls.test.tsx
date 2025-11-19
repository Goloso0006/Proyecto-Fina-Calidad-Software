// src/components/solar-system/SolarSystemControls.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SolarSystemControls } from "./SolarSystemControls";

const mockTextos = {
  controles: {
    pausar: "Pausar",
    reanudar: "Reanudar",
    resetVista: "Reset Vista",
    vistaGeneral: "Vista General",
    velocidad: "Velocidad",
  },
};

describe("SolarSystemControls - Renderizado básico", () => {
  /**
   * Test 1: Verifica que se rendericen todos los controles principales
   * Importancia: El usuario debe tener acceso a todos los controles de la simulación
   */
  test("muestra todos los controles cuando el panel está visible", () => {
    render(
      <SolarSystemControls
        isPaused={false}
        velocidadAnimacion={1.5}
        mostrarControles={true}
        vozActiva={false}
        textos={mockTextos}
        onToggleControles={jest.fn()}
        onPauseToggle={jest.fn()}
        onVelocidadChange={jest.fn()}
        onResetVista={jest.fn()}
        onVistaGeneral={jest.fn()}
        onRestablecer={jest.fn()}
        onVozToggle={jest.fn()}
      />
    );

    // Verifica que se muestren los botones principales
    expect(screen.getByLabelText("Pausar")).toBeInTheDocument();
    expect(screen.getByLabelText("Reset Vista")).toBeInTheDocument();
    expect(screen.getByLabelText("Vista General")).toBeInTheDocument();
    expect(screen.getByLabelText("Restablecer sistema")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Alternar narración por voz")
    ).toBeInTheDocument();

    // Verifica que se muestre el control de velocidad
    expect(screen.getByText(/Velocidad:/i)).toBeInTheDocument();
    expect(screen.getByText("1.5x")).toBeInTheDocument();
  });

  /**
   * Test 2: Verifica la funcionalidad de pausar/reanudar
   * Importancia: Control fundamental para la interacción con la simulación
   */
  test("cambia entre pausar y reanudar correctamente", () => {
    const mockPauseToggle = jest.fn();

    const { rerender } = render(
      <SolarSystemControls
        isPaused={false}
        velocidadAnimacion={1}
        mostrarControles={true}
        vozActiva={false}
        textos={mockTextos}
        onToggleControles={jest.fn()}
        onPauseToggle={mockPauseToggle}
      />
    );

    // Estado inicial: No pausado, debe mostrar "Pausar"
    const pauseButton = screen.getByLabelText("Pausar");
    expect(pauseButton).toHaveTextContent("Pausar");
    expect(pauseButton).toHaveTextContent("⏸");

    // Click en pausar
    fireEvent.click(pauseButton);
    expect(mockPauseToggle).toHaveBeenCalledTimes(1);

    // Simula estado pausado
    rerender(
      <SolarSystemControls
        isPaused={true}
        velocidadAnimacion={1}
        mostrarControles={true}
        vozActiva={false}
        textos={mockTextos}
        onToggleControles={jest.fn()}
        onPauseToggle={mockPauseToggle}
      />
    );

    // Debe mostrar "Reanudar"
    const resumeButton = screen.getByLabelText("Reanudar");
    expect(resumeButton).toHaveTextContent("Reanudar");
    expect(resumeButton).toHaveTextContent("▶");
  });

  /**
   * Test 3: Verifica el control de velocidad de animación
   * Importancia: Permite al usuario ajustar la velocidad de la simulación
   */
  test("permite ajustar la velocidad de animación", () => {
    const mockVelocidadChange = jest.fn();

    render(
      <SolarSystemControls
        isPaused={false}
        velocidadAnimacion={2.0}
        mostrarControles={true}
        vozActiva={false}
        textos={mockTextos}
        onToggleControles={jest.fn()}
        onPauseToggle={jest.fn()}
        onVelocidadChange={mockVelocidadChange}
      />
    );

    // Encuentra el slider de velocidad
    const velocidadSlider = screen.getByLabelText(/Velocidad: 2.0x/i);

    // Cambia el valor del slider
    fireEvent.change(velocidadSlider, { target: { value: "3.5" } });

    expect(mockVelocidadChange).toHaveBeenCalledWith(3.5);
  });

  /**
   * Test 4: Verifica el comportamiento de mostrar/ocultar controles
   * Importancia: Permite al usuario tener más espacio visual cuando lo necesita
   */
  test("oculta y muestra el panel de controles correctamente", () => {
    const mockToggleControles = jest.fn();

    const { rerender } = render(
      <SolarSystemControls
        isPaused={false}
        velocidadAnimacion={1}
        mostrarControles={true}
        vozActiva={false}
        textos={mockTextos}
        onToggleControles={mockToggleControles}
        onPauseToggle={jest.fn()}
      />
    );

    // Verifica que los controles estén visibles
    expect(screen.getByLabelText("Pausar")).toBeInTheDocument();

    // Click en el botón de toggle
    const toggleButton = screen.getByLabelText("Ocultar controles");
    fireEvent.click(toggleButton);
    expect(mockToggleControles).toHaveBeenCalledTimes(1);

    // Simula ocultar controles
    rerender(
      <SolarSystemControls
        isPaused={false}
        velocidadAnimacion={1}
        mostrarControles={false}
        vozActiva={false}
        textos={mockTextos}
        onToggleControles={mockToggleControles}
        onPauseToggle={jest.fn()}
      />
    );

    // Los controles no deben estar visibles
    expect(screen.queryByLabelText("Pausar")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Mostrar controles")).toBeInTheDocument();
  });
});

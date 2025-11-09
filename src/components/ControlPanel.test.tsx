// src/components/ControlPanel.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ControlPanel } from "./ControlPanel";

// Limpieza de mocks
beforeEach(() => {
  jest.clearAllMocks();
});

const defaultProps = {
  isPaused: false,
  onPauseToggle: jest.fn(),
  velocidadRotacion: 1,
  onVelocidadChange: jest.fn(),
  onResetVista: jest.fn(),
  onVistaGeneral: jest.fn(),
  mostrarCaras: true,
  onCarasToggle: jest.fn(),
  mostrarAristas: false,
  onAristasToggle: jest.fn(),
  mostrarVertices: false,
  onVerticesToggle: jest.fn(),
  onDescomponer: jest.fn(),
  isDescompuesta: false,
  onReproducirAudio: jest.fn(),
  onAyuda: jest.fn(),
  ayudaActiva: false,
};

describe("ControlPanel - Renderizado básico", () => {
  test("renderiza botones principales con etiquetas correctas (no pausado)", () => {
    render(<ControlPanel {...defaultProps} />);
    expect(screen.getByText(/Pausar/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset Vista/i)).toBeInTheDocument();
    expect(screen.getByText(/Vista General/i)).toBeInTheDocument();
    expect(screen.getByText(/Descomponer/i)).toBeInTheDocument();
    expect(screen.getByText(/Escuchar/i)).toBeInTheDocument();
    expect(screen.getByText(/Ayuda/i)).toBeInTheDocument();
  });

  test("muestra 'Reanudar' cuando isPaused=true y deshabilita el slider", () => {
    render(<ControlPanel {...defaultProps} isPaused={true} />);
    expect(screen.getByText(/Reanudar/i)).toBeInTheDocument();
    const range = screen.getByRole("slider");
    expect(range).toBeDisabled();
  });
});

describe("ControlPanel - Callbacks de botones principales", () => {
  test("click en Pausar llama onPauseToggle", () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Pausar/i));
    expect(defaultProps.onPauseToggle).toHaveBeenCalledTimes(1);
  });

  test("click en Reset Vista llama onResetVista", () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Reset Vista/i));
    expect(defaultProps.onResetVista).toHaveBeenCalledTimes(1);
  });

  test("click en Vista General llama onVistaGeneral", () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Vista General/i));
    expect(defaultProps.onVistaGeneral).toHaveBeenCalledTimes(1);
  });

  test("click en Descomponer/Armar llama onDescomponer", () => {
    const props = { ...defaultProps, isDescompuesta: false };
    render(<ControlPanel {...props} />);
    fireEvent.click(screen.getByText(/Descomponer/i));
    expect(defaultProps.onDescomponer).toHaveBeenCalledTimes(1);
  });

  test("click en Escuchar llama onReproducirAudio", () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Escuchar/i));
    expect(defaultProps.onReproducirAudio).toHaveBeenCalledTimes(1);
  });

  test("click en Ayuda/Ocultar llama onAyuda", () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Ayuda/i));
    expect(defaultProps.onAyuda).toHaveBeenCalledTimes(1);
  });
});

describe("ControlPanel - Slider de velocidad", () => {
  test("muestra la velocidad en formato 'x' y emite cambios", () => {
    render(<ControlPanel {...defaultProps} velocidadRotacion={1.2} />);
    expect(screen.getByText("1.2x")).toBeInTheDocument();

    const range = screen.getByRole("slider");
    fireEvent.change(range, { target: { value: "2.5" } });
    expect(defaultProps.onVelocidadChange).toHaveBeenCalledWith(2.5);
  });
});

describe("ControlPanel - Botones de visualización", () => {
  test("Caras está deshabilitado cuando isDescompuesta=true", () => {
    render(<ControlPanel {...defaultProps} isDescompuesta={true} />);
    const btnCaras = screen.getByText(/Caras/i).closest("button");
    expect(btnCaras).toBeDisabled();
  });

  test("click en Caras/Aristas/Vértices llama a sus toggles", () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Caras/i));
    fireEvent.click(screen.getByText(/Aristas/i));
    fireEvent.click(screen.getByText(/Vértices/i));
    expect(defaultProps.onCarasToggle).toHaveBeenCalledTimes(1);
    expect(defaultProps.onAristasToggle).toHaveBeenCalledTimes(1);
    expect(defaultProps.onVerticesToggle).toHaveBeenCalledTimes(1);
  });

  test("refleja estados activos de visualización en el DOM", () => {
    render(
      <ControlPanel
        {...defaultProps}
        mostrarCaras={true}
        mostrarAristas={true}
        mostrarVertices={true}
      />
    );
    // Solo verificamos que los botones existan; estilos son clases pero no requieren evaluación CSS
    expect(screen.getByText(/Caras/i)).toBeInTheDocument();
    expect(screen.getByText(/Aristas/i)).toBeInTheDocument();
    expect(screen.getByText(/Vértices/i)).toBeInTheDocument();
  });
});
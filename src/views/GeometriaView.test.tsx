import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GeometriaView from "./GeometriaView";

// Mock del componente 3D para evitar problemas con Three.js en tests
jest.mock("../components/GeometriaFiguras3D", () => {
  return function MockGeometriaFiguras3D() {
    return <div data-testid="geometria-3d">Visualización 3D Mock</div>;
  };
});

// Mock de speechSynthesis
const mockSpeak = jest.fn();
const mockCancel = jest.fn();

Object.defineProperty(window, "speechSynthesis", {
  writable: true,
  value: {
    speak: mockSpeak,
    cancel: mockCancel,
  },
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("GeometriaView - Renderizado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el título principal correctamente", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByText(/Explorando Figuras Geométricas 3D/i)).toBeInTheDocument();
  });

  test("renderiza el subtítulo correctamente", () => {
    renderWithRouter(<GeometriaView />);
    expect(
      screen.getByText(/Aprende sobre caras, aristas y vértices de forma interactiva/i)
    ).toBeInTheDocument();
  });

  test("renderiza los 5 botones de selección de figuras", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByRole("button", { name: /Cubo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tetraedro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Octaedro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dodecaedro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Icosaedro/i })).toBeInTheDocument();
  });

  test("renderiza el componente de visualización 3D", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByTestId("geometria-3d")).toBeInTheDocument();
  });

  test("muestra la información de la figura por defecto (Cubo)", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByText("Cubo")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument(); // Vértices
    expect(screen.getByText("12")).toBeInTheDocument(); // Aristas
    expect(screen.getByText("6")).toBeInTheDocument(); // Caras
  });
});

describe("GeometriaView - Controles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("el botón de pausar/reanudar cambia de texto al hacer clic", () => {
    renderWithRouter(<GeometriaView />);
    const pauseButton = screen.getByRole("button", { name: /Pausar Rotación/i });
    
    expect(pauseButton).toHaveTextContent("Pausar Rotación");
    
    fireEvent.click(pauseButton);
    expect(pauseButton).toHaveTextContent("Reanudar Rotación");
    
    fireEvent.click(pauseButton);
    expect(pauseButton).toHaveTextContent("Pausar Rotación");
  });

  test("los checkboxes de visualización están presentes y funcionan", () => {
    renderWithRouter(<GeometriaView />);
    
    const checkboxCaras = screen.getByRole("checkbox", { name: /Mostrar Caras/i });
    const checkboxAristas = screen.getByRole("checkbox", { name: /Mostrar Aristas/i });
    const checkboxVertices = screen.getByRole("checkbox", { name: /Mostrar Vértices/i });
    
    expect(checkboxCaras).toBeInTheDocument();
    expect(checkboxAristas).toBeInTheDocument();
    expect(checkboxVertices).toBeInTheDocument();
    
    // Por defecto, caras está marcado
    expect(checkboxCaras).toBeChecked();
    expect(checkboxAristas).not.toBeChecked();
    expect(checkboxVertices).not.toBeChecked();
    
    // Cambiar estado
    fireEvent.click(checkboxAristas);
    expect(checkboxAristas).toBeChecked();
  });

  test("el botón de descomponer cambia a 'Armar Figura' al hacer clic", () => {
    renderWithRouter(<GeometriaView />);
    const descomponerButton = screen.getByRole("button", { name: /Descomponer Figura/i });
    
    expect(descomponerButton).toHaveTextContent("Descomponer Figura");
    
    fireEvent.click(descomponerButton);
    expect(descomponerButton).toHaveTextContent("Armar Figura");
    
    fireEvent.click(descomponerButton);
    expect(descomponerButton).toHaveTextContent("Descomponer Figura");
  });

  test("el control de velocidad está presente y puede cambiar", () => {
    renderWithRouter(<GeometriaView />);
    const velocidadInput = screen.getByLabelText(/Velocidad de Rotación:/i);
    
    expect(velocidadInput).toBeInTheDocument();
    expect(velocidadInput).toHaveValue("1");
    
    fireEvent.change(velocidadInput, { target: { value: "2" } });
    expect(velocidadInput).toHaveValue("2");
  });
});

describe("GeometriaView - Selección de figuras", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("cambiar de figura actualiza la información mostrada", () => {
    renderWithRouter(<GeometriaView />);
    
    // Inicialmente muestra Cubo
    expect(screen.getByText("Cubo")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument(); // Vértices del cubo
    
    // Cambiar a Tetraedro
    const tetraedroButton = screen.getByRole("button", { name: /Tetraedro/i });
    fireEvent.click(tetraedroButton);
    
    expect(screen.getByText("Tetraedro")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument(); // Vértices del tetraedro
  });

  test("al cambiar de figura, se resetea el estado de descomposición", () => {
    renderWithRouter(<GeometriaView />);
    
    // Descomponer la figura actual
    const descomponerButton = screen.getByRole("button", { name: /Descomponer Figura/i });
    fireEvent.click(descomponerButton);
    expect(descomponerButton).toHaveTextContent("Armar Figura");
    
    // Cambiar a otra figura
    const octaedroButton = screen.getByRole("button", { name: /Octaedro/i });
    fireEvent.click(octaedroButton);
    
    // El botón debe volver a "Descomponer"
    expect(descomponerButton).toHaveTextContent("Descomponer Figura");
  });
});

describe("GeometriaView - Fórmula de Euler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra la fórmula de Euler correctamente", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByText(/V - A \+ C = 2/i)).toBeInTheDocument();
  });

  test("valida correctamente la fórmula de Euler para el Cubo", () => {
    renderWithRouter(<GeometriaView />);
    
    // Para el cubo: 8 - 12 + 6 = 2 ✓
    expect(screen.getByText(/8 - 12 \+ 6 = 2/i)).toBeInTheDocument();
    expect(screen.getByText(/¡Cumple la fórmula de Euler!/i)).toBeInTheDocument();
  });

  test("valida correctamente la fórmula de Euler para diferentes figuras", () => {
    renderWithRouter(<GeometriaView />);
    
    // Cambiar a Tetraedro
    const tetraedroButton = screen.getByRole("button", { name: /Tetraedro/i });
    fireEvent.click(tetraedroButton);
    
    // Para el tetraedro: 4 - 6 + 4 = 2 ✓
    expect(screen.getByText(/4 - 6 \+ 4 = 2/i)).toBeInTheDocument();
    expect(screen.getByText(/¡Cumple la fórmula de Euler!/i)).toBeInTheDocument();
  });
});

describe("GeometriaView - Audio descriptivo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("el botón de audio está presente", () => {
    renderWithRouter(<GeometriaView />);
    const audioButton = screen.getByRole("button", { name: /Escuchar Descripción/i });
    expect(audioButton).toBeInTheDocument();
  });

  test("al hacer clic en el botón de audio, se llama a speechSynthesis", () => {
    renderWithRouter(<GeometriaView />);
    const audioButton = screen.getByRole("button", { name: /Escuchar Descripción/i });
    
    fireEvent.click(audioButton);
    
    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
  });
});

describe("GeometriaView - Datos curiosos y ejemplos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra los datos curiosos de la figura seleccionada", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByText(/Datos Curiosos/i)).toBeInTheDocument();
  });

  test("muestra ejemplos de la vida real", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByText(/En la Vida Real/i)).toBeInTheDocument();
    expect(screen.getByText(/Dado de juego/i)).toBeInTheDocument();
  });
});

describe("GeometriaView - Instrucciones", () => {
  test("muestra las instrucciones de uso", () => {
    renderWithRouter(<GeometriaView />);
    expect(screen.getByText(/Instrucciones:/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrastra para rotar la figura/i)).toBeInTheDocument();
  });
});
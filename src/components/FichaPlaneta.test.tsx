// src/components/FichaPlaneta.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FichaPlaneta from "./FichaPlaneta";
import planetasData from "../data/planetas.json";
import textosData from "../data/textos-interfaz.json";
import type { PlanetasData, TextosInterfaz } from "../types/planetas";

// Limpia los mocks antes de cada prueba
beforeEach(() => {
    jest.clearAllMocks();
});

const planetas = (planetasData as PlanetasData).planetas;
const textos = (textosData as TextosInterfaz).sistemaSolar.ficha;

const mockProps = {
    planetaId: "tierra",
    onCerrar: jest.fn(),
    onAnterior: jest.fn(),
    onSiguiente: jest.fn(),
    planetaActualIndex: 2,
};

describe("FichaPlaneta - Renderizado", () => {
    test("no renderiza nada cuando planetaId es null", () => {
        const { container } = render(<FichaPlaneta {...mockProps} planetaId={null} />);
        expect(container.firstChild).toBeNull();
    });

    test("renderiza la ficha cuando planetaId es válido", () => {
        render(<FichaPlaneta {...mockProps} />);
        const planeta = planetas.find((p) => p.id === "tierra");
        expect(screen.getByText(planeta!.nombre)).toBeInTheDocument();
    });

    test("renderiza el nombre del planeta", () => {
        render(<FichaPlaneta {...mockProps} />);
        const planeta = planetas.find((p) => p.id === "tierra");
        expect(screen.getByRole("heading", { name: planeta!.nombre })).toBeInTheDocument();
    });

    test("renderiza la descripción del planeta", () => {
        render(<FichaPlaneta {...mockProps} />);
        const planeta = planetas.find((p) => p.id === "tierra");
        expect(screen.getByText(planeta!.descripcion)).toBeInTheDocument();
    });

    test("renderiza los datos básicos del planeta", () => {
        render(<FichaPlaneta {...mockProps} />);
        const planeta = planetas.find((p) => p.id === "tierra");

        expect(screen.getByText(textos.datos.diametro)).toBeInTheDocument();
        expect(screen.getByText(planeta!.diametro)).toBeInTheDocument();

        if (planeta!.distanciaSol) {
            expect(screen.getByText(textos.datos.distanciaSol)).toBeInTheDocument();
            expect(screen.getByText(planeta!.distanciaSol)).toBeInTheDocument();
        }

        expect(screen.getByText(textos.datos.periodoRotacion)).toBeInTheDocument();
        expect(screen.getByText(planeta!.periodoRotacion)).toBeInTheDocument();

        if (planeta!.periodoOrbital) {
            expect(screen.getByText(textos.datos.periodoOrbital)).toBeInTheDocument();
            expect(screen.getByText(planeta!.periodoOrbital)).toBeInTheDocument();
        }
    });

    test("renderiza los datos curiosos del planeta", () => {
        render(<FichaPlaneta {...mockProps} />);
        const planeta = planetas.find((p) => p.id === "tierra");

        expect(screen.getByText(textos.datos.datosCuriosos)).toBeInTheDocument();
        planeta!.datosCuriosos.forEach((dato) => {
            expect(screen.getByText(dato)).toBeInTheDocument();
        });
    });

    test("renderiza el contador de planetas", () => {
        render(<FichaPlaneta {...mockProps} />);
        expect(screen.getByText(/3 de 8/i)).toBeInTheDocument();
    });
});

describe("FichaPlaneta - Interacciones", () => {
    test("llama a onCerrar cuando se hace clic en el botón cerrar", () => {
        const mockOnCerrar = jest.fn();
        render(<FichaPlaneta {...mockProps} onCerrar={mockOnCerrar} />);

        const botonCerrar = screen.getByRole("button", { name: textosData.sistemaSolar.controles.cerrarFicha });
        fireEvent.click(botonCerrar);

        expect(mockOnCerrar).toHaveBeenCalledTimes(1);
    });

    test("llama a onCerrar cuando se hace clic fuera de la ficha", () => {
        const mockOnCerrar = jest.fn();
        render(<FichaPlaneta {...mockProps} onCerrar={mockOnCerrar} />);

        // El overlay es el elemento con role="dialog"
        const overlay = screen.getByRole("dialog");
        fireEvent.click(overlay);

        expect(mockOnCerrar).toHaveBeenCalledTimes(1);
    });

    test("no llama a onCerrar cuando se hace clic dentro de la ficha", () => {
        const mockOnCerrar = jest.fn();
        render(<FichaPlaneta {...mockProps} onCerrar={mockOnCerrar} />);

        const contenido = screen.getByText(planetas.find((p) => p.id === "tierra")!.nombre);
        fireEvent.click(contenido);

        expect(mockOnCerrar).not.toHaveBeenCalled();
    });

    test("llama a onAnterior cuando se hace clic en el botón anterior", () => {
        const mockOnAnterior = jest.fn();
        render(<FichaPlaneta {...mockProps} onAnterior={mockOnAnterior} planetaActualIndex={2} />);

        const botonAnterior = screen.getByRole("button", { name: /Anterior/i });
        expect(botonAnterior).not.toBeDisabled();

        fireEvent.click(botonAnterior);
        expect(mockOnAnterior).toHaveBeenCalledTimes(1);
    });

    test("llama a onSiguiente cuando se hace clic en el botón siguiente", () => {
        const mockOnSiguiente = jest.fn();
        render(<FichaPlaneta {...mockProps} onSiguiente={mockOnSiguiente} planetaActualIndex={2} />);

        const botonSiguiente = screen.getByRole("button", { name: /Siguiente/i });
        expect(botonSiguiente).not.toBeDisabled();

        fireEvent.click(botonSiguiente);
        expect(mockOnSiguiente).toHaveBeenCalledTimes(1);
    });

    test("deshabilita el botón anterior en el primer planeta", () => {
        render(<FichaPlaneta {...mockProps} planetaActualIndex={0} />);

        const botonAnterior = screen.getByRole("button", { name: /Anterior/i });
        expect(botonAnterior).toBeDisabled();
    });

    test("deshabilita el botón siguiente en el último planeta", () => {
        render(<FichaPlaneta {...mockProps} planetaActualIndex={planetas.length - 1} />);

        const botonSiguiente = screen.getByRole("button", { name: /Siguiente/i });
        expect(botonSiguiente).toBeDisabled();
    });
});

describe("FichaPlaneta - Navegación por teclado", () => {
    test("llama a onCerrar cuando se presiona Escape", async () => {
        const mockOnCerrar = jest.fn();
        render(<FichaPlaneta {...mockProps} onCerrar={mockOnCerrar} />);

        fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

        await waitFor(() => {
            expect(mockOnCerrar).toHaveBeenCalledTimes(1);
        });
    });

    test("llama a onAnterior cuando se presiona ArrowLeft y no es el primer planeta", async () => {
        const mockOnAnterior = jest.fn();
        render(<FichaPlaneta {...mockProps} onAnterior={mockOnAnterior} planetaActualIndex={2} />);

        fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });

        await waitFor(() => {
            expect(mockOnAnterior).toHaveBeenCalledTimes(1);
        });
    });

    test("no llama a onAnterior cuando se presiona ArrowLeft y es el primer planeta", async () => {
        const mockOnAnterior = jest.fn();
        render(<FichaPlaneta {...mockProps} onAnterior={mockOnAnterior} planetaActualIndex={0} />);

        fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });

        await waitFor(() => {
            expect(mockOnAnterior).not.toHaveBeenCalled();
        });
    });

    test("llama a onSiguiente cuando se presiona ArrowRight y no es el último planeta", async () => {
        const mockOnSiguiente = jest.fn();
        render(<FichaPlaneta {...mockProps} onSiguiente={mockOnSiguiente} planetaActualIndex={2} />);

        fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });

        await waitFor(() => {
            expect(mockOnSiguiente).toHaveBeenCalledTimes(1);
        });
    });

    test("no llama a onSiguiente cuando se presiona ArrowRight y es el último planeta", async () => {
        const mockOnSiguiente = jest.fn();
        render(
            <FichaPlaneta
                {...mockProps}
                onSiguiente={mockOnSiguiente}
                planetaActualIndex={planetas.length - 1}
            />
        );

        fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });

        await waitFor(() => {
            expect(mockOnSiguiente).not.toHaveBeenCalled();
        });
    });
});

describe("FichaPlaneta - Accesibilidad", () => {
    test("tiene el atributo role dialog", () => {
        render(<FichaPlaneta {...mockProps} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("tiene el atributo aria-modal", () => {
        render(<FichaPlaneta {...mockProps} />);
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    test("tiene el atributo aria-labelledby", () => {
        render(<FichaPlaneta {...mockProps} />);
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-labelledby", "ficha-titulo");
    });

    test("el botón cerrar tiene aria-label", () => {
        render(<FichaPlaneta {...mockProps} />);
        const botonCerrar = screen.getByRole("button", { name: textosData.sistemaSolar.controles.cerrarFicha });
        expect(botonCerrar).toHaveAttribute("aria-label");
    });
});

describe("FichaPlaneta - Casos edge", () => {
    test("no renderiza cuando el planeta no existe", () => {
        const { container } = render(
            <FichaPlaneta {...mockProps} planetaId="planeta-inexistente" />
        );
        expect(container.firstChild).toBeNull();
    });

    test("renderiza correctamente con diferentes planetas", () => {
        const { rerender } = render(<FichaPlaneta {...mockProps} planetaId="mercurio" planetaActualIndex={0} />);
        expect(screen.getByText("Mercurio")).toBeInTheDocument();

        rerender(<FichaPlaneta {...mockProps} planetaId="jupiter" planetaActualIndex={4} />);
        expect(screen.getByText("Júpiter")).toBeInTheDocument();
    });
});

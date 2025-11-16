export interface Planeta {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  diametro: string;
  distanciaSol?: string; // Opcional para el Sol
  periodoRotacion: string;
  periodoOrbital?: string; // Opcional para el Sol
  datosCuriosos: string[];
}

export interface PlanetasData {
  planetas: Planeta[];
}

export interface TextosInterfaz {
  sistemaSolar: {
    titulo: string;
    subtitulo: string;
    controles: {
      pausar: string;
      reanudar: string;
      resetVista: string;
      vistaGeneral: string;
      velocidad: string;
      cerrarFicha: string;
      modoPantallaCompleta: string;
      salirPantallaCompleta: string;
    };
    instrucciones: {
      clicPlaneta: string;
      zoom: string;
      rotar: string;
      velocidad: string;
    };
    ficha: {
      titulo: string;
      anterior: string;
      siguiente: string;
      datos: {
        diametro: string;
        distanciaSol: string;
        periodoRotacion: string;
        periodoOrbital: string;
        datosCuriosos: string;
      };
    };
    menu: {
      verPlanetas: string;
      volverVisualizacion: string;
    };
  };
}

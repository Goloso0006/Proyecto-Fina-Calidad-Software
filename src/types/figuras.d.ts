export interface Figura {
  id: string;
  nombre: string;
  descripcion: string;
  vertices: number;
  aristas: number;
  caras: number;
  tipoCaras: string;
  color: string;
  audioDescripcion: string;
  ejemplosVidaReal: string[];
  datosCuriosos: string[];
}

export interface FigurasData {
  figuras: Figura[];
  textos: TextosFiguras;
}

export interface TextosFiguras {
  titulo: string;
  subtitulo: string;
  controles: {
    pausar: string;
    reanudar: string;
    mostrarCaras: string;
    mostrarAristas: string;
    mostrarVertices: string;
    descomponer: string;
    armar: string;
    velocidad: string;
    reproducirAudio: string;
  };
  instrucciones: {
    rotar: string;
    zoom: string;
    seleccionar: string;
    descomponer: string;
  };
  formuraEuler: {
    titulo: string;
    descripcion: string;
    formula: string;
    leyenda: {
      v: string;
      a: string;
      c: string;
    };
  };
}
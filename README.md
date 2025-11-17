# GeoNova - Plataforma Educativa Interactiva

[![CI - GeoNova](https://github.com/Goloso0006/Proyecto-Fina-Calidad-Software/workflows/🚀%20CI%20-%20GeoNova/badge.svg)](https://github.com/Goloso0006/Proyecto-Fina-Calidad-Software/actions)
[![Node.js Version](https://img.shields.io/badge/node-20.x-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://react.dev/)

## Descripción

**GeoNova** es una plataforma educativa interactiva desarrollada en **React con Vite** que combina matemáticas y ciencias naturales a través de experiencias 3D inmersivas. El proyecto incluye dos módulos principales: **Geometría 3D** y **Sistema Solar Interactivo**.

### Módulos incluidos:

* **Geometría 3D**: Explora figuras geométricas tridimensionales (poliedros platónicos) con visualización interactiva, aprende sobre sus propiedades (caras, aristas, vértices) y verifica el Teorema de Euler.

* **Sistema Solar Interactivo**: Viaja por el espacio y descubre los planetas del sistema solar con modelos 3D realistas, información detallada y controles de navegación interactivos.

---

## Características principales

- ✨ **Visualización 3D con Three.js**: Modelos interactivos con controles de cámara, zoom y rotación
- 🎨 **Animaciones fluidas con Framer Motion**: Transiciones suaves y efectos visuales atractivos
- 🎤 **Narración por voz**: Sistema de accesibilidad con síntesis de voz para describir contenido
- 📱 **Diseño responsive**: Optimizado para desktop, tablet y móvil con Tailwind CSS
- ♿ **Accesibilidad**: Navegación por teclado, lectores de pantalla y alto contraste
- 🧪 **Cobertura de tests**: Pruebas unitarias con Jest y React Testing Library
- 🚀 **Integración Continua**: CI/CD con GitHub Actions

### Características del Sistema Solar 3D:

- 🪐 **8 planetas del sistema solar** con modelos 3D realistas
- ☀️ **Sol con iluminación dinámica** que ilumina el sistema
- 🔄 **Anillos de Saturno** con geometría realista y semi-transparente
- 🎯 **Efecto hover interactivo**: Los planetas y el sol se agrandan al pasar el mouse, con cambio de cursor a pointer
- 🖱️ **Controles de cámara mejorados**: 
  - Zoom 5x más rápido con rueda del mouse
  - Pinch-to-zoom 4x más sensible en dispositivos móviles
  - Rotación suave con arrastre del mouse o touch
- 📊 **Información detallada de cada planeta**: Diámetro, distancia al sol, períodos de rotación y orbital, datos curiosos
- 🎮 **Modo pantalla completa** con controles integrados
- 🌌 **Fondo espacial con gradientes** adaptado a la temática

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Goloso0006/Proyecto-Fina-Calidad-Software.git
cd integracion_continua
```

Instalar dependencias:

```bash
npm install
```

---

## Scripts disponibles

**Iniciar servidor de desarrollo:**

```bash
npm run dev
```

**Compilar para producción:**

```bash
npm run build
```

**Previsualizar build de producción:**

```bash
npm run preview
```

**Ejecutar pruebas unitarias:**

```bash
npm test
```

**Revisar tipos TypeScript:**

```bash
npm run type-check
```

**Linting y formateo:**

```bash
npm run lint
npm run format
```

---

## Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx       # Layout principal con Sidebar y Navbar
│   ├── Navbar.tsx       # Barra de navegación superior
│   ├── Sidebar.tsx      # Menú lateral con navegación
│   ├── SistemaSolar3D.tsx        # Visualización 3D del sistema solar
│   ├── FichaPlaneta.tsx          # Información detallada de planetas
│   ├── GeometriaFiguras3D.tsx    # Visualización 3D de figuras geométricas
│   ├── FiguraCard.tsx            # Tarjetas de selección de figuras
│   ├── ControlPanel.tsx          # Panel de controles para geometría
│   ├── InfoPanel.tsx             # Panel informativo de figuras
│   ├── HelpPanel.tsx             # Panel de ayuda
│   └── solar-system/             # Componentes específicos del sistema solar
│       ├── Planet3D.tsx          # Componente de planeta individual con anillos
│       ├── Sun3D.tsx             # Componente del sol
│       ├── LightingSetup.tsx     # Configuración de iluminación
│       ├── SolarSystemControls.tsx  # Controles del sistema solar
│       └── PlanetCardFullscreen.tsx # Tarjeta de planeta en fullscreen
├── views/               # Vistas principales de las rutas
│   ├── HomeView.tsx     # Página de inicio con selección de módulos
│   ├── GeometriaView.tsx # Vista del módulo de geometría
│   └── SistemaSolarView.tsx # Vista del módulo del sistema solar
├── routes/
│   └── AppRoutes.tsx    # Configuración de rutas de React Router
├── hooks/               # Custom hooks
│   ├── useVoz.ts        # Hook para síntesis de voz
│   └── solar-system/
│       ├── useCameraControls.ts    # Control de cámara
│       ├── usePlanetAnimation.ts   # Animación de planetas
│       ├── usePlanetInteraction.ts # Interacción con planetas (hover, click, zoom)
│       └── useResizeHandler.ts     # Manejo de redimensionamiento
├── data/                # Datos JSON
│   ├── planetas.json    # Información de los planetas
│   ├── figuras-geometricas.json # Datos de figuras geométricas
│   └── textos-interfaz.json # Textos de la interfaz
├── types/               # Definiciones de tipos TypeScript
│   ├── planetas.d.ts
│   └── figuras.d.ts
├── utils/               # Utilidades
│   └── solar-system/
│       ├── cameraHelpers.ts    # Helpers para la cámara
│       ├── planetConfig.ts     # Configuración de planetas y zoom
│       └── threeHelpers.ts     # Helpers de Three.js
├── App.tsx              # Componente raíz
├── main.tsx             # Punto de entrada
└── index.css            # Estilos globales con Tailwind
```

---

## Tecnologías utilizadas

### Frontend
* **React 19** - Biblioteca de UI
* **TypeScript** - Tipado estático
* **Vite** - Build tool y dev server ultrarrápido
* **React Router DOM 7** - Enrutamiento SPA

### Visualización 3D
* **Three.js 0.179.1** - Motor de renderizado 3D WebGL

### Estilos y Animaciones
* **Tailwind CSS 4** - Framework CSS utility-first
* **Framer Motion 12** - Biblioteca de animaciones
* **React Icons** - Iconos

### Testing
* **Jest** - Framework de testing
* **React Testing Library** - Testing de componentes
* **@testing-library/jest-dom** - Matchers personalizados

### Calidad de Código
* **ESLint 9** - Linter con flat config
* **TypeScript Compiler** - Type checking
* **Prettier** - Formateador de código

---

## Pruebas unitarias

Las pruebas unitarias validan:

* ✅ Renderizado correcto de componentes
* ✅ Interacciones de usuario (clicks, navegación, controles)
* ✅ Lógica de cálculos geométricos (Teorema de Euler)
* ✅ Navegación entre rutas
* ✅ Estados y props de componentes
* ✅ Funcionalidad de efectos 3D (anillos de Saturno, hover)
* ✅ Accesibilidad básica

**Ejecutar todas las pruebas:**

```bash
npm test
```

**Ejecutar tests con cobertura:**

```bash
npm test -- --coverage
```

---

## Integración Continua

El proyecto utiliza **GitHub Actions** para:

- 🔍 Verificación de tipos con TypeScript
- 🧹 Linting con ESLint
- 🧪 Ejecución de tests con Jest
- 🏗️ Build de producción
- 📦 Upload de artefactos

El workflow se ejecuta en cada push a `main` y en Pull Requests.

---

## Configuración de Zoom (Sistema Solar)

El sistema solar incluye controles de zoom ajustables. Configuración actual:

- **Rueda del mouse**: Multiplicador de 0.05 (5x más rápido)
- **Pinch móvil**: Multiplicador de 0.08 (4x más sensible)

---

## Interacciones del Sistema Solar

### Desktop (Mouse):
- 🖱️ **Click**: Seleccionar planeta/sol
- 🖱️ **Doble Click**: Abrir información detallada
- 🖱️ **Arrastrar**: Rotar cámara
- 🖱️ **Rueda**: Zoom in/out
- 🖱️ **Hover**: Efecto de agrandamiento + cursor pointer

### Móvil (Touch):
- 👆 **Tap**: Seleccionar planeta/sol
- 👆 **Doble Tap**: Abrir información detallada
- 👆 **Deslizar**: Rotar cámara
- 🤏 **Pinch**: Zoom in/out

---

## Autores

**Proyecto Final - Calidad de Software**  
Marlon Alexander Imbajoa Canchala
Daniel Guevara
Repositorio: [Proyecto-Fina-Calidad-Software](https://github.com/Goloso0006/Proyecto-Fina-Calidad-Software)

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
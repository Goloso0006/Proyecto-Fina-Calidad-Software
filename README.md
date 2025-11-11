# GeoNova - Plataforma Educativa Interactiva# Clase UCC - Aplicativo React con Vite



## Descripción## Descripción



**GeoNova** es una plataforma educativa interactiva desarrollada en **React con Vite** que combina matemáticas y ciencias naturales a través de experiencias 3D inmersivas. El proyecto incluye dos módulos principales: **Geometría 3D** y **Sistema Solar Interactivo**.Este proyecto es un aplicativo desarrollado en **React con Vite** para aprender y aplicar **pruebas unitarias** con Jest más la integración continua con GitHub Actions.



### Módulos incluidos:El aplicativo incluye:



* **Geometría 3D**: Explora figuras geométricas tridimensionales (poliedros platónicos) con visualización interactiva, aprende sobre sus propiedades (caras, aristas, vértices) y verifica el Teorema de Euler.* **Sidebar con acordeón** para navegación.

  * **Componentes de ejemplo** para verificar dependencias.

* **Sistema Solar Interactivo**: Viaja por el espacio y descubre los planetas del sistema solar con modelos 3D realistas, información detallada y controles de navegación interactivos.* **Ejercicios con pruebas unitarias**:



---  * Tablas de Multiplicar (`TablasMul.tsx`)

  * Conversor de Unidades (`UnitConverter.tsx`)

## Características principales  * Validador de Contraseñas (`PasswordValidator.tsx`)

  * Contador de Clics (`ClickCounter.tsx`)

- ✨ **Visualización 3D con Three.js**: Modelos interactivos con controles de cámara, zoom y rotación  * Lista de Tareas (`TodoList.tsx`)

- 🎨 **Animaciones fluidas con Framer Motion**: Transiciones suaves y efectos visuales atractivos

- 🎤 **Narración por voz**: Sistema de accesibilidad con síntesis de voz para describir contenido---

- 📱 **Diseño responsive**: Optimizado para desktop, tablet y móvil con Tailwind CSS

- ♿ **Accesibilidad**: Navegación por teclado, lectores de pantalla y alto contraste## Instalación

- 🧪 **Cobertura de tests**: Pruebas unitarias con Jest y React Testing Library

- 🚀 **Integración Continua**: CI/CD con GitHub ActionsClonar el repositorio:



---```bash

git clone https://github.com/guswill24/ucc_ing_web.git

## Instalacióncd clase-ucc

```

Clonar el repositorio:

Instalar dependencias:

```bash

git clone https://github.com/Goloso0006/Proyecto-Fina-Calidad-Software.git```bash

cd integracion_continuanpm install

``````



Instalar dependencias:---



```bash## Scripts disponibles

npm install

```* **Iniciar servidor de desarrollo**



---```bash

npm run dev

## Scripts disponibles```



* **Iniciar servidor de desarrollo*** **Compilar para producción**



```bash```bash

npm run devnpm run build

``````



* **Compilar para producción*** **Previsualizar build de producción**



```bash```bash

npm run buildnpm run preview

``````



* **Previsualizar build de producción*** **Ejecutar pruebas unitarias**



```bash```bash

npm run previewnpm test

``````



* **Ejecutar pruebas unitarias*** **Revisar tipos TypeScript**



```bash```bash

npm testnpm run type-check

``````



* **Revisar tipos TypeScript*** **Linting y formateo**



```bash```bash

npm run type-checknpm run lint

```npm run format

```

* **Linting y formateo**

---

```bash

npm run lint## Estructura de Carpetas

npm run format

``````

src/

---├─ components/       # Componentes reutilizables (Sidebar, UnitConverter, etc.)

├─ views/            # Vistas de cada ejercicio y ejemplo

## Estructura de Carpetas├─ AppRoutes.tsx     # Rutas principales

└─ main.tsx          # Entrada principal de React

``````

src/

├── components/          # Componentes reutilizables---

│   ├── Layout.tsx       # Layout principal con Sidebar y Navbar

│   ├── Navbar.tsx       # Barra de navegación superior## Componentes y funcionalidades

│   ├── Sidebar.tsx      # Menú lateral con navegación

│   ├── SistemaSolar3D.tsx        # Visualización 3D del sistema solar1. **Sidebar.tsx**: Menú lateral con acordeón, permite agrupar ejercicios y ejemplos.

│   ├── FichaPlaneta.tsx          # Información detallada de planetas2. **UnitConverter.tsx**: Conversor de unidades (Celsius ↔ Fahrenheit) con input controlado.

│   ├── GeometriaFiguras3D.tsx    # Visualización 3D de figuras geométricas3. **PasswordValidator.tsx**: Validador de contraseñas dinámico, muestra requisitos cumplidos.

│   ├── FiguraCard.tsx            # Tarjetas de selección de figuras4. **ClickCounter.tsx**: Contador de clics persistente usando `localStorage`.

│   ├── ControlPanel.tsx          # Panel de controles para geometría5. **TodoList.tsx**: Lista de tareas con agregar y eliminar elementos.

│   ├── InfoPanel.tsx             # Panel informativo de figuras6. **TablasMul.tsx**: Tabla de multiplicar interactiva.

│   ├── HelpPanel.tsx             # Panel de ayuda

│   └── solar-system/             # Componentes específicos del sistema solar---

│       ├── Planet3D.tsx          # Componente de planeta individual

│       ├── Sun3D.tsx             # Componente del sol## Pruebas unitarias

│       ├── LightingSetup.tsx     # Configuración de iluminación

│       ├── SolarSystemControls.tsx  # Controles del sistema solarLas pruebas unitarias están desarrolladas con **Jest** y **React Testing Library**.

│       └── PlanetCardFullscreen.tsx # Tarjeta de planeta en fullscreen

├── views/               # Vistas principales de las rutas* Validan la correcta interacción de los componentes.

│   ├── HomeView.tsx     # Página de inicio con selección de módulos* Comprobar que `localStorage` persista valores en `ClickCounter`.

│   ├── GeometriaView.tsx # Vista del módulo de geometría* Verificar la lógica de validación en `PasswordValidator`.

│   └── SistemaSolarView.tsx # Vista del módulo del sistema solar* Confirmar el funcionamiento de agregar y eliminar tareas en `TodoList`.

├── routes/* Aseguran que los componentes principales rendericen correctamente.

│   └── AppRoutes.tsx    # Configuración de rutas de React Router

├── hooks/               # Custom hooksEjecutar todas las pruebas:

│   ├── useVoz.ts        # Hook para síntesis de voz

│   └── solar-system/```bash

│       ├── useCameraControls.ts    # Control de cámaranpm test

│       ├── usePlanetAnimation.ts   # Animación de planetas```

│       ├── usePlanetInteraction.ts # Interacción con planetas

│       └── useResizeHandler.ts     # Manejo de redimensionamiento---

├── data/                # Datos JSON

│   ├── planetas.json    # Información de los planetas## Consideraciones

│   ├── figuras-geometricas.json # Datos de figuras geométricas

│   └── textos-interfaz.json # Textos de la interfaz* Se recomienda **investigar, analizar e interpretar cada ejercicio** antes de ejecutar pruebas unitarias.

├── types/               # Definiciones de tipos TypeScript* Las pruebas serán evaluadas de manera **individual en clase**, considerando la explicación del proceso y la solución aplicada.

│   ├── planetas.d.ts

│   └── figuras.d.ts---

├── utils/               # Utilidades

│   └── solar-system/## Dependencias principales

│       ├── cameraHelpers.ts    # Helpers para la cámara

│       ├── planetConfig.ts     # Configuración de planetas* `react`, `react-dom`, `react-router-dom`

│       └── threeHelpers.ts     # Helpers de Three.js* `three`

├── App.tsx              # Componente raíz* `tailwindcss`

├── main.tsx             # Punto de entrada* `framer-motion`

└── index.css            # Estilos globales con Tailwind* `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`

```

---

---

## Autor

## Tecnologías utilizadas

**Gustavo Sánchez Rodríguez**

### FrontendAsignatura: Ingeniería Web

* **React 19** - Biblioteca de UIClase UCC

* **TypeScript** - Tipado estático

* **Vite** - Build tool y dev server ultrarrápido
* **React Router DOM** - Enrutamiento SPA

### Visualización 3D
* **Three.js** - Motor de renderizado 3D

### Estilos y Animaciones
* **Tailwind CSS 4** - Framework CSS utility-first
* **Framer Motion** - Biblioteca de animaciones
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
* ✅ Accesibilidad básica

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar tests en modo watch:

```bash
npm test -- --watch
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

## Despliegue

Para generar el build de producción:

```bash
npm run build
```

Los archivos optimizados se generan en la carpeta `dist/` y están listos para ser desplegados en servicios como:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

---

## Dependencias principales

* `react`, `react-dom` - UI library
* `react-router-dom` - Routing
* `three` - Motor 3D
* `framer-motion` - Animaciones
* `react-icons` - Iconos
* `tailwindcss` - Estilos
* `jest`, `@testing-library/react` - Testing

---

## Autores

**Proyecto Final - Calidad de Software**
Universidad Cooperativa de Colombia
Repositorio: [Proyecto-Fina-Calidad-Software](https://github.com/Goloso0006/Proyecto-Fina-Calidad-Software)

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

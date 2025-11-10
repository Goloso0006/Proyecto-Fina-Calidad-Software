import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface GeometriaFiguras3DProps {
  figuraId: string;
  velocidadRotacion: number;
  isPaused: boolean;
  mostrarCaras: boolean;
  mostrarAristas: boolean;
  mostrarVertices: boolean;
  isDescompuesta: boolean;
  color: string;
}

export default function GeometriaFiguras3D({
  figuraId,
  velocidadRotacion,
  isPaused,
  mostrarCaras,
  mostrarAristas,
  mostrarVertices,
  isDescompuesta,
  color,
}: GeometriaFiguras3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const figuraRef = useRef<THREE.Group | null>(null);
  const carasRef = useRef<THREE.Mesh[]>([]);
  const aristasRef = useRef<THREE.LineSegments | null>(null);
  const verticesRef = useRef<THREE.Points | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  // Crear geometría según el tipo de figura
  const crearGeometria = (id: string): THREE.BufferGeometry => {
    switch (id) {
      case "cubo":
        return new THREE.BoxGeometry(2, 2, 2);
      case "tetraedro":
        return new THREE.TetrahedronGeometry(1.5);
      case "octaedro":
        return new THREE.OctahedronGeometry(1.5);
      case "dodecaedro":
        return new THREE.DodecahedronGeometry(1.5);
      case "icosaedro":
        return new THREE.IcosahedronGeometry(1.5);
      default:
        return new THREE.BoxGeometry(2, 2, 2);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Grid de referencia
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xe0e0e0);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Crear figura
    const figuraGroup = new THREE.Group();
    figuraRef.current = figuraGroup;
    scene.add(figuraGroup);

    const geometry = crearGeometria(figuraId);

    // Mesh principal con caras
    const material = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    figuraGroup.add(mesh);

    // Aristas (wireframe)
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    edges.visible = false;
    aristasRef.current = edges;
    figuraGroup.add(edges);

    // Vértices
    const verticesGeometry = new THREE.BufferGeometry();
    const positions = geometry.attributes.position.array;
    const uniqueVertices = new Set<string>();
    const vertexPositions: number[] = [];

    for (let i = 0; i < positions.length; i += 3) {
      const key = `${positions[i].toFixed(2)},${positions[i + 1].toFixed(2)},${positions[i + 2].toFixed(2)}`;
      if (!uniqueVertices.has(key)) {
        uniqueVertices.add(key);
        vertexPositions.push(positions[i], positions[i + 1], positions[i + 2]);
      }
    }

    verticesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertexPositions, 3)
    );

    const verticesMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.2,
      sizeAttenuation: true,
    });
    const verticesPoints = new THREE.Points(verticesGeometry, verticesMaterial);
    verticesPoints.visible = false;
    verticesRef.current = verticesPoints;
    figuraGroup.add(verticesPoints);

    // Crear caras individuales para descomposición
    const caras: THREE.Mesh[] = [];
    if (geometry.index) {
      const indices = geometry.index.array;
      const posAttr = geometry.attributes.position;

      for (let i = 0; i < indices.length; i += 3) {
        const idx1 = indices[i];
        const idx2 = indices[i + 1];
        const idx3 = indices[i + 2];

        const v1 = new THREE.Vector3(
          posAttr.getX(idx1),
          posAttr.getY(idx1),
          posAttr.getZ(idx1)
        );
        const v2 = new THREE.Vector3(
          posAttr.getX(idx2),
          posAttr.getY(idx2),
          posAttr.getZ(idx2)
        );
        const v3 = new THREE.Vector3(
          posAttr.getX(idx3),
          posAttr.getY(idx3),
          posAttr.getZ(idx3)
        );

        const faceGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          v1.x,
          v1.y,
          v1.z,
          v2.x,
          v2.y,
          v2.z,
          v3.x,
          v3.y,
          v3.z,
        ]);
        faceGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(vertices, 3)
        );

        const faceMaterial = new THREE.MeshStandardMaterial({
          color: color,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        });

        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
        faceMesh.visible = false;
        caras.push(faceMesh);
        scene.add(faceMesh);
      }
    }
    carasRef.current = caras;

    // Controles de mouse
    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      setCursor("grabbing");
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setCursor("grab");
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !figuraRef.current) return;

      const deltaX = event.clientX - previousMousePositionRef.current.x;
      const deltaY = event.clientY - previousMousePositionRef.current.y;

      figuraRef.current.rotation.y += deltaX * 0.01;
      figuraRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(15, camera.position.z + delta));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("wheel", onWheel);

    // Animación
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isPaused && figuraRef.current && !isDescompuesta) {
        figuraRef.current.rotation.y += velocidadRotacion * 0.01;
        figuraRef.current.rotation.x += velocidadRotacion * 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Manejar resize
    const onResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [figuraId, color]);

  // Efecto para mostrar/ocultar aristas
  useEffect(() => {
    if (aristasRef.current) {
      aristasRef.current.visible = mostrarAristas;
    }
  }, [mostrarAristas]);

  // Efecto para mostrar/ocultar vértices
  useEffect(() => {
    if (verticesRef.current) {
      verticesRef.current.visible = mostrarVertices;
    }
  }, [mostrarVertices]);

  // Efecto para descomposición
  useEffect(() => {
    if (!figuraRef.current) return;

    const mainMesh = figuraRef.current.children[0] as THREE.Mesh;
    const caras = carasRef.current;

    if (isDescompuesta) {
      // Ocultar figura principal
      mainMesh.visible = false;
      if (aristasRef.current) aristasRef.current.visible = false;

      // Mostrar y animar caras individuales
      caras.forEach((cara, index) => {
        cara.visible = true;

        // Calcular normal de la cara para moverla hacia afuera
        const geometry = cara.geometry;
        const positions = geometry.attributes.position.array;

        const v1 = new THREE.Vector3(positions[0], positions[1], positions[2]);
        const v2 = new THREE.Vector3(positions[3], positions[4], positions[5]);
        const v3 = new THREE.Vector3(positions[6], positions[7], positions[8]);

        // Calcular centro de la cara
        const center = new THREE.Vector3()
          .add(v1)
          .add(v2)
          .add(v3)
          .divideScalar(3);

        // Normalizar para obtener dirección
        const direction = center.clone().normalize();

        // Mover la cara hacia afuera
        const distance = 1.5;
        cara.position.set(
          direction.x * distance,
          direction.y * distance,
          direction.z * distance
        );

        // Agregar rotación ligera a cada cara
        cara.rotation.x = index * 0.1;
        cara.rotation.y = index * 0.15;
      });
    } else {
      // Mostrar figura principal
      mainMesh.visible = mostrarCaras;

      // Ocultar caras individuales y resetear posiciones
      caras.forEach((cara) => {
        cara.visible = false;
        cara.position.set(0, 0, 0);
        cara.rotation.set(0, 0, 0);
      });
    }
  }, [isDescompuesta, mostrarCaras]);

  // Efecto para actualizar velocidad de rotación
  useEffect(() => {
    // La velocidad se aplica en el loop de animación
  }, [velocidadRotacion, isPaused]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
      style={{ minHeight: "50vh", cursor }}
    />
  );
}

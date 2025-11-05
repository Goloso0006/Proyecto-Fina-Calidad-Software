import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

// Views
// Implementación de los requerimientos del módulo
import SistemaSolarView from "../views/SistemaSolarView";
import GeometriaView from "../views/GeometriaView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Implementación de los requerimientos del módulo */}
        <Route path="sistema-solar" element={<SistemaSolarView />} />
        <Route path="geometria" element={<GeometriaView />} />
        <Route index element={<GeometriaView />} />  {/* Ruta predeterminada si no hay ninguna específica */}
      </Route>
    </Routes>
  );
}

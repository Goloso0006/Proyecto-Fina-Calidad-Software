import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

// Views
// Implementación de los requerimientos del módulo
import SistemaSolarView from "../views/SistemaSolarView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Implementación de los requerimientos del módulo */}
        <Route path="sistema-solar" element={<SistemaSolarView />} />
      </Route>
    </Routes>
  );
}
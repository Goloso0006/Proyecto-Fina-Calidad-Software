import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

// Views
import HomeView from "../views/HomeView";
import SistemaSolarView from "../views/SistemaSolarView";
import GeometriaView from "../views/GeometriaView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Vista de bienvenida */}
        <Route index element={<HomeView />} />
        {/* Módulos */}
        <Route path="sistema-solar" element={<SistemaSolarView />} />
        <Route path="geometria" element={<GeometriaView />} />
      </Route>
    </Routes>
  );
}
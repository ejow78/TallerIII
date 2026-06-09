import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Vistas Públicas
import LandingPage from "@/views/public/LandingPage";
import TrackingPage from "@/views/public/TrackingPage";
import LoginPage from "@/views/admin/LoginPage";
import PrivacyPage from "@/views/public/PrivacyPage";
import TermsPage from "@/views/public/TermsPage";

// Vistas Privadas (Dashboard)
import DashboardPage from "@/views/admin/DashboardPage";
import OrdersPage from "@/views/admin/OrdersPage";
import InventoryPage from "@/views/admin/InventoryPage";
import ProfilePage from "@/views/admin/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Entorno Público (seguimiento.repairit.cloud) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="seguimiento/:id" element={<TrackingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="privacidad" element={<PrivacyPage />} />
          <Route path="terminos" element={<TermsPage />} />
        </Route>

        {/* Entorno Administrativo (dashboard.repairit.cloud) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="ordenes" element={<OrdersPage />} />
          <Route path="inventario" element={<InventoryPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>

      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

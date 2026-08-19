import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/services/supabaseClient";

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
import NewOrderPage from "@/views/admin/NewOrderPage";
import OrdersPage from "@/views/admin/OrdersPage";
import ClientsPage from "@/views/admin/ClientsPage";
import InventoryPage from "@/views/admin/InventoryPage";
import ProfilePage from "@/views/admin/ProfilePage";
import SuperAdminUsersPage from "@/views/admin/SuperAdminUsersPage";
import VenueAccountsPage from "@/views/admin/VenueAccountsPage";
import POSPage from "@/views/admin/POSPage";

export default function App() {
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        localStorage.setItem("repairit_token", session.access_token);
        
        const localUser = JSON.parse(localStorage.getItem("repairit_user") || "{}");
        if (
          !localUser._id ||
          !localUser.venueId ||
          localUser.venueId === "undefined" ||
          localUser._id !== session.user.id ||
          localUser.token !== session.access_token
        ) {
          try {
            const { data: profile, error: profileErr } = await supabase
              .from("profiles")
              .select("id, name, role, organization_id, venue_id")
              .eq("id", session.user.id)
              .single();

            if (profileErr) throw profileErr;

            let subPlan = "Sin Plan";
            let subStatus = "inactivo";

            if (profile.organization_id) {
              try {
                const { data: org } = await supabase
                  .from("organizations")
                  .select("subscription_plan, subscription_status")
                  .eq("id", profile.organization_id)
                  .single();
                if (org) {
                  subPlan = org.subscription_plan;
                  subStatus = org.subscription_status;
                }
              } catch (orgErr) {
                console.error("Error al sincronizar organización:", orgErr);
              }
            }

            if (profile) {
              const userData = {
                _id: profile.id,
                name: profile.name,
                email: session.user.email,
                role: profile.role,
                organizationId: profile.organization_id,
                venueId: profile.venue_id,
                subscriptionPlan: subPlan,
                subscriptionStatus: subStatus,
                token: session.access_token,
              };
              localStorage.setItem("repairit_user", JSON.stringify(userData));
              
              if (event === "SIGNED_IN") {
                window.location.href = "/dashboard";
              }
            }
          } catch (err) {
            console.error("Error al sincronizar perfil en onAuthStateChange:", err);
          }
        }
      } else {
        localStorage.removeItem("repairit_token");
        localStorage.removeItem("repairit_user");
      }
      setSessionLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (sessionLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-light">Cargando sesión segura...</p>
        </div>
      </div>
    );
  }

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
          <Route path="nuevo-ingreso" element={<NewOrderPage />} />
          <Route path="ordenes" element={<OrdersPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="inventario" element={<InventoryPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="usuarios" element={<SuperAdminUsersPage />} />
          <Route path="cuentas" element={<VenueAccountsPage />} />
          <Route path="caja" element={<POSPage />} />
        </Route>

      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

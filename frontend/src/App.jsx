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
import RegisterPage from "@/views/admin/RegisterPage";
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
    // Detección inteligente de subdominio en producción
    const checkSubdomain = () => {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;

      if (hostname.includes("repairit.cloud")) {
        const token = sessionStorage.getItem("repairit_token") || localStorage.getItem("repairit_token");

        // app.repairit.cloud es ESTRICTO y EXCLUSIVO para /dashboard, /login y /registro
        if (hostname === "app.repairit.cloud") {
          const hash = window.location.hash;
          const isAuthHash = hash.includes("access_token") || hash.includes("refresh_token") || hash.includes("error") || hash.includes("type=");

          if ((hash && !isAuthHash) || (pathname !== "/login" && pathname !== "/registro" && !pathname.startsWith("/dashboard"))) {
            const targetPath = pathname === "/login" || pathname === "/registro" ? "" : pathname;
            window.location.href = `https://repairit.cloud${targetPath}${hash}`;
            return;
          }
        }

        if (hostname !== "app.repairit.cloud" && (pathname === "/login" || pathname === "/registro")) {
          window.location.href = `https://app.repairit.cloud${pathname}`;
          return;
        }
        if (hostname !== "app.repairit.cloud" && pathname.startsWith("/dashboard")) {
          if (!token) {
            window.location.href = "https://app.repairit.cloud/login";
            return;
          }
          window.location.href = `https://app.repairit.cloud${pathname}`;
          return;
        }
        if (hostname === "tracking.repairit.cloud" && pathname === "/") {
          window.location.href = "/seguimiento/demo-id";
          return;
        }
      }
    };

    checkSubdomain();
    window.addEventListener("hashchange", checkSubdomain);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        sessionStorage.setItem("repairit_token", session.access_token);
        localStorage.setItem("repairit_token", session.access_token);
        
        const localUser = JSON.parse(sessionStorage.getItem("repairit_user") || localStorage.getItem("repairit_user") || "{}");
        if (
          !localUser._id ||
          !localUser.venueId ||
          localUser.venueId === "undefined" ||
          localUser._id !== session.user.id ||
          localUser.token !== session.access_token
        ) {
          try {
            let { data: profile } = await supabase
              .from("profiles")
              .select("id, name, role, organization_id, venue_id")
              .eq("id", session.user.id)
              .maybeSingle();

            if (!profile) {
              // Auto-creación de perfil si no existe en la base de datos
              try {
                const workshopTitle = session.user.user_metadata?.workshop_name || "Taller RepairIT";
                const personName = session.user.user_metadata?.name || session.user.email.split("@")[0];
                const phoneContact = session.user.user_metadata?.phone || "+54 381 4223344";

                const { data: newOrg } = await supabase
                  .from("organizations")
                  .insert({ name: workshopTitle, subscription_plan: "Multi-Taller Pro", subscription_status: "activo" })
                  .select()
                  .single();

                const { data: newVenue } = await supabase
                  .from("venues")
                  .insert({
                    organization_id: newOrg?.id,
                    name: "Sucursal Central",
                    email: session.user.email,
                    phone: phoneContact,
                    address: "Casa Central",
                  })
                  .select()
                  .single();

                const { data: newProf } = await supabase
                  .from("profiles")
                  .insert({
                    id: session.user.id,
                    organization_id: newOrg?.id,
                    venue_id: newVenue?.id,
                    name: personName,
                    role: "admin",
                  })
                  .select()
                  .single();

                profile = newProf;
              } catch (createErr) {
                console.error("Error al autogenerar perfil:", createErr);
                profile = {
                  id: session.user.id,
                  name: session.user.user_metadata?.name || session.user.email.split("@")[0],
                  role: "admin",
                  organization_id: null,
                  venue_id: null
                };
              }
            }

            let subPlan = "Multi-Taller Pro";
            let subStatus = "activo";

            if (profile?.organization_id) {
              try {
                const { data: org } = await supabase
                  .from("organizations")
                  .select("subscription_plan, subscription_status")
                  .eq("id", profile.organization_id)
                  .maybeSingle();
                if (org) {
                  subPlan = org.subscription_plan || "Multi-Taller Pro";
                  subStatus = org.subscription_status || "activo";
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
                subscriptionPlan: subPlan,
                subscriptionStatus: subStatus,
                organizationId: profile.organization_id,
                venueId: profile.venue_id,
                token: session.access_token,
              };
              sessionStorage.setItem("repairit_user", JSON.stringify(userData));
              localStorage.setItem("repairit_user", JSON.stringify(userData));
              
              if (event === "SIGNED_IN") {
                if (window.location.hostname.includes("repairit.cloud")) {
                  if (window.location.hostname !== "app.repairit.cloud") {
                    window.location.href = "https://app.repairit.cloud/dashboard";
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error al sincronizar perfil en onAuthStateChange:", err);
          }
        }
      } else {
        sessionStorage.removeItem("repairit_token");
        sessionStorage.removeItem("repairit_user");
        localStorage.clear();
      }
      setSessionLoading(false);
    });

    return () => {
      window.removeEventListener("hashchange", checkSubdomain);
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
          <Route path="registro" element={<RegisterPage />} />
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

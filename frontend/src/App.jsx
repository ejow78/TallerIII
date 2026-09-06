import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));

// Vistas Públicas
import LandingPage from "@/views/public/LandingPage";
const TrackingPage = lazy(() => import("@/views/public/TrackingPage"));
const TrackingPortalPage = lazy(() => import("@/views/public/TrackingPortalPage"));
const LoginPage = lazy(() => import("@/views/admin/LoginPage"));
const RegisterPage = lazy(() => import("@/views/admin/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/views/admin/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/views/admin/ResetPasswordPage"));
const PrivacyPage = lazy(() => import("@/views/public/PrivacyPage"));
const TermsPage = lazy(() => import("@/views/public/TermsPage"));

// Vistas Privadas (Dashboard)
const DashboardPage = lazy(() => import("@/views/admin/DashboardPage"));
const NewOrderPage = lazy(() => import("@/views/admin/NewOrderPage"));
const OrdersPage = lazy(() => import("@/views/admin/OrdersPage"));
const ClientsPage = lazy(() => import("@/views/admin/ClientsPage"));
const InventoryPage = lazy(() => import("@/views/admin/InventoryPage"));
const ProfilePage = lazy(() => import("@/views/admin/ProfilePage"));
const SuperAdminUsersPage = lazy(() => import("@/views/admin/SuperAdminUsersPage"));
const VenueAccountsPage = lazy(() => import("@/views/admin/VenueAccountsPage"));
const POSPage = lazy(() => import("@/views/admin/POSPage"));

const RouteFallback = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // Detección inteligente de subdominio en producción
    const checkSubdomain = () => {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;

      if (hostname.includes("repairit.cloud")) {
        const token = sessionStorage.getItem("repairit_token") || localStorage.getItem("repairit_token");

        // app.repairit.cloud es ESTRICTO y EXCLUSIVO para /dashboard, /login, /register, /registro, /recuperar-password y /reset-password
        if (hostname === "app.repairit.cloud") {
          // Si entra directo a la raíz de app.repairit.cloud, derivar según sesión
          if (pathname === "/") {
            if (token) {
              window.location.href = "https://app.repairit.cloud/dashboard";
            } else {
              window.location.href = "https://app.repairit.cloud/login";
            }
            return;
          }

          if (pathname === "/registro") {
            window.location.href = "https://app.repairit.cloud/register";
            return;
          }

          const hash = window.location.hash;
          const isAuthHash = hash.includes("access_token") || hash.includes("refresh_token") || hash.includes("error") || hash.includes("type=");
          const isAllowedAuthPath = pathname === "/login" || pathname === "/register" || pathname === "/registro" || pathname === "/recuperar-password" || pathname === "/olvide-password" || pathname === "/reset-password";

          if ((hash && !isAuthHash) || (!isAllowedAuthPath && !pathname.startsWith("/dashboard"))) {
            const targetPath = isAllowedAuthPath ? "" : pathname;
            window.location.href = `https://repairit.cloud${targetPath}${hash}`;
            return;
          }
        }

        if (hostname !== "app.repairit.cloud" && (pathname === "/login" || pathname === "/register" || pathname === "/registro")) {
          const target = pathname === "/registro" ? "/register" : pathname;
          window.location.href = `https://app.repairit.cloud${target}`;
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
        if (hostname !== "tracking.repairit.cloud" && (pathname === "/consulta" || pathname === "/tracking" || pathname === "/seguimiento")) {
          window.location.href = "https://tracking.repairit.cloud/consulta";
          return;
        }
        if (hostname !== "tracking.repairit.cloud" && pathname.startsWith("/seguimiento/")) {
          window.location.href = `https://tracking.repairit.cloud${pathname}`;
          return;
        }
        if (hostname === "tracking.repairit.cloud" && pathname === "/") {
          window.location.href = "/consulta";
          return;
        }
      }
    };

    checkSubdomain();
    window.addEventListener("hashchange", checkSubdomain);

    let unsubscribeAuth = null;

    const hasToken = typeof window !== "undefined" && !!(sessionStorage.getItem("repairit_token") || localStorage.getItem("repairit_token"));
    const isAuthOrDashboard = typeof window !== "undefined" && (
      window.location.pathname.startsWith("/dashboard") ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/registro" ||
      window.location.pathname.startsWith("/reset-password") ||
      window.location.hostname.startsWith("app.") ||
      (window.location.hash && (window.location.hash.includes("access_token") || window.location.hash.includes("type=")))
    );

    if (hasToken || isAuthOrDashboard) {
      import("@/services/supabaseClient").then(({ supabase }) => {
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
        unsubscribeAuth = () => subscription.unsubscribe();
      }).catch(err => {
        console.error("Error al cargar autenticación:", err);
        setSessionLoading(false);
      });
    } else {
      setSessionLoading(false);
    }

    return () => {
      window.removeEventListener("hashchange", checkSubdomain);
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const isDashboardRoute = typeof window !== "undefined" && (window.location.pathname.startsWith("/dashboard") || window.location.hostname.startsWith("app."));
  if (sessionLoading && isDashboardRoute) {
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
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          
          {/* Entorno Público (seguimiento.repairit.cloud) */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="consulta" element={<TrackingPortalPage />} />
            <Route path="tracking" element={<Navigate to="/consulta" replace />} />
            <Route path="seguimiento" element={<Navigate to="/consulta" replace />} />
            <Route path="seguimiento/:id" element={<TrackingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="registro" element={<Navigate to="/register" replace />} />
            <Route path="recuperar-password" element={<ForgotPasswordPage />} />
            <Route path="olvide-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
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
      </Suspense>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

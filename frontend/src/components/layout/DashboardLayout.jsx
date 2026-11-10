import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import OnboardingModal from "@/components/common/OnboardingModal";
import { useDashboardLayout, prefetchRoute } from "./dashboard/useDashboardLayout";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";

function MobileSidebarAutoClose({ pathname }) {
  const { setOpenMobile } = useSidebar();
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);
  return null;
}

export default function DashboardLayout() {
  const {
    location,
    currentPath,
    venues,
    activeVenue,
    sidebarStats,
    token,
    user,
    isSuperAdmin,
    effectivePlan,
    handleHeaderSwitchVenue,
    handleLogout,
  } = useDashboardLayout();

  // Guard de sesión
  if (!token) {
    if (window.location.hostname.includes("repairit.cloud")) {
      return null;
    }
    return <Navigate to="/login" replace />;
  }

  // Guard de Roles por Ruta (RBAC)
  if (
    user.role === "tecnico" &&
    (currentPath === "/dashboard/perfil" ||
      currentPath === "/dashboard/cuentas" ||
      currentPath === "/dashboard/usuarios" ||
      currentPath === "/dashboard/consultas")
  ) {
    return <Navigate to="/dashboard" replace />;
  }
  if (
    !isSuperAdmin &&
    (currentPath === "/dashboard/usuarios" ||
      currentPath === "/dashboard/consultas")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SidebarProvider className="h-dvh max-h-dvh overflow-hidden">
      <MobileSidebarAutoClose pathname={location.pathname} />
      <div className="flex h-dvh max-h-dvh w-full max-w-[100vw] overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
        <DashboardSidebar
          isSuperAdmin={isSuperAdmin}
          user={user}
          activeVenue={activeVenue}
          effectivePlan={effectivePlan}
          sidebarStats={sidebarStats}
          currentPath={currentPath}
          onLogout={handleLogout}
          prefetchRoute={prefetchRoute}
        />

        <SidebarInset className="flex-1 flex flex-col min-w-0 h-dvh max-h-dvh overflow-hidden bg-background">
          <DashboardHeader
            isSuperAdmin={isSuperAdmin}
            user={user}
            activeVenue={activeVenue}
            venues={venues}
            effectivePlan={effectivePlan}
            currentPath={currentPath}
            onSwitchVenue={handleHeaderSwitchVenue}
          />

          <main className="flex-1 min-h-0 p-3.5 sm:p-6 md:p-8 pb-8 sm:pb-10 overflow-y-auto overflow-x-hidden max-w-7xl w-full mx-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Outlet />
          </main>

          <OnboardingModal />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

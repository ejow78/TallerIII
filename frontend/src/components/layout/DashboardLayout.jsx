import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  Wrench,
  Store,
  Settings
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    toast.success("Sesión cerrada correctamente.");
    navigate("/");
  };

  // Determinar los Breadcrumbs basados en la ruta actual
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/dashboard/ordenes") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Órdenes de Servicio</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
    if (path === "/dashboard/inventario") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventario de Insumos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
    if (path === "/dashboard/perfil") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Perfil de Taller</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Inicio</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">

        {/* Sidebar Oficial de shadcn/ui */}
        <Sidebar className="border-r border-border/80 bg-card">

          <SidebarHeader className="p-6 border-b border-border/30">
            {/* Logo de la Empresa */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="font-outfit text-lg font-black tracking-tight text-foreground">
                  Repair<span className="text-primary">IT</span>
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4 pt-6">
            <SidebarMenu className="space-y-1">

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                  <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Inicio</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/ordenes"}>
                  <NavLink to="/dashboard/ordenes" className="flex items-center gap-3 w-full">
                    <ClipboardList className="w-4 h-4" />
                    <span>Órdenes de Servicio</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/inventario"}>
                  <NavLink to="/dashboard/inventario" className="flex items-center gap-3 w-full">
                    <Package className="w-4 h-4" />
                    <span>Inventario de Insumos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>



            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border/85 space-y-4 bg-card/65">
            <div className="flex items-center justify-between px-2 w-full gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary uppercase shrink-0">
                  EO
                </div>
                <div className="text-xs truncate min-w-0">
                  <span className="text-foreground font-bold block leading-none truncate">Edgar Ortiz</span>
                  <span className="text-muted-foreground block text-[10px] mt-1 truncate">Administrador</span>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                title="Configuración de Taller"
              >
                <NavLink to="/dashboard/perfil">
                  <Settings className="w-4 h-4" />
                </NavLink>
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full bg-background hover:bg-red-950/20 text-muted-foreground hover:text-red-400 border-border hover:border-red-950/50 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </Button>
          </SidebarFooter>

        </Sidebar>

        {/* Sidebar Inset para contener el área de trabajo y la barra de navegación superior */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-background">

          {/* Cabecera Superior con Trigger y Breadcrumbs */}
          <header className="h-16 border-b border-border/80 flex items-center justify-between px-6 bg-card/20 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-4 !self-center" />
              <Breadcrumb className="flex items-center">
                {getBreadcrumbs()}
              </Breadcrumb>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono select-none">
              Taller Central &bull; Activo
            </div>
          </header>

          {/* Contenido Dinámico de las Páginas del Dashboard */}
          <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}

import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Settings,
  PlusCircle,
  Users,
  ChevronDown,
  KeyRound,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { ShieldAlert } from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Guard síncrono: Impedir parpadeo visual (FOUC) si no hay token de sesión
  const token = localStorage.getItem("repairit_token");
  if (!token) {
    if (window.location.hostname.includes("repairit.cloud")) {
      window.location.href = "https://app.repairit.cloud/login";
    } else {
      return <Navigate to="/login" replace />;
    }
    return null;
  }

  const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
  const isSuperAdmin = user.role === "superadmin";

  const [venues, setVenues] = useState([]);
  const [activeVenue, setActiveVenue] = useState(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      const loadVenues = async () => {
        try {
          const profile = await api.auth.getProfile();
          setActiveVenue(profile);
          const data = await api.auth.getVenues();
          setVenues(data);
        } catch (err) {
          console.error("Error al cargar sucursales en header:", err.message);
        }
      };
      loadVenues();
    }
  }, [isSuperAdmin]);

  const handleHeaderSwitchVenue = async (venueId) => {
    try {
      const updatedUser = await api.auth.switchVenue(venueId);
      const localUser = JSON.parse(localStorage.getItem("repairit_user") || "{}");
      localStorage.setItem("repairit_user", JSON.stringify({ ...localUser, venueId: updatedUser.venueId }));
      toast.success("Sucursal cambiada correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error("Error al cambiar de sucursal", { description: err.message });
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      toast.success("Sesión cerrada correctamente.");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.clear();
      if (window.location.hostname.includes("repairit.cloud")) {
        window.location.href = "https://repairit.cloud";
      } else {
        window.location.href = "/";
      }
    }
  };

  // Determinar los Breadcrumbs basados en la ruta actual
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (isSuperAdmin) {
      if (path === "/dashboard/usuarios") {
        return (
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/dashboard">Panel</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Gestión de Usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        );
      }
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Suscripciones de Clientes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
    if (path === "/dashboard/nuevo-ingreso") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ingreso de Equipos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
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
    if (path === "/dashboard/clientes") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Directorio de Clientes</BreadcrumbPage>
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
                <span className="font-outfit text-xl font-black tracking-tight text-foreground">
                  Repair<span className="text-primary">IT</span>
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4 pt-6">
            <SidebarMenu className="space-y-1">
              {isSuperAdmin ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                      <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Suscripciones</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/usuarios"}>
                      <NavLink to="/dashboard/usuarios" className="flex items-center gap-3 w-full">
                        <Users className="w-4 h-4" />
                        <span>Usuarios</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                      <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Inicio</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/nuevo-ingreso"}>
                      <NavLink to="/dashboard/nuevo-ingreso" className="flex items-center gap-3 w-full">
                        <PlusCircle className="w-4 h-4" />
                        <span>Nuevo Ingreso</span>
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
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/clientes"}>
                      <NavLink to="/dashboard/clientes" className="flex items-center gap-3 w-full">
                        <Users className="w-4 h-4" />
                        <span>Clientes</span>
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

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/caja"}>
                      <NavLink to="/dashboard/caja" className="flex items-center gap-3 w-full">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Caja</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {user.role === "admin" && user.subscriptionPlan === "Multi-Taller Pro" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/cuentas"}>
                        <NavLink to="/dashboard/cuentas" className="flex items-center gap-3 w-full">
                          <KeyRound className="w-4 h-4" />
                          <span>Cuentas de Acceso</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border/85 space-y-4 bg-card/65">
            <div className="flex items-center justify-between px-2 w-full gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary uppercase shrink-0">
                  {isSuperAdmin
                    ? "SA"
                    : activeVenue && activeVenue.name
                    ? activeVenue.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                    : "TL"}
                </div>
                <div className="text-xs truncate min-w-0">
                  <span className="text-foreground font-bold block leading-none truncate">
                    {isSuperAdmin ? "Plataforma Central" : activeVenue ? activeVenue.name : "Cargando Taller..."}
                  </span>
                  <span className="text-muted-foreground block text-[10px] mt-1 truncate">
                    {isSuperAdmin ? "Super Admin" : `${user.name || "Usuario"} (${user.role === "admin" ? "Admin" : "Técnico"})`}
                  </span>
                </div>
              </div>
              {!isSuperAdmin && (
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
              )}
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
            <div className="flex items-center gap-3">
              {isSuperAdmin ? (
                <div className="text-[10px] text-muted-foreground font-mono select-none">
                  Plataforma RepairIT • SuperAdmin
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono select-none">Sucursal:</span>
                  {venues.length > 1 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 border border-border/80 px-2 text-[10px] font-bold rounded flex items-center gap-1 select-none cursor-pointer">
                          {activeVenue ? activeVenue.name : "Cargando..."}
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border text-foreground text-[10px]">
                        {venues.map((v) => (
                          <DropdownMenuItem
                            key={v._id}
                            onClick={() => handleHeaderSwitchVenue(v._id)}
                            className="text-[10px] transition-colors cursor-pointer flex items-center justify-between gap-4"
                          >
                            <span>{v.name}</span>
                            {v._id === activeVenue?._id && <span className="text-primary font-bold">✓</span>}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-[10px] text-foreground font-bold font-mono">
                      {activeVenue ? activeVenue.name : "Cargando..."}
                    </span>
                  )}
                </div>
              )}
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

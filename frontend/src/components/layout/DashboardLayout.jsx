import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarTrigger,
  SidebarInset,
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
  ShoppingCart,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";
import OnboardingModal from "@/components/common/OnboardingModal";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Guard síncrono: Impedir parpadeo visual (FOUC) si no hay token de sesión
  const token = sessionStorage.getItem("repairit_token") || localStorage.getItem("repairit_token");
  if (!token) {
    if (window.location.hostname.includes("repairit.cloud")) {
      window.location.href = "https://app.repairit.cloud/login";
    } else {
      return <Navigate to="/login" replace />;
    }
    return null;
  }

  // Actualización síncrona del título del documento
  const currentPath = location.pathname;
  if (currentPath === "/dashboard/nuevo-ingreso") document.title = "RepairIT - Registrar Ingreso";
  else if (currentPath === "/dashboard/ordenes") document.title = "RepairIT - Órdenes de Servicio";
  else if (currentPath === "/dashboard/clientes") document.title = "RepairIT - Directorio de Clientes";
  else if (currentPath === "/dashboard/inventario") document.title = "RepairIT - Inventario de Insumos";
  else if (currentPath === "/dashboard/caja") document.title = "RepairIT - Control de Caja";
  else if (currentPath === "/dashboard/usuarios") document.title = "RepairIT - Gestión de Usuarios";
  else if (currentPath === "/dashboard/cuentas") document.title = "RepairIT - Cuentas de Acceso";
  else if (currentPath === "/dashboard/perfil") document.title = "RepairIT - Configuración de Taller";
  else document.title = "RepairIT - Panel de Control";

  const user = JSON.parse(sessionStorage.getItem("repairit_user") || localStorage.getItem("repairit_user") || "{}");
  const isSuperAdmin = user.role === "superadmin";

  const [venues, setVenues] = useState([]);
  const [activeVenue, setActiveVenue] = useState(null);
  const [sidebarStats, setSidebarStats] = useState({ activeOrders: 0, lowStock: 0 });

  useEffect(() => {
    if (!isSuperAdmin) {
      const loadSidebarData = async () => {
        try {
          const [profile, venuesData, ordersData, inventoryData] = await Promise.all([
            api.auth.getProfile().catch(() => null),
            api.auth.getVenues().catch(() => []),
            api.orders.getAll().catch(() => []),
            api.inventory.getAll().catch(() => []),
          ]);

          if (profile) setActiveVenue(profile);
          if (venuesData) setVenues(venuesData);

          const activeOrders = (ordersData || []).filter(
            (o) => o.status !== "entregado" && o.status !== "rechazado"
          ).length;
          const lowStock = (inventoryData || []).filter(
            (item) => item.quantity <= (item.minQuantity || item.min_quantity || 0)
          ).length;

          setSidebarStats({ activeOrders, lowStock });
        } catch (err) {
          console.error("Error al cargar datos de navegación:", err.message);
        }
      };
      loadSidebarData();
    }
  }, [isSuperAdmin, location.pathname]);

  const handleHeaderSwitchVenue = async (venueId) => {
    try {
      const updatedUser = await api.auth.switchVenue(venueId);
      const localUser = JSON.parse(localStorage.getItem("repairit_user") || sessionStorage.getItem("repairit_user") || "{}");
      const nextUser = { ...localUser, venueId: updatedUser.venueId };
      localStorage.setItem("repairit_user", JSON.stringify(nextUser));
      sessionStorage.setItem("repairit_user", JSON.stringify(nextUser));
      toast.success("Sucursal cambiada correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 400);
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
      sessionStorage.clear();
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

    const routeLabels = {
      "/dashboard/nuevo-ingreso": "Ingreso de Equipos",
      "/dashboard/ordenes": "Órdenes de Servicio",
      "/dashboard/clientes": "Directorio de Clientes",
      "/dashboard/inventario": "Inventario de Insumos",
      "/dashboard/caja": "Control de Caja (POS)",
      "/dashboard/cuentas": "Cuentas de Acceso",
      "/dashboard/perfil": "Configuración de Taller",
    };

    if (routeLabels[path]) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{routeLabels[path]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Panel de Control</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  };

  const navItemClass =
    "h-9 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold data-[active=true]:border data-[active=true]:border-primary/25 transition-all";

  const trackingPortalUrl = window.location.hostname.includes("repairit.cloud")
    ? "https://tracking.repairit.cloud/consulta"
    : "/consulta";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
        {/* Sidebar Mejorada estilo Shadcn Block */}
        <Sidebar className="border-r border-border/70 bg-card/95 backdrop-blur-xl">
          {/* Header con Marca y Plan */}
          <SidebarHeader className="px-4 py-4 border-b border-border/50 space-y-3">
            <div className="flex items-center justify-between px-1">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shadow-sm">
                  <Wrench className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-outfit text-xl font-black tracking-tight text-foreground leading-none">
                    Repair<span className="text-primary">IT</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-wide mt-0.5">
                    {isSuperAdmin ? "Consola Central" : "Gestión de Taller"}
                  </span>
                </div>
              </NavLink>
              {!isSuperAdmin && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary border-primary/25"
                >
                  {user.subscriptionPlan?.includes("Pro") ? "PRO" : "ACTIVO"}
                </Badge>
              )}
            </div>

            {/* Acción Principal Rápida */}
            {!isSuperAdmin && (
              <Button
                asChild
                className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg shadow-md shadow-primary/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <NavLink to="/dashboard/nuevo-ingreso">
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Ingreso Técnico</span>
                </NavLink>
              </Button>
            )}
          </SidebarHeader>

          {/* Contenido de Navegación por Secciones */}
          <SidebarContent className="px-2 py-3 space-y-2 flex-1">
            {isSuperAdmin ? (
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
                  Administración Global
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === "/dashboard"}
                        className={navItemClass}
                      >
                        <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Suscripciones</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === "/dashboard/usuarios"}
                        className={navItemClass}
                      >
                        <NavLink to="/dashboard/usuarios" className="flex items-center gap-3 w-full">
                          <Users className="w-4 h-4" />
                          <span>Usuarios Globales</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : (
              <>
                {/* Grupo 1: Operaciones Diarias */}
                <SidebarGroup className="py-1">
                  <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
                    Operaciones de Taller
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === "/dashboard"}
                          className={navItemClass}
                        >
                          <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Panel de Control</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === "/dashboard/ordenes"}
                          className={navItemClass}
                        >
                          <NavLink to="/dashboard/ordenes" className="flex items-center gap-3 w-full">
                            <ClipboardList className="w-4 h-4" />
                            <span>Órdenes de Servicio</span>
                          </NavLink>
                        </SidebarMenuButton>
                        {sidebarStats.activeOrders > 0 && (
                          <SidebarMenuBadge className="bg-primary/15 text-primary border border-primary/25 rounded-md text-[10px] font-mono font-bold px-1.5">
                            {sidebarStats.activeOrders}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === "/dashboard/clientes"}
                          className={navItemClass}
                        >
                          <NavLink to="/dashboard/clientes" className="flex items-center gap-3 w-full">
                            <Users className="w-4 h-4" />
                            <span>Directorio de Clientes</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Grupo 2: Stock y Finanzas */}
                <SidebarGroup className="py-1">
                  <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
                    Stock y Finanzas
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === "/dashboard/inventario"}
                          className={navItemClass}
                        >
                          <NavLink to="/dashboard/inventario" className="flex items-center gap-3 w-full">
                            <Package className="w-4 h-4" />
                            <span>Inventario de Insumos</span>
                          </NavLink>
                        </SidebarMenuButton>
                        {sidebarStats.lowStock > 0 && (
                          <SidebarMenuBadge
                            title={`${sidebarStats.lowStock} ítems con bajo stock`}
                            className="bg-destructive/15 text-destructive border border-destructive/30 rounded-md text-[10px] font-mono font-bold px-1.5 flex items-center gap-0.5"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {sidebarStats.lowStock}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === "/dashboard/caja"}
                          className={navItemClass}
                        >
                          <NavLink to="/dashboard/caja" className="flex items-center gap-3 w-full">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Control de Caja (POS)</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Grupo 3: Configuración y Accesos */}
                <SidebarGroup className="py-1">
                  <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
                    Administración
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === "/dashboard/perfil"}
                          className={navItemClass}
                        >
                          <NavLink to="/dashboard/perfil" className="flex items-center gap-3 w-full">
                            <Settings className="w-4 h-4" />
                            <span>Configuración de Taller</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {user.role === "admin" && user.subscriptionPlan === "Multi-Taller Pro" && (
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === "/dashboard/cuentas"}
                            className={navItemClass}
                          >
                            <NavLink to="/dashboard/cuentas" className="flex items-center gap-3 w-full">
                              <KeyRound className="w-4 h-4" />
                              <span>Cuentas de Técnicos</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}

            {/* Tarjeta Inferior de Estado de Sucursal & Portal Público */}
            {!isSuperAdmin && (
              <div className="mt-auto px-2 pt-4 pb-1">
                <div className="rounded-xl border border-border/70 bg-background/60 p-3 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Store className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-[11px] font-bold text-foreground truncate">
                        {activeVenue ? activeVenue.name : "Sucursal Central"}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En línea
                    </span>
                  </div>

                  {activeVenue?.address && (
                    <p className="text-[10px] text-muted-foreground truncate leading-tight">
                      {activeVenue.address}
                    </p>
                  )}

                  {venues.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-[10px] font-semibold justify-between px-2.5 bg-card border-border/80 cursor-pointer"
                        >
                          <span className="truncate">Cambiar sucursal activa</span>
                          <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-52 bg-card border-border text-foreground">
                        {venues.map((v) => (
                          <DropdownMenuItem
                            key={v._id}
                            onClick={() => handleHeaderSwitchVenue(v._id)}
                            className="text-xs transition-colors cursor-pointer flex items-center justify-between gap-2"
                          >
                            <span className="truncate">{v.name}</span>
                            {v._id === activeVenue?._id && <span className="text-primary font-bold">✓</span>}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <a
                    href={trackingPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/15 border border-primary/20 text-[10px] font-semibold text-primary transition-colors"
                  >
                    <span>Portal Público de Clientes</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            )}
          </SidebarContent>

          {/* Pie de Sidebar con Perfil y Cerrar Sesión */}
          <SidebarFooter className="p-3 border-t border-border/70 space-y-2.5 bg-card/80">
            <div className="flex items-center justify-between px-1.5 w-full gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center font-bold text-xs text-primary uppercase shrink-0">
                  {isSuperAdmin
                    ? "SA"
                    : user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "TL"}
                </div>
                <div className="text-xs truncate min-w-0">
                  <span className="text-foreground font-bold block leading-none truncate">
                    {isSuperAdmin ? "Super Administrador" : user.name || "Operador"}
                  </span>
                  <span className="text-muted-foreground block text-[10px] mt-1 truncate">
                    {isSuperAdmin
                      ? "Plataforma Central"
                      : `${user.role === "admin" ? "Administrador" : "Técnico"} • ${
                          activeVenue ? activeVenue.name : "Taller"
                        }`}
                  </span>
                </div>
              </div>
              {!isSuperAdmin && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer shrink-0 rounded-lg"
                  title="Configuración de Taller"
                >
                  <NavLink to="/dashboard/perfil">
                    <Settings className="w-3.5 h-3.5" />
                  </NavLink>
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full h-8 bg-background/80 hover:bg-destructive/15 text-muted-foreground hover:text-destructive border-border/80 hover:border-destructive/30 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Área Principal */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Cabecera Superior */}
          <header className="h-14 border-b border-border/70 flex items-center justify-between px-4 sm:px-6 bg-card/20 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground cursor-pointer" />
              <Separator orientation="vertical" className="h-4 !self-center" />
              <Breadcrumb className="flex items-center">{getBreadcrumbs()}</Breadcrumb>
            </div>
            <div className="flex items-center gap-3">
              {isSuperAdmin ? (
                <div className="text-[10px] text-muted-foreground font-mono select-none">
                  Plataforma RepairIT • SuperAdmin
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[11px] text-muted-foreground select-none">
                    Sucursal:
                  </span>
                  {venues.length > 1 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 border border-border/80 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 select-none cursor-pointer"
                        >
                          <Store className="w-3 h-3 text-primary" />
                          <span className="max-w-[140px] truncate">
                            {activeVenue ? activeVenue.name : "Cargando..."}
                          </span>
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border text-foreground text-xs">
                        {venues.map((v) => (
                          <DropdownMenuItem
                            key={v._id}
                            onClick={() => handleHeaderSwitchVenue(v._id)}
                            className="text-xs transition-colors cursor-pointer flex items-center justify-between gap-4"
                          >
                            <span>{v.name}</span>
                            {v._id === activeVenue?._id && <span className="text-primary font-bold">✓</span>}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-card border border-border/70 text-foreground flex items-center gap-1.5"
                    >
                      <Store className="w-3 h-3 text-primary" />
                      <span className="max-w-[150px] truncate">
                        {activeVenue ? activeVenue.name : "Sucursal Central"}
                      </span>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Contenido Dinámico de las Páginas del Dashboard */}
          <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Modal de Bienvenida para Talleres Nuevos */}
          <OnboardingModal />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

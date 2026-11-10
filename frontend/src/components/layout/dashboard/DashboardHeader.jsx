import { NavLink } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Store } from "lucide-react";
import { hasMultiTallerAccess } from "@/utils/venueHelper";

function getBreadcrumbs(isSuperAdmin, currentPath) {
  if (isSuperAdmin) {
    if (currentPath === "/dashboard/usuarios") {
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
    if (currentPath === "/dashboard/consultas") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Panel</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Consultas Web</BreadcrumbPage>
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
    "/dashboard/inventario": "Inventario",
    "/dashboard/caja": "Control de Caja (POS)",
    "/dashboard/cuentas": "Cuentas de Acceso",
    "/dashboard/perfil": "Configuración de Taller",
  };

  if (routeLabels[currentPath]) {
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink to="/dashboard">Panel</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{routeLabels[currentPath]}</BreadcrumbPage>
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
}

export function DashboardHeader({
  isSuperAdmin,
  user,
  activeVenue,
  venues,
  effectivePlan,
  currentPath,
  onSwitchVenue,
}) {
  return (
    <header className="sticky top-0 z-50 h-14 sm:h-16 border-b border-border/80 flex items-center justify-between px-3 sm:px-6 bg-background/95 backdrop-blur-md shrink-0 gap-2">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0" />
        <Separator
          orientation="vertical"
          className="h-4 !self-center shrink-0"
        />
        <Breadcrumb className="flex items-center min-w-0 truncate">
          {getBreadcrumbs(isSuperAdmin, currentPath)}
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isSuperAdmin ? (
          <div className="text-[10px] text-muted-foreground font-mono select-none">
            <span className="hidden sm:inline">Plataforma RepairIT • </span>
            <span>SuperAdmin</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user.role === "admin" &&
            venues.length > 1 &&
            hasMultiTallerAccess(effectivePlan) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border border-border/80 px-2.5 sm:px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 select-none cursor-pointer bg-background/60 hover:bg-muted/40 transition-colors"
                    title="Cambiar sucursal activa"
                  >
                    <Store className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="max-w-[130px] sm:max-w-[180px] truncate">
                      {activeVenue ? activeVenue.name : "Cargando..."}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60 shrink-0 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border text-foreground w-56 p-1">
                  {venues.map((v) => (
                    <DropdownMenuItem
                      key={v._id}
                      onClick={() => onSwitchVenue(v._id)}
                      className="text-xs transition-colors cursor-pointer flex items-center justify-between gap-3 py-2 px-2.5 rounded-md hover:bg-muted"
                    >
                      <span className="truncate font-medium">{v.name}</span>
                      {v._id === activeVenue?._id && (
                        <span className="text-primary font-bold text-xs shrink-0">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="h-8 border border-border/60 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 bg-background/50 text-foreground select-none">
                <Store className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {activeVenue ? activeVenue.name : "Cargando..."}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

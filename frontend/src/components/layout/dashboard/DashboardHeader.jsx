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
import { ChevronDown } from "lucide-react";
import { hasMultiTallerAccess } from "@/services/api";

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
    "/dashboard/inventario": "Inventario de Insumos",
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
            <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono select-none">
              Sucursal:
            </span>
            {user.role === "admin" &&
            venues.length > 1 &&
            hasMultiTallerAccess(effectivePlan) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border border-border/80 px-2 text-[10px] font-bold rounded flex items-center gap-1 select-none cursor-pointer max-w-[140px] sm:max-w-none"
                  >
                    <span className="truncate">
                      {activeVenue ? activeVenue.name : "Cargando..."}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border text-foreground text-[10px]">
                  {venues.map((v) => (
                    <DropdownMenuItem
                      key={v._id}
                      onClick={() => onSwitchVenue(v._id)}
                      className="text-[10px] transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <span>{v.name}</span>
                      {v._id === activeVenue?._id && (
                        <span className="text-primary font-bold">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-[10px] text-foreground font-bold font-mono truncate max-w-[120px] sm:max-w-none">
                {activeVenue ? activeVenue.name : "Cargando..."}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

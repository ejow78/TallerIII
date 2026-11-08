import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  Settings,
  PlusCircle,
  Users,
  KeyRound,
  ShoppingCart,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { hasPOSAccess, hasMultiTallerAccess } from "@/services/api";
import { prefetchRoute } from "./useDashboardLayout";

const navItemClass =
  "h-9 sm:h-9.5 px-3 rounded-lg text-[13.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold data-[active=true]:border data-[active=true]:border-primary/25 transition-all";

export function DashboardSidebar({
  isSuperAdmin,
  user,
  activeVenue,
  effectivePlan,
  sidebarStats,
  currentPath,
  onLogout,
}) {
  return (
    <Sidebar className="border-r border-border/70 bg-card/95 backdrop-blur-xl">
      {/* Header Limpio solo con el Logo */}
      <SidebarHeader className="px-4 py-3 sm:p-6 border-b border-border/30 shrink-0">
        <div className="flex items-center justify-between">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="font-outfit text-2xl font-black tracking-tight text-foreground">
              Repair<span className="text-primary">IT</span>
            </span>
          </NavLink>
        </div>
      </SidebarHeader>

      {/* Contenido de Navegación por Secciones */}
      <SidebarContent className="px-2 py-2 sm:py-4 space-y-1 sm:space-y-2 flex-1 min-h-0 overflow-y-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isSuperAdmin ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 px-3 mb-1.5">
              Administración Global
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === "/dashboard"}
                    className={navItemClass}
                    onMouseEnter={() => prefetchRoute("/dashboard")}
                    onFocus={() => prefetchRoute("/dashboard")}
                  >
                    <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                      <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
                      <span>Suscripciones</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === "/dashboard/usuarios"}
                    className={navItemClass}
                    onMouseEnter={() => prefetchRoute("/dashboard/usuarios")}
                    onFocus={() => prefetchRoute("/dashboard/usuarios")}
                  >
                    <NavLink to="/dashboard/usuarios" className="flex items-center gap-3 w-full">
                      <Users className="w-[18px] h-[18px] shrink-0" />
                      <span>Usuarios</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === "/dashboard/consultas"}
                    className={navItemClass}
                    onMouseEnter={() => prefetchRoute("/dashboard/consultas")}
                    onFocus={() => prefetchRoute("/dashboard/consultas")}
                  >
                    <NavLink to="/dashboard/consultas" className="flex items-center gap-3 w-full">
                      <MessageSquare className="w-[18px] h-[18px] shrink-0" />
                      <span>Consultas Web</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {sidebarStats.contactMessagesCount > 0 && (
                    <SidebarMenuBadge className="bg-primary/15 text-primary border border-primary/25 rounded-md text-[10px] font-mono font-bold px-1.5">
                      {sidebarStats.contactMessagesCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            {/* Grupo 1: Operaciones Diarias */}
            <SidebarGroup className="py-1">
              <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 px-3 mb-1.5">
                Operaciones de Taller
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === "/dashboard"}
                      className={navItemClass}
                      onMouseEnter={() => prefetchRoute("/dashboard")}
                      onFocus={() => prefetchRoute("/dashboard")}
                    >
                      <NavLink to="/dashboard" end className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
                        <span>Inicio</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === "/dashboard/nuevo-ingreso"}
                      className={navItemClass}
                      onMouseEnter={() => prefetchRoute("/dashboard/nuevo-ingreso")}
                      onFocus={() => prefetchRoute("/dashboard/nuevo-ingreso")}
                    >
                      <NavLink to="/dashboard/nuevo-ingreso" className="flex items-center gap-3 w-full">
                        <PlusCircle className="w-[18px] h-[18px] shrink-0" />
                        <span>Nuevo Ingreso</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === "/dashboard/ordenes"}
                      className={navItemClass}
                      onMouseEnter={() => prefetchRoute("/dashboard/ordenes")}
                      onFocus={() => prefetchRoute("/dashboard/ordenes")}
                    >
                      <NavLink to="/dashboard/ordenes" className="flex items-center gap-3 w-full">
                        <ClipboardList className="w-[18px] h-[18px] shrink-0" />
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
                      isActive={currentPath === "/dashboard/clientes"}
                      className={navItemClass}
                      onMouseEnter={() => prefetchRoute("/dashboard/clientes")}
                      onFocus={() => prefetchRoute("/dashboard/clientes")}
                    >
                      <NavLink to="/dashboard/clientes" className="flex items-center gap-3 w-full">
                        <Users className="w-[18px] h-[18px] shrink-0" />
                        <span>Clientes</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo 2: Stock y Finanzas */}
            <SidebarGroup className="py-1">
              <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 px-3 mb-1.5">
                Stock y Finanzas
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === "/dashboard/inventario"}
                      className={navItemClass}
                      onMouseEnter={() => prefetchRoute("/dashboard/inventario")}
                      onFocus={() => prefetchRoute("/dashboard/inventario")}
                    >
                      <NavLink to="/dashboard/inventario" className="flex items-center gap-3 w-full">
                        <Package className="w-[18px] h-[18px] shrink-0" />
                        <span>Inventario de Insumos</span>
                      </NavLink>
                    </SidebarMenuButton>
                    {hasPOSAccess(effectivePlan) &&
                      (sidebarStats.lowStock > 0 || sidebarStats.outOfStock > 0) && (
                        <SidebarMenuBadge
                          title={
                            sidebarStats.outOfStock > 0
                              ? `${sidebarStats.outOfStock} sin stock • ${sidebarStats.lowStock} bajo stock`
                              : `${sidebarStats.lowStock} ítems para reposición`
                          }
                          className={`rounded-md text-[10px] font-mono font-bold px-1.5 flex items-center gap-1 border ${
                            sidebarStats.outOfStock > 0
                              ? "bg-destructive/15 text-destructive border-destructive/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <AlertTriangle
                            className={`w-2.5 h-2.5 ${
                              sidebarStats.outOfStock > 0
                                ? "text-destructive"
                                : "text-amber-400"
                            }`}
                          />
                          {sidebarStats.outOfStock > 0
                            ? sidebarStats.outOfStock + sidebarStats.lowStock
                            : sidebarStats.lowStock}
                        </SidebarMenuBadge>
                      )}
                  </SidebarMenuItem>

                  {hasPOSAccess(effectivePlan) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath === "/dashboard/caja"}
                        className={navItemClass}
                        onMouseEnter={() => prefetchRoute("/dashboard/caja")}
                        onFocus={() => prefetchRoute("/dashboard/caja")}
                      >
                        <NavLink to="/dashboard/caja" className="flex items-center gap-3 w-full">
                          <ShoppingCart className="w-[18px] h-[18px] shrink-0" />
                          <span>Caja</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo 3: Configuración y Accesos - Solo visible para Administradores */}
            {user.role === "admin" && (
              <SidebarGroup className="py-1">
                <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 px-3 mb-1.5">
                  Administración
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath === "/dashboard/perfil"}
                        className={navItemClass}
                        onMouseEnter={() => prefetchRoute("/dashboard/perfil")}
                        onFocus={() => prefetchRoute("/dashboard/perfil")}
                      >
                        <NavLink to="/dashboard/perfil" className="flex items-center gap-3 w-full">
                          <Settings className="w-[18px] h-[18px] shrink-0" />
                          <span>Configuración de Taller</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {hasMultiTallerAccess(effectivePlan) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={currentPath === "/dashboard/cuentas"}
                          className={navItemClass}
                          onMouseEnter={() => prefetchRoute("/dashboard/cuentas")}
                          onFocus={() => prefetchRoute("/dashboard/cuentas")}
                        >
                          <NavLink to="/dashboard/cuentas" className="flex items-center gap-3 w-full">
                            <KeyRound className="w-[18px] h-[18px] shrink-0" />
                            <span>Cuentas de Acceso</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>

      {/* Pie de Sidebar con Perfil y Cerrar Sesión */}
      <SidebarFooter className="p-3 sm:p-4 border-t border-border/85 space-y-2.5 sm:space-y-4 bg-card/65 shrink-0">
        <div className="flex items-center px-2 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary uppercase shrink-0">
              {isSuperAdmin
                ? "SA"
                : activeVenue && activeVenue.name
                ? activeVenue.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "TL"}
            </div>
            <div className="text-[13px] truncate min-w-0">
              <span className="text-foreground font-bold block leading-none truncate">
                {isSuperAdmin
                  ? "Plataforma Central"
                  : activeVenue
                  ? activeVenue.name
                  : "Cargando Taller..."}
              </span>
              <span className="text-muted-foreground block text-[11px] mt-0.5 truncate">
                {isSuperAdmin
                  ? "Super Admin"
                  : `${user.name || "Usuario"} (${
                      user.role === "admin" ? "Admin" : "Técnico"
                    })`}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full bg-background hover:bg-red-950/20 text-muted-foreground hover:text-red-400 border-border hover:border-red-950/50 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

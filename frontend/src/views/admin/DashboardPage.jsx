import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  ShieldAlert,
  PackageCheck,
  Wrench,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  ChevronDown,
  Search,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // Datos de sesión del usuario
  const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
  const isSuperAdmin = user.role === "superadmin";

  // Estados de SuperAdmin
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados de Taller (Inquilino común)
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  const loadSuperData = async () => {
    try {
      setLoading(true);
      const orgsData = await api.super.getOrganizations();
      setOrganizations(orgsData);
    } catch (err) {
      toast.error("Error al cargar organizaciones de la plataforma", {
        description: err.message || "Por favor, intente de nuevo."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWorkshopData = async () => {
    try {
      setLoading(true);
      const ordersData = await api.orders.getAll();
      const inventoryData = await api.inventory.getAll();
      setOrders(ordersData);
      setInventory(inventoryData);
    } catch (err) {
      toast.error("Error al cargar datos del taller", {
        description: err.message || "Por favor, intente de nuevo."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadSuperData();
    } else {
      loadWorkshopData();
    }
  }, [isSuperAdmin]);

  // Actualizar Plan
  const handlePlanChange = async (orgId, newPlan) => {
    try {
      await api.super.updateSubscription(orgId, newPlan, null);
      toast.success("Plan de suscripción actualizado");
      loadSuperData();
    } catch (err) {
      toast.error("Error al cambiar plan", { description: err.message });
    }
  };

  // Actualizar Estado
  const handleStatusChange = async (orgId, newStatus) => {
    try {
      await api.super.updateSubscription(orgId, null, newStatus);
      toast.success("Estado de suscripción actualizado");
      loadSuperData();
    } catch (err) {
      toast.error("Error al cambiar estado", { description: err.message });
    }
  };

  // Render para SuperAdmin
  if (isSuperAdmin) {
    const filteredOrgs = organizations.filter(o => 
      o.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter(o => o.subscriptionStatus === "activo").length;
    const suspendedOrgs = organizations.filter(o => o.subscriptionStatus !== "activo").length;
    const totalVenues = organizations.reduce((acc, o) => acc + (o.venuesCount || 0), 0);

    if (loading) {
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-1">
          <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
            <span>Plataforma de Suscripciones</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Administración centralizada de inquilinos, licencias operativas y planes de suscripción de talleres.
          </p>
        </div>

        {/* Tarjetas de Métricas de Plataforma */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/45 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Talleres / Inquilinos</span>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-foreground block">{totalOrgs}</span>
              <span className="text-[10px] text-primary block font-medium mt-1">Registrados en la plataforma</span>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-emerald-450 uppercase tracking-wider">Planes Activos</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-emerald-400 block">{activeOrgs}</span>
              <span className="text-[10px] text-emerald-400 block font-medium mt-1">Talleres con acceso vigente</span>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-destructive/80 uppercase tracking-wider">Suspendidos / Vencidos</span>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-destructive block">{suspendedOrgs}</span>
              <span className="text-[10px] text-destructive/80 block font-medium mt-1">Talleres bloqueados</span>
            </CardContent>
          </Card>

          <Card className="bg-card/45 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sucursales Totales</span>
              <Wrench className="h-4 w-4 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-foreground block">{totalVenues}</span>
              <span className="text-[10px] text-muted-foreground block font-medium mt-1">Puntos de servicio activos</span>
            </CardContent>
          </Card>
        </div>

        {/* Listado y control de planes */}
        <Card className="bg-card/20 border-border p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center gap-2 border-0 pb-0">
                <CreditCard className="w-4.5 h-4.5 text-muted-foreground" />
                Control de Cuentas & Licencias
              </CardTitle>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">Total: {organizations.length}</span>
            </div>

            {/* Filtro rápido de búsqueda */}
            <div className="flex gap-3 py-2 border-b border-border/30">
              <div className="relative w-full sm:max-w-xs flex items-center">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre de taller..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/80 border-border text-xs w-full pl-9"
                />
              </div>
            </div>

            {filteredOrgs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Taller</th>
                      <th className="py-3 px-2">Sucursales</th>
                      <th className="py-3 px-2">Técnicos</th>
                      <th className="py-3 px-2">Plan Contratado</th>
                      <th className="py-3 px-2">Acceso / Licencia</th>
                      <th className="py-3 px-2">Alta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrgs.map((org) => {
                      let statusBadge = "secondary";
                      let statusLabel = "Inactivo";
                      if (org.subscriptionStatus === "activo") {
                        statusBadge = "success";
                        statusLabel = "Activo";
                      } else if (org.subscriptionStatus === "suspendido") {
                        statusBadge = "destructive";
                        statusLabel = "Suspendido";
                      } else if (org.subscriptionStatus === "vencido") {
                        statusBadge = "outline";
                        statusLabel = "Vencido";
                      }

                      return (
                        <tr key={org._id} className="border-b border-border/40 hover:bg-card/30 transition-colors">
                          <td className="py-3.5 px-2 font-medium text-foreground text-sm">{org.name}</td>
                          <td className="py-3.5 px-2 font-mono text-muted-foreground">{org.venuesCount || 0}</td>
                          <td className="py-3.5 px-2 font-mono text-muted-foreground">{org.usersCount || 0}</td>
                          <td className="py-3.5 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border px-2 text-xs font-semibold rounded flex items-center gap-1">
                                  {org.subscriptionPlan}
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border text-foreground">
                                <DropdownMenuItem onClick={() => handlePlanChange(org._id, "Taller Básico")} className="text-xs transition-colors cursor-pointer">Taller Básico</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePlanChange(org._id, "Taller Premium")} className="text-xs transition-colors cursor-pointer">Taller Premium</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePlanChange(org._id, "Multi-Taller Pro")} className="text-xs transition-colors cursor-pointer">Multi-Taller Pro</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="py-3.5 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border px-2 text-xs font-semibold rounded flex items-center gap-1">
                                  <Badge variant={statusBadge} className="text-[9px] uppercase font-bold px-1.5 py-0.5 border">
                                    {statusLabel}
                                  </Badge>
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border text-foreground">
                                <DropdownMenuItem onClick={() => handleStatusChange(org._id, "activo")} className="text-xs transition-colors cursor-pointer">Activo</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(org._id, "suspendido")} className="text-xs transition-colors cursor-pointer">Suspendido</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(org._id, "vencido")} className="text-xs transition-colors cursor-pointer">Vencido</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="py-3.5 px-2 text-muted-foreground font-mono">{org.createdAt ? new Date(org.createdAt).toLocaleDateString("es-AR") : "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs font-light">
                No se encontraron talleres/inquilinos registrados.
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Render para Técnicos / Administradores comunes
  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Grid de Skeletons para tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Métricas operativas dinámicas calculadas desde los datos reales de la sucursal activa
  const activeOrdersCount = orders.filter((o) => o.status !== "entregado" && o.status !== "rechazado").length;
  const diagnosticsCount = orders.filter((o) => o.status === "diagnostico").length;
  const repairCount = orders.filter((o) => o.status === "reparacion" || o.status === "en_reparacion").length;
  const activeOrdersDetail = `${diagnosticsCount} en diagnóstico, ${repairCount} en reparación`;

  const deliveredCount = orders.filter((o) => o.status === "entregado").length;

  const totalItemsCount = inventory.length;
  const categoriesCount = new Set(inventory.map((item) => item.category)).size;
  const totalItemsDetail = `Distribuidos en ${categoriesCount} categorías`;

  const lowStockItems = inventory.filter((item) => item.quantity <= (item.minQuantity || item.min_quantity));
  const lowStockCount = lowStockItems.length;
  const lowStockDetail = lowStockCount > 0 ? "Requieren compra o reposición" : "Niveles de stock óptimos";

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <LayoutDashboard className="w-7 h-7 text-primary shrink-0" />
          <span>Panel de Control</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Resumen operativo del taller y control de stock de insumos técnicos de la sucursal activa.
        </p>
      </div>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Órdenes Activas */}
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Órdenes Activas</span>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-foreground block">{activeOrdersCount}</span>
            <span className="text-[10px] text-primary block font-medium mt-1">{activeOrdersDetail}</span>
          </CardContent>
        </Card>

        {/* Card 2: Entregados este Mes */}
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entregados Totales</span>
            <PackageCheck className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-foreground block">{deliveredCount}</span>
            <span className="text-[10px] text-emerald-400 block font-medium mt-1">Dispositivos retirados por clientes</span>
          </CardContent>
        </Card>

        {/* Card 3: Repuestos en Stock */}
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items en Inventario</span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-foreground block">{totalItemsCount}</span>
            <span className="text-[10px] text-muted-foreground block font-medium mt-1">{totalItemsDetail}</span>
          </CardContent>
        </Card>

        {/* Card 4: Alertas de Stock */}
        <Card className={lowStockCount > 0 ? "bg-destructive/5 border-destructive/20 shadow-md" : "bg-card/45 border-border shadow-md"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alertas de Stock</span>
            <AlertCircle className={lowStockCount > 0 ? "h-4 w-4 text-destructive" : "h-4 w-4 text-muted-foreground/60"} />
          </CardHeader>
          <CardContent>
            <span className={lowStockCount > 0 ? "text-3xl font-outfit font-black text-destructive block" : "text-3xl font-outfit font-black text-foreground block"}>{lowStockCount}</span>
            <span className={lowStockCount > 0 ? "text-[10px] text-destructive/80 block font-medium mt-1" : "text-[10px] text-muted-foreground block font-medium mt-1"}>{lowStockDetail}</span>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Órdenes Recientes */}
        <Card className="lg:col-span-2 bg-card/20 border-border shadow-sm">
          <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="font-outfit text-base font-bold text-foreground/90">
              Ingresos Recientes
            </CardTitle>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Últimos 5 registros</span>
          </CardHeader>
          <CardContent className="pt-4">
            {orders.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground uppercase tracking-wider font-semibold">
                      <th className="py-2">N° Orden</th>
                      <th className="py-2">Cliente</th>
                      <th className="py-2">Equipo</th>
                      <th className="py-2 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => {
                      const clientName = o.clientId && typeof o.clientId === "object" ? o.clientId.name : "N/A";
                      return (
                        <tr key={o._id} className="border-b border-border/20 hover:bg-card/10">
                          <td className="py-2.5 font-mono font-bold text-primary">{o.trackingCode}</td>
                          <td className="py-2.5 font-medium">{clientName}</td>
                          <td className="py-2.5 text-muted-foreground">{o.deviceModel}</td>
                          <td className="py-2.5 text-right">
                            <Badge variant={o.status === "listo" ? "success" : o.status === "ingresado" ? "secondary" : "outline"} className="text-[9px] uppercase font-bold py-0.5 px-2 border">
                              {o.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xs text-muted-foreground leading-normal font-light">
                  No hay órdenes de servicio cargadas. Ve a la pestaña de "Registrar Ingreso" para añadir un ingreso técnico.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4 border-border text-xs gap-1 font-bold">
                  <Link to="/dashboard/ordenes">
                    Ir a Registro de Dispositivos <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas de Stock Detalladas */}
        <Card className="bg-card/20 border-border shadow-sm">
          <CardHeader className="border-b border-border/50 py-4">
            <CardTitle className="font-outfit text-base font-bold text-foreground/90">
              Críticos de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <Alert key={item._id} variant="destructive" className="bg-destructive/10 border-destructive/20 text-foreground p-3.5">
                  <AlertCircle className="h-4 w-4 stroke-destructive" />
                  <div className="ml-2 w-full text-left">
                    <AlertTitle className="text-xs font-bold font-outfit flex items-center justify-between">
                      <span>{item.name}</span>
                      <Badge variant="destructive" className="text-[8px] font-bold py-0.5 px-1 uppercase tracking-wider shrink-0 select-none">Bajo Stock</Badge>
                    </AlertTitle>
                    <AlertDescription className="text-[10px] text-muted-foreground mt-1">
                      Mínimo requerido: {item.minQuantity || item.min_quantity} | Actual en stock: {item.quantity}.
                    </AlertDescription>
                  </div>
                </Alert>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs font-light">
                No hay alertas de stock críticas en esta sucursal.
              </div>
            )}

          </CardContent>
        </Card>

      </div>

    </div>
  );
}

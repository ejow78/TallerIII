import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  PackageCheck,
  Wrench,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  CreditCard,
  ChevronDown,
  Search,
  LayoutDashboard,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "sonner";

const activityChartConfig = {
  ingresados: {
    label: "Equipos Ingresados",
    color: "#38bdf8",
  },
  entregados: {
    label: "Equipos Entregados",
    color: "#10b981",
  },
  facturacion: {
    label: "Facturación ($)",
    color: "#60a5fa",
  },
};

const statusChartConfig = {
  cantidad: {
    label: "Órdenes",
    color: "#38bdf8",
  },
};

const STATUS_META = {
  ingresado: { label: "Ingresado", color: "#94a3b8", badge: "secondary" },
  diagnostico: { label: "En Diagnóstico", color: "#f59e0b", badge: "outline" },
  presupuestado: { label: "Presupuestado", color: "#a855f7", badge: "outline" },
  en_reparacion: { label: "En Reparación", color: "#38bdf8", badge: "default" },
  reparacion: { label: "En Reparación", color: "#38bdf8", badge: "default" },
  listo: { label: "Listo p/ Retirar", color: "#10b981", badge: "success" },
  entregado: { label: "Entregado", color: "#059669", badge: "success" },
  rechazado: { label: "Rechazado", color: "#ef4444", badge: "destructive" },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // Datos de sesión del usuario
  const user = JSON.parse(
    sessionStorage.getItem("repairit_user") || localStorage.getItem("repairit_user") || "{}"
  );
  const isSuperAdmin = user.role === "superadmin";

  // Estados de SuperAdmin
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados de Taller
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);

  // Controles de Gráficos Interactivos
  const [timeRange, setTimeRange] = useState("14d");
  const [chartMode, setChartMode] = useState("orders"); // "orders" | "revenue"
  const [breakdownMode, setBreakdownMode] = useState("status"); // "status" | "devices"

  const loadSuperData = async () => {
    try {
      setLoading(true);
      const orgsData = await api.super.getOrganizations();
      setOrganizations(orgsData);
    } catch (err) {
      toast.error("Error al cargar organizaciones de la plataforma", {
        description: err.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWorkshopData = async () => {
    try {
      setLoading(true);
      const [ordersData, inventoryData, salesData] = await Promise.all([
        api.orders.getAll().catch(() => []),
        api.inventory.getAll().catch(() => []),
        api.sales.getAll().catch(() => []),
      ]);
      setOrders(ordersData || []);
      setInventory(inventoryData || []);
      setSales(salesData || []);
    } catch (err) {
      toast.error("Error al cargar datos del taller", {
        description: err.message || "Por favor, intente de nuevo.",
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

  // Actualizar Plan (SuperAdmin)
  const handlePlanChange = async (orgId, newPlan) => {
    try {
      await api.super.updateSubscription(orgId, newPlan, null);
      toast.success("Plan de suscripción actualizado");
      loadSuperData();
    } catch (err) {
      toast.error("Error al cambiar plan", { description: err.message });
    }
  };

  // Actualizar Estado (SuperAdmin)
  const handleStatusChange = async (orgId, newStatus) => {
    try {
      await api.super.updateSubscription(orgId, null, newStatus);
      toast.success("Estado de suscripción actualizado");
      loadSuperData();
    } catch (err) {
      toast.error("Error al cambiar estado", { description: err.message });
    }
  };

  // Procesamiento de serie temporal para el AreaChart (Shadcn Charts)
  const timeSeriesData = useMemo(() => {
    const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 14;
    const now = new Date();
    const daysMap = new Map();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
      daysMap.set(key, {
        dateKey: key,
        label,
        ingresados: 0,
        entregados: 0,
        facturacion: 0,
      });
    }

    // Contabilizar órdenes por fecha de creación
    orders.forEach((o) => {
      let key = null;
      if (o.created_at) {
        key = new Date(o.created_at).toISOString().split("T")[0];
      } else if (o.date && o.date.includes("/")) {
        const parts = o.date.split("/");
        if (parts.length === 3) {
          const [dd, mm, yyyy] = parts;
          key = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        }
      }

      if (key && daysMap.has(key)) {
        const entry = daysMap.get(key);
        entry.ingresados += 1;
        if (o.status === "entregado" || o.status === "listo") {
          entry.entregados += 1;
        }
        if (o.budget?.approved && Number(o.budget?.total) > 0) {
          entry.facturacion += Number(o.budget.total);
        }
      }
    });

    // Contabilizar ventas de caja (POS)
    sales.forEach((s) => {
      if (s.created_at) {
        const key = new Date(s.created_at).toISOString().split("T")[0];
        if (daysMap.has(key)) {
          const entry = daysMap.get(key);
          entry.facturacion += Number(s.total || 0);
        }
      }
    });

    return Array.from(daysMap.values());
  }, [orders, sales, timeRange]);

  // Procesamiento de distribución por Estado o por Tipo de Dispositivo
  const breakdownData = useMemo(() => {
    if (breakdownMode === "status") {
      const counts = {
        ingresado: 0,
        diagnostico: 0,
        presupuestado: 0,
        en_reparacion: 0,
        listo: 0,
        entregado: 0,
      };
      orders.forEach((o) => {
        const st = o.status === "reparacion" ? "en_reparacion" : o.status;
        if (st && st in counts) {
          counts[st] += 1;
        }
      });
      return [
        { name: "Ingresado", cantidad: counts.ingresado },
        { name: "Diagnóstico", cantidad: counts.diagnostico },
        { name: "Presupuesto", cantidad: counts.presupuestado },
        { name: "Reparación", cantidad: counts.en_reparacion },
        { name: "Listos", cantidad: counts.listo },
        { name: "Entregados", cantidad: counts.entregado },
      ];
    } else {
      const deviceCounts = {};
      orders.forEach((o) => {
        const type = o.deviceType || "Otro";
        deviceCounts[type] = (deviceCounts[type] || 0) + 1;
      });
      const entries = Object.entries(deviceCounts)
        .map(([name, cantidad]) => ({ name, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 6);

      if (entries.length === 0) {
        return [
          { name: "Smartphone", cantidad: 0 },
          { name: "Notebook", cantidad: 0 },
          { name: "PC Escritorio", cantidad: 0 },
          { name: "Consola", cantidad: 0 },
        ];
      }
      return entries;
    }
  }, [orders, breakdownMode]);

  // Render para SuperAdmin
  if (isSuperAdmin) {
    const filteredOrgs = organizations.filter((o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter((o) => o.subscriptionStatus === "activo").length;
    const suspendedOrgs = organizations.filter((o) => o.subscriptionStatus !== "activo").length;
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
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
            <span>Plataforma de Suscripciones</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Administración centralizada de inquilinos, licencias operativas y planes de suscripción de talleres.
          </p>
        </div>

        {/* Tarjetas de Métricas de Plataforma */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card/45 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Talleres / Inquilinos
              </span>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-foreground block">{totalOrgs}</span>
              <span className="text-[10px] text-primary block font-medium mt-1">
                Registrados en la plataforma
              </span>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Planes Activos
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-emerald-400 block">{activeOrgs}</span>
              <span className="text-[10px] text-emerald-400 block font-medium mt-1">
                Talleres con acceso vigente
              </span>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-destructive/80 uppercase tracking-wider">
                Suspendidos / Vencidos
              </span>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-destructive block">
                {suspendedOrgs}
              </span>
              <span className="text-[10px] text-destructive/80 block font-medium mt-1">
                Talleres bloqueados
              </span>
            </CardContent>
          </Card>

          <Card className="bg-card/45 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sucursales Totales
              </span>
              <Wrench className="h-4 w-4 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-outfit font-black text-foreground block">{totalVenues}</span>
              <span className="text-[10px] text-muted-foreground block font-medium mt-1">
                Puntos de servicio activos
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Listado y control de planes */}
        <Card className="bg-card/20 border-border p-4 sm:p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center gap-2 border-0 pb-0">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                Control de Cuentas & Licencias
              </CardTitle>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
                Total: {organizations.length}
              </span>
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
                        <tr
                          key={org._id}
                          className="border-b border-border/40 hover:bg-card/30 transition-colors"
                        >
                          <td className="py-3.5 px-2 font-medium text-foreground text-sm">
                            {org.name}
                          </td>
                          <td className="py-3.5 px-2 font-mono text-muted-foreground">
                            {org.venuesCount || 0}
                          </td>
                          <td className="py-3.5 px-2 font-mono text-muted-foreground">
                            {org.usersCount || 0}
                          </td>
                          <td className="py-3.5 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border px-2 text-xs font-semibold rounded flex items-center gap-1"
                                >
                                  {org.subscriptionPlan}
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border text-foreground">
                                <DropdownMenuItem
                                  onClick={() => handlePlanChange(org._id, "Taller Básico")}
                                  className="text-xs transition-colors cursor-pointer"
                                >
                                  Taller Básico
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePlanChange(org._id, "Taller Premium")}
                                  className="text-xs transition-colors cursor-pointer"
                                >
                                  Taller Premium
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePlanChange(org._id, "Multi-Taller Pro")}
                                  className="text-xs transition-colors cursor-pointer"
                                >
                                  Multi-Taller Pro
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="py-3.5 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border px-2 text-xs font-semibold rounded flex items-center gap-1"
                                >
                                  <Badge
                                    variant={statusBadge}
                                    className="text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                                  >
                                    {statusLabel}
                                  </Badge>
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border text-foreground">
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(org._id, "activo")}
                                  className="text-xs transition-colors cursor-pointer"
                                >
                                  Activo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(org._id, "suspendido")}
                                  className="text-xs transition-colors cursor-pointer"
                                >
                                  Suspendido
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(org._id, "vencido")}
                                  className="text-xs transition-colors cursor-pointer"
                                >
                                  Vencido
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="py-3.5 px-2 text-muted-foreground font-mono">
                            {org.createdAt
                              ? new Date(org.createdAt).toLocaleDateString("es-AR")
                              : "N/A"}
                          </td>
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

  // Render para Técnicos / Administradores del Taller
  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[320px] w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-[320px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Métricas operativas dinámicas calculadas desde los datos reales de la sucursal activa
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "entregado" && o.status !== "rechazado"
  ).length;
  const diagnosticsCount = orders.filter(
    (o) => o.status === "diagnostico" || o.status === "ingresado"
  ).length;
  const repairCount = orders.filter(
    (o) => o.status === "reparacion" || o.status === "en_reparacion"
  ).length;
  const readyToPickupCount = orders.filter((o) => o.status === "listo").length;
  const activeOrdersDetail = `${diagnosticsCount} en revisión • ${repairCount} en reparación • ${readyToPickupCount} listos`;

  const deliveredCount = orders.filter((o) => o.status === "entregado").length;

  // Ingresos acumulados (Ventas POS + Presupuestos Aprobados)
  const totalSalesRevenue = sales.reduce((acc, s) => acc + Number(s.total || 0), 0);
  const approvedBudgetsRevenue = orders.reduce((acc, o) => {
    if (o.budget?.approved && Number(o.budget?.total) > 0) {
      return acc + Number(o.budget.total);
    }
    return acc;
  }, 0);
  const totalRevenue = totalSalesRevenue + approvedBudgetsRevenue;

  const totalItemsCount = inventory.length;
  const categoriesCount = new Set(inventory.map((item) => item.category).filter(Boolean)).size;

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= (item.minQuantity || item.min_quantity || 0)
  );
  const lowStockCount = lowStockItems.length;
  const lowStockDetail =
    lowStockCount > 0
      ? `${lowStockCount} repuestos requieren reposición`
      : `${totalItemsCount} insumos en ${categoriesCount} categorías`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <LayoutDashboard className="w-7 h-7 text-primary shrink-0" />
          <span>Panel de Control</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Resumen operativo del taller y control de stock de insumos técnicos de la sucursal activa.
        </p>
      </div>

      {/* Grid de 4 Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Card 1: Órdenes Activas */}
        <Card className="bg-card/45 border-border/80 shadow-sm hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2 px-3.5 sm:px-6 pt-3.5 sm:pt-6">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              Órdenes Activas
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Wrench className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="px-3.5 sm:px-6 pb-3.5 sm:pb-6">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {activeOrdersCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-primary block font-medium mt-1 leading-tight line-clamp-2">
              {activeOrdersDetail}
            </span>
          </CardContent>
        </Card>

        {/* Card 2: Equipos Entregados */}
        <Card className="bg-card/45 border-border/80 shadow-sm hover:border-emerald-500/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2 px-3.5 sm:px-6 pt-3.5 sm:pt-6">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              Equipos Entregados
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <PackageCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3.5 sm:px-6 pb-3.5 sm:pb-6">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {deliveredCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 block font-medium mt-1 leading-tight line-clamp-2">
              {readyToPickupCount > 0
                ? `+ ${readyToPickupCount} listos esperando retiro`
                : "Dispositivos retirados por clientes"}
            </span>
          </CardContent>
        </Card>

        {/* Card 3: Balance Operativo (Caja + Presupuestos) */}
        <Card className="bg-card/45 border-border/80 shadow-sm hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2 px-3.5 sm:px-6 pt-3.5 sm:pt-6">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              Facturación
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sky-400" />
            </div>
          </CardHeader>
          <CardContent className="px-3.5 sm:px-6 pb-3.5 sm:pb-6">
            <span className="text-xl sm:text-3xl font-outfit font-black text-foreground block tabular-nums truncate">
              ${totalRevenue.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground block font-medium mt-1 leading-tight line-clamp-2">
              {sales.length} ventas POS • ${approvedBudgetsRevenue.toLocaleString("es-AR")} en órdenes
            </span>
          </CardContent>
        </Card>

        {/* Card 4: Stock & Alertas */}
        <Card
          className={
            lowStockCount > 0
              ? "bg-destructive/5 border-destructive/25 shadow-sm"
              : "bg-card/45 border-border/80 shadow-sm"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 sm:pb-2 px-3.5 sm:px-6 pt-3.5 sm:pt-6">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              Estado de Stock
            </span>
            <div
              className={
                lowStockCount > 0
                  ? "w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center shrink-0"
                  : "w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0"
              }
            >
              {lowStockCount > 0 ? (
                <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-destructive" />
              ) : (
                <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent className="px-3.5 sm:px-6 pb-3.5 sm:pb-6">
            <span
              className={
                lowStockCount > 0
                  ? "text-2xl sm:text-3xl font-outfit font-black text-destructive block"
                  : "text-2xl sm:text-3xl font-outfit font-black text-foreground block"
              }
            >
              {lowStockCount > 0 ? `${lowStockCount} Alertas` : `${totalItemsCount} Ítems`}
            </span>
            <span
              className={
                lowStockCount > 0
                  ? "text-[10px] sm:text-[11px] text-destructive/90 block font-medium mt-1 leading-tight line-clamp-2"
                  : "text-[10px] sm:text-[11px] text-muted-foreground block font-medium mt-1 leading-tight line-clamp-2"
              }
            >
              {lowStockDetail}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Gráficos Interactivos (Shadcn Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Shadcn Interactive Area Chart (2 columnas) */}
        <Card className="lg:col-span-2 bg-card/30 border-border/80 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>
                  {chartMode === "orders"
                    ? "Flujo de Equipos: Ingresados vs. Entregados"
                    : "Evolución de Facturación Diaria ($)"}
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {chartMode === "orders"
                  ? "Comparativa diaria de órdenes recibidas y equipos completados"
                  : "Ingresos consolidados por cobros en Caja POS y presupuestos aprobados"}
              </CardDescription>
            </div>

            {/* Controles del gráfico */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5">
                <button
                  type="button"
                  onClick={() => setChartMode("orders")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    chartMode === "orders"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Órdenes
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode("revenue")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    chartMode === "revenue"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Facturación
                </button>
              </div>

              <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5">
                {[
                  { id: "7d", label: "7d" },
                  { id: "14d", label: "14d" },
                  { id: "30d", label: "30d" },
                ].map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setTimeRange(range.id)}
                    className={`px-2 py-1 text-[11px] font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                      timeRange === range.id
                        ? "bg-card text-foreground border border-border/60 shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 pb-4 flex-1 flex flex-col justify-center">
            <ChartContainer
              config={activityChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart
                data={timeSeriesData}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillIngresados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-ingresados)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-ingresados)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillEntregados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-entregados)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-entregados)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillFacturacion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-facturacion)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-facturacion)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={chartMode === "revenue" ? 55 : 28}
                  allowDecimals={false}
                  tickFormatter={(val) =>
                    chartMode === "revenue"
                      ? val >= 1000
                        ? `$${(val / 1000).toFixed(0)}k`
                        : `$${val}`
                      : val
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                {chartMode === "orders" ? (
                  <>
                    <Area
                      dataKey="entregados"
                      type="monotone"
                      fill="url(#fillEntregados)"
                      stroke="var(--color-entregados)"
                      strokeWidth={2}
                    />
                    <Area
                      dataKey="ingresados"
                      type="monotone"
                      fill="url(#fillIngresados)"
                      stroke="var(--color-ingresados)"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <Area
                    dataKey="facturacion"
                    type="monotone"
                    fill="url(#fillFacturacion)"
                    stroke="var(--color-facturacion)"
                    strokeWidth={2.5}
                  />
                )}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico 2: Distribución por Estado de Laboratorio / Equipos */}
        <Card className="bg-card/30 border-border/80 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="font-outfit text-base font-bold text-foreground">
                {breakdownMode === "status" ? "Estados de Taller" : "Tipos de Equipos"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {breakdownMode === "status"
                  ? "Volumen por etapa operativa"
                  : "Dispositivos más recibidos"}
              </CardDescription>
            </div>

            <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setBreakdownMode("status")}
                className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                  breakdownMode === "status"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Estados
              </button>
              <button
                type="button"
                onClick={() => setBreakdownMode("devices")}
                className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                  breakdownMode === "devices"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Equipos
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 pb-4 flex-1 flex flex-col justify-center">
            <ChartContainer
              config={statusChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                data={breakdownData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={84}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="cantidad"
                  fill="var(--color-cantidad)"
                  radius={[0, 6, 6, 0]}
                  barSize={22}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fila Inferior: Órdenes Recientes y Alertas de Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla / Tarjetas de Órdenes Recientes */}
        <Card className="lg:col-span-2 bg-card/25 border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-outfit text-base font-bold text-foreground/90">
                Ingresos Recientes
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Últimas órdenes registradas en el laboratorio
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-primary hover:text-primary font-semibold gap-1 px-2"
            >
              <Link to="/dashboard/ordenes">
                <span>Ver todas</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {orders.length > 0 ? (
              <>
                {/* Vista Móvil (< sm): Tarjetas apiladas */}
                <div className="space-y-2.5 sm:hidden">
                  {orders.slice(0, 5).map((o) => {
                    const clientName =
                      o.clientId && typeof o.clientId === "object" ? o.clientId.name : "Cliente";
                    const stMeta = STATUS_META[o.status] || {
                      label: o.status,
                      badge: "outline",
                    };
                    return (
                      <div
                        key={o._id}
                        className="rounded-xl border border-border/60 bg-background/40 p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={
                              window.location.hostname.includes("repairit.cloud")
                                ? `https://tracking.repairit.cloud/seguimiento/${o.trackingCode}`
                                : `/seguimiento/${o.trackingCode}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs font-bold text-primary inline-flex items-center gap-1 shrink-0"
                          >
                            <span>{o.trackingCode}</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                          <Badge
                            variant={stMeta.badge}
                            className="text-[9px] uppercase font-bold py-0.5 px-2 border shrink-0 whitespace-nowrap"
                          >
                            {stMeta.label}
                          </Badge>
                        </div>
                        <div className="space-y-0.5 text-left">
                          <span className="text-xs font-semibold text-foreground block leading-snug">
                            {o.deviceType ? `${o.deviceType} • ` : ""}
                            {o.deviceModel}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            Cliente: {clientName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vista Escritorio (>= sm): Tabla limpia */}
                <div className="hidden sm:block overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-2.5">Código QR / Orden</th>
                        <th className="py-2.5">Cliente</th>
                        <th className="py-2.5">Equipo</th>
                        <th className="py-2.5 text-right">Estado Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 6).map((o) => {
                        const clientName =
                          o.clientId && typeof o.clientId === "object"
                            ? o.clientId.name
                            : "Cliente";
                        const stMeta = STATUS_META[o.status] || {
                          label: o.status,
                          badge: "outline",
                        };
                        return (
                          <tr
                            key={o._id}
                            className="border-b border-border/20 hover:bg-card/40 transition-colors"
                          >
                            <td className="py-3 font-mono font-bold text-primary">
                              <a
                                href={
                                  window.location.hostname.includes("repairit.cloud")
                                    ? `https://tracking.repairit.cloud/seguimiento/${o.trackingCode}`
                                    : `/seguimiento/${o.trackingCode}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline inline-flex items-center gap-1.5 group text-primary"
                                title="Abrir seguimiento online del cliente"
                              >
                                <span>{o.trackingCode}</span>
                                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                              </a>
                            </td>
                            <td className="py-3 font-medium text-foreground">{clientName}</td>
                            <td className="py-3 text-muted-foreground">
                              {o.deviceType ? `${o.deviceType} • ` : ""}
                              {o.deviceModel}
                            </td>
                            <td className="py-3 text-right">
                              <Badge
                                variant={stMeta.badge}
                                className="text-[9px] uppercase font-bold py-0.5 px-2 border"
                              >
                                {stMeta.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-normal font-light max-w-sm mx-auto">
                  Todavía no hay órdenes de servicio cargadas en esta sucursal. Registrá el primer equipo para ver su seguimiento en vivo.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-4 border-border text-xs gap-1.5 font-bold"
                >
                  <Link to="/dashboard/nuevo-ingreso">
                    Registrar Primer Dispositivo <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas de Stock Detalladas */}
        <Card className="bg-card/25 border-border/80 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-outfit text-base font-bold text-foreground/90">
                Críticos de Inventario
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Control de umbral de reposición
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-primary hover:text-primary font-semibold px-2"
            >
              <Link to="/dashboard/inventario">Inventario</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5 flex-1">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl bg-destructive/10 border border-destructive/25 text-foreground p-3.5 flex items-start gap-2.5 text-left"
                >
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold font-outfit leading-snug text-foreground">
                        {item.name}
                      </span>
                      <Badge
                        variant="destructive"
                        className="text-[9px] font-bold py-0.5 px-1.5 uppercase tracking-wider shrink-0 select-none whitespace-nowrap"
                      >
                        Stock: {item.quantity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Mínimo sugerido: {item.minQuantity || item.min_quantity} u. •{" "}
                      {item.category || "General"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-foreground">Stock en niveles óptimos</p>
                <p className="text-[11px] text-muted-foreground font-light mt-1 max-w-[220px]">
                  No hay repuestos ni insumos por debajo del stock mínimo en esta sucursal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

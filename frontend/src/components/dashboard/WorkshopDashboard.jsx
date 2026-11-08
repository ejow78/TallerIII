import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard } from "lucide-react";
import { useWorkshopDashboard } from "./useWorkshopDashboard";
import DashboardKpis from "./DashboardKpis";
import DashboardCharts from "./DashboardCharts";
import RecentOrdersCard from "./RecentOrdersCard";
import StockAlertsCard from "./StockAlertsCard";

export default function WorkshopDashboard({ user }) {
  const {
    loading,
    orders,
    sales,
    timeRange,
    setTimeRange,
    chartMode,
    setChartMode,
    breakdownMode,
    setBreakdownMode,
    timeSeriesData,
    breakdownData,
    metrics,
  } = useWorkshopDashboard(user);

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
      <DashboardKpis metrics={metrics} salesLength={sales.length} />

      {/* Sección de Gráficos Interactivos */}
      <DashboardCharts
        isBasicPlan={metrics.isBasicPlan}
        userRole={user?.role}
        chartMode={chartMode}
        setChartMode={setChartMode}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        timeSeriesData={timeSeriesData}
        breakdownMode={breakdownMode}
        setBreakdownMode={setBreakdownMode}
        breakdownData={breakdownData}
      />

      {/* Fila Inferior: Órdenes Recientes y Alertas de Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrdersCard orders={orders} />
        <StockAlertsCard
          isBasicPlan={metrics.isBasicPlan}
          totalItemsCount={metrics.totalItemsCount}
          allAlertItems={metrics.allAlertItems}
        />
      </div>
    </div>
  );
}

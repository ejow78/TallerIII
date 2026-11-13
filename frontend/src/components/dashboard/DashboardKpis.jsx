import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  PackageCheck,
  Clock,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  Package,
} from "lucide-react";

export default function DashboardKpis({ metrics, salesLength }) {
  const {
    activeOrdersCount,
    diagnosticsCount = 0,
    repairCount = 0,
    readyToPickupCount = 0,
    deliveredCount,
    totalRevenue,
    approvedBudgetsRevenue,
    isBasicPlan,
    monthlyOrdersCount,
    totalItemsCount,
    outOfStockCount,
    lowStockCount,
    isCriticalNoStock,
    lowStockDetail,
  } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Card 1: Órdenes Activas */}
      <Card className="bg-card/45 border-border/80 shadow-sm hover:border-primary/30 transition-colors p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
            Órdenes Activas
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Wrench className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3.5 space-y-2">
          <span className="text-3xl sm:text-4xl font-outfit font-black text-foreground block tracking-tight leading-none">
            {activeOrdersCount}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <Badge
              variant="outline"
              className="text-[10px] font-semibold bg-sky-500/10 text-sky-400 border-sky-500/30 px-1.5 py-0 h-5"
            >
              {diagnosticsCount} en revisión
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 border-amber-500/30 px-1.5 py-0 h-5"
            >
              {repairCount} en rep.
            </Badge>
            {readyToPickupCount > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-1.5 py-0 h-5"
              >
                {readyToPickupCount} listos
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Card 2: Equipos Entregados */}
      <Card className="bg-card/45 border-border/80 shadow-sm hover:border-emerald-500/30 transition-colors p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
            Equipos Entregados
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <PackageCheck className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-3.5 space-y-2">
          <span className="text-3xl sm:text-4xl font-outfit font-black text-foreground block tracking-tight leading-none">
            {deliveredCount}
          </span>
          {readyToPickupCount > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <Badge
                variant="outline"
                className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 border-amber-500/30 px-1.5 py-0 h-5"
              >
                +{readyToPickupCount} por retirar
              </Badge>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground/70 block font-normal leading-snug line-clamp-1">
              Dispositivos retirados
            </span>
          )}
        </div>
      </Card>

      {/* Card 3: Balance Operativo (Pro/Multi) o Cupo Mensual (Básico) */}
      <Card className="bg-card/45 border-border/80 shadow-sm hover:border-primary/30 transition-colors p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
            {isBasicPlan ? "Cupo Mensual" : "Facturación"}
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            {isBasicPlan ? (
              <Clock className="h-4 w-4 text-sky-400" />
            ) : (
              <DollarSign className="h-4 w-4 text-sky-400" />
            )}
          </div>
        </div>
        <div className="mt-3.5 space-y-1.5">
          {isBasicPlan ? (
            <>
              <span className="text-3xl sm:text-4xl font-outfit font-black text-foreground block tracking-tight leading-none tabular-nums">
                {monthlyOrdersCount} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
              </span>
              <span className="text-xs text-muted-foreground block font-medium leading-snug line-clamp-1">
                Órdenes registradas este mes (Plan Básico)
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl sm:text-4xl font-outfit font-black text-foreground block tracking-tight leading-none tabular-nums truncate">
                ${totalRevenue.toLocaleString("es-AR")}
              </span>
              <span className="text-xs text-muted-foreground block font-medium leading-snug line-clamp-1">
                {salesLength} ventas POS • ${approvedBudgetsRevenue.toLocaleString("es-AR")} en órdenes
              </span>
            </>
          )}
        </div>
      </Card>

      {/* Card 4: Stock & Alertas */}
      <Card
        className={`p-4 sm:p-5 flex flex-col justify-between transition-colors shadow-sm ${
          isCriticalNoStock
            ? "bg-destructive/5 border-destructive/25"
            : lowStockCount > 0
            ? "bg-amber-500/5 border-amber-500/25"
            : "bg-card/45 border-border/80"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
            Estado de Stock
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              isCriticalNoStock
                ? "bg-destructive/15 border-destructive/30"
                : lowStockCount > 0
                ? "bg-amber-500/15 border-amber-500/30"
                : "bg-muted border-border"
            }`}
          >
            {isCriticalNoStock ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : lowStockCount > 0 ? (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            ) : (
              <Package className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="mt-3.5 space-y-1.5">
          <span
            className={`text-3xl sm:text-4xl font-outfit font-black block tracking-tight leading-none truncate ${
              isCriticalNoStock
                ? "text-destructive"
                : lowStockCount > 0
                ? "text-amber-400"
                : "text-foreground"
            }`}
          >
            {isCriticalNoStock
              ? `${outOfStockCount + lowStockCount} Alertas`
              : lowStockCount > 0
              ? `${lowStockCount} Por Reponer`
              : `${totalItemsCount} Ítems`}
          </span>
          <span
            className={`text-xs block font-medium leading-snug line-clamp-1 ${
              isCriticalNoStock
                ? "text-destructive/90"
                : lowStockCount > 0
                ? "text-amber-400/90"
                : "text-muted-foreground"
            }`}
          >
            {lowStockDetail}
          </span>
        </div>
      </Card>
    </div>
  );
}

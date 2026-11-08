import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, Ban, Store } from "lucide-react";

export function SuperAdminMetricsCards({
  totalOrgs,
  activeOrgs,
  suspendedOrgs,
  totalVenues,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
      <Card className="bg-card/45 border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Talleres Registrados
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
            {totalOrgs}
          </span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">
            {activeOrgs} activos • {suspendedOrgs} suspendidos
          </span>
        </CardContent>
      </Card>

      <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Licencias Activas
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-emerald-400 block">
            {activeOrgs}
          </span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">
            Operando en la nube
          </span>
        </CardContent>
      </Card>

      <Card className="bg-destructive/5 border-destructive/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-destructive/90 uppercase tracking-wider">
            Licencias Bloqueadas
          </span>
          <div className="w-7 h-7 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
            <Ban className="h-3.5 w-3.5 text-destructive" />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-destructive block">
            {suspendedOrgs}
          </span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">
            Suspendidas o vencidas
          </span>
        </CardContent>
      </Card>

      <Card className="bg-card/45 border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Sucursales Totales
          </span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Store className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
            {totalVenues}
          </span>
          <span className="text-xs text-muted-foreground block font-medium mt-1">
            Puntos físicos conectados
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

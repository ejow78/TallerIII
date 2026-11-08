import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, UserCog, UserCheck, Shield } from "lucide-react";

export function SuperAdminKpis({
  totalCount,
  adminsCount,
  techsCount,
  superCount,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
      <Card className="bg-card/45 border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Total Cuentas
          </span>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
            {totalCount}
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground block font-medium mt-1">
            Registradas en la plataforma
          </span>
        </CardContent>
      </Card>

      <Card className="bg-card/45 border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Administradores
          </span>
          <UserCog className="h-4 w-4 text-amber-400" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
            {adminsCount}
          </span>
          <span className="text-[10px] sm:text-[11px] text-amber-400/90 block font-medium mt-1">
            Dueños / encargados de taller
          </span>
        </CardContent>
      </Card>

      <Card className="bg-card/45 border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
            Técnicos de Sucursal
          </span>
          <UserCheck className="h-4 w-4 text-sky-400" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
            {techsCount}
          </span>
          <span className="text-[10px] sm:text-[11px] text-sky-400/90 block font-medium mt-1">
            Cuentas operativas de sucursal
          </span>
        </CardContent>
      </Card>

      <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Super Admins
          </span>
          <Shield className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
          <span className="text-2xl sm:text-3xl font-outfit font-black text-emerald-400 block">
            {superCount}
          </span>
          <span className="text-[10px] sm:text-[11px] text-emerald-400/90 block font-medium mt-1">
            Control global de plataforma
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

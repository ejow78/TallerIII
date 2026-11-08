import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Pencil,
  Trash2,
  Store,
  Users,
  ChevronDown,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { normalizePlan } from "@/services/api";

export function SuperAdminOrgsTable({
  filteredOrgs,
  onViewOrg,
  onOpenEditOrg,
  onDeleteOrg,
  onPlanChange,
  onStatusChange,
}) {
  if (filteredOrgs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-xs font-light">
        No se encontraron talleres registrados con ese criterio.
      </div>
    );
  }

  return (
    <>
      {/* Vista Mobile (< md): Tarjetas de Talleres */}
      <div className="space-y-3 md:hidden">
        {filteredOrgs.map((org) => {
          const normPlan = normalizePlan(org.subscriptionPlan);
          const isActive = org.subscriptionStatus === "activo";
          const mainVenue = (org.venues || [])[0];

          return (
            <div
              key={org._id}
              className="p-4 rounded-2xl border border-border/70 bg-background/50 space-y-3 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-sm text-foreground block truncate">
                    {org.name}
                  </span>
                  {mainVenue?.email && (
                    <span className="text-[11px] text-muted-foreground font-mono block truncate">
                      {mainVenue.email}
                    </span>
                  )}
                </div>
                <Badge
                  variant={
                    isActive
                      ? "success"
                      : org.subscriptionStatus === "suspendido"
                      ? "destructive"
                      : "outline"
                  }
                  className="text-[9px] uppercase font-bold px-2 py-0.5 shrink-0"
                >
                  {org.subscriptionStatus || "activo"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50 font-mono">
                  {org.venuesCount || 0} sucursales
                </span>
                <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50 font-mono">
                  {org.usersCount || 0} cuentas
                </span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/25 font-bold">
                  {normPlan}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewOrg(org)}
                  className="h-8 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer flex-1"
                >
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  Sedes y Cuentas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenEditOrg(org)}
                  className="h-8 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteOrg(org)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista Escritorio (>= md): Tabla Completa */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3.5 px-3">Taller / Organización</th>
              <th className="py-3.5 px-3">Sucursales</th>
              <th className="py-3.5 px-3">Cuentas</th>
              <th className="py-3.5 px-3">Plan Contratado</th>
              <th className="py-3.5 px-3">Estado Licencia</th>
              <th className="py-3.5 px-3">Alta</th>
              <th className="py-3.5 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredOrgs.map((org) => {
              const normPlan = normalizePlan(org.subscriptionPlan);
              const mainVenue = (org.venues || [])[0];
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
                  className="hover:bg-card/40 transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground text-sm block">
                        {org.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono block">
                        {mainVenue?.email ||
                          mainVenue?.address ||
                          `ID: ${org._id.substring(0, 8)}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => onViewOrg(org)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-primary/15 hover:text-primary border border-border/60 font-mono text-xs transition-colors cursor-pointer"
                      title="Ver sucursales del taller"
                    >
                      <Store className="w-3.5 h-3.5 text-primary" />
                      <span>{org.venuesCount || 0}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => onViewOrg(org)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-primary/15 hover:text-primary border border-border/60 font-mono text-xs transition-colors cursor-pointer"
                      title="Ver cuentas de usuario del taller"
                    >
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>{org.usersCount || 0}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-8 border px-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                            normPlan === "Multi-Taller Pro"
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : normPlan === "Taller Pro"
                              ? "border-sky-500/40 bg-sky-500/10 text-sky-400"
                              : "border-border/80 bg-background/60 text-foreground"
                          }`}
                        >
                          {normPlan}
                          <ChevronDown className="w-3 h-3 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                          onClick={() =>
                            onPlanChange(org._id, "Taller Básico")
                          }
                          className="text-xs transition-colors cursor-pointer font-medium"
                        >
                          Taller Básico
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onPlanChange(org._id, "Taller Pro")
                          }
                          className="text-xs transition-colors cursor-pointer font-semibold text-sky-400"
                        >
                          Taller Pro
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onPlanChange(org._id, "Multi-Taller Pro")
                          }
                          className="text-xs transition-colors cursor-pointer font-bold text-primary"
                        >
                          Multi-Taller Pro
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="py-3.5 px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border border-border/70 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
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
                          onClick={() =>
                            onStatusChange(org._id, "activo")
                          }
                          className="text-xs transition-colors cursor-pointer"
                        >
                          Activo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(org._id, "suspendido")
                          }
                          className="text-xs transition-colors cursor-pointer"
                        >
                          Suspendido
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(org._id, "vencido")
                          }
                          className="text-xs transition-colors cursor-pointer"
                        >
                          Vencido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="py-3.5 px-3 text-muted-foreground font-mono text-[11px]">
                    {org.createdAt
                      ? new Date(org.createdAt).toLocaleDateString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewOrg(org)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                        title="Ver detalle, sucursales y cuentas del taller"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenEditOrg(org)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer"
                        title="Editar nombre, plan y licencia del taller"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onStatusChange(
                            org._id,
                            org.subscriptionStatus === "activo"
                              ? "suspendido"
                              : "activo"
                          )
                        }
                        className={`h-8 w-8 rounded-lg cursor-pointer ${
                          org.subscriptionStatus === "activo"
                            ? "text-amber-400 hover:bg-amber-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                        title={
                          org.subscriptionStatus === "activo"
                            ? "Suspender licencia rápidamente"
                            : "Reactivar licencia rápidamente"
                        }
                      >
                        {org.subscriptionStatus === "activo" ? (
                          <Ban className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteOrg(org)}
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Eliminar taller"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

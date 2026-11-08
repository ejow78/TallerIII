import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_META = {
  ingresado: {
    label: "Ingresado",
    colorClass: "bg-sky-500/10 text-sky-400 border-sky-500/25",
    badge: "outline",
  },
  diagnostico: {
    label: "En Diagnóstico",
    colorClass: "bg-purple-500/10 text-purple-400 border-purple-500/25",
    badge: "outline",
  },
  presupuestado: {
    label: "Presupuestado",
    colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    badge: "outline",
  },
  en_reparacion: {
    label: "En Reparación",
    colorClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
    badge: "outline",
  },
  reparacion: {
    label: "En Reparación",
    colorClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
    badge: "outline",
  },
  listo: {
    label: "Listo",
    colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    badge: "outline",
  },
  entregado: {
    label: "Entregado",
    colorClass: "bg-muted text-muted-foreground border-border",
    badge: "outline",
  },
  rechazado: {
    label: "Rechazado",
    colorClass: "bg-red-500/10 text-red-400 border-red-500/25",
    badge: "outline",
  },
};

export default function RecentOrdersCard({ orders }) {
  return (
    <Card className="lg:col-span-2 bg-card/25 border-border/80 shadow-sm min-w-0 overflow-hidden">
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
                          <span
                            className={`text-[10px] uppercase font-bold py-0.5 px-2.5 rounded-md border inline-block ${
                              stMeta.colorClass || "bg-secondary text-secondary-foreground border-border"
                            }`}
                          >
                            {stMeta.label}
                          </span>
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
  );
}

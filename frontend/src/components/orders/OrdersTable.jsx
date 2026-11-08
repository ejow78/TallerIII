import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Eye,
  MessageCircle,
  Printer,
  Pencil,
  ShoppingCart,
  Trash2,
  Stethoscope,
} from "lucide-react";
import OrderStatusDropdown from "./OrderStatusDropdown";
import { cn } from "@/lib/utils";

export default function OrdersTable({
  orders,
  loading,
  canUsePOS,
  isTechnician,
  onStatusChange,
  onOpenDetailModal,
  onOpenDiagModal,
  onOpenEditReceptionModal,
  onOpenChargePosModal,
  onDeleteOrder,
  onPrintOrder,
  onSendWhatsApp,
  getPublicTrackingUrl,
}) {
  if (loading) {
    return (
      <div className="text-center py-16 text-xs text-muted-foreground font-light">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Cargando órdenes de servicio...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-xs text-muted-foreground leading-normal font-light">
          No se encontraron órdenes de servicio con ese criterio.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista Móvil (< md): Tarjetas operativas */}
      <div className="space-y-3 md:hidden">
        {orders.map((o) => {
          const client = o.clientId || {};
          const hasDiag = !!o.diagnosis;
          const hasBudget =
            o.budget && Array.isArray(o.budget.items) && o.budget.items.length > 0;
          const totalB = hasBudget ? o.budget.items.reduce((s, i) => s + (Number(i.price) || 0), 0) : 0;

          return (
            <div
              key={o._id}
              className="rounded-xl border border-border/70 bg-background/50 p-3 sm:p-3.5 space-y-3 text-left overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenDetailModal(o)}
                    className="font-mono text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{o.trackingCode}</span>
                  </button>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleDateString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : o.date || ""}
                    {o.created_at || o.time
                      ? ` • ${
                          o.created_at
                            ? new Date(o.created_at).toLocaleTimeString("es-AR", {
                                timeZone: "America/Argentina/Buenos_Aires",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : o.time
                        } hs`
                      : ""}
                  </div>
                </div>
                <div className="shrink-0">
                  <OrderStatusDropdown
                    orderId={o._id}
                    currentStatus={o.status}
                    onStatusChange={onStatusChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                    Equipo
                  </span>
                  <span className="font-semibold text-foreground block leading-snug">
                    {o.deviceModel}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{o.deviceType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                    Cliente
                  </span>
                  <span className="font-semibold text-foreground block leading-snug">
                    {client.name || "N/A"}
                  </span>
                  {client.dni && (
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      DNI: {client.dni}
                    </span>
                  )}
                </div>
              </div>

              {(hasDiag || hasBudget) && (
                <div className="rounded-lg bg-card/60 border border-border/40 p-2.5 space-y-1 text-xs">
                  {hasDiag && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                      <strong className="text-foreground">Diag:</strong> {o.diagnosis}
                    </p>
                  )}
                  {hasBudget && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ${totalB.toLocaleString("es-AR")}
                      </span>
                      {o.budget?.approved ? (
                        <Badge className="text-[9px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold px-1.5 py-0">
                          Aprobado ✓
                        </Badge>
                      ) : o.budget?.rejected ? (
                        <Badge className="text-[9px] bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold px-1.5 py-0">
                          Rechazado ✕
                        </Badge>
                      ) : (
                        <Badge className="text-[9px] bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold px-1.5 py-0">
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1 pt-1 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenDiagModal(o)}
                  disabled={Boolean(o.budget?.approved)}
                  className={cn(
                    "flex-1 min-w-0 h-7 sm:h-8 px-2 text-[11px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1",
                    o.budget?.approved
                      ? "opacity-50 cursor-not-allowed border-border text-muted-foreground"
                      : "border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                  )}
                  title={o.budget?.approved ? "Presupuesto ya aprobado por el cliente" : "Cargar o editar diagnóstico y presupuesto"}
                >
                  <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{o.budget?.approved ? "Aprobado" : "Diagnóstico"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onOpenDetailModal(o)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer shrink-0"
                  title="Ver detalle completo de la orden"
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onSendWhatsApp(o)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 rounded-lg cursor-pointer shrink-0"
                  title="Enviar enlace de seguimiento por WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onPrintOrder(o)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer shrink-0"
                  title="Imprimir Comprobante"
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onOpenEditReceptionModal(o)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer shrink-0"
                  title="Editar recepción"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                {canUsePOS && (
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={!(totalB > 0 && o.status === "listo")}
                    onClick={() => onOpenChargePosModal(o)}
                    className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 disabled:opacity-20 disabled:pointer-events-none rounded-lg cursor-pointer shrink-0"
                    title={
                      totalB > 0 && o.status === "listo"
                        ? "Cobrar orden en Caja POS y marcar entregado"
                        : "Disponible cuando la orden esté en estado Listo y tenga presupuesto mayor a $0"
                    }
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                )}
                {!isTechnician && (
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onDeleteOrder(o)}
                    className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10 border-destructive/30 rounded-lg cursor-pointer shrink-0"
                    title="Eliminar orden"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista Escritorio (>= md): Tabla completa */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-2.5">N° de Orden</th>
              <th className="py-3 px-2.5">Cliente</th>
              <th className="py-3 px-2.5">Dispositivo</th>
              <th className="py-3 px-2.5">Diagnóstico / Presupuesto</th>
              <th className="py-3 px-2.5">Estado</th>
              <th className="py-3 px-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const client = o.clientId || {};
              const hasDiag = !!o.diagnosis;
              const hasBudget =
                o.budget && Array.isArray(o.budget.items) && o.budget.items.length > 0;
              const totalB = hasBudget ? o.budget.items.reduce((s, i) => s + (Number(i.price) || 0), 0) : 0;

              return (
                <tr
                  key={o._id}
                  className="border-b border-border/40 hover:bg-card/40 transition-colors"
                >
                  <td className="py-3.5 px-2.5">
                    <div className="font-mono font-bold text-primary flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenDetailModal(o)}
                        className="hover:underline cursor-pointer"
                        title="Ver ficha completa de la orden"
                      >
                        {o.trackingCode}
                      </button>
                      <a
                        href={getPublicTrackingUrl(o.trackingCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Abrir seguimiento público en pestaña nueva"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5 whitespace-nowrap">
                      <span>
                        {o.created_at
                          ? new Date(o.created_at).toLocaleDateString("es-AR", {
                              timeZone: "America/Argentina/Buenos_Aires",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : o.date || ""}
                      </span>
                      {(o.created_at || o.time) && (
                        <>
                          <span className="opacity-40">•</span>
                          <span>
                            {o.created_at
                              ? new Date(o.created_at).toLocaleTimeString("es-AR", {
                                  timeZone: "America/Argentina/Buenos_Aires",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                              : o.time}{" "}
                            hs
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5">
                    <span className="font-semibold text-foreground block">
                      {client.name || "N/A"}
                    </span>
                    <div className="flex flex-col text-[10px] text-muted-foreground font-mono">
                      {client.dni && <span>DNI: {client.dni}</span>}
                      {client.phone && <span>Tel: {client.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5">
                    <span className="font-semibold text-foreground block">
                      {o.deviceModel}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{o.deviceType}</span>
                  </td>
                  <td className="py-3.5 px-2.5 max-w-[230px]">
                    <div className="space-y-1">
                      {hasDiag ? (
                        <span
                          className="font-medium text-foreground truncate block"
                          title={o.diagnosis}
                        >
                          {o.diagnosis}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/60 italic block">
                          Sin diagnóstico cargado
                        </span>
                      )}

                      {hasBudget && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[11px] font-mono font-bold text-emerald-400">
                            ${totalB.toLocaleString("es-AR")}
                          </span>
                          {o.budget?.approved ? (
                            <Badge className="text-[9px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold px-1.5 py-0">
                              Aprobado ✓
                            </Badge>
                          ) : o.budget?.rejected ? (
                            <Badge className="text-[9px] bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold px-1.5 py-0">
                              Rechazado ✕
                            </Badge>
                          ) : (
                            <Badge className="text-[9px] bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold px-1.5 py-0">
                              Pendiente
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5">
                    <OrderStatusDropdown
                      orderId={o._id}
                      currentStatus={o.status}
                      onStatusChange={onStatusChange}
                    />
                  </td>
                  <td className="py-3.5 px-2.5 text-right">
                    <div className="inline-flex items-center justify-start gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDiagModal(o)}
                        className="h-8 px-2.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                        title="Cargar o editar diagnóstico y presupuesto"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        Diagnóstico
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onOpenDetailModal(o)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer shrink-0"
                        title="Ver detalle completo de la orden"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onSendWhatsApp(o)}
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-lg cursor-pointer shrink-0"
                        title="Enviar link de seguimiento por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPrintOrder(o)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer shrink-0"
                        title="Imprimir Comprobante de Recepción"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onOpenEditReceptionModal(o)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer shrink-0"
                        title="Editar datos de recepción"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      {canUsePOS && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={!(totalB > 0 && o.status === "listo")}
                          onClick={() => onOpenChargePosModal(o)}
                          className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-20 disabled:pointer-events-none rounded-lg cursor-pointer shrink-0"
                          title={
                            totalB > 0 && o.status === "listo"
                              ? "Cobrar presupuesto en Caja POS y marcar entregado"
                              : "Disponible cuando la orden esté en estado Listo y tenga presupuesto mayor a $0"
                          }
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      )}

                      {!isTechnician && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDeleteOrder(o)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer shrink-0"
                          title="Eliminar orden"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
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

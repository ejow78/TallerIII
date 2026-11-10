import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  User,
  Smartphone,
  Pencil,
  Stethoscope,
  History,
  MessageCircle,
  Printer,
  QrCode,
  ShoppingCart,
  Trash2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import OrderStatusDropdown from "./OrderStatusDropdown";

export default function OrderDetailModal({
  order,
  canUsePOS,
  isTechnician,
  onClose,
  onStatusChange,
  onOpenEditReceptionModal,
  onOpenDiagModal,
  onOpenChargePosModal,
  onSendWhatsApp,
  onPrintOrder,
  onPrintDeviceLabel,
  onDeleteOrder,
  getPublicTrackingUrl,
}) {
  if (!order) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/80 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Cabecera del Modal */}
        <CardHeader className="border-b border-border/70 p-4 sm:p-5 flex flex-row items-start justify-between gap-3 shrink-0 bg-muted/15">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-black text-primary">
                #{order.trackingCode}
              </span>
              <OrderStatusDropdown
                orderId={order._id}
                currentStatus={order.status}
                onStatusChange={onStatusChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresado el{" "}
              <strong className="text-foreground">
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : order.date || "N/A"}
              </strong>
              {order.created_at || order.time
                ? ` a las ${
                    order.created_at
                      ? new Date(order.created_at).toLocaleTimeString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : order.time
                  } hs`
                : ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Cuerpo Scrolleable */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-left text-xs flex-1">
          {/* Bloque 1: Cliente + Equipo en grilla */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Datos del Cliente */}
            <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Datos del Cliente
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {order.clientId?.name || "Cliente sin especificar"}
                </p>
                <p className="text-muted-foreground font-mono text-[11px]">
                  DNI: <strong className="text-foreground">{order.clientId?.dni || "N/A"}</strong>
                </p>
                <p className="text-muted-foreground font-mono text-[11px]">
                  Tel: <strong className="text-foreground">{order.clientId?.phone || "N/A"}</strong>
                </p>
                {order.clientId?.email && (
                  <p className="text-muted-foreground text-[11px] truncate">
                    Email: <strong className="text-foreground">{order.clientId.email}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Datos del Dispositivo */}
            <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Equipo Recibido
                </span>
                {(order.status || "").toLowerCase().trim() === "ingresado" && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenEditReceptionModal(order);
                    }}
                    className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    Editar Recepción
                  </button>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {order.deviceModel || "Sin modelo"}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Categoría: <strong className="text-foreground">{order.deviceType || "N/A"}</strong>
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Accesorios:{" "}
                  <strong className="text-foreground">{order.accessories || "Ninguno"}</strong>
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Estética:{" "}
                  <strong className="text-foreground">
                    {order.cosmetic || "Sin detalles"}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Bloque 2: Falla Reportada */}
          <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Falla Declarada en Recepción
            </span>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {order.issue || "Sin descripción de falla."}
            </p>
          </div>

          {/* Bloque 3: Diagnóstico y Presupuesto */}
          <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                Diagnóstico Técnico y Presupuesto
              </span>
              {order.budget?.approved ? (
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  Presupuesto Aprobado ✓
                </Badge>
              ) : order.budget?.rejected ? (
                <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px] font-bold">
                  Presupuesto Rechazado ✕
                </Badge>
              ) : order.budget?.items?.length > 0 ? (
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-semibold">
                  Pendiente de Aprobación
                </Badge>
              ) : null}
            </div>

            {order.diagnosis ? (
              <p className="text-foreground leading-relaxed whitespace-pre-wrap bg-card/70 p-2.5 rounded-lg border border-border/50">
                {order.diagnosis}
              </p>
            ) : (
              <p className="text-muted-foreground italic text-[11px]">
                Todavía no se registró un diagnóstico técnico para esta orden.
              </p>
            )}

            {order.budget?.items?.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="divide-y divide-border/40 border border-border/60 rounded-lg overflow-hidden">
                  {order.budget.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 bg-card/40 text-xs"
                    >
                      <span className="text-foreground">{item.desc}</span>
                      <span className="font-mono font-semibold text-foreground">
                        ${Number(item.price || 0).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-[11px] font-bold uppercase text-primary">
                    Total Presupuestado
                  </span>
                  <span className="font-mono text-base font-black text-primary">
                    $
                    {order.budget.items
                      .reduce((s, i) => s + (Number(i.price) || 0), 0)
                      .toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bloque 4: Historial / Bitácora */}
          {Array.isArray(order.history) && order.history.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-primary" />
                Historial de Movimientos
              </span>
              <div className="space-y-2 pl-2 border-l-2 border-primary/30">
                {order.history.map((h, idx) => (
                  <div key={idx} className="text-[11px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                    <span className="text-foreground font-medium">{h.text || "Cambio de estado"}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal con Acciones Rápidas */}
        <div className="border-t border-border/70 p-3.5 sm:p-4 bg-muted/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSendWhatsApp(order)}
              className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPrintOrder(order)}
              className="h-8 text-xs font-semibold border-border rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPrintDeviceLabel?.(order)}
              className="h-8 text-xs font-semibold border-border rounded-lg flex items-center gap-1.5 cursor-pointer"
              title="Imprimir etiqueta con QR para pegar al equipo"
            >
              <QrCode className="w-3.5 h-3.5" />
              Etiqueta QR
            </Button>
            {canUsePOS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  !(
                    order.status === "listo" &&
                    (order.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) || 0) > 0
                  )
                }
                onClick={() => {
                  onClose();
                  onOpenChargePosModal(order);
                }}
                className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-25 disabled:pointer-events-none rounded-lg flex items-center gap-1.5 cursor-pointer"
                title={
                  order.status === "listo"
                    ? "Cobrar presupuesto en Caja POS y marcar entregado"
                    : "Disponible cuando la orden esté en estado Listo para retirar y tenga presupuesto mayor a $0"
                }
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Cobrar en Caja
              </Button>
            )}
            {!isTechnician && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeleteOrder(order)}
                className="h-8 text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs font-semibold border-border rounded-lg"
            >
              <a
                href={getPublicTrackingUrl(order.trackingCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Portal Público
              </a>
            </Button>
            {!order.budget?.approved ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenDiagModal(order);
                }}
                className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                {(order.status || "").toLowerCase().trim() === "diagnostico" || !order.diagnosis
                  ? "Agregar Diagnóstico"
                  : "Editar Diagnóstico"}
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled
                className="h-8 bg-muted text-muted-foreground border border-border/70 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
                title="El diagnóstico y presupuesto ya fue aprobado por el cliente (bloqueado para modificaciones)"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Presupuesto Aprobado
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

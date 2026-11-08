import { parseVenueAddress } from '@/utils/venueHelper';
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { api } from "@/services/api";
import { escapeHtml, printHtml } from "@/utils/printHelper";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Store,
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Stethoscope, 
  Laptop, 
  Smartphone,
  Tablet,
  Cpu,
  AlertCircle,
  ShieldCheck,
  Download,
  Phone,
  ExternalLink
} from "lucide-react";

// Lista de estados en orden secuencial
const STEPS = [
  { key: "ingresado", label: "Ingresado" },
  { key: "diagnostico", label: "En Diagnóstico" },
  { key: "presupuestado", label: "Presupuestado" },
  { key: "reparacion", label: "En Reparación" },
  { key: "listo", label: "Listo para Entregar" },
  { key: "entregado", label: "Entregado" }
];

export default function TrackingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [dniInput, setDniInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await api.orders.track(id);
      setOrder(data);
    } catch (error) {
      console.error(error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = id ? `RepairIT - Seguimiento ${id}` : "RepairIT - Seguimiento de Orden";
    if (id) {
      loadOrder();
    }
  }, [id]);

  // Descargar / Imprimir Ficha PDF
  const handleDownloadPdf = () => {
    if (!order) return;

    const clientName = escapeHtml(order.clientId?.name || "Cliente");
    const venueName = escapeHtml(order.venueId?.name || "Taller RepairIT");
    const parsedPdfVenue = parseVenueAddress(order.venueId?.address);
    const venueAddress = escapeHtml(parsedPdfVenue.address || "Sucursal Central");
    const venueHours = escapeHtml(parsedPdfVenue.hours || "");
    const safeTrackingCode = escapeHtml(order.trackingCode || "");
    const safeStatus = escapeHtml((order.status || "INGRESADO").replace("_", " "));
    const safeDate = escapeHtml(
      order.created_at
        ? `${new Date(order.created_at).toLocaleDateString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })} ${new Date(order.created_at).toLocaleTimeString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })} hs`
        : order.date ||
            new Date().toLocaleDateString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
    );
    const safeDeviceType = escapeHtml(order.deviceType || "");
    const safeDeviceModel = escapeHtml(order.deviceModel || "");
    const safeIssue = escapeHtml(order.issue || "Sin especificar");
    const safeDiagnosis = order.diagnosis ? escapeHtml(order.diagnosis) : "";
    const budgetTotal = order.budget?.items ? order.budget.items.reduce((s, i) => s + (Number(i.price) || 0), 0) : 0;
    const rawTrackingUrl = `https://tracking.repairit.cloud/seguimiento/${encodeURIComponent(order.trackingCode || "")}`;
    const trackingUrl = escapeHtml(rawTrackingUrl);

    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Ficha de Servicio - #${safeTrackingCode}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            * { box-sizing: border-box; }
            body {
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              font-size: 11px;
              line-height: 1.4;
              margin: 0;
              padding: 10px;
              background: #ffffff;
            }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 15px; }
            .logo { font-size: 22px; font-weight: 900; color: #0f172a; }
            .logo-sub { font-size: 10px; color: #64748b; }
            .badge { background: #0284c7; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 11px; text-transform: uppercase; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
            .box { background: #ffffff; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; }
            .title { font-size: 9px; text-transform: uppercase; color: #0284c7; font-weight: 800; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
            .val { font-size: 12px; font-weight: 600; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { text-align: left; background: #f1f5f9; padding: 6px 8px; font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
            td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
            .total { font-size: 14px; font-weight: 900; color: #0284c7; text-align: right; margin-top: 10px; }
            .footer { margin-top: 25px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Repair<span style="color: #0284c7;">IT</span></div>
              <div class="logo-sub">Comprobante Oficial de Servicio Técnico</div>
              <div style="font-size: 10px; color: #334155; margin-top: 2px;">${venueName} &bull; ${venueAddress}${venueHours ? ` &bull; Horarios: ${venueHours}` : ""}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">${safeStatus}</span>
              <div style="font-size: 15px; font-weight: 900; font-family: monospace; color: #0284c7; margin-top: 4px;">#${safeTrackingCode}</div>
              <div style="font-size: 9px; color: #64748b;">Fecha: ${safeDate}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="box">
              <div class="title">Datos del Cliente</div>
              <div class="val">${clientName}</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Orden registrada #${safeTrackingCode}</div>
            </div>
            <div class="box" style="display: flex; align-items: center; gap: 10px; background: #f8fafc;">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=0&data=${encodeURIComponent(rawTrackingUrl)}" 
                alt="QR Seguimiento" 
                style="width: 60px; height: 60px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; background: #fff;"
              />
              <div>
                <div style="font-size: 10px; font-weight: 700; color: #0284c7;">Seguimiento Online en Vivo</div>
                <div style="font-size: 9px; color: #475569;">Escaneá para consultar avances en tiempo real.</div>
              </div>
            </div>
          </div>

          <div class="box" style="margin-bottom: 12px;">
            <div class="title">Dispositivo &amp; Falla Declarada</div>
            <div class="val" style="margin-bottom: 4px;">${safeDeviceType} - ${safeDeviceModel}</div>
            <div style="font-size: 11px; color: #334155;"><strong>Falla reportada:</strong> ${safeIssue}</div>
            ${safeDiagnosis ? `<div style="font-size: 11px; color: #0f172a; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0;"><strong>Diagnóstico del Taller:</strong> ${safeDiagnosis}</div>` : ""}
          </div>

          ${order.budget?.items?.length ? `
            <div class="box" style="margin-bottom: 12px;">
              <div class="title">Presupuesto Detallado</div>
              <table>
                <thead>
                  <tr>
                    <th>Concepto / Repuesto</th>
                    <th style="text-align: right; width: 120px;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.budget.items.map(item => `
                    <tr>
                      <td>${escapeHtml(item.desc)}</td>
                      <td style="text-align: right; font-weight: 600;">$${Number(item.price || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <div class="total">Total Presupuestado: $${budgetTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</div>
            </div>
          ` : ""}

          <div class="footer">
            Documento emitido electrónicamente por RepairIT Cloud &bull; ${trackingUrl}
          </div>
        </body>
      </html>
    `;
    printHtml(html);
  };

  // Aprobación online del presupuesto con validación de DNI
  const handleApproveBudget = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!order) return;

    const hasClientDni = Boolean(order.hasClientDni ?? order.clientId?.dni ?? order.client?.dni ?? true);
    if (hasClientDni && !dniInput.trim()) {
      toast.error("Validación requerida", {
        description: "Por favor, ingresá tu número de DNI para confirmar la aprobación."
      });
      return;
    }

    try {
      setApproving(true);
      await api.orders.approveBudget(order.trackingCode, dniInput.trim());
      toast.success("¡Presupuesto Aprobado!", {
        description: "El taller técnico ha sido notificado y comenzará las tareas de reparación."
      });
      setIsDialogOpen(false);
      setDniInput("");
      loadOrder();
    } catch (error) {
      toast.error("No se pudo aprobar el presupuesto", {
        description: error.message || "Verificá que el DNI ingresado sea el correcto."
      });
    } finally {
      setApproving(false);
    }
  };

  // Obtener el índice del estado actual
  const statusKey = (order?.status || "").toLowerCase().trim();
  const foundIndex = order 
    ? STEPS.findIndex(s => s.key === statusKey || (s.key === "reparacion" && statusKey === "en_reparacion")) 
    : 0;
  const currentStepIndex = foundIndex >= 0 ? foundIndex : 0;
  const isEntregado = statusKey === "entregado";

  // Ícono dinámico del dispositivo
  const getDeviceIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("celular") || t.includes("smartphone") || t.includes("teléfono") || t.includes("telefono") || t.includes("iphone") || t.includes("samsung")) {
      return Smartphone;
    }
    if (t.includes("tablet") || t.includes("ipad")) {
      return Tablet;
    }
    if (t.includes("notebook") || t.includes("laptop") || t.includes("macbook") || t.includes("pc") || t.includes("computadora")) {
      return Laptop;
    }
    return Cpu;
  };

  // Renderizador de Skeleton de carga
  if (loading) {
    return (
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-60 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-outfit text-xl font-bold text-foreground">Orden no encontrada</h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            No se encontró información para el código <span className="font-mono font-bold text-foreground">"{id}"</span>. Comprobá el código o consultá a tu taller.
          </p>
        </div>
        <Button asChild variant="outline" className="text-xs font-bold rounded-xl px-5 h-9">
          <Link to="/consulta">Ver otro seguimiento</Link>
        </Button>
      </div>
    );
  }

  const clientName = order.clientId?.name || "Cliente";
  const DeviceIcon = getDeviceIcon(order.deviceType);
  const parsedVenue = parseVenueAddress(order.venueId?.address);
  const venueName = order.venueId?.name || "Taller RepairIT";
  const venuePhone = order.venueId?.phone;

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">

      {/* Botón superior de retorno */}
      <div className="flex items-center justify-between">
        <Link
          to="/consulta"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al portal de consulta
        </Link>
      </div>

      {/* BENTO HERO: Tarjeta Principal del Dispositivo y Estados */}
      <Card className="bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
        
        {/* Fila Superior: Datos de la orden y estado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
              <DeviceIcon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              {/* Código de Orden limpio sin píldora */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground tracking-wider uppercase">
                  Orden #{order.trackingCode}
                </span>
                {order.created_at && (
                  <>
                    <span className="text-muted-foreground/40 text-xs">&bull;</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Ingresado {new Date(order.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-outfit text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {order.deviceType} {order.deviceModel}
              </h1>
              <p className="text-xs text-muted-foreground font-light">
                Titular: <span className="font-medium text-foreground">{clientName}</span>
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-bold px-3.5 py-1.5 uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm",
                isEntregado
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-primary/10 text-primary border-primary/30"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                isEntregado ? "bg-emerald-400" : "bg-primary animate-pulse"
              )} />
              {STEPS[currentStepIndex]?.label || order.status}
            </Badge>
          </div>
        </div>

        {/* Estados del Servicio limpios y horizontales (sin barras de progreso ni cajas pesadas) */}
        <div className="pt-1">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2">
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all",
                      isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md font-black scale-105"
                        : isDone
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground/40 border border-border/40"
                    )}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] mt-2 leading-tight transition-colors",
                      isCurrent
                        ? "font-bold text-primary"
                        : isDone
                          ? "font-medium text-foreground/90"
                          : "font-light text-muted-foreground/60"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </Card>

      {/* GRID BENTO PRINCIPAL (2 Columnas en Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* COLUMNA IZQUIERDA (2/3): Informe Técnico e Historial */}
        <div className="md:col-span-2 space-y-6">

          {/* BENTO CARD: Informe Técnico y Revisión */}
          <Card className="bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Servicio Técnico
                </span>
                <h3 className="font-outfit text-sm font-bold text-foreground leading-tight">
                  Informe & Diagnóstico
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* Falla Reportada */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Falla Declarada en Recepción
                </span>
                <div className="bg-muted/20 p-3.5 rounded-xl border border-border/40 text-xs text-foreground/90 font-light leading-relaxed">
                  {order.issue || "Sin falla declarada al momento del ingreso."}
                </div>
              </div>

              {/* Diagnóstico del Especialista */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" /> Diagnóstico del Técnico Especialista
                </span>
                {order.diagnosis ? (
                  <div className="bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/20 text-xs text-foreground font-light leading-relaxed">
                    {order.diagnosis}
                  </div>
                ) : (
                  <div className="bg-muted/15 p-3.5 rounded-xl border border-border/40 text-xs text-muted-foreground font-light italic flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                    <span>El dispositivo se encuentra en evaluación diagnóstica en el laboratorio técnico.</span>
                  </div>
                )}
              </div>

              {/* Accesorios y Estado Estético si existen */}
              {(order.accessories || order.cosmeticCondition) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40 text-xs">
                  {order.accessories && (
                    <div className="bg-muted/20 p-2.5 rounded-xl border border-border/40">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Accesorios Recibidos
                      </span>
                      <span className="text-foreground font-medium text-xs mt-0.5 block">{order.accessories}</span>
                    </div>
                  )}
                  {order.cosmeticCondition && (
                    <div className="bg-muted/20 p-2.5 rounded-xl border border-border/40">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Estado Estético
                      </span>
                      <span className="text-foreground font-medium text-xs mt-0.5 block">{order.cosmeticCondition}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* BENTO CARD: Historial de Movimientos */}
          <Card className="bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Trazabilidad
                </span>
                <h3 className="font-outfit text-sm font-bold text-foreground leading-tight">
                  Historial de Movimientos
                </h3>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {Array.isArray(order.history) && order.history.length > 0 ? (
                order.history.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 text-xs border-b border-border/30 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-[11px] font-semibold text-muted-foreground shrink-0 bg-muted/30 px-2 py-0.5 rounded border border-border/30 w-fit">
                      {log.date}
                    </span>
                    <p className="text-foreground/90 font-light leading-relaxed">
                      {log.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground font-light">Sin registros de movimientos.</p>
              )}
            </div>
          </Card>

        </div>

        {/* COLUMNA DERECHA (1/3): Presupuesto y Taller Responsable */}
        <div className="space-y-6">

          {/* BENTO CARD: Presupuesto Oficial, Aprobación y Descarga Integrada */}
          <Card className="bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Cotización
                  </span>
                  <h3 className="font-outfit text-sm font-bold text-foreground leading-tight">
                    Presupuesto Oficial
                  </h3>
                </div>
              </div>

              {order.budget && order.budget.items?.length > 0 ? (
                <div className="space-y-4 pt-3">
                  <div className="space-y-2">
                    {order.budget.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs border-b border-border/30 pb-2 last:border-0 last:pb-0">
                        <span className="text-foreground/80 font-light pr-2 leading-tight">{item.desc}</span>
                        <span className="font-mono font-bold text-primary shrink-0">
                          ${Number(item.price || 0).toLocaleString("es-AR")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-border/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                    <span className="text-xl font-black font-outfit text-primary font-mono">
                      ${order.budget.items.reduce((s, i) => s + (Number(i.price) || 0), 0).toLocaleString("es-AR")}
                    </span>
                  </div>

                  {order.budget.approved ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                      <div>
                        <div className="leading-tight">Presupuesto Aprobado</div>
                        <div className="text-[10px] font-normal text-emerald-400/80">Orden autorizada para reparación.</div>
                      </div>
                    </div>
                  ) : (
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 rounded-xl shadow-md cursor-pointer mt-1">
                          <ShieldCheck className="w-4 h-4 mr-1.5" />
                          Aprobar Presupuesto Online
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border shadow-2xl max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Aprobación de Presupuesto
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground text-xs font-light space-y-1">
                            <span>Autorizás la realización del servicio técnico por un total de <strong className="text-foreground font-bold">${order.budget.items.reduce((s, i) => s + (Number(i.price) || 0), 0).toLocaleString("es-AR")}</strong>.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="space-y-2 py-2 border-y border-border/40 my-2">
                          <label className="text-xs font-semibold text-foreground block">
                            Confirmación de identidad (DNI del titular):
                          </label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ingresá tu DNI sin puntos..."
                            value={dniInput}
                            onChange={(e) => setDniInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleApproveBudget(); }}
                            className="bg-background/80 border-border text-xs h-9 font-mono"
                          />
                          <p className="text-[11px] text-muted-foreground font-light">
                            Por seguridad, ingresá el número de DNI registrado en la orden para autorizar la reparación.
                          </p>
                        </div>

                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={approving} className="bg-background border-border text-foreground text-xs font-bold rounded-lg cursor-pointer">
                            Cancelar
                          </AlertDialogCancel>
                          <Button
                            onClick={handleApproveBudget}
                            disabled={approving}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg cursor-pointer"
                          >
                            {approving ? "Verificando..." : "Confirmar Aprobación"}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-muted-foreground font-light">
                    Presupuesto pendiente de evaluación por el equipo técnico.
                  </p>
                  <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">
                    En Evaluación
                  </Badge>
                </div>
              )}
            </div>

            {/* Acción de Descarga Integrada en el pie de la tarjeta */}
            <div className="pt-3 border-t border-border/40 mt-3">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 border-border/60 rounded-xl py-2.5 h-auto flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Descargar Comprobante PDF</span>
              </Button>
            </div>
          </Card>

          {/* BENTO CARD: Taller Responsable / Sucursal (Espacioso y con bloques individuales) */}
          <Card className="bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Taller Responsable
                </span>
                <h3 className="font-outfit text-sm font-bold text-foreground leading-tight">
                  {venueName}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {parsedVenue.address && (
                <div className="bg-muted/20 border border-border/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Dirección Física
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed pl-6">
                    {parsedVenue.address}
                  </p>
                  <div className="pl-6 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsedVenue.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold cursor-pointer"
                    >
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {parsedVenue.hours && (
                <div className="bg-muted/20 border border-border/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Horarios de Atención
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed pl-6">
                    {parsedVenue.hours}
                  </p>
                </div>
              )}

              {venuePhone && (
                <div className="bg-muted/20 border border-border/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Teléfono de Contacto
                    </span>
                  </div>
                  <div className="pl-6">
                    <a
                      href={`tel:${venuePhone.replace(/\s+/g, '')}`}
                      className="text-xs text-foreground/90 font-bold hover:text-primary transition-colors inline-block"
                    >
                      {venuePhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}

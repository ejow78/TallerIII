import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
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
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Stethoscope, 
  Laptop, 
  AlertCircle,
  ShieldCheck,
  Download
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
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("No se pudo abrir la ventana de impresión. Habilitá los pop-ups.");
      return;
    }

    const clientName = order.clientId?.name || "Cliente";
    const venueName = order.venueId?.name || "Taller RepairIT";
    const venueAddress = order.venueId?.address || "Sucursal Central";
    const budgetTotal = order.budget?.items ? order.budget.items.reduce((s, i) => s + (i.price || 0), 0) : 0;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ficha de Servicio - ${order.trackingCode}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .badge { background: #3b82f6; color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 14px; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            .title { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 5px; }
            .val { font-size: 15px; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { text-align: left; background: #f1f5f9; padding: 8px; font-size: 12px; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .total { font-size: 18px; font-weight: bold; color: #3b82f6; text-align: right; margin-top: 15px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">RepairIT</div>
              <div style="font-size: 12px; color: #64748b;">Comprobante de Servicio Técnico</div>
            </div>
            <div>
              <span class="badge">${(order.status || "INGRESADO").replace("_", " ")}</span>
              <div style="font-size: 14px; font-weight: bold; text-align: right; margin-top: 5px;">#${order.trackingCode}</div>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="title">Datos del Cliente</div>
              <div class="val">${clientName}</div>
            </div>
            <div class="box">
              <div class="title">Sucursal de Atención</div>
              <div class="val">${venueName}</div>
              <div style="font-size: 12px; color: #64748b;">${venueAddress}</div>
            </div>
          </div>

          <div class="box" style="margin-bottom: 20px;">
            <div class="title">Dispositivo & Falla Reportada</div>
            <div class="val" style="margin-bottom: 5px;">${order.deviceType} - ${order.deviceModel}</div>
            <div style="font-size: 13px; color: #334155;"><strong>Falla:</strong> ${order.issue || "Sin especificar"}</div>
            ${order.diagnosis ? `<div style="font-size: 13px; color: #334155; margin-top: 5px;"><strong>Diagnóstico Técnico:</strong> ${order.diagnosis}</div>` : ""}
          </div>

          ${order.budget?.items?.length ? `
            <div class="title">Presupuesto Detallado</div>
            <table>
              <thead>
                <tr>
                  <th>Concepto / Repuesto</th>
                  <th style="text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${order.budget.items.map(item => `
                  <tr>
                    <td>${item.desc}</td>
                    <td style="text-align: right;">$${Number(item.price).toLocaleString("es-AR")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <div class="total">Total: $${budgetTotal.toLocaleString("es-AR")}</div>
          ` : ""}

          <div class="footer">
            Documento generado digitalmente por RepairIT Cloud • https://tracking.repairit.cloud/seguimiento/${order.trackingCode}
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Aprobación online del presupuesto
  const handleApproveBudget = async () => {
    if (!order) return;

    try {
      const updated = await api.orders.approveBudget(order.trackingCode);
      toast.success("¡Presupuesto Aprobado!", {
        description: "El taller técnico iniciará las tareas de reparación."
      });
      if (updated) {
        setOrder(updated);
      } else {
        loadOrder();
      }
    } catch (error) {
      toast.error("Error al aprobar presupuesto", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  // Obtener el índice del estado actual
  const foundIndex = order ? STEPS.findIndex(s => s.key === order.status || (s.key === "reparacion" && order.status === "en_reparacion")) : 0;
  const currentStepIndex = foundIndex >= 0 ? foundIndex : 0;
  const progressPercent = order ? (currentStepIndex / (STEPS.length - 1)) * 100 : 0;

  // Renderizador de Skeleton de carga
  if (loading) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-6 animate-fade-in">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-outfit text-lg font-bold text-foreground">Orden no encontrada</h2>
          <p className="text-xs text-muted-foreground font-light">
            No se encontró información para el código <span className="font-mono font-bold text-foreground">"{id}"</span>.
          </p>
        </div>
        <Button asChild variant="outline" className="text-xs font-bold rounded-xl px-5 h-9">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    );
  }

  const clientName = order.clientId?.name || "Cliente";

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-5 py-8 space-y-6 animate-fade-in">

      {/* Botón de retorno simple */}
      <div>
        <a
          href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
        </a>
      </div>

      {/* Tarjeta Principal de Resumen del Dispositivo */}
      <Card className="bg-card/40 border-border/70 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider font-semibold">Orden #{order.trackingCode}</span>
              <h1 className="font-outfit text-xl font-bold text-foreground">
                {order.deviceType} {order.deviceModel}
              </h1>
            </div>
          </div>

          <Badge variant="outline" className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider self-start sm:self-auto rounded-lg">
            {STEPS[currentStepIndex]?.label || order.status}
          </Badge>
        </div>

        {/* Línea de Progreso Limpia */}
        <div className="pt-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-light">Progreso del servicio</span>
          </div>
          
          <Progress value={progressPercent} className="h-2 bg-muted [&>div]:bg-primary rounded-full" />

          {/* Pasos limpios horizontal */}
          <div className="hidden sm:flex justify-between pt-1 text-[11px]">
            {STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              return (
                <span key={step.key} className={`font-medium ${isDone ? "text-foreground font-semibold" : "text-muted-foreground/60"}`}>
                  {step.label}
                </span>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Grid de 2 Columnas: Detalle Técnico + Presupuesto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Columna Principal (2/3): Diagnóstico e Historial */}
        <div className="md:col-span-2 space-y-5">
          
          {/* Falla Reportada y Diagnóstico en 1 sola tarjeta limpia */}
          <Card className="bg-card/40 border-border/70 p-5 rounded-2xl shadow-sm space-y-4">
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Falla Reportada</span>
              <p className="text-xs text-foreground/90 font-light bg-muted/20 p-3 rounded-xl border border-border/40 leading-relaxed">
                {order.issue}
              </p>
            </div>

            {order.diagnosis && (
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" /> Diagnóstico del Técnico
                </span>
                <p className="text-xs text-foreground font-light bg-purple-500/5 p-3 rounded-xl border border-purple-500/20 leading-relaxed">
                  {order.diagnosis}
                </p>
              </div>
            )}

            <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-2">
              <span>Cliente: <strong className="text-foreground font-medium">{clientName}</strong></span>
              <span>&bull;</span>
              <span>Sede: <strong className="text-foreground font-medium">{order.venueId?.name || "Taller Central"}</strong></span>
            </div>
          </Card>

          {/* Historial Compacto */}
          <Card className="bg-card/40 border-border/70 p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Historial de Trazabilidad
            </h3>
            
            <div className="space-y-3 pt-1">
              {order.history.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs border-b border-border/30 pb-2 last:border-0 last:pb-0">
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0 mt-0.5">{log.date}</span>
                  <p className="text-foreground/90 font-light leading-snug">{log.text}</p>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Columna Derecha (1/3): Presupuesto y Aprobación */}
        <div className="space-y-5">
          <Card className="bg-card/40 border-border/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full space-y-4">
            
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/50 pb-2.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Presupuesto
              </h3>

              {order.budget ? (
                <div className="space-y-3.5">
                  <div className="space-y-2">
                    {order.budget.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs border-b border-border/30 pb-1.5">
                        <span className="text-foreground/80 font-light pr-2 leading-tight">{item.desc}</span>
                        <span className="font-mono font-bold text-primary shrink-0">${item.price.toLocaleString("es-AR")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Total</span>
                    <span className="text-lg font-black font-outfit text-primary font-mono">
                      ${order.budget.items.reduce((s, i) => s + i.price, 0).toLocaleString("es-AR")}
                    </span>
                  </div>

                  {order.budget.approved ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Presupuesto Aprobado</span>
                    </div>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 rounded-xl shadow-md cursor-pointer mt-1">
                          Aprobar Presupuesto
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-outfit text-base font-bold text-foreground">
                            ¿Aprobar Presupuesto de Reparación?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground text-xs font-light">
                            Autorizas la realización del servicio por un total de <strong className="text-foreground font-bold">${order.budget.items.reduce((s, i) => s + i.price, 0).toLocaleString("es-AR")}</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-background border-border text-foreground text-xs font-bold rounded-lg">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleApproveBudget} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg">
                            Confirmar Aprobación
                          </AlertDialogAction>
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

            <div className="pt-3 border-t border-border/40">
              <Button
                variant="ghost"
                onClick={handleDownloadPdf}
                className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 h-8 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Ficha PDF
              </Button>
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
}

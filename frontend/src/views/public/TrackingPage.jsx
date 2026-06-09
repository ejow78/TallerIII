import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

// Lista de estados en orden secuencial
const STEPS = [
  { key: "ingresado", label: "Ingresado", desc: "Equipo recibido" },
  { key: "diagnostico", label: "En Diagnóstico", desc: "Evaluando fallas" },
  { key: "presupuestado", label: "Presupuestado", desc: "Costo listo" },
  { key: "reparacion", label: "En Reparación", desc: "Técnico trabajando" },
  { key: "listo", label: "Listo para Entregar", desc: "Pruebas superadas" },
  { key: "entregado", label: "Entregado", desc: "Retirado por cliente" }
];

export default function TrackingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simular llamada a la API
    const timer = setTimeout(() => {
      if (id === "demo-id") {
        setOrder({
          id: "demo-id",
          nanoId: "RT-2026-ASUS",
          client: "Edgar Javier Ortiz",
          dni: "44375912",
          phone: "+54 381 1234567",
          email: "edgar.ortiz@gmail.com",
          device: "Notebook ASUS ROG Strix G15",
          serial: "SN-98218-ASUS",
          report: "Calentamiento excesivo (alcanza 95°C) y reinicios aleatorios durante sesiones de renderizado o juegos.",
          currentStatus: "listo", // Empezar en presupuestado para poder probar el flujo de aprobación
          dateIngress: "05/06/2026",
          budget: {
            items: [
              { desc: "Mantenimiento térmico preventivo (limpieza + cambio de pasta térmica Arctic MX-6)", price: 15000 },
              { desc: "Reemplazo de Cooler FAN original (lado izquierdo - fallando rodamientos)", price: 25000 }
            ],
            approved: false, // Iniciar sin aprobar para el testing interactivo
            dateApproved: null
          },
          history: [
            { date: "05/06/2026 10:30", text: "Equipo ingresado al sistema por recepción física." },
            { date: "06/06/2026 14:15", text: "Diagnóstico finalizado. Se detectó cooler izquierdo trabado y pasta térmica original cristalizada." }
          ]
        });
      } else {
        // Orden genérica para cualquier otro ID
        setOrder({
          id: id,
          nanoId: id.toUpperCase(),
          client: "Cliente Registrado",
          dni: "29.987.654",
          phone: "+54 381 4567890",
          email: "cliente.registrado@email.com",
          device: "Dispositivo Tecnológico Genérico",
          serial: "SN-PENDIENTE",
          report: "Diagnóstico inicial pendiente de revisión.",
          currentStatus: "diagnostico",
          dateIngress: "08/06/2026",
          budget: null,
          history: [
            { date: "08/06/2026 08:00", text: "Equipo ingresado. En espera de evaluación del departamento técnico." }
          ]
        });
      }
      setLoading(false);
    }, 1200); // Demora para visualizar el skeleton de carga

    return () => clearTimeout(timer);
  }, [id]);

  // Manejo de la aprobación del presupuesto en el cliente
  const handleApproveBudget = () => {
    if (!order) return;

    // Simular aprobación
    setOrder(prev => ({
      ...prev,
      currentStatus: "reparacion", // Pasa a reparación al aprobar
      budget: {
        ...prev.budget,
        approved: true,
        dateApproved: new Date().toLocaleDateString("es-AR")
      },
      history: [
        ...prev.history,
        {
          date: new Date().toLocaleString("es-AR"),
          text: "Presupuesto aprobado de forma online por el cliente. Inicio de trabajos técnicos autorizado."
        }
      ]
    }));

    toast.success("¡Presupuesto Aprobado!", {
      description: "El departamento técnico ha sido notificado para iniciar la reparación."
    });
  };

  // Obtener el índice del estado actual
  const currentStepIndex = order ? STEPS.findIndex(s => s.key === order.currentStatus) : 0;
  // Porcentaje del progreso (basado en el índice)
  const progressPercent = order ? (currentStepIndex / (STEPS.length - 1)) * 100 : 0;

  // Renderizador de Skeleton de carga
  if (loading) {
    return (
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        <div className="border-b border-border pb-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-96" />
          </div>
        </div>

        {/* Skeleton de la Línea de Tiempo */}
        <Skeleton className="h-28 w-full rounded-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[380px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">

      {/* Cabecera del Seguimiento */}
      <div className="border-b border-border pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              &larr; Volver
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Orden de Servicio</span>
          </div>
          <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
            Seguimiento de Equipo: <span className="text-muted-foreground">{order.nanoId}</span>
          </h1>
        </div>
      </div>

      {/* LINEA DE TIEMPO DEL ESTADO CON PROGRESS BAR DE SHADCN */}
      <Card className="bg-card/20 border-border p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="relative flex flex-col gap-8 w-full">

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 w-full">
            {/* Componente Progress nativo de shadcn - Centrado al píxel */}
            <div className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[12px] -translate-y-1/2 h-1 pointer-events-none z-0 hidden md:block">
              <Progress value={progressPercent} className="h-1 bg-border [&>div]:bg-primary" />
            </div>

            {STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex items-start md:flex-col md:items-center gap-4 md:gap-2.5 text-left md:text-center flex-1 w-full md:w-auto"
                >
                  {/* Línea vertical de conexión en móvil */}
                  {idx < STEPS.length - 1 && (
                    <div className="absolute left-[11px] top-[24px] bottom-[-32px] w-[2px] bg-border z-0 md:hidden">
                      <div className={`w-full bg-primary transition-all duration-300 ${idx < currentStepIndex ? "h-full" : "h-0"}`} />
                    </div>
                  )}

                  {/* Círculo indicador */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                      : isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                      }`}
                  >
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    ) : isCompleted ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </div>

                  {/* Etiquetas */}
                  <div className="space-y-0.5 pt-0.5 md:pt-0">
                    <span className={`text-xs font-bold block ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-light block leading-tight md:max-w-[125px] md:mx-auto">
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </Card>

      {/* DETALLES Y PRESUPUESTO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna Izquierda (2/3): Datos del Cliente, Equipo e Historial */}
        <div className="lg:col-span-2 space-y-8">

          {/* Datos del Cliente con Card de shadcn */}
          <Card className="bg-card/25 border-border shadow-md">
            <CardHeader className="border-b border-border/50 py-4">
              <CardTitle className="font-outfit text-base font-bold text-foreground">
                Datos del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                <div>
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">Cliente</span>
                  <span className="text-foreground text-sm mt-1 block font-medium">{order.client}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">DNI / Identificación</span>
                  <span className="text-foreground text-sm mt-1 block font-mono">{order.dni}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">Teléfono</span>
                  <span className="text-foreground text-sm mt-1 block">{order.phone}</span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">Email</span>
                  <span className="text-foreground text-sm mt-1 block">{order.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ficha Técnica con Card de shadcn */}
          <Card className="bg-card/25 border-border shadow-md">
            <CardHeader className="border-b border-border/50 py-4">
              <CardTitle className="font-outfit text-base font-bold text-foreground">
                Detalles del Dispositivo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">Dispositivo</span>
                  <span className="text-foreground text-sm mt-1 block font-medium">{order.device}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">Número de Serie</span>
                  <span className="text-foreground/90 text-sm mt-1 block font-mono font-bold">{order.serial}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block uppercase tracking-wider font-semibold">Falla Reportada</span>
                  <p className="text-foreground/90 text-sm mt-2 leading-relaxed font-light bg-background/50 p-3.5 rounded-lg border border-border/40">
                    {order.report}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Trazabilidad con Card de shadcn */}
          <Card className="bg-card/25 border-border shadow-md">
            <CardHeader className="border-b border-border/50 py-4">
              <CardTitle className="font-outfit text-base font-bold text-foreground">
                Historial del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                {order.history.map((log, index) => (
                  <div key={index} className="flex gap-4 relative z-10 text-xs">
                    <div className="w-[23px] h-[23px] rounded-full bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-mono font-medium block">{log.date}</span>
                      <p className="text-foreground/95 text-sm font-light leading-relaxed">{log.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Columna Derecha (1/3): Presupuesto y Acciones */}
        <div className="space-y-8">

          {/* Ficha de Presupuesto con Card de shadcn */}
          <Card className="bg-card/30 border-border p-6 shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-5">
              <h3 className="font-outfit text-lg font-bold text-foreground border-b border-border pb-2.5">
                Presupuesto del Servicio
              </h3>

              {order.budget ? (
                <div className="space-y-5">
                  {/* Desglose */}
                  <div className="space-y-3.5">
                    {order.budget.items.map((item, idx) => (
                      <div key={idx} className="text-xs space-y-1 border-b border-border/40 pb-2">
                        <p className="text-foreground/95 leading-relaxed font-light">{item.desc}</p>
                        <span className="text-primary font-bold block">${item.price.toLocaleString("es-AR")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-semibold uppercase">Total Estimado</span>
                    <span className="text-xl font-outfit font-extrabold text-foreground">
                      ${order.budget.items.reduce((sum, i) => sum + i.price, 0).toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Estado de Aprobación mediante Alert de shadcn */}
                  {order.budget.approved ? (
                    <Alert className="bg-emerald-950/20 border-emerald-500/25 text-emerald-400 p-3 shadow-sm">
                      <svg className="w-4 h-4 shrink-0 stroke-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <AlertTitle className="text-xs font-bold font-outfit ml-2">Aprobado</AlertTitle>
                      <AlertDescription className="text-[10px] opacity-90 ml-2">
                        Autorizado el {order.budget.dateApproved}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <Alert variant="destructive" className="bg-amber-950/20 border-amber-500/30 text-amber-400 p-3 shadow-sm">
                        <svg className="w-4 h-4 stroke-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <AlertTitle className="text-xs font-bold font-outfit ml-2">Espera de Aprobación</AlertTitle>
                        <AlertDescription className="text-[10px] opacity-90 ml-2">
                          Requiere autorización del cliente para iniciar tareas.
                        </AlertDescription>
                      </Alert>

                      {/* Modal de Confirmación AlertDialog para Aprobar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 rounded-lg transition-all active:scale-[0.99] cursor-pointer">
                            Aprobar Presupuesto
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-outfit text-lg font-bold text-foreground">
                              ¿Confirmar aprobación del presupuesto?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground text-xs font-light">
                              Al aprobar, autorizás al taller a realizar el recambio de cooler y mantenimiento térmico especificado por un total de <strong className="text-foreground font-bold">${order.budget.items.reduce((sum, i) => sum + i.price, 0).toLocaleString("es-AR")}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-background border-border text-foreground hover:bg-muted font-bold text-xs">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApproveBudget} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs">
                              Confirmar Aprobación
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    El técnico aún no ha cargado el presupuesto detallado de mano de obra y repuestos.
                  </p>
                  <Badge variant="secondary" className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                    Pendiente de Carga
                  </Badge>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="pt-4 border-t border-border mt-6">
              <Button
                variant="outline"
                onClick={() => toast.info("Módulo de exportación PDF disponible en la Fase VI.")}
                className="w-full bg-background hover:bg-muted text-foreground border-border text-xs font-bold py-2.5 rounded-lg transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Presupuesto (PDF)
              </Button>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}

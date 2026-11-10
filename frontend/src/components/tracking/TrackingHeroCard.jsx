import { Card } from "@/components/ui/card";
import { CheckCircle2, Laptop, Smartphone, Tablet, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "./usePublicTracking";

function DeviceIcon({ type = "", className = "w-6 h-6" }) {
  const t = (type || "").toLowerCase();
  if (
    t.includes("celular") ||
    t.includes("smartphone") ||
    t.includes("teléfono") ||
    t.includes("telefono") ||
    t.includes("iphone") ||
    t.includes("samsung")
  ) {
    return <Smartphone className={className} />;
  }
  if (t.includes("tablet") || t.includes("ipad")) {
    return <Tablet className={className} />;
  }
  if (
    t.includes("notebook") ||
    t.includes("laptop") ||
    t.includes("macbook") ||
    t.includes("pc") ||
    t.includes("computadora")
  ) {
    return <Laptop className={className} />;
  }
  return <Cpu className={className} />;
}

export function TrackingHeroCard({
  order,
  clientName,
  currentStepIndex = 0,
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
      {/* Fila Superior: Datos de la orden */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
            <DeviceIcon type={order?.deviceType} className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            {/* Código de Orden limpio sin píldora */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground tracking-wider uppercase">
                Orden #{order?.trackingCode}
              </span>
              {order?.created_at && (
                <>
                  <span className="text-muted-foreground/40 text-xs">&bull;</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    Ingresado{" "}
                    {new Date(order.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
            <h1 className="font-outfit text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {order?.deviceType} {order?.deviceModel}
            </h1>
            <p className="text-xs text-muted-foreground font-light">
              Titular:{" "}
              <span className="font-medium text-foreground">{clientName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Estados del Servicio limpios y horizontales */}
      <div className="pt-1">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2 items-start">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all shrink-0",
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
                    "text-[11px] mt-2 leading-tight transition-colors min-h-[26px] sm:min-h-0 flex items-start justify-center",
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
  );
}

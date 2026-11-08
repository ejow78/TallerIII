import { Card } from "@/components/ui/card";
import { Stethoscope, Clock } from "lucide-react";

export function TrackingDiagnosisSection({ order }) {
  if (!order) return null;

  return (
    <Card className="order-1 md:order-1 md:col-span-2 bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
      <div>
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

        <div className="space-y-4 pt-3">
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
                <span>
                  El dispositivo se encuentra en evaluación diagnóstica en el laboratorio técnico.
                </span>
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
                  <span className="text-foreground font-medium text-xs mt-0.5 block">
                    {order.accessories}
                  </span>
                </div>
              )}
              {order.cosmeticCondition && (
                <div className="bg-muted/20 p-2.5 rounded-xl border border-border/40">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Estado Estético
                  </span>
                  <span className="text-foreground font-medium text-xs mt-0.5 block">
                    {order.cosmeticCondition}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

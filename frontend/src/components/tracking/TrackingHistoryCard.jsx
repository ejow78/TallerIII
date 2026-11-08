import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function TrackingHistoryCard({ history = [] }) {
  const hasLogs = Array.isArray(history) && history.length > 0;

  return (
    <Card className="order-4 md:order-3 md:col-span-2 bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
      <div>
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

        <div className="space-y-3 pt-3">
          {hasLogs ? (
            history.map((log, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 text-xs border-b border-border/30 pb-2.5 last:border-0 last:pb-0 text-left"
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
            <p className="text-xs text-muted-foreground font-light text-left">
              Sin registros de movimientos.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

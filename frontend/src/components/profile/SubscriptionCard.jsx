import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function SubscriptionCard({
  subscriptionPlan,
  subscriptionStatus,
  onOpenPlansModal,
}) {
  const isActivo = subscriptionStatus === "activo";

  return (
    <Card className="bg-card/25 border-border p-6 shadow-sm space-y-4">
      <h3 className="font-outfit text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
        Suscripción
      </h3>

      <div className="space-y-3.5 text-xs font-light">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Plan Licenciado</span>
          <Badge className="bg-primary hover:bg-primary text-primary-foreground text-[10px] font-extrabold uppercase">
            {subscriptionPlan || "Taller Básico"}
          </Badge>
        </div>
        <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
          <span className="text-muted-foreground">Vencimiento</span>
          <span className="text-foreground font-mono font-medium">
            31/12/2026
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
          <span className="text-muted-foreground">Estado del Pago</span>
          <span
            className={
              isActivo
                ? "text-emerald-400 font-bold flex items-center gap-1.5"
                : "text-destructive font-bold flex items-center gap-1.5"
            }
          >
            <CheckCircle
              className={
                isActivo
                  ? "w-3.5 h-3.5 fill-emerald-400/10"
                  : "w-3.5 h-3.5 fill-destructive/10"
              }
            />
            {isActivo ? "Al Día" : "Inactivo"}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPlansModal}
          className="w-full text-[10px] font-bold uppercase border-border/80 hover:bg-card/50 transition-all cursor-pointer"
        >
          Ver / Cambiar Plan
        </Button>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { FileText, ShieldCheck } from "lucide-react";

export function TrackingBudgetSection({
  budget,
  isDemo = false,
  onResetDemo,
  isDialogOpen,
  setIsDialogOpen,
  dniInput,
  setDniInput,
  approving = false,
  onApproveBudget,
}) {
  const hasItems = budget && Array.isArray(budget.items) && budget.items.length > 0;
  const totalAmount = hasItems
    ? budget.items.reduce((s, i) => s + (Number(i.price) || 0), 0)
    : 0;

  return (
    <Card className="order-2 md:order-2 md:col-span-1 bg-card/50 backdrop-blur-md border-border/70 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
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

        {hasItems ? (
          <div className="space-y-4 pt-3">
            <div className="space-y-2">
              {budget.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start text-xs border-b border-border/30 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-foreground/80 font-light pr-2 leading-tight">
                    {item.desc}
                  </span>
                  <span className="font-mono font-bold text-primary shrink-0">
                    ${Number(item.price || 0).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-border/50">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Total
              </span>
              <span className="text-xl font-black font-outfit text-primary font-mono">
                ${totalAmount.toLocaleString("es-AR")}
              </span>
            </div>

            {budget.approved ? (
              <div className="space-y-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="leading-tight">Presupuesto Aprobado</div>
                    <div className="text-[10px] font-normal text-emerald-400/80">
                      Orden autorizada para reparación.
                    </div>
                  </div>
                </div>
                {isDemo && (
                  <button
                    onClick={onResetDemo}
                    type="button"
                    className="text-[10px] text-muted-foreground/80 hover:text-foreground underline w-full text-center py-0.5 transition-colors cursor-pointer"
                  >
                    Reiniciar simulación Demo
                  </button>
                )}
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
                      <span>
                        Autorizás la realización del servicio técnico por un total de{" "}
                        <strong className="text-foreground font-bold">
                          ${totalAmount.toLocaleString("es-AR")}
                        </strong>
                        .
                      </span>
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onApproveBudget();
                      }}
                      className="bg-background/80 border-border text-xs h-9 font-mono"
                    />
                    <p className="text-[11px] text-muted-foreground font-light">
                      Por seguridad, ingresá el número de DNI registrado en la orden para autorizar la reparación.
                    </p>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={approving}
                      className="bg-background border-border text-foreground text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <Button
                      onClick={onApproveBudget}
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
            <Badge
              variant="secondary"
              className="text-[9px] font-bold uppercase tracking-wider"
            >
              En Evaluación
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}

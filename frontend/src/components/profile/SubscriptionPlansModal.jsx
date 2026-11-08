import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionPlansModal({ isOpen, onClose, subscriptionPlan }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full p-6 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150 relative cursor-default"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="text-center space-y-1.5">
          <h3 className="font-outfit text-xl font-bold text-foreground">
            Planes de Suscripción RepairIT
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto font-light">
            Elija el plan que mejor se adapte al tamaño y necesidades de su taller de reparación técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Plan Básico */}
          <div
            className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all ${
              subscriptionPlan === "Taller Básico"
                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                : "border-border/60 bg-card/25"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Taller Básico
                </span>
                {subscriptionPlan === "Taller Básico" && (
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[8px] font-bold uppercase border border-primary/30">
                    Activo
                  </Badge>
                )}
              </div>
              <div>
                <span className="font-outfit text-2xl font-black text-foreground">
                  $7.500
                </span>
                <span className="text-[10px] text-muted-foreground font-light">
                  {" "}
                  ARS / mes
                </span>
              </div>
              <ul className="text-[11px] text-muted-foreground font-light space-y-2 border-t border-border/40 pt-3">
                <li className="flex items-center gap-2">✓ 1 Sucursal operativa</li>
                <li className="flex items-center gap-2">✓ Hasta 100 órdenes al mes</li>
                <li className="flex items-center gap-2">✓ Clientes, stock y comprobantes QR</li>
                <li className="flex items-center gap-2 text-muted-foreground/60">✕ Sin Control de Caja (POS)</li>
                <li className="flex items-center gap-2 text-muted-foreground/60">✕ Sin Métricas ni Gráficos</li>
              </ul>
            </div>
          </div>

          {/* Plan Taller Pro */}
          <div
            className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
              subscriptionPlan === "Taller Pro"
                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                : "border-border/60 bg-card/25"
            }`}
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black uppercase py-0.5 px-3 rounded-bl-lg tracking-wider">
              Popular
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Taller Pro
                </span>
                {subscriptionPlan === "Taller Pro" && (
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[8px] font-bold uppercase border border-primary/30">
                    Activo
                  </Badge>
                )}
              </div>
              <div>
                <span className="font-outfit text-2xl font-black text-foreground">
                  $14.900
                </span>
                <span className="text-[10px] text-muted-foreground font-light">
                  {" "}
                  ARS / mes
                </span>
              </div>
              <ul className="text-[11px] text-muted-foreground font-light space-y-2 border-t border-border/40 pt-3">
                <li className="flex items-center gap-2 text-primary font-bold">
                  ✓ Órdenes e inventario ilimitados
                </li>
                <li className="flex items-center gap-2 text-primary font-bold">
                  ✓ Control de Caja y Punto de Venta (POS)
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  ✓ Métricas y gráficos financieros
                </li>
                <li className="flex items-center gap-2">
                  ✓ Alertas de stock y exportación CSV
                </li>
                <li className="flex items-center gap-2">
                  ✓ 1 Sucursal operativa completa
                </li>
              </ul>
            </div>
          </div>

          {/* Plan Multi-Taller Pro */}
          <div
            className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all ${
              subscriptionPlan === "Multi-Taller Pro"
                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                : "border-border/60 bg-card/25"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Multi-Taller Pro
                </span>
                {subscriptionPlan === "Multi-Taller Pro" && (
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[8px] font-bold uppercase border border-primary/30">
                    Activo
                  </Badge>
                )}
              </div>
              <div>
                <span className="font-outfit text-2xl font-black text-foreground">
                  $29.900
                </span>
                <span className="text-[10px] text-muted-foreground font-light">
                  {" "}
                  ARS / mes
                </span>
              </div>
              <ul className="text-[11px] text-muted-foreground font-light space-y-2 border-t border-border/40 pt-3">
                <li className="flex items-center gap-2 text-primary font-bold">
                  ✓ Gestión de múltiples sucursales
                </li>
                <li className="flex items-center gap-2 text-primary font-bold">
                  ✓ Cuentas de acceso para técnicos
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  ✓ Incluye Caja POS y Métricas Pro
                </li>
                <li className="flex items-center gap-2">
                  ✓ Órdenes e inventario ilimitados
                </li>
                <li className="flex items-center gap-2">
                  ✓ Selector rápido de sede y soporte
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-border/40">
          <Button
            onClick={() => {
              onClose();
              toast.info("Contacto con Soporte", {
                description:
                  "Para cambiar su suscripción de taller, por favor comuníquese a soporte@repairit.cloud o con su asesor comercial.",
              });
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-6 rounded-lg cursor-pointer transition-all shadow-md shadow-primary/15"
          >
            Solicitar Cambio de Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Package, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function StockAlertsCard({ isBasicPlan, totalItemsCount, allAlertItems }) {
  return (
    <Card className="bg-card/25 border-border/80 shadow-sm flex flex-col min-w-0 overflow-hidden">
      <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-outfit text-base font-bold text-foreground/90">
            Críticos de Inventario
          </CardTitle>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Control de umbral de reposición
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-primary hover:text-primary font-semibold px-2"
        >
          <Link to="/dashboard/inventario">Inventario</Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-2.5 flex-1">
        {isBasicPlan ? (
          <div className="text-center py-8 flex flex-col items-center justify-center h-full space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1 max-w-[240px]">
              <p className="text-xs font-semibold text-foreground">
                Alertas de Stock Mínimo (Plan Pro)
              </p>
              <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                Tenés <strong className="text-foreground">{totalItemsCount} insumos</strong> en catálogo. Activá alertas automáticas de reposición actualizando a <strong className="text-primary font-semibold">Taller Pro</strong>.
              </p>
            </div>
          </div>
        ) : allAlertItems.length > 0 ? (
          allAlertItems.slice(0, 5).map((item) => {
            const isZeroStock = (item.quantity || 0) <= 0;
            return (
              <div
                key={item._id}
                className={`rounded-xl p-3.5 flex items-start gap-2.5 text-left border ${
                  isZeroStock
                    ? "bg-destructive/10 border-destructive/25 text-foreground"
                    : "bg-amber-500/10 border-amber-500/25 text-foreground"
                }`}
              >
                {isZeroStock ? (
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold font-outfit leading-snug text-foreground">
                      {item.name}
                    </span>
                    {isZeroStock ? (
                      <Badge
                        variant="destructive"
                        className="text-[9px] font-bold py-0.5 px-1.5 uppercase tracking-wider shrink-0 select-none whitespace-nowrap"
                      >
                        Stock: 0
                      </Badge>
                    ) : (
                      <span className="text-[9px] font-bold py-0.5 px-1.5 uppercase tracking-wider shrink-0 select-none whitespace-nowrap rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Stock: {item.quantity}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Mínimo sugerido: {item.minQuantity || item.min_quantity} u. •{" "}
                    {item.category || "General"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-foreground">Stock en niveles óptimos</p>
            <p className="text-[11px] text-muted-foreground font-light mt-1 max-w-[220px]">
              No hay repuestos ni insumos por debajo del stock mínimo en esta sucursal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Package, DollarSign, AlertCircle } from "lucide-react";

export function InventoryKpis({
  itemsCount = 0,
  totalValue = 0,
  criticalItems = 0,
  stockFilter = "todos",
  setStockFilter,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <Card className="bg-card/40 border-border/80 p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Total de Artículos
          </span>
          <span className="text-2xl font-outfit font-black text-foreground mt-0.5 block">
            {itemsCount}
          </span>
          <span className="text-[10px] text-muted-foreground font-light">
            Repuestos e insumos activos
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Package className="w-5 h-5" />
        </div>
      </Card>

      <Card className="bg-card/40 border-border/80 p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Valorización en Stock
          </span>
          <span className="text-2xl font-outfit font-black text-foreground font-mono mt-0.5 block">
            ${totalValue.toLocaleString("es-AR")}
          </span>
          <span className="text-[10px] text-muted-foreground font-light">
            Capital estimado en mercadería
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      </Card>

      <Card
        onClick={() =>
          setStockFilter(stockFilter === "bajo" ? "todos" : "bajo")
        }
        className={`p-4 flex items-center justify-between shadow-sm cursor-pointer transition-all ${
          criticalItems > 0
            ? "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10"
            : "bg-card/40 border-border/80"
        }`}
      >
        <div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider block ${
              criticalItems > 0 ? "text-amber-400" : "text-muted-foreground"
            }`}
          >
            Reposición / Bajo Stock
          </span>
          <span
            className={`text-2xl font-outfit font-black mt-0.5 block ${
              criticalItems > 0 ? "text-amber-400" : "text-foreground"
            }`}
          >
            {criticalItems}
          </span>
          <span className="text-[10px] text-muted-foreground font-light">
            {stockFilter === "bajo"
              ? "Mostrando solo bajo stock (clic para ver todos)"
              : "Clic para filtrar críticos"}
          </span>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            criticalItems > 0
              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
              : "bg-muted/30 border-border text-muted-foreground"
          }`}
        >
          <AlertCircle className="w-5 h-5" />
        </div>
      </Card>
    </div>
  );
}

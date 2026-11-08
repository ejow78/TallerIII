import { ShoppingCart, History } from "lucide-react";

export function PosHeader({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
          <span>Caja y Punto de Venta</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-light">
          Facturación rápida de repuestos y accesorios con descuento automático de stock e impresión de ticket.
        </p>
      </div>

      {/* Selector de Vista: Punto de Venta vs Historial */}
      <div className="flex items-center bg-card/80 border border-border/80 rounded-xl p-1.5 self-start sm:self-auto shadow-sm select-none">
        <button
          type="button"
          onClick={() => setActiveTab("venta")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "venta"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Punto de Venta
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("historial")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "historial"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="w-4 h-4" />
          Historial de Ventas
        </button>
      </div>
    </div>
  );
}

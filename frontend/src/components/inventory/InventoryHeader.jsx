import { Button } from "@/components/ui/button";
import { Package, PlusCircle, Download, Upload } from "lucide-react";

export function InventoryHeader({
  fileInputRef,
  onImportCSV,
  onExportExcel,
  onOpenCreateModal,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
          <span>Stock e Inventario</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Control de repuestos e insumos del taller, alertas de reposición y precios de venta.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onImportCSV}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
          title="Importar catálogo desde CSV"
        >
          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Importar CSV</span>
        </Button>
        <Button
          variant="outline"
          onClick={onExportExcel}
          className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
          title="Exportar catálogo a Excel (.xlsx)"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exportar Excel</span>
        </Button>
        <Button
          onClick={onOpenCreateModal}
          className="h-9 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nuevo Insumo</span>
        </Button>
      </div>
    </div>
  );
}

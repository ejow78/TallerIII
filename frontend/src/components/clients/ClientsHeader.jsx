import { Button } from "@/components/ui/button";
import { Users, Download, UserPlus } from "lucide-react";

export function ClientsHeader({ onExportExcel, onNewClient }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
          <span>Directorio de Clientes</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Gestión de fichas de clientes e historial técnico de reparaciones asociadas.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Button
          variant="outline"
          onClick={onExportExcel}
          className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
          title="Exportar listado de clientes a Excel (.xlsx)"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          Exportar Excel
        </Button>
        <Button
          onClick={onNewClient}
          className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>
    </div>
  );
}

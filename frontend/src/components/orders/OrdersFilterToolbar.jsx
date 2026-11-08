import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileSpreadsheet, PlusCircle, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_FILTERS = [
  { key: "todos", label: "Todas" },
  { key: "ingresado", label: "Ingresados" },
  { key: "diagnostico", label: "En Diagnóstico" },
  { key: "presupuestado", label: "Presupuestados" },
  { key: "en_reparacion", label: "En Reparación" },
  { key: "listo", label: "Listos" },
  { key: "entregado", label: "Entregados" },
];

export default function OrdersFilterToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExportToExcel,
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
            <span>Órdenes de Servicio</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Seguimiento técnico del taller, ficha detallada de equipos, presupuestos y avisos por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={onExportToExcel}
            variant="outline"
            className="h-9 border-border/80 hover:bg-muted/40 text-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
            title="Exportar órdenes a Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </Button>
          <Button
            onClick={() => navigate("/dashboard/nuevo-ingreso")}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Ingreso</span>
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda + Píldoras de Estado */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-border/50 pb-3.5">
        <div className="relative w-full lg:max-w-xs flex items-center">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar N° orden, cliente, DNI o equipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/85 border-border text-xs w-full pl-9 h-9 rounded-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Píldoras de filtro rápido */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {STATUS_FILTERS.map((st) => {
            const isActive = statusFilter === st.key;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => setStatusFilter(st.key)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-primary/15 text-primary border-primary/30 font-bold"
                    : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

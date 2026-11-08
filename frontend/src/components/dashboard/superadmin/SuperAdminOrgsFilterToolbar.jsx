import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, X } from "lucide-react";

export function SuperAdminOrgsFilterToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  filteredCount,
  totalCount,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-3">
        <div>
          <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
            <CreditCard className="w-4.5 h-4.5 text-primary" />
            Directorio de Talleres, Planes y Licencias
          </CardTitle>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Cambiá el plan o estado de cada taller en un clic, o inspeccioná sus sucursales y cuentas de acceso.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 self-start sm:self-auto"
        >
          Mostrando {filteredCount} de {totalCount}
        </Badge>
      </div>

      {/* Barra de Búsqueda + Píldoras de Filtro */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative w-full lg:max-w-sm flex items-center">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar por nombre de taller, sucursal o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/85 border-border text-xs w-full pl-10 h-10 rounded-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro por Estado */}
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/70">
            {[
              { id: "todos", label: "Todos" },
              { id: "activo", label: "Activos" },
              { id: "suspendido", label: "Suspendidos" },
              { id: "vencido", label: "Vencidos" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Filtro por Plan */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="h-9 rounded-xl border border-border/70 bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="todos">Todos los Planes</option>
            <option value="Taller Básico">Taller Básico</option>
            <option value="Taller Pro">Taller Pro</option>
            <option value="Multi-Taller Pro">Multi-Taller Pro</option>
          </select>
        </div>
      </div>
    </>
  );
}

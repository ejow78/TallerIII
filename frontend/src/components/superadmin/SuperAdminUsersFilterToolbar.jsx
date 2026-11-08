import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, X } from "lucide-react";

export function SuperAdminUsersFilterToolbar({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  orgFilter,
  setOrgFilter,
  organizations,
  filteredCount,
  totalCount,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-3">
        <div>
          <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
            <Users className="w-4.5 h-4.5 text-primary" />
            Directorio General de Personal y Accesos
          </CardTitle>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Filtrá por rol o taller, cambiá permisos o restablecé contraseñas de cualquier cuenta.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 self-start sm:self-auto"
        >
          Mostrando {filteredCount} de {totalCount}
        </Badge>
      </div>

      {/* Barra de Búsqueda + Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative w-full lg:max-w-sm flex items-center">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar por nombre, email, taller o sucursal..."
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
          {/* Píldoras de Rol */}
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/70">
            {[
              { id: "todos", label: "Todos" },
              { id: "admin", label: "Administradores" },
              { id: "tecnico", label: "Técnicos" },
              { id: "superadmin", label: "Super Admin" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoleFilter(r.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  roleFilter === r.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Filtro por Organización / Taller */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="h-9 rounded-xl border border-border/70 bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="todas">Todos los Talleres</option>
            {organizations.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

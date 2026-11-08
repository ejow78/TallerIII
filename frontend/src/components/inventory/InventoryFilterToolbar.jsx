import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export function InventoryFilterToolbar({
  searchQuery,
  setSearchQuery,
  stockFilter,
  setStockFilter,
  categoryFilter,
  setCategoryFilter,
  availableCategories = [],
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-border/50 pb-3.5">
      <div className="relative w-full lg:max-w-xs flex items-center">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por nombre, SKU o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background/85 border-border text-xs w-full pl-9 h-9 rounded-lg"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Píldoras de nivel de stock */}
        <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border/60">
          {[
            { key: "todos", label: "Todos" },
            { key: "normal", label: "Óptimos" },
            { key: "bajo", label: "Bajo Stock" },
            { key: "sin", label: "Sin Stock" },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setStockFilter(st.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                stockFilter === st.key
                  ? "bg-primary/15 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Selector de Categoría */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 bg-background/85 border border-border/80 rounded-lg px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="todas">Todas las categorías</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

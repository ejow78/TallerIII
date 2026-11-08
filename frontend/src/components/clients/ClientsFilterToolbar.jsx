import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export function ClientsFilterToolbar({
  searchQuery,
  setSearchQuery,
  totalCount = 0,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-border/50 pb-3.5">
      <div className="relative w-full sm:max-w-sm flex items-center">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por nombre, DNI, teléfono o email..."
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
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
        Total: {totalCount} Clientes
      </span>
    </div>
  );
}

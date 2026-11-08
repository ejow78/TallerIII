import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X, Sparkles } from "lucide-react";

export function PosProductCatalog({
  searchInputRef,
  searchQuery,
  setSearchQuery,
  categories = [],
  categoryFilter = "todas",
  setCategoryFilter,
  totalItemsCount = 0,
  filteredItems = [],
  cart = [],
  onAddToCart,
}) {
  return (
    <Card className="xl:col-span-7 bg-card/30 border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Buscador + Filtros de Categoría */}
      <div className="space-y-3.5 border-b border-border/50 pb-4">
        <div className="relative w-full flex items-center">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
          <Input
            ref={searchInputRef}
            id="search-input"
            type="text"
            placeholder="Buscar producto por nombre o código SKU... [F2]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/85 border-border text-xs sm:text-sm w-full pl-10 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Píldoras de Categorías */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setCategoryFilter("todas")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                categoryFilter === "todas"
                  ? "bg-primary/15 text-primary border-primary/30 font-bold"
                  : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              Todos ({totalItemsCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  categoryFilter === cat
                    ? "bg-primary/15 text-primary border-primary/30 font-bold"
                    : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grilla de Productos */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-xs sm:text-sm font-light space-y-2.5">
          <Sparkles className="w-8 h-8 opacity-25 mx-auto text-primary" />
          <p>No se encontraron productos disponibles con ese filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isOutOfStock = (item.quantity || 0) <= 0;
            const inCartItem = cart.find((c) => c.id === item._id);
            const minQty = item.min_quantity ?? item.minQuantity ?? 0;

            return (
              <div
                key={item._id}
                onClick={() => !isOutOfStock && onAddToCart(item)}
                className={`group flex justify-between items-center p-4 rounded-2xl border transition-all select-none text-left gap-3 ${
                  isOutOfStock
                    ? "opacity-45 bg-muted/10 border-border/40 cursor-not-allowed"
                    : inCartItem
                    ? "bg-primary/10 border-primary/40 hover:bg-primary/15 cursor-pointer shadow-sm"
                    : "bg-background/60 border-border/70 hover:bg-card hover:border-primary/35 cursor-pointer active:scale-[0.99]"
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <span className="text-sm font-bold text-foreground block truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                      {item.code}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        isOutOfStock
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/25"
                          : item.quantity <= minQty
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      }`}
                    >
                      {isOutOfStock ? "Sin stock" : `${item.quantity} disp.`}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <span className="text-base font-black font-outfit text-primary font-mono block">
                    $
                    {(item.price || 0).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  {inCartItem ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-md">
                      En ticket: x{inCartItem.quantity}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors block">
                      + Agregar
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

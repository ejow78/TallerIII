import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import { getStockStatus } from "./useInventoryData";

export function InventoryTable({
  loading,
  items = [],
  isTechnician = false,
  onAdjustQuantity,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="text-center py-14 text-xs text-muted-foreground font-light">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Cargando catálogo de inventario...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-xs font-light">
        No se encontraron insumos que coincidan con la búsqueda.
      </div>
    );
  }

  return (
    <>
      {/* Vista Móvil (< md): Tarjetas de Insumos */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => {
          const minQty = item.min_quantity ?? item.minQuantity ?? 0;
          const { label, colorClass } = getStockStatus(
            item.quantity || 0,
            minQty
          );
          return (
            <div
              key={item._id}
              className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-3 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-foreground text-sm block leading-snug">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/50">
                      {item.code}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] uppercase font-bold px-1.5 py-0"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border shrink-0 whitespace-nowrap ${colorClass}`}
                >
                  {label}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                    Precio Venta
                  </span>
                  <span className="font-mono font-bold text-primary text-sm">
                    $
                    {(item.price || 0).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Control de Stock Integrado */}
                <div className="flex items-center gap-1.5 bg-card border border-border/70 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => onAdjustQuantity(item._id, -1)}
                    className="w-6 h-6 rounded-md bg-muted/40 hover:bg-amber-500/20 text-foreground hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Restar 1 unidad"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="px-2 text-center">
                    <span className="font-mono font-bold text-xs text-foreground">
                      {item.quantity}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono block leading-none">
                      mín {minQty}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAdjustQuantity(item._id, 1)}
                    className="w-6 h-6 rounded-md bg-muted/40 hover:bg-emerald-500/20 text-foreground hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Sumar 1 unidad"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 pt-1 border-t border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-lg gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </Button>
                {!isTechnician && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item._id, item.name)}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista Escritorio (>= md): Tabla estilizada */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-2.5">SKU</th>
              <th className="py-3 px-2.5">Artículo / Insumo</th>
              <th className="py-3 px-2.5">Categoría</th>
              <th className="py-3 px-2.5">Precio Venta</th>
              <th className="py-3 px-2.5 text-center">Stock Actual</th>
              <th className="py-3 px-2.5 text-center">Mínimo</th>
              <th className="py-3 px-2.5">Estado</th>
              <th className="py-3 px-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const minQty = item.min_quantity ?? item.minQuantity ?? 0;
              const { label, colorClass } = getStockStatus(
                item.quantity || 0,
                minQty
              );
              return (
                <tr
                  key={item._id}
                  className="border-b border-border/40 hover:bg-card/40 transition-colors"
                >
                  <td className="py-3 px-2.5 font-mono text-[11px] text-muted-foreground">
                    {item.code}
                  </td>
                  <td className="py-3 px-2.5">
                    <span className="font-semibold text-foreground block leading-snug">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-muted-foreground font-light block max-w-xs truncate">
                        {item.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2.5">
                    <Badge
                      variant="secondary"
                      className="text-[9px] uppercase font-bold px-1.5 py-0.5"
                    >
                      {item.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-2.5 font-mono text-foreground font-bold">
                    $
                    {(item.price || 0).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-2.5 text-center">
                    {/* Stepper limpio en línea */}
                    <div className="inline-flex items-center gap-1 bg-background/80 border border-border/70 rounded-lg px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => onAdjustQuantity(item._id, -1)}
                        className="w-5 h-5 rounded hover:bg-amber-500/15 text-muted-foreground hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                        title="Restar 1 unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs text-foreground min-w-[26px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAdjustQuantity(item._id, 1)}
                        className="w-5 h-5 rounded hover:bg-emerald-500/15 text-muted-foreground hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                        title="Sumar 1 unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2.5 font-mono text-muted-foreground text-center">
                    {minQty}
                  </td>
                  <td className="py-3 px-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${colorClass}`}
                    >
                      {label}
                    </span>
                  </td>
                  <td className="py-3 px-2.5 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer rounded-lg"
                        title="Editar insumo"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      {!isTechnician && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(item._id, item.name)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

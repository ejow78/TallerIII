import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { normalizeCategory } from "@/constants/categories";

export function InventoryItemModal({
  isOpen,
  onClose,
  item = null,
  availableCategories = [],
  onSaved,
}) {
  const isEditing = Boolean(item?._id);

  const [itemName, setItemName] = useState(() => item?.name || "");
  const [itemCategory, setItemCategory] = useState(() => normalizeCategory(item?.category || "Repuestos"));
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [itemDesc, setItemDesc] = useState(() => item?.description || "");
  const [itemQty, setItemQty] = useState(() => item?.quantity ?? 0);
  const [itemMinQty, setItemMinQty] = useState(
    () => item?.min_quantity ?? item?.minQuantity ?? 2
  );
  const [itemPrice, setItemPrice] = useState(() => item?.price ?? 0);
  const [itemCode, setItemCode] = useState(() => item?.code || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("item-name")?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName) {
      toast.error("El nombre del insumo es obligatorio.");
      return;
    }

    try {
      setSubmitting(true);
      const finalCode =
        itemCode.trim() || `INV-${Math.floor(100 + Math.random() * 900)}`;

      const finalCategory = normalizeCategory(isCustomCategory ? customCategoryInput : itemCategory);

      if (isEditing) {
        await api.inventory.update(item._id, {
          name: itemName,
          category: finalCategory,
          description: itemDesc,
          quantity: Math.max(0, Number(itemQty) || 0),
          minQuantity: Math.max(0, Number(itemMinQty) || 0),
          price: Math.max(0, Number(itemPrice) || 0),
          code: finalCode,
        });
        toast.success("¡Insumo Actualizado!", {
          description: `${itemName} fue modificado correctamente.`,
        });
      } else {
        await api.inventory.create({
          name: itemName,
          category: finalCategory,
          description: itemDesc,
          quantity: Math.max(0, Number(itemQty) || 0),
          minQuantity: Math.max(0, Number(itemMinQty) || 0),
          price: Math.max(0, Number(itemPrice) || 0),
          code: finalCode,
        });
        toast.success("¡Insumo Registrado!", {
          description: `${itemName} se añadió al catálogo con el código ${finalCode}.`,
        });
      }

      onClose();
      if (onSaved) onSaved();
    } catch (error) {
      toast.error("Error al guardar insumo", {
        description: error.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/80 rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left cursor-default"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="space-y-1 border-b border-border/60 pb-3">
          <h3 className="font-outfit text-base sm:text-lg font-bold text-foreground">
            {isEditing ? "Editar Insumo" : "Nuevo Insumo / Repuesto"}
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Completá las especificaciones del artículo para actualizar el stock.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label
              htmlFor="item-name"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Nombre del Insumo
            </Label>
            <Input
              id="item-name"
              type="text"
              required
              placeholder="Ej. Módulo OLED iPhone 13"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="item-code"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Código SKU / Barras
              </Label>
              <Input
                id="item-code"
                type="text"
                placeholder="Opcional (se autogenera)"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="item-category"
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Categoría
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCategory((prev) => !prev);
                    if (!isCustomCategory) {
                      setCustomCategoryInput("");
                    }
                  }}
                  className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                >
                  {isCustomCategory ? "Elegir de la lista" : "+ Nueva categoría"}
                </button>
              </div>

              {isCustomCategory ? (
                <Input
                  id="item-category-custom"
                  type="text"
                  autoFocus
                  placeholder="Escribí la nueva categoría (ej: Consolas, Audio)..."
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg w-full"
                />
              ) : (
                <select
                  id="item-category"
                  value={itemCategory}
                  onChange={(e) => {
                    if (e.target.value === "__nueva__") {
                      setIsCustomCategory(true);
                      setCustomCategoryInput("");
                    } else {
                      setItemCategory(e.target.value);
                    }
                  }}
                  className="w-full h-9 rounded-lg border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__nueva__">+ Otra categoría personalizada...</option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="item-qty"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Stock Actual
              </Label>
              <div className="flex items-center bg-background/85 border border-border rounded-lg h-9 px-1 focus-within:ring-1 focus-within:ring-primary">
                <button
                  type="button"
                  onClick={() =>
                    setItemQty((prev) => Math.max(0, (parseInt(prev, 10) || 0) - 1))
                  }
                  className="w-7 h-7 rounded hover:bg-amber-500/15 text-muted-foreground hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Restar 1 unidad"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  id="item-qty"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  required
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  className="w-full bg-transparent text-center font-mono font-bold text-xs text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setItemQty((prev) => (parseInt(prev, 10) || 0) + 1)
                  }
                  className="w-7 h-7 rounded hover:bg-emerald-500/15 text-muted-foreground hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Sumar 1 unidad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="item-min"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Stock Mínimo
              </Label>
              <div className="flex items-center bg-background/85 border border-border rounded-lg h-9 px-1 focus-within:ring-1 focus-within:ring-primary">
                <button
                  type="button"
                  onClick={() =>
                    setItemMinQty((prev) =>
                      Math.max(0, (parseInt(prev, 10) || 0) - 1)
                    )
                  }
                  className="w-7 h-7 rounded hover:bg-amber-500/15 text-muted-foreground hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Restar 1 unidad"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  id="item-min"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  required
                  value={itemMinQty}
                  onChange={(e) => setItemMinQty(e.target.value)}
                  className="w-full bg-transparent text-center font-mono font-bold text-xs text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setItemMinQty((prev) => (parseInt(prev, 10) || 0) + 1)
                  }
                  className="w-7 h-7 rounded hover:bg-emerald-500/15 text-muted-foreground hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Sumar 1 unidad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="item-price"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Precio ($)
              </Label>
              <Input
                id="item-price"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                required
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg text-center"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="item-desc"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Descripción o Notas
            </Label>
            <Textarea
              id="item-desc"
              placeholder="Especificaciones, compatibilidad o proveedor..."
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-16 rounded-lg resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {submitting ? "Guardando..." : "Guardar Insumo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

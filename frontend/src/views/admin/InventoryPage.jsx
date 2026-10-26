import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Package,
  PlusCircle,
  Search,
  Trash2,
  AlertCircle,
  Pencil,
  Download,
  Upload,
  Plus,
  Minus,
  X,
  Save,
  DollarSign,
} from "lucide-react";
import { api } from "@/services/api";

const DEFAULT_CATEGORIES = [
  "Insumos",
  "Repuestos",
  "Accesorios",
  "Herramientas",
  "Pantallas",
  "Baterías",
  "Almacenamiento",
  "Memorias",
];

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [stockFilter, setStockFilter] = useState("todos");

  // Control del modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Formulario
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Repuestos");
  const [itemDesc, setItemDesc] = useState("");
  const [itemQty, setItemQty] = useState(0);
  const [itemMinQty, setItemMinQty] = useState(2);
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCode, setItemCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.inventory.getAll();
      setItems(data || []);
    } catch (error) {
      toast.error("Error al cargar inventario", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lector de código de barras silencioso en segundo plano
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";

      if (isInput && activeEl.id !== "item-code") {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 100) {
        buffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter") {
        if (buffer.length >= 3) {
          e.preventDefault();
          handleInventoryScan(buffer.trim());
          buffer = "";
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, showModal]);

  const handleInventoryScan = (barcode) => {
    const existingItem = items.find(
      (item) => (item.code || "").toLowerCase() === barcode.toLowerCase()
    );

    if (existingItem) {
      handleOpenEditModal(existingItem);
      toast.info(`Insumo detectado: ${existingItem.name}`, {
        description: `Se abrió la edición para ajustar cantidad. Código: ${existingItem.code}`,
      });
    } else {
      setEditingId(null);
      setItemName("");
      setItemCategory("Repuestos");
      setItemDesc("");
      setItemQty(0);
      setItemMinQty(2);
      setItemPrice(0);
      setItemCode(barcode);
      setShowModal(true);

      toast.success(`Nuevo código detectado: "${barcode}"`, {
        description: "Completá el nombre y precio del insumo.",
        duration: 4000,
      });

      setTimeout(() => {
        document.getElementById("item-name")?.focus();
      }, 150);
    }
  };

  const handleCodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("item-name")?.focus();
    }
  };

  const availableCategories = useMemo(() => {
    const fromItems = items.map((i) => i.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromItems]));
  }, [items]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setItemName("");
    setItemCategory("Repuestos");
    setItemDesc("");
    setItemQty(0);
    setItemMinQty(2);
    setItemPrice(0);
    setItemCode("");
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setItemName(item.name || "");
    setItemCategory(item.category || "Repuestos");
    setItemDesc(item.description || "");
    setItemQty(item.quantity || 0);
    setItemMinQty(item.min_quantity ?? item.minQuantity ?? 0);
    setItemPrice(item.price || 0);
    setItemCode(item.code || "");
    setShowModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemName) {
      toast.error("El nombre del insumo es obligatorio.");
      return;
    }

    try {
      setSubmitting(true);
      const finalCode =
        itemCode.trim() || `INV-${Math.floor(100 + Math.random() * 900)}`;

      if (editingId) {
        await api.inventory.update(editingId, {
          name: itemName,
          category: itemCategory,
          description: itemDesc,
          quantity: Number(itemQty),
          minQuantity: Number(itemMinQty),
          price: Number(itemPrice),
          code: finalCode,
        });
        toast.success("¡Insumo Actualizado!", {
          description: `${itemName} fue modificado correctamente.`,
        });
      } else {
        await api.inventory.create({
          name: itemName,
          category: itemCategory,
          description: itemDesc,
          quantity: Number(itemQty),
          minQuantity: Number(itemMinQty),
          price: Number(itemPrice),
          code: finalCode,
        });
        toast.success("¡Insumo Registrado!", {
          description: `${itemName} se añadió al catálogo con el código ${finalCode}.`,
        });
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error("Error al guardar insumo", {
        description: error.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const adjustQuantity = async (id, delta) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const currentQty = item.quantity || 0;
    const newQty = currentQty + delta;
    if (newQty < 0) {
      toast.error("La cantidad no puede ser inferior a 0.");
      return;
    }

    try {
      await api.inventory.adjustStock(id, delta);
      const minQty = item.min_quantity ?? item.minQuantity ?? 0;
      if (delta < 0 && newQty <= minQty) {
        toast.warning(`¡Bajo Stock!`, {
          description: `El stock de ${item.name} quedó en ${newQty} u. (Mínimo: ${minQty}).`,
        });
      } else {
        toast.success("Stock actualizado.");
      }
      loadData();
    } catch (error) {
      toast.error("Error al ajustar stock", {
        description: error.message || "Intente de nuevo.",
      });
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseás eliminar permanentemente el insumo "${name}"?`
      )
    ) {
      return;
    }

    try {
      await api.inventory.delete(id);
      toast.success(`Insumo eliminado`, {
        description: `${name} fue retirado del catálogo.`,
      });
      loadData();
    } catch (error) {
      toast.error("Error al eliminar insumo", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  };

  const handleExportToExcel = async () => {
    if (items.length === 0) {
      toast.error("No hay insumos para exportar.");
      return;
    }

    try {
      toast.info("Generando archivo Excel de inventario...");
      const { default: writeXlsxFile } = await import("write-excel-file/browser");

      const columns = [
        {
          header: {
            value: "Código / SKU",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (item) => ({
            type: String,
            value: String(item.code || "S/C"),
            align: "center",
          }),
          width: 18,
        },
        {
          header: {
            value: "Insumo / Producto",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (item) => ({
            type: String,
            value: item.name || "Sin nombre",
            fontWeight: "bold",
          }),
          width: 32,
        },
        {
          header: {
            value: "Categoría",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (item) => ({ type: String, value: item.category || "General" }),
          width: 20,
        },
        {
          header: {
            value: "Descripción",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (item) => ({ type: String, value: item.description || "-" }),
          width: 35,
        },
        {
          header: {
            value: "Stock Actual",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (item) => ({
            type: Number,
            value: Number(item.quantity) || 0,
            align: "center",
          }),
          width: 14,
        },
        {
          header: {
            value: "Stock Mínimo",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (item) => ({
            type: Number,
            value: Number(item.min_quantity || item.minQuantity) || 0,
            align: "center",
          }),
          width: 14,
        },
        {
          header: {
            value: "Estado Stock",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (item) => {
            const qty = Number(item.quantity) || 0;
            const minQty = Number(item.min_quantity || item.minQuantity) || 0;
            const isLow = qty <= minQty;
            return {
              type: String,
              value: isLow ? "CRÍTICO / BAJO" : "ÓPTIMO",
              align: "center",
              fontWeight: "bold",
              color: isLow ? "#dc2626" : "#16a34a",
            };
          },
          width: 18,
        },
        {
          header: {
            value: "Precio Venta",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "right",
          },
          cell: (item) => ({
            type: Number,
            value: Number(item.price) || 0,
            format: "$#,##0.00",
            align: "right",
          }),
          width: 18,
        },
      ];

      await writeXlsxFile(items, { columns }).toFile(
        `Inventario_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Catálogo de inventario exportado a Excel (.xlsx).");
    } catch (err) {
      console.error("Error al generar Excel de inventario:", err);
      toast.error("Error al exportar inventario a Excel.");
    }
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          throw new Error("El archivo CSV no contiene registros válidos.");
        }

        const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
        if (
          !user.organizationId ||
          !user.venueId ||
          user.venueId === "undefined"
        ) {
          throw new Error("Sesión de sucursal inválida.");
        }

        const parsedItems = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i]
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((c) => c.replace(/^["']|["']$/g, "").trim());
          if (row.length < 2) continue;

          const code = row[0] || `INV-${Math.floor(100 + Math.random() * 900)}`;
          const name = row[1];
          const category = row[2] || "Insumos";
          const description = row[3] || "";
          const quantity = Number(row[4]) || 0;
          const minQuantity = Number(row[5]) || 0;
          const price = Number(row[6]) || 0;

          if (!name) continue;

          parsedItems.push({
            organization_id: user.organizationId,
            venue_id: user.venueId,
            code,
            name,
            category,
            description,
            quantity,
            min_quantity: minQuantity,
            price,
          });
        }

        if (parsedItems.length === 0) {
          throw new Error(
            "No se encontraron filas con nombres de insumos válidos."
          );
        }

        await api.inventory.bulkUpsert(parsedItems);
        toast.success("¡Importación completada con éxito!", {
          description: `Se procesaron ${parsedItems.length} insumos de forma masiva.`,
        });
        loadData();
      } catch (error) {
        toast.error("Error al importar CSV", {
          description: error.message || "Compruebe el formato de las columnas.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const getStockStatus = (quantity, minQuantity) => {
    if (quantity === 0) {
      return {
        label: "Sin Stock",
        colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/25",
      };
    }
    if (quantity <= minQuantity) {
      return {
        label: "Bajo Stock",
        colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25",
      };
    }
    return {
      label: "Óptimo",
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    };
  };

  const filteredItems = items.filter((item) => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      (item.code && item.code.toLowerCase().includes(term)) ||
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term));

    const matchesCategory =
      categoryFilter === "todas" || item.category === categoryFilter;

    let matchesStock = true;
    const minQty = item.min_quantity ?? item.minQuantity ?? 0;
    if (stockFilter === "bajo") {
      matchesStock = (item.quantity || 0) <= minQty;
    } else if (stockFilter === "sin") {
      matchesStock = (item.quantity || 0) === 0;
    } else if (stockFilter === "normal") {
      matchesStock = (item.quantity || 0) > minQty;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalValue = items.reduce(
    (acc, curr) => acc + (curr.price || 0) * (curr.quantity || 0),
    0
  );
  const criticalItems = items.filter(
    (i) => (i.quantity || 0) <= (i.min_quantity ?? i.minQuantity ?? 0)
  ).length;

  return (
    <div className="space-y-5">
      {/* Cabecera Superior */}
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
            onChange={handleImportCSV}
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
            onClick={handleExportToExcel}
            className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
            title="Exportar catálogo a Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar Excel</span>
          </Button>
          <Button
            onClick={handleOpenCreateModal}
            className="h-9 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Insumo</span>
          </Button>
        </div>
      </div>

      {/* KPIs Compactos y Modernos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="bg-card/40 border-border/80 p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Total de Artículos
            </span>
            <span className="text-2xl font-outfit font-black text-foreground mt-0.5 block">
              {items.length}
            </span>
            <span className="text-[10px] text-muted-foreground font-light">
              Repuestos e insumos activos
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Valorización en Stock
            </span>
            <span className="text-2xl font-outfit font-black text-foreground font-mono mt-0.5 block">
              ${totalValue.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-muted-foreground font-light">
              Capital estimado en mercadería
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        <Card
          onClick={() =>
            setStockFilter(stockFilter === "bajo" ? "todos" : "bajo")
          }
          className={`p-4 flex items-center justify-between shadow-sm cursor-pointer transition-all ${
            criticalItems > 0
              ? "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10"
              : "bg-card/40 border-border/80"
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                criticalItems > 0 ? "text-amber-400" : "text-muted-foreground"
              }`}
            >
              Reposición / Bajo Stock
            </span>
            <span
              className={`text-2xl font-outfit font-black mt-0.5 block ${
                criticalItems > 0 ? "text-amber-400" : "text-foreground"
              }`}
            >
              {criticalItems}
            </span>
            <span className="text-[10px] text-muted-foreground font-light">
              {stockFilter === "bajo"
                ? "Mostrando solo bajo stock (clic para ver todos)"
                : "Clic para filtrar críticos"}
            </span>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              criticalItems > 0
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                : "bg-muted/30 border-border text-muted-foreground"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Contenedor Principal: Filtros + Tabla */}
      <Card className="bg-card/30 border-border/80 p-3.5 sm:p-5 shadow-sm space-y-4">
        {/* Barra de Búsqueda + Filtros Rápidos */}
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
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
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

        {/* Tabla / Tarjetas de Resultados */}
        {loading ? (
          <div className="text-center py-14 text-xs text-muted-foreground font-light">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando catálogo de inventario...
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            {/* Vista Móvil (< md): Tarjetas de Insumos */}
            <div className="space-y-3 md:hidden">
              {filteredItems.map((item) => {
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
                          onClick={() => adjustQuantity(item._id, -1)}
                          className="w-6 h-6 rounded-md bg-muted/40 hover:bg-amber-500/20 text-foreground hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
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
                          onClick={() => adjustQuantity(item._id, 1)}
                          className="w-6 h-6 rounded-md bg-muted/40 hover:bg-emerald-500/20 text-foreground hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-1 border-t border-border/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(item)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-lg gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item._id, item.name)}
                        className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </Button>
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
                  {filteredItems.map((item) => {
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
                              onClick={() => adjustQuantity(item._id, -1)}
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
                              onClick={() => adjustQuantity(item._id, 1)}
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
                              onClick={() => handleOpenEditModal(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer rounded-lg"
                              title="Editar insumo"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteItem(item._id, item.name)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg"
                              title="Eliminar insumo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-xs font-light">
            No se encontraron insumos que coincidan con la búsqueda.
          </div>
        )}
      </Card>

      {/* MODAL PARA CREACIÓN / EDICIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-card border border-border/80 rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left">
            <Button
              onClick={() => setShowModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-1 border-b border-border/60 pb-3">
              <h3 className="font-outfit text-base sm:text-lg font-bold text-foreground">
                {editingId ? "Editar Insumo" : "Nuevo Insumo / Repuesto"}
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Completá las especificaciones del artículo para actualizar el stock.
              </p>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5">
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
                  <Label
                    htmlFor="item-category"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Categoría
                  </Label>
                  <select
                    id="item-category"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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
                  <Input
                    id="item-qty"
                    type="number"
                    min="0"
                    required
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="item-min"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Stock Mínimo
                  </Label>
                  <Input
                    id="item-min"
                    type="number"
                    min="0"
                    required
                    value={itemMinQty}
                    onChange={(e) => setItemMinQty(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg"
                  />
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
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg"
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
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
}

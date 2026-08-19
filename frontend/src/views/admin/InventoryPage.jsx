import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Scan
} from "lucide-react";
import { api } from "@/services/api";

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
  const [itemCategory, setItemCategory] = useState("Insumos");
  const [itemDesc, setItemDesc] = useState("");
  const [itemQty, setItemQty] = useState(0);
  const [itemMinQty, setItemMinQty] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCode, setItemCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.inventory.getAll();
      setItems(data);
    } catch (error) {
      toast.error("Error al cargar inventario", {
        description: error.message || "Por favor, intente nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔌 LECTOR DE CÓDIGO DE BARRAS EN INVENTARIO (BÚSQUEDA Y ALTA RÁPIDA)
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA";
      
      // Si está en otro input (ej. nombre o descripción), no capturamos para evitar pisar la escritura del usuario.
      // Pero si está en el input del SKU o fuera de los inputs, sí leemos.
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
    // Buscar si el código ya existe en el stock
    const existingItem = items.find(
      (item) => item.code.toLowerCase() === barcode.toLowerCase()
    );

    if (existingItem) {
      // 1. Si existe: Abrir modal de edición para ajustar stock rápidamente
      handleOpenEditModal(existingItem);
      toast.info(`Insumo detectado: ${existingItem.name}`, {
        description: `Se abrió la edición para ajustar cantidad. Código: ${existingItem.code}`
      });
    } else {
      // 2. Si no existe: Abrir modal de creación con el código precargado
      setEditingId(null);
      setItemName("");
      setItemCategory("Insumos");
      setItemDesc("");
      setItemQty(0);
      setItemMinQty(0);
      setItemPrice(0);
      setItemCode(barcode);
      setShowModal(true);
      
      toast.success(`Nuevo código detectado: "${barcode}"`, {
        description: "Modal de registro abierto. Complete el nombre y precio del insumo.",
        duration: 5000
      });

      // Mover foco al campo de nombre automáticamente tras abrirse el modal
      setTimeout(() => {
        document.getElementById("item-name")?.focus();
      }, 150);
    }
  };

  // Prevenir que el Enter del escáner guarde el modal al estar sobre el SKU input
  const handleCodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evitar submit accidental del formulario
      document.getElementById("item-name")?.focus(); // Pasar foco a Nombre
    }
  };

  // Abrir modal para crear
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setItemName("");
    setItemCategory("Insumos");
    setItemDesc("");
    setItemQty(0);
    setItemMinQty(0);
    setItemPrice(0);
    setItemCode("");
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setItemName(item.name || "");
    setItemCategory(item.category || "Insumos");
    setItemDesc(item.description || "");
    setItemQty(item.quantity || 0);
    setItemMinQty(item.min_quantity || item.minQuantity || 0);
    setItemPrice(item.price || 0);
    setItemCode(item.code || "");
    setShowModal(true);
  };

  // Guardar insumo (crear o editar)
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemName) {
      toast.error("El nombre del insumo es obligatorio.");
      return;
    }

    try {
      setSubmitting(true);
      const finalCode = itemCode.trim() || `INV-${Math.floor(100 + Math.random() * 900)}`;

      if (editingId) {
        // Modificar
        await api.inventory.update(editingId, {
          name: itemName,
          category: itemCategory,
          description: itemDesc,
          quantity: Number(itemQty),
          minQuantity: Number(itemMinQty),
          price: Number(itemPrice),
          code: finalCode
        });
        toast.success("¡Insumo Actualizado!", {
          description: `${itemName} fue modificado correctamente.`
        });
      } else {
        // Crear
        await api.inventory.create({
          name: itemName,
          category: itemCategory,
          description: itemDesc,
          quantity: Number(itemQty),
          minQuantity: Number(itemMinQty),
          price: Number(itemPrice),
          code: finalCode
        });
        toast.success("¡Insumo Registrado!", {
          description: `${itemName} se añadió al catálogo con el código ${finalCode}.`
        });
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error("Error al guardar insumo", {
        description: error.message || "Por favor, intente de nuevo."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Ajustar cantidad de stock (+ / -) rápidamente en la tabla
  const adjustQuantity = async (id, delta) => {
    const item = items.find(i => i._id === id);
    if (!item) return;

    const currentQty = item.quantity || 0;
    const newQty = currentQty + delta;
    if (newQty < 0) {
      toast.error("La cantidad no puede ser inferior a 0.");
      return;
    }

    try {
      await api.inventory.adjustStock(id, delta);
      const minQty = item.min_quantity || item.minQuantity || 0;
      if (delta < 0 && newQty < minQty) {
        toast.warning(`¡Bajo Stock Crítico!`, {
          description: `El stock de ${item.name} ha caído a ${newQty}. Mínimo sugerido: ${minQty}.`
        });
      } else {
        toast.success("Stock ajustado correctamente.");
      }
      loadData();
    } catch (error) {
      toast.error("Error al ajustar stock", {
        description: error.message || "Intente de nuevo."
      });
    }
  };

  // Eliminar insumo
  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar permanentemente el insumo "${name}"?`)) {
      return;
    }

    try {
      await api.inventory.delete(id);
      toast.success(`Insumo eliminado`, {
        description: `${name} fue retirado del catálogo.`
      });
      loadData();
    } catch (error) {
      toast.error("Error al eliminar insumo", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  // 📤 EXPORTAR A CSV
  const handleExportCSV = () => {
    if (items.length === 0) {
      toast.error("No hay insumos para exportar.");
      return;
    }

    const headers = ["Codigo", "Nombre", "Categoria", "Descripcion", "Stock", "StockMinimo", "PrecioVenta"];
    const rows = items.map(item => [
      item.code,
      item.name,
      item.category || "Insumos",
      item.description || "",
      item.quantity || 0,
      item.min_quantity || item.minQuantity || 0,
      item.price || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Inventario exportado como CSV.");
  };

  // 📥 IMPORTAR DESDE CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error("El archivo CSV no contiene registros válidos.");
        }

        const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
        if (!user.organizationId || !user.venueId || user.venueId === "undefined") {
          throw new Error("Sesión de sucursal inválida.");
        }

        const parsedItems = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^["']|["']$/g, "").trim());
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
            price
          });
        }

        if (parsedItems.length === 0) {
          throw new Error("No se encontraron filas con nombres de insumos válidos.");
        }

        await api.inventory.bulkUpsert(parsedItems);
        toast.success("¡Importación completada con éxito!", {
          description: `Se procesaron ${parsedItems.length} insumos de forma masiva.`
        });
        loadData();
      } catch (error) {
        toast.error("Error al importar CSV", {
          description: error.message || "Compruebe el formato de las columnas."
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Obtener estado de stock (Normal, Bajo, Sin Stock)
  const getStockStatus = (quantity, minQuantity) => {
    if (quantity === 0) {
      return { label: "Sin Stock", variant: "destructive", colorClass: "text-red-400 bg-red-500/10 border-red-500/20" };
    }
    if (quantity < minQuantity) {
      return { label: "Bajo Stock", variant: "warning", colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    }
    return { label: "Stock Normal", variant: "success", colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  };

  // Filtrado de items
  const filteredItems = items.filter(item => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (item.code && item.code.toLowerCase().includes(term)) ||
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term));

    const matchesCategory = categoryFilter === "todas" || item.category === categoryFilter;

    let matchesStock = true;
    const minQty = item.min_quantity || item.minQuantity || 0;
    if (stockFilter === "bajo") {
      matchesStock = item.quantity > 0 && item.quantity < minQty;
    } else if (stockFilter === "sin") {
      matchesStock = item.quantity === 0;
    } else if (stockFilter === "normal") {
      matchesStock = item.quantity >= minQty;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalValue = items.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.quantity || 0)), 0);
  const criticalItems = items.filter(i => (i.quantity || 0) < (i.min_quantity || i.minQuantity || 0)).length;

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-primary shrink-0" />
            <span>Control de Inventario</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Monitorea el stock de repuestos e insumos del taller, importa listas de precios y exporta informes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3.5 py-2 text-[11px] text-primary font-semibold select-none self-start sm:self-auto shadow-sm">
            <Scan className="w-4 h-4 animate-pulse" />
            Lector de Código Activo (Escanea para buscar o registrar)
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/15 transition-all select-none self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Registrar Insumo
          </Button>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total de Insumos</span>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-outfit font-black text-foreground block">{items.length}</span>
            <span className="text-[10px] text-muted-foreground block font-light mt-1">Componentes registrados</span>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor Estimado Stock</span>
            <span className="text-xs font-black text-primary font-mono">$</span>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-outfit font-black text-foreground block">
              ${totalValue.toLocaleString("es-AR")}
            </span>
            <span className="text-[10px] text-muted-foreground block font-light mt-1">Valor de venta acumulado</span>
          </CardContent>
        </Card>

        <Card className={`${criticalItems > 0 ? "bg-destructive/5 border-destructive/20" : "bg-card/45 border-border"} shadow-md`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className={`text-xs font-semibold uppercase tracking-wider ${criticalItems > 0 ? "text-destructive/80" : "text-muted-foreground"}`}>Alertas Críticas</span>
            <AlertCircle className={`h-4 w-4 ${criticalItems > 0 ? "text-destructive animate-pulse" : "text-muted-foreground/60"}`} />
          </CardHeader>
          <CardContent>
            <span className={`text-2xl font-outfit font-black block ${criticalItems > 0 ? "text-destructive" : "text-foreground"}`}>{criticalItems}</span>
            <span className="text-[10px] text-muted-foreground block font-light mt-1">Bajo el mínimo sugerido</span>
          </CardContent>
        </Card>
      </div>

      {/* Barra de herramientas */}
      <Card className="bg-card/20 border-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border/50 pb-4">
          <div className="relative w-full md:max-w-xs flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar insumo o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/80 border-border text-xs w-full pl-9 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2.5 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 bg-background/85 border border-border rounded-md px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
            >
              <option value="todas">Todas las categorías</option>
              <option value="Insumos">Insumos</option>
              <option value="Repuestos">Repuestos</option>
              <option value="Herramientas">Herramientas</option>
              <option value="Accesorios">Accesorios</option>
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-9 bg-background/85 border border-border rounded-md px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
            >
              <option value="todos">Todos los niveles</option>
              <option value="normal">Stock Normal</option>
              <option value="bajo">Bajo Stock</option>
              <option value="sin">Sin Stock</option>
            </select>

            <div className="flex gap-2 w-full sm:w-auto">
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
                className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer w-full sm:w-auto"
                title="Importar catálogo desde CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                Importar
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer w-full sm:w-auto"
                title="Exportar catálogo a CSV"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de Resultados */}
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                  <th className="py-3 px-2">Código</th>
                  <th className="py-3 px-2">Insumo</th>
                  <th className="py-3 px-2">Categoría</th>
                  <th className="py-3 px-2">Precio Venta</th>
                  <th className="py-3 px-2">Stock Actual</th>
                  <th className="py-3 px-2">Mínimo</th>
                  <th className="py-3 px-2">Estado</th>
                  <th className="py-3 px-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const minQty = item.min_quantity || item.minQuantity || 0;
                  const { label, variant, colorClass } = getStockStatus(item.quantity || 0, minQty);
                  return (
                    <tr key={item._id} className="border-b border-border/40 hover:bg-card/30 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-muted-foreground">{item.code}</td>
                      <td className="py-3.5 px-2">
                        <span className="font-bold text-foreground text-sm block leading-tight">{item.name}</span>
                        {item.description && (
                          <span className="text-[10px] text-muted-foreground font-light block max-w-xs truncate">{item.description}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2">
                        <Badge variant="secondary" className="text-[9px] uppercase font-bold px-1.5 py-0.5">{item.category}</Badge>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-foreground font-bold">${(item.price || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-2 font-mono font-bold text-foreground text-sm">{item.quantity}</td>
                      <td className="py-3.5 px-2 font-mono text-muted-foreground">{minQty}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${colorClass}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex justify-end items-center gap-1">
                          
                          {/* Ajustes rápidos */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => adjustQuantity(item._id, 1)}
                            className="h-7 w-7 text-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10 cursor-pointer rounded-full"
                            title="Sumar 1 unidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => adjustQuantity(item._id, -1)}
                            className="h-7 w-7 text-amber-500 hover:text-amber-500 hover:bg-amber-500/10 cursor-pointer rounded-full"
                            title="Restar 1 unidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>

                          <div className="w-px h-4 bg-border mx-1" />

                          {/* Editar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditModal(item)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer rounded-full"
                            title="Editar insumo"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>

                          {/* Borrar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(item._id, item.name)}
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-full"
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
        ) : (
          <div className="text-center py-12 text-muted-foreground text-xs font-light">
            No se encontraron insumos que coincidan con la búsqueda.
          </div>
        )}
      </Card>

      {/* MODAL PARA CREACIÓN / EDICIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative">
            <Button
              onClick={() => setShowModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-1">
              <h3 className="font-outfit text-base font-bold text-foreground">
                {editingId ? "Editar Detalle de Insumo" : "Registrar Nuevo Insumo"}
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Complete las especificaciones del artículo para actualizar el stock.
              </p>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="item-name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nombre del Insumo</Label>
                <Input
                  id="item-name"
                  type="text"
                  required
                  placeholder="Ej. Pantalla LCD iPhone 13"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="item-code" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                    <span>Código SKU / Barras</span>
                  </Label>
                  <Input
                    id="item-code"
                    type="text"
                    placeholder="Escanea o escribe código"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    onKeyDown={handleCodeKeyDown}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="item-category" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Categoría</Label>
                  <select
                    id="item-category"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full h-9 rounded-md border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                  >
                    <option value="Insumos">Insumos</option>
                    <option value="Repuestos">Repuestos</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="item-qty" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Stock Inicial</Label>
                  <Input
                    id="item-qty"
                    type="number"
                    min="0"
                    required
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="item-min" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Stock Mínimo</Label>
                  <Input
                    id="item-min"
                    type="number"
                    min="0"
                    required
                    value={itemMinQty}
                    onChange={(e) => setItemMinQty(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="item-price" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Precio Venta</Label>
                  <Input
                    id="item-price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="item-desc" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Descripción o Notas</Label>
                <Textarea
                  id="item-desc"
                  placeholder="Especificaciones, marca o notas del insumo..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-md cursor-pointer flex items-center gap-1.5"
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

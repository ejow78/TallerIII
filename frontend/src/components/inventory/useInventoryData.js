import { normalizeText } from "@/lib/utils";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { api, getLocalUser, cache } from "@/services/api";

export const DEFAULT_CATEGORIES = [
  "Insumos",
  "Repuestos",
  "Accesorios",
  "Herramientas",
  "Pantallas",
  "Baterías",
  "Almacenamiento",
  "Memorias",
];

export function getStockStatus(quantity, minQuantity) {
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
}

export function useInventoryData() {
  const currentUser = getLocalUser();
  const isTechnician = currentUser?.role === "tecnico";
  const venueId = currentUser?.venueId;

  const [items, setItems] = useState(() => cache.get(`inventory_${venueId}`) || []);
  const [loading, setLoading] = useState(() => !cache.has(`inventory_${venueId}`));

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [stockFilter, setStockFilter] = useState("todos");

  // Modal de creación / edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fileInputRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const data = await api.inventory.getAll();
      setItems(data || []);
    } catch (error) {
      toast.error("Error al cargar inventario", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchInventory = async () => {
      if (!isMounted) return;
      await loadData();
    };
    fetchInventory();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const openCreateModal = useCallback((prefilledCode = "") => {
    setEditingItem(prefilledCode ? { code: prefilledCode } : null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  // Lector de código de barras silencioso
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
          const barcode = buffer.trim();
          buffer = "";

          const existingItem = items.find(
            (item) => (item.code || "").toLowerCase() === barcode.toLowerCase()
          );

          if (existingItem) {
            openEditModal(existingItem);
            toast.info(`Insumo detectado: ${existingItem.name}`, {
              description: `Se abrió la edición para ajustar cantidad. Código: ${existingItem.code}`,
            });
          } else {
            openCreateModal(barcode);
            toast.success(`Nuevo código detectado: "${barcode}"`, {
              description: "Completá el nombre y precio del insumo.",
              duration: 4000,
            });

            setTimeout(() => {
              document.getElementById("item-name")?.focus();
            }, 150);
          }
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, isModalOpen, openEditModal, openCreateModal]);

  const availableCategories = useMemo(() => {
    const fromItems = items.map((i) => i.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromItems]));
  }, [items]);

  const adjustQuantity = useCallback(async (id, delta) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const currentQty = item.quantity || 0;
    const newQty = currentQty + delta;
    if (newQty < 0) {
      toast.error("La cantidad no puede ser inferior a 0.");
      return;
    }

    const previousItems = [...items];
    // Optimistic UI
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: newQty } : i))
    );

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
    } catch (error) {
      setItems(previousItems);
      toast.error("Error al ajustar stock", {
        description: error.message || "Intente de nuevo.",
      });
    }
  }, [items]);

  const handleDeleteItem = useCallback(async (id, name) => {
    if (isTechnician) {
      toast.error("Permiso denegado", {
        description: "Solo los administradores pueden eliminar insumos.",
      });
      return;
    }
    if (
      !window.confirm(
        `¿Estás seguro de que deseás eliminar permanentemente el insumo "${name}"?`
      )
    ) {
      return;
    }

    const previousItems = [...items];
    // Optimistic UI
    setItems((prev) => prev.filter((i) => i._id !== id));

    try {
      await api.inventory.delete(id);
      toast.success(`Insumo eliminado`, {
        description: `${name} fue retirado del catálogo.`,
      });
    } catch (error) {
      setItems(previousItems);
      toast.error("Error al eliminar insumo", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  }, [isTechnician, items]);

  const handleExportToExcel = useCallback(async () => {
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
  }, [items]);

  const handleImportCSV = useCallback((e) => {
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

        const user = getLocalUser();
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
          const quantity = Math.max(0, Math.floor(Number(row[4]) || 0));
          const minQuantity = Math.max(0, Math.floor(Number(row[5]) || 0));
          const price = Math.max(0, Number(row[6]) || 0);

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
  }, [loadData]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const term = normalizeText(searchQuery);
      const matchesSearch =
        !term ||
        normalizeText(item.code).includes(term) ||
        normalizeText(item.name).includes(term) ||
        normalizeText(item.description).includes(term);

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
  }, [items, searchQuery, categoryFilter, stockFilter]);

  const totalValue = useMemo(() => {
    return items.reduce(
      (acc, curr) => acc + (curr.price || 0) * (curr.quantity || 0),
      0
    );
  }, [items]);

  const criticalItems = useMemo(() => {
    return items.filter(
      (i) => (i.quantity || 0) <= (i.min_quantity ?? i.minQuantity ?? 0)
    ).length;
  }, [items]);

  return {
    currentUser,
    isTechnician,
    items,
    loading,
    loadData,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
    fileInputRef,
    availableCategories,
    adjustQuantity,
    handleDeleteItem,
    handleExportToExcel,
    handleImportCSV,
    filteredItems,
    totalValue,
    criticalItems,
  };
}

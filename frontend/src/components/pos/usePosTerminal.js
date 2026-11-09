import { normalizeText, getArgentinaDateString } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  api,
  getLocalUser,
  normalizePlan,
  hasPOSAccess,
  hasMultiTallerAccess,
} from "@/services/api";
import { printPosReceipt } from "@/utils/printHelper";

export function usePosTerminal() {
  const user = getLocalUser();
  const [effectivePlan, setEffectivePlan] = useState(() =>
    normalizePlan(user.subscriptionPlan)
  );
  const isMultiTaller = hasMultiTallerAccess(effectivePlan);
  const isAdmin = user.role === "admin" || user.role === "superadmin";

  const [activeTab, setActiveTab] = useState("venta"); // "venta" | "historial"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [submitting, setSubmitting] = useState(false);
  const [activeVenue, setActiveVenue] = useState(null);

  // Calculadora de Vuelto
  const [cashReceived, setCashReceived] = useState("");

  // Historial States
  const [sales, setSales] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedVenueFilter, setSelectedVenueFilter] = useState(() => user?.venueId || "todas");
  const [dateRangeFilter, setDateRangeFilter] = useState("hoy"); // "hoy" | "7d" | "mes" | "todo" | "dia"
  const [selectedDate, setSelectedDate] = useState(null); // "YYYY-MM-DD" | null
  const [salesLoading, setSalesLoading] = useState(false);

  const searchInputRef = useRef(null);

  const handleSelectPaymentMethod = useCallback((method) => {
    setPaymentMethod(method);
    setCashReceived("");
  }, []);

  const loadInventoryAndVenues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.inventory.getAll();
      setItems(data || []);

      try {
        const venueData = await api.auth.getProfile();
        setActiveVenue(venueData);
        if (venueData?.subscriptionPlan) {
          setEffectivePlan(normalizePlan(venueData.subscriptionPlan));
        }
        if (venueData?.venue_id) {
          setSelectedVenueFilter((prev) => (prev === "todas" ? venueData.venue_id : prev));
        }
      } catch (err) {
        console.error("Error al cargar datos del taller:", err);
      }

      if (isMultiTaller && isAdmin) {
        try {
          const venuesData = await api.auth.getVenues();
          setVenues(venuesData || []);
        } catch (err) {
          console.error("Error al cargar sucursales:", err);
        }
      }
    } catch (error) {
      toast.error("Error al cargar inventario", {
        description:
          error.message || "No se pudo recuperar la lista de insumos.",
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isMultiTaller]);

  const loadSalesHistory = useCallback(async (venueId = "todas") => {
    try {
      setSalesLoading(true);
      const salesData = await api.sales.getAll(venueId);
      setSales(salesData || []);
    } catch (error) {
      toast.error("Error al cargar historial de ventas", {
        description: error.message || "No se pudo obtener el historial.",
      });
    } finally {
      setSalesLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchTerminalData = async () => {
      if (!isMounted) return;
      await loadInventoryAndVenues();
    };
    fetchTerminalData();
    return () => {
      isMounted = false;
    };
  }, [loadInventoryAndVenues]);

  useEffect(() => {
    if (activeTab === "historial") {
      let isMounted = true;
      const fetchSales = async () => {
        if (!isMounted) return;
        await loadSalesHistory(selectedVenueFilter);
      };
      fetchSales();
      return () => {
        isMounted = false;
      };
    }
  }, [activeTab, selectedVenueFilter, loadSalesHistory]);

  const addToCart = useCallback((item) => {
    if (item.quantity <= 0) {
      toast.error("Producto sin stock disponible.");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item._id);
      if (existing) {
        if (existing.quantity >= item.quantity) {
          toast.warning("Se alcanzó el límite de stock disponible.");
          return prevCart;
        }
        return prevCart.map((i) =>
          i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prevCart,
        {
          id: item._id,
          name: item.name,
          price: item.price || 0,
          code: item.code,
          maxQty: item.quantity,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateCartQty = useCallback((itemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            if (newQty > i.maxQty) {
              toast.warning("Límite de stock alcanzado.");
              return i;
            }
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
  }, []);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const handlePrintReceipt = useCallback(
    (
      saleId,
      soldItems,
      saleTotal,
      methodUsed,
      dateStr = null,
      cashRec = null
    ) => {
      printPosReceipt(
        {
          id: saleId,
          items: soldItems,
          total: saleTotal,
          payment_method: methodUsed,
          created_at: dateStr || new Date().toISOString(),
          cashReceived: cashRec,
        },
        activeVenue || {}
      );
    },
    [activeVenue]
  );

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }

    if (
      paymentMethod === "efectivo" &&
      cashReceived !== "" &&
      Number(cashReceived) > 0 &&
      Number(cashReceived) < total
    ) {
      toast.warning("El dinero recibido es inferior al total a pagar.");
      return;
    }

    try {
      setSubmitting(true);
      const saleData = {
        total,
        paymentMethod,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          code: i.code,
          price: i.price,
          quantity: i.quantity,
        })),
      };

      const result = await api.sales.create(saleData);

      const cambio =
        paymentMethod === "efectivo" &&
        cashReceived &&
        Number(cashReceived) > total
          ? Number(cashReceived) - total
          : 0;

      toast.success("¡Venta procesada con éxito!", {
        description:
          cambio > 0
            ? `Vuelto a entregar: $${cambio.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}`
            : `Comprobante #${(result._id || "").substring(0, 8).toUpperCase()} emitido.`,
      });

      // Disparar ventana de impresión directa
      handlePrintReceipt(
        result._id || "POS",
        saleData.items,
        total,
        paymentMethod,
        null,
        paymentMethod === "efectivo" ? cashReceived : null
      );

      setCart([]);
      setCashReceived("");
      loadInventoryAndVenues();
    } catch (error) {
      toast.error("Error al procesar la venta", {
        description: error.message || "Intente nuevamente en unos minutos.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    cart,
    paymentMethod,
    cashReceived,
    total,
    handlePrintReceipt,
    loadInventoryAndVenues,
  ]);

  const handleCashKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (cart.length > 0 && !submitting) {
          handleCheckout();
        }
      }
    },
    [cart.length, submitting, handleCheckout]
  );

  // Atajos de teclado y lector de código en segundo plano
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (e.key === "F4") {
        e.preventDefault();
        const methods = ["efectivo", "transferencia", "debito", "credito"];
        const nextIndex =
          (methods.indexOf(paymentMethod) + 1) % methods.length;
        handleSelectPaymentMethod(methods[nextIndex]);
        return;
      }

      if (e.key === "F8") {
        e.preventDefault();
        if (cart.length > 0 && !submitting) {
          handleCheckout();
        }
        return;
      }

      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";

      if (e.key === "F9" || (!isInput && (e.key === "+" || e.key === "Add"))) {
        e.preventDefault();
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1];
          updateCartQty(lastItem.id, 1);
        }
        return;
      }

      if (
        e.key === "F3" ||
        (!isInput && (e.key === "-" || e.key === "Subtract"))
      ) {
        e.preventDefault();
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1];
          updateCartQty(lastItem.id, -1);
        }
        return;
      }

      if (activeTab !== "venta") return;

      if (
        isInput &&
        activeEl !== searchInputRef.current &&
        activeEl.id !== "cash-received"
      ) {
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

          const foundItem = items.find(
            (item) => (item.code || "").toLowerCase() === barcode.toLowerCase()
          );

          if (foundItem) {
            addToCart(foundItem);
            toast.success(`Escaneado: ${foundItem.name}`, {
              description: `Se agregó al carrito. Código: ${foundItem.code}`,
            });
          } else {
            toast.error(`Código no encontrado: "${barcode}"`, {
              description:
                "Asegurate de registrar primero el insumo en el Inventario.",
            });
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
  }, [
    items,
    cart,
    paymentMethod,
    activeTab,
    submitting,
    cashReceived,
    addToCart,
    updateCartQty,
    handleCheckout,
    handleSelectPaymentMethod,
  ]);

  const categories = useMemo(() => {
    const cats = items.map((i) => i.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(searchQuery);
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        normalizeText(item.name).includes(q) ||
        normalizeText(item.code).includes(q);
      const matchesCat =
        categoryFilter === "todas" || item.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, categoryFilter]);

  // Mapa de días con ventas para el calendario interactivo
  const salesDaysMap = useMemo(() => {
    const map = {};
    for (const s of sales) {
      const day = getArgentinaDateString(s.created_at || s.date);
      if (day) {
        if (!map[day]) {
          map[day] = { count: 0, total: 0 };
        }
        map[day].count += 1;
        map[day].total += Number(s.total) || 0;
      }
    }
    return map;
  }, [sales]);

  const handleSelectSpecificDate = useCallback((dateStr) => {
    setSelectedDate(dateStr);
    if (dateStr) {
      setDateRangeFilter("dia");
    } else {
      setDateRangeFilter("hoy");
    }
  }, []);

  const handleClearSpecificDate = useCallback(() => {
    setSelectedDate(null);
    setDateRangeFilter("hoy");
  }, []);

  const handleSetDateRangeFilter = useCallback((range) => {
    setDateRangeFilter(range);
    setSelectedDate(null);
  }, []);

  // Filtrado por período y arqueo de caja
  const filteredSales = useMemo(() => {
    if (dateRangeFilter === "dia" && selectedDate) {
      return sales.filter((s) => {
        const saleDay = getArgentinaDateString(s.created_at || s.date);
        return saleDay === selectedDate;
      });
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const sevenDaysAgo = startOfToday - 6 * 24 * 60 * 60 * 1000;
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();

    return sales.filter((s) => {
      if (dateRangeFilter === "todo") return true;
      const raw = s.created_at || s.date;
      if (!raw) return false;
      const ts = new Date(raw).getTime();
      if (isNaN(ts)) return false;
      if (dateRangeFilter === "hoy") return ts >= startOfToday;
      if (dateRangeFilter === "7d") return ts >= sevenDaysAgo;
      if (dateRangeFilter === "mes") return ts >= startOfMonth;
      return true;
    });
  }, [sales, dateRangeFilter, selectedDate]);

  const salesBreakdown = useMemo(() => {
    let totalAmount = 0;
    let cashAmount = 0;
    let digitalAmount = 0;

    for (const s of filteredSales) {
      const amt = Number(s.total) || 0;
      totalAmount += amt;
      const method = (s.payment_method || "efectivo").toLowerCase();
      if (method === "efectivo") {
        cashAmount += amt;
      } else {
        digitalAmount += amt;
      }
    }

    return {
      totalAmount,
      cashAmount,
      digitalAmount,
      count: filteredSales.length,
    };
  }, [filteredSales]);

  const handleExportSalesToExcel = useCallback(async () => {
    if (filteredSales.length === 0) {
      toast.error("No hay ventas en el período seleccionado para exportar.");
      return;
    }

    try {
      toast.info("Generando archivo Excel de caja...");
      const { default: writeXlsxFile } = await import("write-excel-file/browser");

      const columns = [
        {
          header: {
            value: "ID Ticket",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (s) => ({
            type: String,
            value: String(
              s._id ? s._id.substring(0, 8).toUpperCase() : "N/A"
            ),
            align: "center",
          }),
          width: 16,
        },
        {
          header: {
            value: "Fecha y Hora",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (s) => {
            const d = s.created_at || s.date;
            return {
              type: String,
              value: d
                ? `${new Date(d).toLocaleDateString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })} ${new Date(d).toLocaleTimeString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })} hs`
                : "-",
              align: "center",
            };
          },
          width: 22,
        },
        {
          header: {
            value: "Sucursal / Taller",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (s) => ({
            type: String,
            value:
              s.venue_id?.name || activeVenue?.name || "Sucursal Central",
          }),
          width: 24,
        },
        {
          header: {
            value: "Medio de Pago",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (s) => ({
            type: String,
            value: (s.payment_method || "Efectivo").toUpperCase(),
            align: "center",
            fontWeight: "bold",
          }),
          width: 18,
        },
        {
          header: {
            value: "Productos / Cantidad",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (s) => {
            const itemsSummary = (s.items || [])
              .map((i) => `${i.name || i.code} (x${i.quantity || 1})`)
              .join(", ");
            return { type: String, value: itemsSummary || "Sin detalle" };
          },
          width: 36,
        },
        {
          header: {
            value: "Total Cobrado",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "right",
          },
          cell: (s) => ({
            type: Number,
            value: Number(s.total) || 0,
            format: "$#,##0.00",
            align: "right",
          }),
          width: 18,
        },
      ];

      await writeXlsxFile(filteredSales, { columns }).toFile(
        `Caja_Ventas_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Historial de ventas exportado a Excel (.xlsx).");
    } catch (err) {
      console.error("Error al generar Excel de ventas:", err);
      toast.error("Error al exportar ventas a Excel.");
    }
  }, [filteredSales, activeVenue]);

  const hasAccess = hasPOSAccess(effectivePlan) || user.role === "superadmin";

  return {
    user,
    effectivePlan,
    isMultiTaller,
    isAdmin,
    hasAccess,
    activeTab,
    setActiveTab,
    items,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    cart,
    setCart,
    paymentMethod,
    setPaymentMethod: handleSelectPaymentMethod,
    submitting,
    cashReceived,
    setCashReceived,
    sales,
    venues,
    selectedVenueFilter,
    setSelectedVenueFilter,
    dateRangeFilter,
    setDateRangeFilter: handleSetDateRangeFilter,
    selectedDate,
    setSelectedDate: handleSelectSpecificDate,
    clearSelectedDate: handleClearSpecificDate,
    salesDaysMap,
    salesLoading,
    searchInputRef,
    categories,
    filteredItems,
    addToCart,
    updateCartQty,
    removeFromCart,
    total,
    handleCheckout,
    handleCashKeyDown,
    filteredSales,
    salesBreakdown,
    handlePrintReceipt,
    handleExportSalesToExcel,
  };
}

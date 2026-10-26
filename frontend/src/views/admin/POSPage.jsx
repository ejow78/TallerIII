import { useState, useEffect, useRef, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShoppingCart,
  Search,
  Trash2,
  Plus,
  Minus,
  Printer,
  DollarSign,
  CreditCard,
  Smartphone,
  Wallet,
  AlertCircle,
  History,
  Store,
  Sparkles,
  Download,
  X,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  api,
  getLocalUser,
  normalizePlan,
  hasPOSAccess,
  hasMultiTallerAccess,
} from "@/services/api";
import { printPosReceipt } from "@/utils/printHelper";

export default function POSPage() {
  const user = getLocalUser();
  const [effectivePlan, setEffectivePlan] = useState(
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
  const [selectedVenueFilter, setSelectedVenueFilter] = useState("todas");
  const [salesLoading, setSalesLoading] = useState(false);

  const searchInputRef = useRef(null);

  const loadInventoryAndVenues = async () => {
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
  };

  const loadSalesHistory = async (venueId = "todas") => {
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
  };

  useEffect(() => {
    loadInventoryAndVenues();
  }, []);

  useEffect(() => {
    if (activeTab === "historial") {
      loadSalesHistory(selectedVenueFilter);
    }
  }, [activeTab, selectedVenueFilter]);

  useEffect(() => {
    setCashReceived("");
  }, [paymentMethod]);

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
        setPaymentMethod(methods[nextIndex]);
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
          handleScanBarcode(buffer.trim());
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
  }, [items, cart, paymentMethod, activeTab, submitting, cashReceived]);

  const handleScanBarcode = (barcode) => {
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
  };

  const addToCart = (item) => {
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
  };

  const updateCartQty = (itemId, delta) => {
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
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Impresión directa sin bloqueo de pop-ups
  const handlePrintReceipt = (
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
  };

  const handleExportSalesToExcel = async () => {
    if (sales.length === 0) {
      toast.error("No hay ventas registradas para exportar.");
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
              value: d ? new Date(d).toLocaleString("es-AR") : "-",
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

      await writeXlsxFile(sales, { columns }).toFile(
        `Caja_Ventas_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Historial de ventas exportado a Excel (.xlsx).");
    } catch (err) {
      console.error("Error al generar Excel de ventas:", err);
      toast.error("Error al exportar ventas a Excel.");
    }
  };

  const handleCheckout = async () => {
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
  };

  const handleCashKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (cart.length > 0 && !submitting) {
        handleCheckout();
      }
    }
  };

  const categories = useMemo(() => {
    const cats = items.map((i) => i.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [items]);

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.code && item.code.toLowerCase().includes(q));
    const matchesCat =
      categoryFilter === "todas" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <div className="flex h-[65vh] items-center justify-center text-foreground">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-light">
            Cargando punto de venta...
          </p>
        </div>
      </div>
    );
  }

  if (!hasPOSAccess(effectivePlan) && user.role !== "superadmin") {
    return (
      <div className="flex h-[70vh] items-center justify-center p-4">
        <Card className="bg-card/40 border-border/80 max-w-md w-full p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-outfit text-xl font-bold text-foreground">
              Control de Caja no incluido en Taller Básico
            </h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              El módulo de Caja y Punto de Venta (POS) está disponible a partir del plan{" "}
              <span className="text-primary font-semibold">Taller Pro</span> y{" "}
              <span className="text-primary font-semibold">Multi-Taller Pro</span>.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/dashboard/perfil">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-6 h-10 rounded-xl cursor-pointer">
                Ver Planes en Configuración
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
            <span>Caja y Punto de Venta</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Facturación rápida de repuestos y accesorios con descuento automático de stock e impresión de ticket.
          </p>
        </div>

        {/* Selector de Vista: Punto de Venta vs Historial */}
        <div className="flex items-center bg-card/80 border border-border/80 rounded-xl p-1.5 self-start sm:self-auto shadow-sm select-none">
          <button
            type="button"
            onClick={() => setActiveTab("venta")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "venta"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Punto de Venta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("historial")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "historial"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            Historial de Ventas
          </button>
        </div>
      </div>

      {activeTab === "venta" ? (
        /* VISTA DE TERMINAL POS (2 COLUMNAS ESPACIOSAS Y CÓMODAS) */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda (7 cols): Catálogo de Productos */}
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
                    Todos ({items.length})
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
                      onClick={() => !isOutOfStock && addToCart(item)}
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

          {/* Columna Derecha (5 cols): Ticket / Carrito de Cobro */}
          <Card className="xl:col-span-5 bg-card/40 border-border/80 shadow-md flex flex-col overflow-hidden">
            <CardHeader className="border-b border-border/60 p-5 sm:p-6 flex flex-row items-center justify-between space-y-0 bg-muted/15">
              <div>
                <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-4.5 h-4.5 text-primary" />
                  Ticket de Venta Actual
                </CardTitle>
                <CardDescription className="text-xs font-light mt-1">
                  {cart.length === 0
                    ? "Seleccioná artículos del catálogo para cobrar"
                    : `${cart.reduce((a, b) => a + b.quantity, 0)} unidades seleccionadas`}
                </CardDescription>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-destructive/10"
                >
                  Vaciar
                </button>
              )}
            </CardHeader>

            <CardContent className="p-5 sm:p-6 flex flex-col justify-between space-y-5">
              {/* Lista de Ítems del Carrito (SIN scroll cuando está vacío) */}
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 py-12 px-6 border border-dashed border-border/60 rounded-2xl bg-background/30">
                  <ShoppingCart className="w-9 h-9 opacity-25 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground/80">
                    El carrito está vacío
                  </p>
                  <p className="text-xs text-muted-foreground/75 max-w-[250px] leading-relaxed">
                    Tocá cualquier producto del listado izquierdo para sumarlo al ticket.
                  </p>
                </div>
              ) : (
                <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-background/70 p-3.5 rounded-xl border border-border/60 text-xs gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1 text-left">
                        <span className="text-sm font-semibold text-foreground block truncate leading-snug">
                          {item.name}
                        </span>
                        <span className="text-xs text-primary font-mono font-bold block">
                          $
                          {(item.price * item.quantity).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span className="text-[11px] text-muted-foreground font-normal">
                            (${item.price.toLocaleString("es-AR")} c/u)
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-border/80 rounded-lg bg-card">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-foreground font-mono text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bloque de Pago y Total */}
              <div className="border-t border-border/60 pt-5 space-y-4 text-left">
                {/* Selector de Medio de Pago en 4 píldoras */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Medio de Pago [F4]
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {[
                      { id: "efectivo", label: "Efectivo", icon: DollarSign },
                      { id: "transferencia", label: "Transferencia", icon: Smartphone },
                      { id: "debito", label: "Débito", icon: CreditCard },
                      { id: "credito", label: "Crédito", icon: Wallet },
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            active
                              ? "bg-primary/15 border-primary text-primary font-bold shadow-xs"
                              : "border-border/70 bg-background/60 hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-primary" />
                          <span className="truncate">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calculadora de Vuelto (Solo Efectivo y cuando hay ítems) */}
                {paymentMethod === "efectivo" && total > 0 && (
                  <div className="bg-background/60 border border-border/70 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="cash-received"
                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Abona con (Opcional)
                      </Label>
                      <button
                        type="button"
                        onClick={() => setCashReceived(total.toString())}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Pago Justo (${total.toLocaleString("es-AR")})
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm font-mono text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="cash-received"
                        type="number"
                        placeholder={total.toString()}
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        onKeyDown={handleCashKeyDown}
                        className="pl-8 h-10 text-sm font-mono bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                      />
                    </div>
                    {cashReceived !== "" && Number(cashReceived) > total && (
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs text-muted-foreground">
                          Vuelto a entregar:
                        </span>
                        <span className="text-base font-black font-outfit text-emerald-400 font-mono">
                          $
                          {(Number(cashReceived) - total).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                    {cashReceived !== "" &&
                      Number(cashReceived) > 0 &&
                      Number(cashReceived) < total && (
                        <div className="text-xs text-destructive font-semibold">
                          Faltan: $
                          {(total - Number(cashReceived)).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      )}
                  </div>
                )}

                {/* Totalizador */}
                <div className="flex justify-between items-baseline bg-primary/10 p-4 sm:p-5 rounded-xl border border-primary/25">
                  <span className="text-xs sm:text-sm font-bold tracking-wider text-primary uppercase">
                    TOTAL A COBRAR:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-outfit text-primary font-mono">
                    $
                    {total.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Botón Principal de Cobro e Impresión */}
                <Button
                  onClick={handleCheckout}
                  disabled={
                    submitting ||
                    cart.length === 0 ||
                    (paymentMethod === "efectivo" &&
                      cashReceived !== "" &&
                      Number(cashReceived) > 0 &&
                      Number(cashReceived) < total)
                  }
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2.5 h-12"
                >
                  <Printer className="w-4.5 h-4.5" />
                  {submitting
                    ? "Procesando cobro..."
                    : "Confirmar y Emitir Ticket [F8]"}
                </Button>

                <p className="hidden md:block text-[11px] text-center text-muted-foreground font-mono">
                  Atajos: [F2] Buscar • [F4] Medio de Pago • [F8] Cobrar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* VISTA DE HISTORIAL DE VENTAS */
        <div className="space-y-4">
          {/* Barra de Filtros del Historial */}
          <Card className="bg-card/30 border-border/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5 text-left">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Registro de Caja y Tickets Emitidos
              </h3>
              <p className="text-[11px] text-muted-foreground font-light">
                Consultá cobros anteriores y re-imprimí cualquier ticket en un clic.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {isMultiTaller && isAdmin && (
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-muted-foreground shrink-0" />
                  <select
                    value={selectedVenueFilter}
                    onChange={(e) => setSelectedVenueFilter(e.target.value)}
                    className="h-9 bg-background/85 border border-border rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="todas">Todas las Sucursales</option>
                    {venues.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <Button
                variant="outline"
                onClick={handleExportSalesToExcel}
                className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
                title="Exportar historial de caja a Excel (.xlsx)"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Exportar Excel
              </Button>
            </div>
          </Card>

          {/* Tabla / Tarjetas de Historial */}
          <Card className="bg-card/30 border-border/80 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {salesLoading ? (
                <div className="text-center py-16 text-xs font-light text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Cargando transacciones de caja...
                </div>
              ) : sales.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-xs font-light space-y-1">
                  <AlertCircle className="w-8 h-8 opacity-30 mx-auto text-muted-foreground mb-1" />
                  <p>No se encontraron transacciones registradas.</p>
                </div>
              ) : (
                <>
                  {/* Vista Móvil (< md): Tarjetas de Ventas */}
                  <div className="space-y-3 p-3.5 md:hidden">
                    {sales.map((sale) => (
                      <div
                        key={sale._id}
                        className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2.5 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-xs text-primary block">
                              #{sale._id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
                              {new Date(sale.created_at).toLocaleString("es-AR")}
                            </span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-bold uppercase px-2 py-0.5 shrink-0"
                          >
                            {sale.payment_method}
                          </Badge>
                        </div>

                        <p className="text-xs text-foreground font-light leading-snug pt-1.5 border-t border-border/40">
                          {sale.items
                            ?.map((i) => `${i.name} (x${i.quantity})`)
                            .join(", ")}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              {sale.venueName} • {sale.cajero}
                            </span>
                            <span className="font-mono font-black text-base text-foreground">
                              $
                              {Number(sale.total).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePrintReceipt(
                                sale._id,
                                sale.items,
                                Number(sale.total),
                                sale.payment_method,
                                sale.created_at
                              )
                            }
                            className="h-8 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Re-imprimir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista Escritorio (>= md): Tabla completa */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                          <th className="py-3.5 px-4">Ticket</th>
                          <th className="py-3.5 px-4">Fecha y Hora</th>
                          <th className="py-3.5 px-4">Sucursal</th>
                          <th className="py-3.5 px-4">Cajero</th>
                          <th className="py-3.5 px-4 max-w-xs">
                            Artículos Vendidos
                          </th>
                          <th className="py-3.5 px-4">Medio de Pago</th>
                          <th className="py-3.5 px-4 text-right">
                            Monto Cobrado
                          </th>
                          <th className="py-3.5 px-4 text-right">Imprimir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {sales.map((sale) => (
                          <tr
                            key={sale._id}
                            className="hover:bg-card/40 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold font-mono text-[11px] text-primary">
                              #{sale._id.substring(0, 8).toUpperCase()}
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground font-mono text-[10px]">
                              {new Date(sale.created_at).toLocaleString("es-AR")}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <Store className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                                <span className="text-foreground font-medium">
                                  {sale.venueName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground">
                              {sale.cajero}
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="text-foreground font-light leading-tight">
                                {sale.items
                                  ?.map((i) => `${i.name} (x${i.quantity})`)
                                  .join(", ")}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 uppercase">
                              <Badge
                                variant="secondary"
                                className="text-[9px] font-bold px-2 py-0.5"
                              >
                                {sale.payment_method}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground text-sm">
                              $
                              {Number(sale.total).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handlePrintReceipt(
                                    sale._id,
                                    sale.items,
                                    Number(sale.total),
                                    sale.payment_method,
                                    sale.created_at
                                  )
                                }
                                className="h-8 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                                title="Re-imprimir Ticket de Venta"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                Ticket
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

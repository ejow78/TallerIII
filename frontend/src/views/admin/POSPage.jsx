import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  Scan, 
  Printer, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Wallet,
  AlertCircle,
  History,
  Store,
  Keyboard,
  Sparkles,
  Receipt
} from "lucide-react";
import { api } from "@/services/api";

export default function POSPage() {
  const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
  const isMultiTaller = user.subscriptionPlan === "Multi-Taller Pro";
  const isAdmin = user.role === "admin" || user.role === "superadmin";

  const [activeTab, setActiveTab] = useState("venta"); // "venta" | "historial"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [submitting, setSubmitting] = useState(false);
  const [activeVenue, setActiveVenue] = useState(null);

  // Calculadora de Vuelto
  const [cashReceived, setCashReceived] = useState("0");

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
      setItems(data);
      
      try {
        const venueData = await api.auth.getProfile();
        setActiveVenue(venueData);
      } catch (err) {
        console.error("Error al cargar datos del taller:", err);
      }

      if (isMultiTaller && isAdmin) {
        try {
          const venuesData = await api.auth.getVenues();
          setVenues(venuesData);
        } catch (err) {
          console.error("Error al cargar sucursales:", err);
        }
      }
    } catch (error) {
      toast.error("Error al cargar inventario", {
        description: error.message || "No se pudo recuperar la lista de insumos."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSalesHistory = async (venueId = "todas") => {
    try {
      setSalesLoading(true);
      const salesData = await api.sales.getAll(venueId);
      setSales(salesData);
    } catch (error) {
      toast.error("Error al cargar historial de ventas", {
        description: error.message || "No se pudo obtener el historial."
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

  // Resetear vuelto al cambiar de método
  useEffect(() => {
    setCashReceived("0");
  }, [paymentMethod]);

  // 🔌 INTEGRACIÓN DE ATAJOS DE TECLADO Y LECTOR DE CÓDIGO
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      // 1. ATAJOS DE TECLADO GLOBALES
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (e.key === "F4") {
        e.preventDefault();
        const methods = ["efectivo", "transferencia", "debito", "credito"];
        const nextIndex = (methods.indexOf(paymentMethod) + 1) % methods.length;
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
      const isInput = activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA";

      // Atajos de cantidad: F9 o '+' (sumar), F3 o '-' (restar) al último producto del carrito
      if (e.key === "F9" || (!isInput && (e.key === "+" || e.key === "Add"))) {
        e.preventDefault();
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1];
          updateCartQty(lastItem.id, 1);
        }
        return;
      }

      if (e.key === "F3" || (!isInput && (e.key === "-" || e.key === "Subtract"))) {
        e.preventDefault();
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1];
          updateCartQty(lastItem.id, -1);
        }
        return;
      }

      // 2. DETECCIÓN DEL LECTOR DE CÓDIGO (SOLO EN PESTAÑA VENTA)
      if (activeTab !== "venta") return;

      // Si el foco está en un input y NO es la búsqueda de productos, ignoramos para no interrumpir la escritura manual del usuario.
      if (isInput && activeEl !== searchInputRef.current && activeEl.id !== "cash-received") {
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
      (item) => item.code.toLowerCase() === barcode.toLowerCase()
    );

    if (foundItem) {
      addToCart(foundItem);
      toast.success(`Escaneado: ${foundItem.name}`, {
        description: `Se agregó al carrito. Código: ${foundItem.code}`
      });
    } else {
      toast.error(`Código no encontrado: "${barcode}"`, {
        description: "Asegúrate de registrar primero el insumo en el Inventario."
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
          toast.warning("Se ha alcanzado el límite de stock de este insumo.");
          return prevCart;
        }
        return prevCart.map((i) =>
          i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { id: item._id, name: item.name, price: item.price || 0, code: item.code, maxQty: item.quantity, quantity: 1 }];
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
    toast.info("Producto removido del carrito.");
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 🖨️ IMPRESIÓN DE TICKET TÉRMICO (58mm/80mm)
  const handlePrintReceipt = (saleId, soldItems, saleTotal, methodUsed, dateStr = null) => {
    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (!printWindow) {
      toast.error("El bloqueador de ventanas emergentes impidió abrir el ticket.");
      return;
    }

    const ticketDate = dateStr ? new Date(dateStr) : new Date();

    const ticketHtml = `
      <html>
        <head>
          <title>Ticket de Venta #${saleId.substring(0, 8)}</title>
          <style>
            @page {
              margin: 0;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 260px;
              margin: 0 auto;
              padding: 15px 5px;
              font-size: 11px;
              color: #000;
              line-height: 1.3;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .header-title { font-size: 15px; font-weight: bold; margin-bottom: 2px; text-transform: uppercase; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: flex-start; }
            .item-name { flex: 1; padding-right: 8px; word-break: break-word; }
            .item-qty { width: 30px; text-align: center; font-weight: bold; }
            .item-price { width: 75px; text-align: right; font-weight: bold; }
            .footer { margin-top: 15px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="text-center header-title">REPAIRIT</div>
          <div class="text-center bold">TICKET DE VENTA</div>
          <div class="text-center bold">${activeVenue?.name ? activeVenue.name.toUpperCase() : "SUCURSAL CENTRAL"}</div>
          <div class="divider"></div>
          <div>Fecha: ${ticketDate.toLocaleString("es-AR")}</div>
          <div>Ticket: ${saleId.substring(0, 8).toUpperCase()}</div>
          <div class="divider"></div>
          <div class="bold" style="margin-bottom: 6px;">ITEMS:</div>
          ${soldItems.map(item => `
            <div class="item-row">
              <span class="item-name">${item.name}</span>
              <span class="item-qty">x${item.quantity}</span>
              <span class="item-price">$${(item.price * item.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          `).join("")}
          <div class="divider"></div>
          <div style="margin-bottom: 4px;">Medio de Pago: ${methodUsed.toUpperCase()}</div>
          <div class="item-row bold" style="font-size: 13px; margin-top: 6px; border-top: 1px dashed #000; padding-top: 4px;">
            <span>TOTAL:</span>
            <span class="text-right">$${saleTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="divider"></div>
          <div class="text-center footer">
            ¡Gracias por su compra!
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(ticketHtml);
    printWindow.document.close();
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }

    // Validar cobro en efectivo si escribieron un monto
    if (paymentMethod === "efectivo" && cashReceived && Number(cashReceived) < total) {
      toast.warning("El dinero recibido es inferior al total a pagar.");
      return;
    }

    try {
      setSubmitting(true);
      const saleData = {
        total,
        paymentMethod,
        items: cart.map(i => ({ id: i.id, name: i.name, code: i.code, price: i.price, quantity: i.quantity }))
      };

      const result = await api.sales.create(saleData);
      
      const cambio = paymentMethod === "efectivo" && cashReceived 
        ? Number(cashReceived) - total 
        : 0;

      toast.success("¡Venta procesada con éxito!", {
        description: cambio > 0 
          ? `Vuelto a entregar: $${cambio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
          : `Se registró bajo el ID ${result._id.substring(0, 8)}.`
      });

      handlePrintReceipt(result._id, saleData.items, total, paymentMethod);

      setCart([]);
      setCashReceived("0");
      loadInventoryAndVenues();
    } catch (error) {
      toast.error("Error al procesar la venta", {
        description: error.message || "Intente nuevamente en unos minutos."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar cobro directo presionando Enter en la calculadora
  const handleCashKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (cart.length > 0 && !submitting) {
        handleCheckout();
      }
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (loading) {
    return (
      <div className="flex h-[65vh] items-center justify-center bg-background/50 text-foreground">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/20" />
          <p className="text-xs text-muted-foreground font-medium tracking-wide">Cargando módulo de Caja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-primary shrink-0" />
            <span>Caja</span>
          </h2>
          <p className="text-xs text-muted-foreground font-light">
            Vende insumos del inventario rápidamente y revisa el registro histórico de caja.
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex items-center bg-card border border-border rounded-lg p-1 self-start md:self-auto shadow-sm select-none">
          <button
            onClick={() => setActiveTab("venta")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === "venta"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Nueva Venta
          </button>
          <button
            onClick={() => setActiveTab("historial")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "historial"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            Historial de Ventas
          </button>
        </div>
      </div>

      {activeTab === "venta" ? (
        /* VISTA DE NUEVA VENTA (POS) */
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-[11px] text-emerald-400 font-medium select-none self-start sm:self-auto max-w-max shadow-sm">
            <Scan className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>Escáner de Código Activo <span className="font-mono text-[10px] text-emerald-500 font-bold">(Lectura Global)</span></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Izquierda: Catálogo e Insumos */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-card/30 border-border/70 shadow-xl backdrop-blur-md">
                <CardHeader className="pb-4">
                  <div className="relative w-full flex items-center">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
                    <Input
                      ref={searchInputRef}
                      id="search-input"
                      type="text"
                      placeholder="Buscar producto por nombre o escanear código de barras... [F2]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-background/80 border-border/80 text-xs w-full pl-10 h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground text-xs font-light space-y-2">
                      <Sparkles className="w-8 h-8 opacity-20 mx-auto text-primary" />
                      <p>No se encontraron insumos disponibles en el inventario.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 max-h-[calc(100vh-280px)] overflow-y-auto">
                      {filteredItems.map((item) => {
                        const isOutOfStock = item.quantity <= 0;
                        return (
                          <div
                            key={item._id}
                            onClick={() => !isOutOfStock && addToCart(item)}
                            className={`flex justify-between items-center p-3.5 rounded-xl border transition-all select-none ${
                              isOutOfStock 
                                ? "opacity-45 bg-muted/10 border-border/40 cursor-not-allowed" 
                                : "bg-card/70 border-border/60 hover:bg-primary/10 hover:border-primary/40 cursor-pointer active:scale-[0.98] shadow-sm"
                            }`}
                          >
                            <div className="space-y-1.5 pr-2">
                              <span className="text-xs font-bold text-foreground block leading-tight">{item.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded-md border border-border/50 inline-block">{item.code}</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] text-muted-foreground font-light">Stock:</span>
                                <Badge 
                                  variant={isOutOfStock ? "destructive" : item.quantity < item.minQuantity ? "warning" : "secondary"}
                                  className="text-[9px] px-1.5 py-0 font-bold"
                                >
                                  {item.quantity} un
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black font-outfit text-primary block">
                                ${item.price?.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className="text-[9px] text-muted-foreground block font-light">Agregar</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna Derecha: Carrito de Compras activo */}
            <div className="space-y-4">
              <Card className="bg-card/30 border-border/80 shadow-2xl flex flex-col backdrop-blur-md">
                <CardHeader className="border-b border-border/60 pb-3.5">
                  <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4.5 h-4.5 text-primary" />
                      Detalle de Venta
                    </span>
                    {cart.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {cart.reduce((a, b) => a + b.quantity, 0)} ítems
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[11px] font-light">
                    Resumen de productos seleccionados para cobro
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  
                  {/* Items del Carrito */}
                  <div className="flex-grow overflow-y-auto max-h-[160px] space-y-2 pr-1">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 py-12">
                        <ShoppingCart className="w-10 h-10 opacity-20 text-muted-foreground" />
                        <p className="text-xs font-medium">El carrito está vacío</p>
                        <p className="text-[10px] text-muted-foreground/60">Haz clic en productos del catálogo o escanéalos con el lector.</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-muted/20 p-2.5 rounded-xl border border-border/50 text-xs">
                          <div className="space-y-0.5 max-w-[150px]">
                            <span className="font-bold text-foreground block truncate leading-tight">{item.name}</span>
                            <span className="text-[10px] text-primary font-mono font-semibold">${item.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-border/80 rounded-lg bg-background/90 shadow-sm">
                              <button
                                onClick={() => updateCartQty(item.id, -1)}
                                className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-bold text-foreground font-mono text-[11px]">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.id, 1)}
                                className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Totalizador y Métodos de Pago */}
                  <div className="border-t border-border/60 pt-3.5 space-y-3.5">
                    <div className="flex justify-between items-baseline bg-primary/5 p-3 rounded-xl border border-primary/20">
                      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">TOTAL:</span>
                      <span className="text-2xl font-black font-outfit text-primary font-mono">
                        ${total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Métodos de Pago */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Medio de Pago [F4]</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("efectivo")}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            paymentMethod === "efectivo"
                              ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                              : "border-border/80 bg-background/50 hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          <DollarSign className="w-4 h-4 shrink-0 text-primary" />
                          <span>Efectivo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("transferencia")}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            paymentMethod === "transferencia"
                              ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                              : "border-border/80 bg-background/50 hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          <Smartphone className="w-4 h-4 shrink-0 text-primary" />
                          <span>Transf.</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("debito")}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            paymentMethod === "debito"
                              ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                              : "border-border/80 bg-background/50 hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 shrink-0 text-primary" />
                          <span>Débito</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("credito")}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            paymentMethod === "credito"
                              ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                              : "border-border/80 bg-background/50 hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          <Wallet className="w-4 h-4 shrink-0 text-primary" />
                          <span>Crédito</span>
                        </button>

                      </div>
                    </div>

                    {/* Calculadora de Vuelto (Solo Efectivo) */}
                    {paymentMethod === "efectivo" && total > 0 && (
                      <div className="bg-muted/25 border border-border/60 rounded-xl p-3 space-y-2 animate-in slide-in-from-top-1 duration-150">
                        <Label htmlFor="cash-received" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                          <span>Dinero Recibido</span>
                          {cashReceived && Number(cashReceived) === total && (
                            <span className="text-emerald-400 font-bold">Pago Justo</span>
                          )}
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-2.5 text-xs font-mono text-muted-foreground">$</span>
                            <Input
                              id="cash-received"
                              type="number"
                              placeholder="0,00"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                              onFocus={(e) => e.target.select()}
                              onKeyDown={handleCashKeyDown}
                              className="pl-7 h-9 text-xs font-mono bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setCashReceived(total.toString())}
                            className="h-9 text-[10px] font-bold uppercase tracking-wider px-3.5 border border-border/80 cursor-pointer select-none rounded-lg"
                          >
                            Pago Justo
                          </Button>
                        </div>
                        {cashReceived && Number(cashReceived) > total && (
                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-[10px] text-muted-foreground font-light">Vuelto a entregar:</span>
                            <span className="text-sm font-black font-outfit text-emerald-400 font-mono">
                              ${(Number(cashReceived) - total).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                        {cashReceived && Number(cashReceived) < total && (
                          <div className="text-[10px] text-destructive font-semibold">
                            Faltan: ${(total - Number(cashReceived)).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Confirmar Cobro */}
                    <Button
                      onClick={handleCheckout}
                      disabled={submitting || cart.length === 0 || (paymentMethod === "efectivo" && cashReceived && Number(cashReceived) < total)}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-3.5 rounded-xl cursor-pointer shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 h-11"
                    >
                      <Printer className="w-4 h-4" />
                      {submitting ? "Confirmando..." : "Confirmar y Emitir Ticket [F8]"}
                    </Button>

                    {/* Atajos de teclado informativos */}
                    <div className="bg-muted/15 border border-border/40 rounded-xl p-3 text-[9px] text-muted-foreground space-y-1.5">
                      <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground/80">
                        <Keyboard className="w-3.5 h-3.5 text-primary" />
                        Atajos de Teclado Rápidos
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex justify-between"><span>[F2] Buscar</span> <span className="font-mono text-foreground font-bold">[F2]</span></div>
                        <div className="flex justify-between"><span>[F4] Medio Pago</span> <span className="font-mono text-foreground font-bold">[F4]</span></div>
                        <div className="flex justify-between"><span>[F9 / +] Sumar Cant.</span> <span className="font-mono text-foreground font-bold">[F9]</span></div>
                        <div className="flex justify-between"><span>[F3 / -] Restar Cant.</span> <span className="font-mono text-foreground font-bold">[F3]</span></div>
                        <div className="flex justify-between col-span-2 pt-1 border-t border-border/40 mt-0.5">
                          <span>[F8] Confirmar y Cobrar</span> <span className="font-mono text-primary font-bold">[F8]</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      ) : (
        /* VISTA DE HISTORIAL DE VENTAS */
        <div className="space-y-4">
          
          {/* Barra de Filtros del Historial */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/30 backdrop-blur-md border border-border/70 p-4.5 rounded-2xl shadow-sm">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Registro de Caja Diaria
              </h3>
              <p className="text-[11px] text-muted-foreground font-light">Ventas y egresos de stock realizados en la plataforma.</p>
            </div>

            {/* Dropdown de sucursales (Solo si tiene Multi-Taller Pro y es Admin) */}
            {isMultiTaller && isAdmin && (
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-muted-foreground shrink-0" />
                <select
                  value={selectedVenueFilter}
                  onChange={(e) => setSelectedVenueFilter(e.target.value)}
                  className="h-9 bg-background/85 border border-border rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
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
          </div>

          {/* Tabla de Historial */}
          <Card className="bg-card/30 backdrop-blur-md border-border/70 shadow-md rounded-2xl">
            <CardContent className="p-0">
              {salesLoading ? (
                <div className="text-center py-16 text-xs font-light text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Cargando transacciones de caja...
                </div>
              ) : sales.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-xs font-light space-y-1">
                  <AlertCircle className="w-8 h-8 opacity-30 mx-auto text-muted-foreground mb-1" />
                  <p>No se encontraron transacciones en esta sucursal.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground font-medium uppercase text-[10px] tracking-wider">
                        <th className="py-4 px-5">Código / Ticket</th>
                        <th className="py-4 px-5">Fecha y Hora</th>
                        <th className="py-4 px-5">Sucursal</th>
                        <th className="py-4 px-5">Cajero</th>
                        <th className="py-4 px-5 max-w-xs">Artículos Vendidos</th>
                        <th className="py-4 px-5">Método de Pago</th>
                        <th className="py-4 px-5 text-right">Monto Cobrado</th>
                        <th className="py-4 px-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {sales.map((sale) => (
                        <tr key={sale._id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-5 font-bold font-mono text-[11px] text-foreground">
                            #{sale._id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="py-4 px-5 text-muted-foreground font-mono text-[10px]">
                            {new Date(sale.created_at).toLocaleString("es-AR")}
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                              <span className="text-foreground font-medium">{sale.venueName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-muted-foreground">{sale.cajero}</td>
                          <td className="py-4 px-5 max-w-xs">
                            <span className="text-foreground font-light leading-tight">
                              {sale.items?.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                            </span>
                          </td>
                          <td className="py-4 px-5 uppercase">
                            <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5">
                              {sale.payment_method}
                            </Badge>
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-foreground text-sm">
                            ${Number(sale.total).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePrintReceipt(sale._id, sale.items, Number(sale.total), sale.payment_method, sale.created_at)}
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full cursor-pointer"
                              title="Re-imprimir Ticket de Venta"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ClipboardList, 
  Trash2, 
  ChevronDown, 
  Search, 
  FileSpreadsheet, 
  Printer, 
  Stethoscope, 
  FileText, 
  Plus, 
  X, 
  DollarSign, 
  Save,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/services/api";
import { sendBudgetReadyEmail, sendOrderReadyEmail } from "@/services/emailService";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Estado del perfil del taller cargado de la DB
  const [profile, setProfile] = useState({
    name: "RepairIT - Taller Central",
    address: "Av. Sarmiento 1234, San Miguel de Tucumán",
    phone: "+54 381 4223344",
    email: "central@repairit.cloud"
  });

  // Modal Diagnóstico y Presupuesto
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [diagOrder, setDiagOrder] = useState(null);
  const [diagText, setDiagText] = useState("");
  const [diagStatus, setDiagStatus] = useState("diagnostico");
  const [budgetItems, setBudgetItems] = useState([{ desc: "", price: "" }]);
  const [savingDiag, setSavingDiag] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const ordersData = await api.orders.getAll();
      const clientsData = await api.clients.getAll();
      setOrders(ordersData);
      setClients(clientsData);
      
      try {
        const profileData = await api.auth.getProfile();
        setProfile({
          name: profileData.name || "RepairIT - Taller Central",
          address: profileData.address || "Av. Sarmiento 1234, San Miguel de Tucumán",
          phone: profileData.phone || "+54 381 4223344",
          email: profileData.email || "central@repairit.cloud"
        });
      } catch (err) {
        console.error("Error al cargar perfil del taller:", err);
      }
    } catch (error) {
      toast.error("Error al cargar órdenes de servicio", {
        description: error.message || "Por favor, intente nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Abrir Modal de Diagnóstico y Presupuesto
  const handleOpenDiagModal = (order) => {
    setDiagOrder(order);
    setDiagText(order.diagnosis || "");
    setDiagStatus(order.status || "diagnostico");
    
    if (order.budget && Array.isArray(order.budget.items) && order.budget.items.length > 0) {
      setBudgetItems(order.budget.items.map(i => ({ desc: i.desc, price: i.price?.toString() || "" })));
    } else {
      setBudgetItems([{ desc: "", price: "" }]);
    }

    setShowDiagModal(true);
  };

  const handleAddBudgetItem = () => {
    setBudgetItems([...budgetItems, { desc: "", price: "" }]);
  };

  const handleRemoveBudgetItem = (index) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const handleBudgetItemChange = (index, field, value) => {
    const updated = [...budgetItems];
    updated[index][field] = value;
    setBudgetItems(updated);
  };

  const handleSaveDiagnosis = async (e) => {
    e.preventDefault();
    if (!diagOrder) return;

    try {
      setSavingDiag(true);

      const validBudgetItems = budgetItems
        .filter(i => i.desc.trim() !== "")
        .map(i => ({ desc: i.desc.trim(), price: Number(i.price) || 0 }));

      const totalBudget = validBudgetItems.reduce((acc, i) => acc + i.price, 0);

      const budgetData = validBudgetItems.length > 0 ? {
        items: validBudgetItems,
        total: totalBudget,
        approved: diagOrder.budget?.approved || false,
        dateApproved: diagOrder.budget?.dateApproved || null
      } : null;

      await api.orders.updateDiagnosisAndBudget(diagOrder._id, {
        diagnosis: diagText,
        budget: budgetData,
        status: diagStatus
      });

      toast.success("Diagnóstico y Presupuesto guardados", {
        description: `Se actualizó la orden ${diagOrder.trackingCode}.`
      });

      // Enviar correo de presupuesto listo si el cliente tiene email y hay presupuesto cargado
      const clientEmail = diagOrder.clientId?.email;
      if (clientEmail && clientEmail.includes("@") && budgetData) {
        try {
          await sendBudgetReadyEmail({
            to: clientEmail.trim(),
            clientName: diagOrder.clientId?.name || "Cliente",
            orderCode: diagOrder.trackingCode,
            deviceType: diagOrder.deviceType,
            deviceModel: diagOrder.deviceModel,
            diagnosis: diagText.trim(),
            budgetTotal: totalBudget.toLocaleString("es-AR"),
            workshopName: profile?.name || "RepairIT",
            workshopPhone: profile?.phone || "",
            workshopAddress: profile?.address || "",
          });
        } catch (err) {
          console.warn("No se pudo enviar email de presupuesto:", err);
        }
      }

      setShowDiagModal(false);
      loadData();
    } catch (error) {
      toast.error("Error al guardar diagnóstico", {
        description: error.message || "Por favor, intente nuevamente."
      });
    } finally {
      setSavingDiag(false);
    }
  };

  // Exportar listado a Excel CSV
  const handleExportToExcel = () => {
    if (orders.length === 0) {
      toast.error("No hay órdenes registradas para exportar.");
      return;
    }

    const headers = ["ID Orden", "Cliente", "DNI", "Dispositivo", "Falla Reportada", "Diagnostico", "Total Presupuesto", "Fecha Ingreso", "Estado"];
    const rows = orders.map(o => {
      const client = o.clientId || {};
      const budgetTotal = o.budget ? o.budget.items?.reduce((s, i) => s + i.price, 0) || 0 : 0;
      return [
        o.trackingCode || o._id,
        `"${client.name || "N/A"}"`,
        `"${client.dni || "N/A"}"`,
        `"${o.deviceType} ${o.deviceModel}"`,
        `"${(o.issue || "").replace(/"/g, '""')}"`,
        `"${(o.diagnosis || "").replace(/"/g, '""')}"`,
        budgetTotal,
        o.date,
        o.status.toUpperCase()
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ordenes_Reparacion_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Listado de órdenes exportado a Excel CSV.");
  };

  // Imprimir comprobante de recepción
  const handlePrintOrder = (order) => {
    const client = order.clientId || {};
    const venueName = profile.name;
    const venueAddress = profile.address;
    const venuePhone = profile.phone;
    const venueEmail = profile.email;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      toast.error("El navegador bloqueó la ventana emergente de impresión.");
      return;
    }

    const budgetItemsHtml = order.budget?.items?.map(i => `
      <tr>
        <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${i.desc}</td>
        <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">$${i.price.toLocaleString("es-AR")}</td>
      </tr>
    `).join("") || "";

    const totalBudget = order.budget?.items?.reduce((s, i) => s + i.price, 0) || 0;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Recepción - Orden #${order.trackingCode}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; font-size: 13px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 22px; font-weight: bold; color: #1e293b; }
            .info { font-size: 11px; color: #64748b; margin-top: 2px; }
            .order-no { font-size: 11px; font-weight: bold; color: #2563eb; text-align: right; text-transform: uppercase; }
            .order-no-val { font-size: 20px; font-weight: bold; font-family: monospace; color: #0f172a; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .section { border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; background: #fff; }
            .section-title { font-size: 11px; font-weight: bold; color: #2563eb; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 10px; }
            .label { font-weight: bold; font-size: 10px; color: #777; display: block; margin-top: 5px; text-transform: uppercase; }
            .val { font-size: 13px; margin-bottom: 5px; color: #111; }
            .full-width { grid-column: span 2; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">${venueName}</div>
              <div class="info">Dirección: ${venueAddress}</div>
              <div class="info">Teléfono: ${venuePhone} &bull; Email: ${venueEmail}</div>
            </div>
            <div>
              <div class="order-no">ORDEN DE SERVICIO</div>
              <div class="order-no-val">N° ${order.trackingCode}</div>
            </div>
          </div>
          
          <div class="grid">
            <div class="section full-width">
              <div class="section-title">DATOS DEL CLIENTE</div>
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <div>
                  <span class="label">Cliente</span>
                  <div class="val" style="font-weight: bold; font-size: 14px;">${client.name || "N/A"}</div>
                  <span class="label">DNI / Identificación</span>
                  <div class="val">${client.dni || "N/A"}</div>
                  <span class="label">Contacto</span>
                  <div class="val">${client.phone || ""} &bull; ${client.email || ""}</div>
                </div>
                <div style="border-left: 1px solid #eee; padding-left: 20px;">
                  <span class="label">Fecha de Ingreso</span>
                  <div class="val">${order.date}</div>
                  <span class="label">Hora</span>
                  <div class="val">${order.time || "10:30"} hs</div>
                </div>
              </div>
            </div>
            
            <div class="section full-width">
              <div class="section-title">DETALLES DEL EQUIPO</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px;">
                <div>
                  <span class="label">Tipo de Equipo</span>
                  <div class="val">${order.deviceType}</div>
                </div>
                <div>
                  <span class="label">Marca y Modelo</span>
                  <div class="val">${order.deviceModel}</div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                <div>
                  <span class="label">Accesorios Recibidos</span>
                  <div class="val">${order.accessories || "Ninguno"}</div>
                </div>
                <div>
                  <span class="label">Estado Cosmético</span>
                  <div class="val">${order.cosmetic || "Sin detalles"}</div>
                </div>
              </div>
            </div>

            <div class="section full-width">
              <div class="section-title">FALLA REPORTADA POR CLIENTE</div>
              <div class="val" style="white-space: pre-wrap; background: #f8fafc; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">${order.issue}</div>
            </div>

            ${order.diagnosis ? `
              <div class="section full-width">
                <div class="section-title">DIAGNÓSTICO TÉCNICO DEL TALLER</div>
                <div class="val" style="white-space: pre-wrap; background: #eff6ff; padding: 10px; border-radius: 4px; border: 1px solid #bfdbfe; color: #1e3a8a;">${order.diagnosis}</div>
              </div>
            ` : ""}

            ${budgetItemsHtml ? `
              <div class="section full-width">
                <div class="section-title">PRESUPUESTO ESTIMADO DEL SERVICIO</div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                  ${budgetItemsHtml}
                </table>
                <div style="text-align: right; margin-top: 10px; font-size: 15px; font-weight: bold;">
                  TOTAL PREVISTO: $${totalBudget.toLocaleString("es-AR")}
                </div>
              </div>
            ` : ""}
          </div>

          <div class="footer">
            <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: left;">
              <div style="font-size: 16px; font-weight: bold; color: #111;">Repair<span style="color: #2563eb;">IT</span></div>
              <div style="font-size: 10px; color: #777;">repairit.cloud &bull; Seguimiento online disponible con su N° de orden</div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.orders.updateStatus(id, newStatus, `Estado cambiado a ${newStatus.toUpperCase()}`);
      toast.success(`Estado de orden actualizado`, {
        description: `Nuevo estado: ${newStatus.toUpperCase()}`,
      });

      // Si el nuevo estado es "listo", enviar correo de retiro al cliente
      if (newStatus === "listo") {
        const targetOrder = orders.find(o => o._id === id);
        const clientEmail = targetOrder?.clientId?.email;
        if (clientEmail && clientEmail.includes("@")) {
          try {
            await sendOrderReadyEmail({
              to: clientEmail.trim(),
              clientName: targetOrder.clientId?.name || "Cliente",
              orderCode: targetOrder.trackingCode,
              deviceType: targetOrder.deviceType,
              deviceModel: targetOrder.deviceModel,
              workshopName: profile?.name || "RepairIT",
              workshopPhone: profile?.phone || "",
              workshopAddress: profile?.address || "",
            });
          } catch (err) {
            console.warn("No se pudo enviar email de equipo listo:", err);
          }
        }
      }

      loadData();
    } catch (error) {
      toast.error("Error al actualizar estado", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  const getStatusDropdown = (orderId, currentStatus) => {
    let colorClass = "";
    let statusLabel = "";
    switch (currentStatus) {
      case "ingresado":
        colorClass = "bg-sky-500/10 text-sky-400 border-sky-500/25 hover:bg-sky-500/20";
        statusLabel = "Ingresado";
        break;
      case "diagnostico":
        colorClass = "bg-purple-500/10 text-purple-400 border-purple-500/25 hover:bg-purple-500/20";
        statusLabel = "En Diagnóstico";
        break;
      case "presupuestado":
        colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20";
        statusLabel = "Presupuestado";
        break;
      case "reparacion":
      case "en_reparacion":
        colorClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20";
        statusLabel = "En Reparación";
        break;
      case "listo":
        colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20";
        statusLabel = "Listo";
        break;
      case "entregado":
        colorClass = "bg-muted text-muted-foreground border-border hover:bg-muted/80";
        statusLabel = "Entregado";
        break;
      default:
        colorClass = "bg-secondary text-secondary-foreground";
        statusLabel = currentStatus;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-7 border px-2.5 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${colorClass}`}
          >
            {statusLabel}
            <ChevronDown className="w-3 h-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-border text-foreground">
          <DropdownMenuItem onClick={() => handleStatusChange(orderId, "ingresado")} className="text-xs cursor-pointer">
            Ingresado
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(orderId, "diagnostico")} className="text-xs cursor-pointer">
            En Diagnóstico
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(orderId, "presupuestado")} className="text-xs cursor-pointer">
            Presupuestado
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(orderId, "en_reparacion")} className="text-xs cursor-pointer">
            En Reparación
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(orderId, "listo")} className="text-xs cursor-pointer">
            Listo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(orderId, "entregado")} className="text-xs cursor-pointer">
            Entregado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const filteredOrders = orders.filter((o) => {
    const client = o.clientId || {};
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (o.trackingCode && o.trackingCode.toLowerCase().includes(term)) ||
      (client.name && client.name.toLowerCase().includes(term)) ||
      (client.dni && client.dni.includes(term)) ||
      (o.deviceModel && o.deviceModel.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "todos" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <ClipboardList className="w-7 h-7 text-primary shrink-0" />
          <span>Órdenes de Servicio</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Seguimiento de trazabilidad técnica del taller, carga de diagnósticos, presupuestos y cambio de estados.
        </p>
      </div>

      <div className="animate-fade-in pt-2">
        <Card className="bg-card/20 border-border p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center gap-2 border-0 pb-0">
                <ClipboardList className="w-4.5 h-4.5 text-muted-foreground" />
                Control de Trazabilidad
              </CardTitle>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">Total: {orders.length} Equipos</span>
            </div>

            {/* Filtros y Buscador */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between py-2 border-b border-border/30">
              <div className="relative w-full sm:max-w-xs flex items-center">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="N° orden, nombre, DNI, modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/80 border-border text-xs w-full pl-9 h-9"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 bg-background/85 border border-border rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="ingresado">Ingresado</option>
                  <option value="diagnostico">En Diagnóstico</option>
                  <option value="presupuestado">Presupuestado</option>
                  <option value="reparacion">En Reparación</option>
                  <option value="listo">Listo</option>
                  <option value="entregado">Entregado</option>
                </select>
                <Button
                  onClick={handleExportToExcel}
                  variant="outline"
                  className="h-9 border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer select-none rounded-lg"
                  title="Exportar órdenes a Excel"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </Button>
              </div>
            </div>

            {/* Tabla de Órdenes */}
            {loading ? (
              <div className="text-center py-16 text-xs text-muted-foreground font-light">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Cargando órdenes de servicio...
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">N° de Orden</th>
                      <th className="py-3 px-2">Cliente</th>
                      <th className="py-3 px-2">Dispositivo</th>
                      <th className="py-3 px-2">Diagnóstico</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => {
                      const client = o.clientId || {};
                      const hasDiag = !!o.diagnosis;
                      const hasBudget = o.budget && Array.isArray(o.budget.items) && o.budget.items.length > 0;
                      const totalB = hasBudget ? o.budget.items.reduce((s, i) => s + i.price, 0) : 0;

                      return (
                        <tr key={o._id} className="border-b border-border/40 hover:bg-card/30 transition-colors">
                          <td className="py-3.5 px-2 font-mono font-bold text-primary">
                            <a
                              href={window.location.hostname.includes("repairit.cloud") ? `https://tracking.repairit.cloud/seguimiento/${o.trackingCode}` : `/seguimiento/${o.trackingCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline inline-flex items-center gap-1 group"
                              title="Abrir página de seguimiento del cliente"
                            >
                              <span>{o.trackingCode}</span>
                              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="font-medium block">{client.name || "N/A"}</span>
                            <div className="flex flex-col text-[10px] text-muted-foreground font-mono">
                              {client.dni && <span>DNI: {client.dni}</span>}
                              {client.phone && <span>Tel: {client.phone}</span>}
                            </div>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="font-medium block">{o.deviceModel}</span>
                            <span className="text-[10px] text-muted-foreground">{o.deviceType}</span>
                          </td>
                          <td className="py-3.5 px-2 max-w-[200px]">
                            <div className="space-y-1">
                              {hasDiag ? (
                                <span className="font-medium text-foreground truncate block" title={o.diagnosis}>
                                  {o.diagnosis}
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground/60 italic block">Sin diagnóstico</span>
                              )}

                              {hasBudget && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                                    ${totalB.toLocaleString("es-AR")}
                                  </span>
                                  {o.budget?.approved ? (
                                    <Badge className="text-[9px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold px-1.5 py-0">
                                      Aprobado ✓
                                    </Badge>
                                  ) : o.budget?.rejected ? (
                                    <Badge className="text-[9px] bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold px-1.5 py-0">
                                      Rechazado ✕
                                    </Badge>
                                  ) : (
                                    <Badge className="text-[9px] bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold px-1.5 py-0">
                                      Pendiente
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-2">{getStatusDropdown(o._id, o.status)}</td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenDiagModal(o)}
                                className="h-8 px-2 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer"
                                title="Cargar o editar diagnóstico"
                              >
                                <Stethoscope className="w-3.5 h-3.5" />
                                Diagnóstico
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="icon-sm"
                                onClick={() => handlePrintOrder(o)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full cursor-pointer"
                                title="Imprimir Comprobante de Recepción"
                              >
                                <Printer className="w-4 h-4" />
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
              <div className="text-center py-16 space-y-2">
                <p className="text-xs text-muted-foreground leading-normal font-light">
                  No se encontraron órdenes de servicio.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* MODAL DE DIAGNÓSTICO Y PRESUPUESTO */}
      {showDiagModal && diagOrder && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-card border-border/80 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Diagnóstico y Presupuesto
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Orden N° <strong className="font-mono text-foreground">{diagOrder.trackingCode}</strong> &bull; {diagOrder.deviceType} {diagOrder.deviceModel}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDiagModal(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSaveDiagnosis} className="p-6 space-y-5">
              
              {/* Banner de Estado del Presupuesto */}
              {diagOrder.budget?.approved ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Presupuesto Aprobado por el Cliente</strong> {diagOrder.budget.dateApproved && `el ${diagOrder.budget.dateApproved}`}</span>
                  </div>
                  <Badge className="bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold text-[10px]">Aprobado</Badge>
                </div>
              ) : diagOrder.budget?.rejected ? (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center justify-between text-xs text-rose-400">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Presupuesto Rechazado por el Cliente</strong></span>
                  </div>
                  <Badge className="bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold text-[10px]">Rechazado</Badge>
                </div>
              ) : diagOrder.budget?.items?.length ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-between text-xs text-amber-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Presupuesto Pendiente de Aprobación</strong> del cliente en el portal público</span>
                  </div>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-bold text-[10px]">Pendiente</Badge>
                </div>
              ) : null}

              {/* Diagnóstico Técnico */}
              <div className="space-y-2">
                <Label htmlFor="diag-text" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Diagnóstico Técnico del Taller
                </Label>
                <Textarea
                  id="diag-text"
                  rows={4}
                  placeholder="Escribe el diagnóstico técnico (fallas detectadas en inspección, componentes a reemplazar...)"
                  value={diagText}
                  onChange={(e) => setDiagText(e.target.value)}
                  className="bg-background/80 border-border text-xs focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                />
              </div>

              {/* Presupuesto de Mano de Obra y Repuestos */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    Ítems del Presupuesto (Mano de obra y repuestos)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddBudgetItem}
                    className="h-7 text-[10px] font-bold border-primary/40 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar Ítem
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {budgetItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/50">
                      <Input
                        type="text"
                        placeholder="Descripción (ej: Reemplazo de módulo pantalla)"
                        value={item.desc}
                        onChange={(e) => handleBudgetItemChange(idx, "desc", e.target.value)}
                        className="bg-background text-xs h-8 flex-grow rounded-lg"
                      />
                      <div className="relative w-32 shrink-0">
                        <span className="absolute left-2.5 top-2 text-xs font-mono text-muted-foreground">$</span>
                        <Input
                          type="number"
                          placeholder="Monto"
                          value={item.price}
                          onChange={(e) => handleBudgetItemChange(idx, "price", e.target.value)}
                          className="bg-background text-xs h-8 pl-6 font-mono rounded-lg"
                        />
                      </div>
                      {budgetItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBudgetItem(idx)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total calculado */}
                <div className="flex justify-between items-baseline bg-primary/5 p-3 rounded-xl border border-primary/20 mt-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">TOTAL PRESUPUESTADO:</span>
                  <span className="text-xl font-black font-outfit text-primary font-mono">
                    ${budgetItems.reduce((acc, i) => acc + (Number(i.price) || 0), 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Cambiar Estado */}
              <div className="space-y-2 border-t border-border/60 pt-4">
                <Label htmlFor="diag-status" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actualizar Estado de la Orden
                </Label>
                <select
                  id="diag-status"
                  value={diagStatus}
                  onChange={(e) => setDiagStatus(e.target.value)}
                  className="w-full h-9 bg-background border border-border rounded-xl px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="diagnostico">En Diagnóstico</option>
                  <option value="presupuestado">Presupuestado (Listo para envío al cliente)</option>
                  <option value="reparacion">En Reparación</option>
                  <option value="listo">Listo para Entregar</option>
                </select>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDiagModal(false)}
                  className="h-9 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingDiag}
                  className="h-9 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs px-5 rounded-xl cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingDiag ? "Guardando..." : "Guardar Diagnóstico"}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

    </div>
  );
}

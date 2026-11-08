import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ClipboardList,
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
  XCircle,
  Eye,
  MessageCircle,
  User,
  Smartphone,
  History,
  PlusCircle,
  Package,
  Pencil,
  Trash2,
  ShoppingCart,
  CreditCard,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api, getLocalUser, normalizePlan, hasPOSAccess } from "@/services/api";
import { sendBudgetReadyEmail, sendOrderReadyEmail } from "@/services/emailService";
import { printOrderReceipt, printPosReceipt, getOrderWhatsAppUrl } from "@/utils/printHelper";

const STATUS_FILTERS = [
  { key: "todos", label: "Todas" },
  { key: "ingresado", label: "Ingresados" },
  { key: "diagnostico", label: "En Diagnóstico" },
  { key: "presupuestado", label: "Presupuestados" },
  { key: "en_reparacion", label: "En Reparación" },
  { key: "listo", label: "Listos" },
  { key: "entregado", label: "Entregados" },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const currentUser = getLocalUser();
  const isTechnician = currentUser?.role === "tecnico";
  const [effectivePlan, setEffectivePlan] = useState(
    normalizePlan(currentUser?.subscriptionPlan)
  );
  const canUsePOS = hasPOSAccess(effectivePlan);

  const [orders, setOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Estado del perfil del taller cargado de la DB
  const [profile, setProfile] = useState({
    name: "RepairIT - Taller Central",
    address: "Av. Sarmiento 1234, San Miguel de Tucumán",
    phone: "+54 381 4223344",
    email: "central@repairit.cloud",
  });

  // Modal Detalle Completo ("Ojito")
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  // Modal Diagnóstico y Presupuesto
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [diagOrder, setDiagOrder] = useState(null);
  const [diagText, setDiagText] = useState("");
  const [diagStatus, setDiagStatus] = useState("diagnostico");
  const [budgetItems, setBudgetItems] = useState([{ desc: "", price: "" }]);
  const [deductStockOnSave, setDeductStockOnSave] = useState(true);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [savingDiag, setSavingDiag] = useState(false);

  // Modal Editar Recepción (Feature 3)
  const [showEditReceptionModal, setShowEditReceptionModal] = useState(false);
  const [editReceptionOrder, setEditReceptionOrder] = useState(null);
  const [editDeviceType, setEditDeviceType] = useState("Celular");
  const [editDeviceModel, setEditDeviceModel] = useState("");
  const [editAccessories, setEditAccessories] = useState("");
  const [editCosmetic, setEditCosmetic] = useState("");
  const [editIssue, setEditIssue] = useState("");
  const [savingReception, setSavingReception] = useState(false);

  // Modal Cobro en Caja POS (Feature 2)
  const [showChargePosModal, setShowChargePosModal] = useState(false);
  const [chargeOrder, setChargeOrder] = useState(null);
  const [chargeMethod, setChargeMethod] = useState("efectivo");
  const [chargePrintTicket, setChargePrintTicket] = useState(true);
  const [submittingCharge, setSubmittingCharge] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, invData] = await Promise.all([
        api.orders.getAll(),
        api.inventory.getAll().catch(() => []),
      ]);
      setInventoryItems(Array.isArray(invData) ? invData : []);

      // Ordenamiento cronológico estable por fecha de creación (los más recientes primero)
      const sortedOrders = (ordersData || []).sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return (b._id || "").localeCompare(a._id || "");
      });

      setOrders(sortedOrders);

      // Si hay una orden abierta en el modal de detalle, actualizar su referencia
      if (detailOrder) {
        const refreshed = sortedOrders.find((o) => o._id === detailOrder._id);
        if (refreshed) setDetailOrder(refreshed);
      }

      try {
        const profileData = await api.auth.getProfile();
        setProfile({
          name: profileData.name || "RepairIT - Taller Central",
          address: profileData.address || "Av. Sarmiento 1234, San Miguel de Tucumán",
          phone: profileData.phone || "+54 381 4223344",
          email: profileData.email || "central@repairit.cloud",
        });
        if (profileData?.subscriptionPlan) {
          setEffectivePlan(normalizePlan(profileData.subscriptionPlan));
        }
      } catch (err) {
        console.error("Error al cargar perfil del taller:", err);
      }
    } catch (error) {
      toast.error("Error al cargar órdenes de servicio", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cerrar modales con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowDetailModal(false);
        setShowDiagModal(false);
        setShowEditReceptionModal(false);
        setShowChargePosModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Abrir Modal de Detalle Completo ("Ojito")
  const handleOpenDetailModal = (order) => {
    setDetailOrder(order);
    setShowDetailModal(true);
  };

  // Abrir Modal de Diagnóstico y Presupuesto
  const handleOpenDiagModal = (order) => {
    if (order.budget?.approved) {
      toast.info("Presupuesto ya aprobado", {
        description: "Esta orden ya fue aprobada por el cliente y su diagnóstico no puede ser modificado.",
      });
      return;
    }
    setDiagOrder(order);
    setDiagText(order.diagnosis || "");
    setDiagStatus(order.status === "en_reparacion" ? "reparacion" : order.status || "diagnostico");
    setSelectedInventoryId("");
    setDeductStockOnSave(true);

    if (order.budget && Array.isArray(order.budget.items) && order.budget.items.length > 0) {
      setBudgetItems(
        order.budget.items.map((i) => ({
          desc: i.desc,
          price: i.price?.toString() || "",
          inventoryId: i.inventoryId || null,
          stockDeducted: Boolean(i.stockDeducted),
        }))
      );
    } else {
      setBudgetItems([{ desc: "", price: "", inventoryId: null, stockDeducted: false }]);
    }

    setShowDiagModal(true);
  };

  const handleAddBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      { desc: "", price: "", inventoryId: null, stockDeducted: false },
    ]);
  };

  const handleAddInventoryBudgetItem = (invId) => {
    if (!invId) return;
    const invItem = inventoryItems.find((i) => i._id === invId);
    if (!invItem) return;

    const newItem = {
      desc: `${invItem.name}${invItem.code ? ` (${invItem.code})` : ""}`,
      price: String(Math.max(0, Number(invItem.price) || 0)),
      inventoryId: invItem._id,
      stockDeducted: false,
    };

    // Si el único ítem está vacío, reemplazarlo; si no, agregar al final
    if (
      budgetItems.length === 1 &&
      !budgetItems[0].desc.trim() &&
      !budgetItems[0].price
    ) {
      setBudgetItems([newItem]);
    } else {
      setBudgetItems([...budgetItems, newItem]);
    }
    setSelectedInventoryId("");
    toast.info(`Repuesto agregado al presupuesto: ${invItem.name}`);
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

      // Descontar del inventario los repuestos recién vinculados si el check está activo
      const processedItems = [];
      for (const i of budgetItems) {
        if (!i.desc || i.desc.trim() === "") continue;
        const cleanPrice = Math.max(0, Number(i.price) || 0);
        let deducted = Boolean(i.stockDeducted);

        if (i.inventoryId && !deducted && deductStockOnSave) {
          try {
            await api.inventory.adjustStock(i.inventoryId, -1);
            deducted = true;
          } catch (stockErr) {
            console.warn("No se pudo descontar stock del repuesto:", stockErr);
          }
        }

        processedItems.push({
          desc: i.desc.trim(),
          price: cleanPrice,
          ...(i.inventoryId ? { inventoryId: i.inventoryId, stockDeducted: deducted } : {}),
        });
      }

      const validBudgetItems = processedItems;
      const totalBudget = validBudgetItems.reduce((acc, i) => acc + i.price, 0);

      const budgetData =
        validBudgetItems.length > 0
          ? {
              items: validBudgetItems,
              total: totalBudget,
              approved: diagOrder.budget?.approved || false,
              dateApproved: diagOrder.budget?.dateApproved || null,
            }
          : null;

      await api.orders.updateDiagnosisAndBudget(diagOrder._id, {
        diagnosis: diagText,
        budget: budgetData,
        status: diagStatus,
      });

      toast.success("Diagnóstico y Presupuesto guardados", {
        description: `Se actualizó la orden ${diagOrder.trackingCode}.`,
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
            budgetItems: validBudgetItems,
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
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setSavingDiag(false);
    }
  };

  // Feature 3: Editar datos de recepción de la orden
  const handleOpenEditReceptionModal = (order) => {
    setEditReceptionOrder(order);
    setEditDeviceType(order.deviceType || "Celular");
    setEditDeviceModel(order.deviceModel || "");
    setEditAccessories(order.accessories || "Ninguno");
    setEditCosmetic(order.cosmetic || "Sin detalles");
    setEditIssue(order.issue || "");
    setShowEditReceptionModal(true);
  };

  const handleSaveReceptionEdit = async (e) => {
    e.preventDefault();
    if (!editReceptionOrder) return;
    if (!editDeviceModel.trim() || !editIssue.trim()) {
      toast.error("Completá el modelo del equipo y la falla reportada.");
      return;
    }

    try {
      setSavingReception(true);
      const currentHistory = Array.isArray(editReceptionOrder.history)
        ? editReceptionOrder.history
        : [];
      const updatedHistory = [
        ...currentHistory,
        {
          date:
            new Date().toLocaleDateString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) +
            " " +
            new Date().toLocaleTimeString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          text: `Datos de recepción editados (${editDeviceType} ${editDeviceModel.trim()})`,
        },
      ];

      await api.orders.update(editReceptionOrder._id, {
        device_type: editDeviceType,
        device_model: editDeviceModel.trim(),
        accessories: editAccessories.trim() || "Ninguno",
        cosmetic: editCosmetic.trim() || "Sin detalles",
        issue: editIssue.trim(),
        history: updatedHistory,
      });

      toast.success("Datos de recepción actualizados", {
        description: `Se modificó la ficha de la orden ${editReceptionOrder.trackingCode}.`,
      });
      setShowEditReceptionModal(false);
      loadData();
    } catch (error) {
      toast.error("Error al editar recepción", {
        description: error.message || "Intente nuevamente.",
      });
    } finally {
      setSavingReception(false);
    }
  };

  // Feature 3: Eliminar orden mal cargada (Exclusivo Admin / Superadmin)
  const handleDeleteOrder = async (order) => {
    if (isTechnician) {
      toast.error("Permiso denegado", {
        description: "Solo el administrador del taller puede eliminar órdenes.",
      });
      return;
    }
    if (
      !window.confirm(
        `¿Estás seguro de que deseás eliminar permanentemente la orden #${order.trackingCode} (${order.deviceModel})? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await api.orders.delete(order._id);
      toast.success("Orden eliminada", {
        description: `La orden #${order.trackingCode} fue eliminada del sistema.`,
      });
      if (detailOrder?._id === order._id) {
        setShowDetailModal(false);
        setDetailOrder(null);
      }
      loadData();
    } catch (error) {
      toast.error("Error al eliminar orden", {
        description: error.message || "Intente nuevamente.",
      });
    }
  };

  // Feature 2: Registrar cobro de orden directamente en Caja POS (solo cuando está Lista)
  const handleOpenChargePosModal = (order) => {
    if (order?.status !== "listo") {
      toast.error("La orden debe estar en estado 'Listo' para cobrarse en Caja POS.");
      return;
    }
    setChargeOrder(order);
    setChargeMethod("efectivo");
    setChargePrintTicket(true);
    setShowChargePosModal(true);
  };

  const handleConfirmChargePos = async (e) => {
    e.preventDefault();
    if (!chargeOrder) return;

    const totalBudget =
      chargeOrder.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) ||
      Number(chargeOrder.budget?.total) ||
      0;

    if (totalBudget <= 0) {
      toast.error("La orden no posee un monto presupuestado mayor a $0 para cobrar en Caja.");
      return;
    }

    try {
      setSubmittingCharge(true);
      const saleItems = [
        {
          id: `order-${chargeOrder._id}`,
          name: `Orden #${chargeOrder.trackingCode} - ${chargeOrder.deviceType || ""} ${chargeOrder.deviceModel || ""}`.trim(),
          code: chargeOrder.trackingCode,
          price: totalBudget,
          quantity: 1,
          isServiceOrder: true,
        },
      ];

      const createdSale = await api.sales.create({
        items: saleItems,
        total: totalBudget,
        paymentMethod: chargeMethod,
      });

      // Marcar orden como entregada y dejar constancia en la bitácora
      await api.orders.updateStatus(
        chargeOrder._id,
        "entregado",
        `Equipo entregado y cobrado en Caja POS ($${totalBudget.toLocaleString("es-AR")} - ${chargeMethod.toUpperCase()})`
      );

      if (chargePrintTicket) {
        printPosReceipt(
          {
            id: createdSale._id,
            items: saleItems,
            total: totalBudget,
            payment_method: chargeMethod,
            created_at: createdSale.created_at || new Date().toISOString(),
          },
          profile || {}
        );
      }

      toast.success("¡Cobro registrado en Caja POS!", {
        description: `Orden #${chargeOrder.trackingCode} marcada como Entregada ($${totalBudget.toLocaleString("es-AR")}).`,
      });
      setShowChargePosModal(false);
      loadData();
    } catch (error) {
      toast.error("Error al registrar cobro en Caja", {
        description: error.message || "Intente nuevamente.",
      });
    } finally {
      setSubmittingCharge(false);
    }
  };

  // Exportar listado a Excel (.xlsx nativo)
  const handleExportToExcel = async () => {
    if (orders.length === 0) {
      toast.error("No hay órdenes registradas para exportar.");
      return;
    }

    try {
      toast.info("Generando archivo Excel...");
      const { default: writeXlsxFile } = await import("write-excel-file/browser");

      const columns = [
        {
          header: {
            value: "ID Orden",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (o) => ({ type: String, value: o.trackingCode || o._id || "N/A", align: "center" }),
          width: 18,
        },
        {
          header: {
            value: "Cliente",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (o) => ({ type: String, value: o.clientId?.name || "N/A" }),
          width: 26,
        },
        {
          header: {
            value: "DNI",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (o) => ({ type: String, value: String(o.clientId?.dni || "N/A"), align: "center" }),
          width: 15,
        },
        {
          header: {
            value: "Dispositivo",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (o) => ({
            type: String,
            value: `${o.deviceType || ""} ${o.deviceModel || ""}`.trim() || "N/A",
          }),
          width: 26,
        },
        {
          header: {
            value: "Falla Reportada",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (o) => ({ type: String, value: o.issue || "Sin especificar" }),
          width: 34,
        },
        {
          header: {
            value: "Diagnóstico",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (o) => ({ type: String, value: o.diagnosis || "Pendiente" }),
          width: 34,
        },
        {
          header: {
            value: "Presupuesto",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "right",
          },
          cell: (o) => {
            const total =
              o.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) || 0;
            return { type: Number, value: total, format: "$#,##0.00", align: "right" };
          },
          width: 18,
        },
        {
          header: {
            value: "Fecha Ingreso",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (o) => {
            let formattedDate = o.date || "";
            if (o.created_at) {
              formattedDate =
                new Date(o.created_at).toLocaleDateString("es-AR", {
                  timeZone: "America/Argentina/Buenos_Aires",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }) +
                " " +
                new Date(o.created_at).toLocaleTimeString("es-AR", {
                  timeZone: "America/Argentina/Buenos_Aires",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
            } else if (o.date && !isNaN(new Date(o.date).getTime())) {
              formattedDate = new Date(o.date).toLocaleDateString("es-AR", {
                timeZone: "America/Argentina/Buenos_Aires",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            }
            return { type: String, value: formattedDate, align: "center" };
          },
          width: 16,
        },
        {
          header: {
            value: "Estado",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (o) => ({
            type: String,
            value: (o.status || "").toUpperCase(),
            align: "center",
            fontWeight: "bold",
          }),
          width: 18,
        },
      ];

      await writeXlsxFile(orders, { columns }).toFile(
        `Ordenes_Reparacion_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Listado de órdenes exportado a Excel (.xlsx).");
    } catch (err) {
      console.error("Error al generar Excel:", err);
      toast.error("Error al exportar el archivo Excel.");
    }
  };

  // Imprimir comprobante de recepción profesional (A4 con QR) directo en el navegador
  const handlePrintOrder = (order) => {
    printOrderReceipt(order, profile);
  };

  // Enviar link de seguimiento y estado por WhatsApp
  const handleSendWhatsApp = (order) => {
    const waUrl = getOrderWhatsAppUrl(order, profile);
    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.orders.updateStatus(id, newStatus, `Estado cambiado a ${newStatus.toUpperCase()}`);
      toast.success(`Estado de orden actualizado`, {
        description: `Nuevo estado: ${newStatus.toUpperCase()}`,
      });

      // Si el nuevo estado es "listo", enviar correo de retiro al cliente
      if (newStatus === "listo") {
        const targetOrder = orders.find((o) => o._id === id);
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
        description: error.message || "Por favor, intente nuevamente.",
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
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "ingresado")}
            className="text-xs cursor-pointer"
          >
            Ingresado
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "diagnostico")}
            className="text-xs cursor-pointer"
          >
            En Diagnóstico
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "presupuestado")}
            className="text-xs cursor-pointer"
          >
            Presupuestado
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "en_reparacion")}
            className="text-xs cursor-pointer"
          >
            En Reparación
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "listo")}
            className="text-xs cursor-pointer"
          >
            Listo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "entregado")}
            className="text-xs cursor-pointer"
          >
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
      (o.deviceModel && o.deviceModel.toLowerCase().includes(term)) ||
      (o.deviceType && o.deviceType.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "todos" ||
      o.status === statusFilter ||
      (statusFilter === "en_reparacion" &&
        (o.status === "en_reparacion" || o.status === "reparacion")) ||
      (statusFilter === "reparacion" &&
        (o.status === "en_reparacion" || o.status === "reparacion"));

    return matchesSearch && matchesStatus;
  });

  const getPublicTrackingUrl = (trackingCode) =>
    window.location.hostname.includes("repairit.cloud")
      ? `https://tracking.repairit.cloud/seguimiento/${trackingCode}`
      : `/seguimiento/${trackingCode}`;

  return (
    <div className="space-y-5">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
            <span>Órdenes de Servicio</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Seguimiento técnico del taller, ficha detallada de equipos, presupuestos y avisos por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={handleExportToExcel}
            variant="outline"
            className="h-9 border-border/80 hover:bg-muted/40 text-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
            title="Exportar órdenes a Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </Button>
          <Button
            onClick={() => navigate("/dashboard/nuevo-ingreso")}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Ingreso</span>
          </Button>
        </div>
      </div>

      {/* Contenedor Principal */}
      <Card className="bg-card/30 border-border/80 p-2.5 sm:p-5 shadow-sm space-y-4 overflow-hidden">
        {/* Barra de Búsqueda + Píldoras de Estado */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-border/50 pb-3.5">
          <div className="relative w-full lg:max-w-xs flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar N° orden, cliente, DNI o equipo..."
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

          {/* Píldoras de filtro rápido (scrolleables en móvil) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            {STATUS_FILTERS.map((st) => {
              const isActive = statusFilter === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setStatusFilter(st.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-primary/15 text-primary border-primary/30 font-bold"
                      : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla / Tarjetas de Órdenes */}
        {loading ? (
          <div className="text-center py-16 text-xs text-muted-foreground font-light">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando órdenes de servicio...
          </div>
        ) : filteredOrders.length > 0 ? (
          <>
            {/* Vista Móvil (< md): Tarjetas operativas */}
            <div className="space-y-3 md:hidden">
              {filteredOrders.map((o) => {
                const client = o.clientId || {};
                const hasDiag = !!o.diagnosis;
                const hasBudget =
                  o.budget && Array.isArray(o.budget.items) && o.budget.items.length > 0;
                const totalB = hasBudget ? o.budget.items.reduce((s, i) => s + i.price, 0) : 0;

                return (
                  <div
                    key={o._id}
                    className="rounded-xl border border-border/70 bg-background/50 p-3 sm:p-3.5 space-y-3 text-left overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(o)}
                          className="font-mono text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <span>{o.trackingCode}</span>
                        </button>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {o.created_at
                            ? new Date(o.created_at).toLocaleDateString("es-AR", {
                                timeZone: "America/Argentina/Buenos_Aires",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : o.date || ""}
                          {o.created_at || o.time
                            ? ` • ${
                                o.created_at
                                  ? new Date(o.created_at).toLocaleTimeString("es-AR", {
                                      timeZone: "America/Argentina/Buenos_Aires",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                  : o.time
                              } hs`
                            : ""}
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusDropdown(o._id, o.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                          Equipo
                        </span>
                        <span className="font-semibold text-foreground block leading-snug">
                          {o.deviceModel}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{o.deviceType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                          Cliente
                        </span>
                        <span className="font-semibold text-foreground block leading-snug">
                          {client.name || "N/A"}
                        </span>
                        {client.dni && (
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            DNI: {client.dni}
                          </span>
                        )}
                      </div>
                    </div>

                    {(hasDiag || hasBudget) && (
                      <div className="rounded-lg bg-card/60 border border-border/40 p-2.5 space-y-1 text-xs">
                        {hasDiag && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                            <strong className="text-foreground">Diag:</strong> {o.diagnosis}
                          </p>
                        )}
                        {hasBudget && (
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-mono font-bold text-emerald-400">
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
                    )}

                    <div className="flex items-center gap-1 pt-1 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDiagModal(o)}
                        disabled={Boolean(o.budget?.approved)}
                        className={cn(
                          "flex-1 min-w-0 h-7 sm:h-8 px-2 text-[11px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1",
                          o.budget?.approved
                            ? "opacity-50 cursor-not-allowed border-border text-muted-foreground"
                            : "border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                        )}
                        title={o.budget?.approved ? "Presupuesto ya aprobado por el cliente" : "Cargar o editar diagnóstico y presupuesto"}
                      >
                        <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{o.budget?.approved ? "Aprobado" : "Diagnóstico"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleOpenDetailModal(o)}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer shrink-0"
                        title="Ver detalle completo de la orden"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleSendWhatsApp(o)}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 rounded-lg cursor-pointer shrink-0"
                        title="Enviar enlace de seguimiento por WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handlePrintOrder(o)}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer shrink-0"
                        title="Imprimir Comprobante"
                      >
                        <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleOpenEditReceptionModal(o)}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer shrink-0"
                        title="Editar recepción"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      {canUsePOS && (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          disabled={!(totalB > 0 && o.status === "listo")}
                          onClick={() => handleOpenChargePosModal(o)}
                          className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 disabled:opacity-20 disabled:pointer-events-none rounded-lg cursor-pointer shrink-0"
                          title={
                            totalB > 0 && o.status === "listo"
                              ? "Cobrar orden en Caja POS y marcar entregado"
                              : "Disponible cuando la orden esté en estado Listo y tenga presupuesto mayor a $0"
                          }
                        >
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      )}
                      {!isTechnician && (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleDeleteOrder(o)}
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10 border-destructive/30 rounded-lg cursor-pointer shrink-0"
                          title="Eliminar orden"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista Escritorio (>= md): Tabla completa */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-2.5">N° de Orden</th>
                    <th className="py-3 px-2.5">Cliente</th>
                    <th className="py-3 px-2.5">Dispositivo</th>
                    <th className="py-3 px-2.5">Diagnóstico / Presupuesto</th>
                    <th className="py-3 px-2.5">Estado</th>
                    <th className="py-3 px-2.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => {
                    const client = o.clientId || {};
                    const hasDiag = !!o.diagnosis;
                    const hasBudget =
                      o.budget && Array.isArray(o.budget.items) && o.budget.items.length > 0;
                    const totalB = hasBudget ? o.budget.items.reduce((s, i) => s + i.price, 0) : 0;

                    return (
                      <tr
                        key={o._id}
                        className="border-b border-border/40 hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3.5 px-2.5">
                          <div className="font-mono font-bold text-primary flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDetailModal(o)}
                              className="hover:underline cursor-pointer"
                              title="Ver ficha completa de la orden"
                            >
                              {o.trackingCode}
                            </button>
                            <a
                              href={getPublicTrackingUrl(o.trackingCode)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Abrir seguimiento público en pestaña nueva"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5 whitespace-nowrap">
                            <span>
                              {o.created_at
                                ? new Date(o.created_at).toLocaleDateString("es-AR", {
                                    timeZone: "America/Argentina/Buenos_Aires",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                : o.date || ""}
                            </span>
                            {(o.created_at || o.time) && (
                              <>
                                <span className="opacity-40">•</span>
                                <span>
                                  {o.created_at
                                    ? new Date(o.created_at).toLocaleTimeString("es-AR", {
                                        timeZone: "America/Argentina/Buenos_Aires",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })
                                    : o.time}{" "}
                                  hs
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-2.5">
                          <span className="font-semibold text-foreground block">
                            {client.name || "N/A"}
                          </span>
                          <div className="flex flex-col text-[10px] text-muted-foreground font-mono">
                            {client.dni && <span>DNI: {client.dni}</span>}
                            {client.phone && <span>Tel: {client.phone}</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-2.5">
                          <span className="font-semibold text-foreground block">
                            {o.deviceModel}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{o.deviceType}</span>
                        </td>
                        <td className="py-3.5 px-2.5 max-w-[230px]">
                          <div className="space-y-1">
                            {hasDiag ? (
                              <span
                                className="font-medium text-foreground truncate block"
                                title={o.diagnosis}
                              >
                                {o.diagnosis}
                              </span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground/60 italic block">
                                Sin diagnóstico cargado
                              </span>
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
                        <td className="py-3.5 px-2.5">{getStatusDropdown(o._id, o.status)}</td>
                         <td className="py-3.5 px-2.5 text-right">
                           <div className="inline-flex items-center justify-start gap-1">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleOpenDiagModal(o)}
                               className="h-8 px-2.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                               title="Cargar o editar diagnóstico y presupuesto"
                             >
                               <Stethoscope className="w-3.5 h-3.5" />
                               Diagnóstico
                             </Button>

                             <Button
                               variant="ghost"
                               size="icon-sm"
                               onClick={() => handleOpenDetailModal(o)}
                               className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer shrink-0"
                               title="Ver detalle completo de la orden"
                             >
                               <Eye className="w-4 h-4" />
                             </Button>

                             <Button
                               variant="ghost"
                               size="icon-sm"
                               onClick={() => handleSendWhatsApp(o)}
                               className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-lg cursor-pointer shrink-0"
                               title="Enviar link de seguimiento por WhatsApp"
                             >
                               <MessageCircle className="w-4 h-4" />
                             </Button>

                             <Button
                               variant="ghost"
                               size="icon-sm"
                               onClick={() => handlePrintOrder(o)}
                               className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer shrink-0"
                               title="Imprimir Comprobante de Recepción"
                             >
                               <Printer className="w-4 h-4" />
                             </Button>

                             <Button
                               variant="ghost"
                               size="icon-sm"
                               onClick={() => handleOpenEditReceptionModal(o)}
                               className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer shrink-0"
                               title="Editar datos de recepción"
                             >
                               <Pencil className="w-3.5 h-3.5" />
                             </Button>

                             {canUsePOS && (
                               <Button
                                 variant="ghost"
                                 size="icon-sm"
                                 disabled={!(totalB > 0 && o.status === "listo")}
                                 onClick={() => handleOpenChargePosModal(o)}
                                 className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-20 disabled:pointer-events-none rounded-lg cursor-pointer shrink-0"
                                 title={
                                   totalB > 0 && o.status === "listo"
                                     ? "Cobrar presupuesto en Caja POS y marcar entregado"
                                     : "Disponible cuando la orden esté en estado Listo y tenga presupuesto mayor a $0"
                                 }
                               >
                                 <ShoppingCart className="w-4 h-4" />
                               </Button>
                             )}

                             {!isTechnician && (
                               <Button
                                 variant="ghost"
                                 size="icon-sm"
                                 onClick={() => handleDeleteOrder(o)}
                                 className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer shrink-0"
                                 title="Eliminar orden"
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
        ) : (
          <div className="text-center py-16 space-y-2">
            <p className="text-xs text-muted-foreground leading-normal font-light">
              No se encontraron órdenes de servicio con ese criterio.
            </p>
          </div>
        )}
      </Card>

      {/* MODAL DE DETALLE COMPLETO DE LA ORDEN ("OJITO") */}
      {showDetailModal && detailOrder && (
        <div
          onClick={() => setShowDetailModal(false)}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border/80 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
          >
            {/* Cabecera del Modal */}
            <CardHeader className="border-b border-border/70 p-4 sm:p-5 flex flex-row items-start justify-between gap-3 shrink-0 bg-muted/15">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-base sm:text-lg font-black text-primary">
                    #{detailOrder.trackingCode}
                  </span>
                  {getStatusDropdown(detailOrder._id, detailOrder.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ingresado el{" "}
                  <strong className="text-foreground">
                    {detailOrder.created_at
                      ? new Date(detailOrder.created_at).toLocaleDateString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : detailOrder.date || "N/A"}
                  </strong>
                  {detailOrder.created_at || detailOrder.time
                    ? ` a las ${
                        detailOrder.created_at
                          ? new Date(detailOrder.created_at).toLocaleTimeString("es-AR", {
                              timeZone: "America/Argentina/Buenos_Aires",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                          : detailOrder.time
                      } hs`
                    : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetailModal(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            {/* Cuerpo Scrolleable */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-left text-xs flex-1">
              {/* Bloque 1: Cliente + Equipo en grilla */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Datos del Cliente */}
                <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Datos del Cliente
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {detailOrder.clientId?.name || "Cliente sin especificar"}
                    </p>
                    <p className="text-muted-foreground font-mono text-[11px]">
                      DNI: <strong className="text-foreground">{detailOrder.clientId?.dni || "N/A"}</strong>
                    </p>
                    <p className="text-muted-foreground font-mono text-[11px]">
                      Tel: <strong className="text-foreground">{detailOrder.clientId?.phone || "N/A"}</strong>
                    </p>
                    {detailOrder.clientId?.email && (
                      <p className="text-muted-foreground text-[11px] truncate">
                        Email: <strong className="text-foreground">{detailOrder.clientId.email}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Datos del Dispositivo */}
                <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      Equipo Recibido
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDetailModal(false);
                        handleOpenEditReceptionModal(detailOrder);
                      }}
                      className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      Editar Recepción
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {detailOrder.deviceModel || "Sin modelo"}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Categoría: <strong className="text-foreground">{detailOrder.deviceType || "N/A"}</strong>
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Accesorios:{" "}
                      <strong className="text-foreground">{detailOrder.accessories || "Ninguno"}</strong>
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Estética:{" "}
                      <strong className="text-foreground">
                        {detailOrder.cosmetic || "Sin detalles"}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Falla Reportada */}
              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Falla Declarada en Recepción
                </span>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {detailOrder.issue || "Sin descripción de falla."}
                </p>
              </div>

              {/* Bloque 3: Diagnóstico y Presupuesto */}
              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Diagnóstico Técnico y Presupuesto
                  </span>
                  {detailOrder.budget?.approved ? (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                      Presupuesto Aprobado ✓
                    </Badge>
                  ) : detailOrder.budget?.rejected ? (
                    <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px] font-bold">
                      Presupuesto Rechazado ✕
                    </Badge>
                  ) : detailOrder.budget?.items?.length > 0 ? (
                    <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-semibold">
                      Pendiente de Aprobación
                    </Badge>
                  ) : null}
                </div>

                {detailOrder.diagnosis ? (
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap bg-card/70 p-2.5 rounded-lg border border-border/50">
                    {detailOrder.diagnosis}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic text-[11px]">
                    Todavía no se registró un diagnóstico técnico para esta orden.
                  </p>
                )}

                {detailOrder.budget?.items?.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="divide-y divide-border/40 border border-border/60 rounded-lg overflow-hidden">
                      {detailOrder.budget.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 bg-card/40 text-xs"
                        >
                          <span className="text-foreground">{item.desc}</span>
                          <span className="font-mono font-semibold text-foreground">
                            ${Number(item.price || 0).toLocaleString("es-AR")}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-[11px] font-bold uppercase text-primary">
                        Total Presupuestado
                      </span>
                      <span className="font-mono text-base font-black text-primary">
                        $
                        {detailOrder.budget.items
                          .reduce((s, i) => s + (Number(i.price) || 0), 0)
                          .toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bloque 4: Historial / Bitácora */}
              {Array.isArray(detailOrder.history) && detailOrder.history.length > 0 && (
                <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-primary" />
                    Historial de Movimientos
                  </span>
                  <div className="space-y-2 pl-2 border-l-2 border-primary/30">
                    {detailOrder.history.map((h, idx) => (
                      <div key={idx} className="text-[11px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                        <span className="text-foreground font-medium">{h.text}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pie del Modal con Acciones Rápidas */}
            <div className="border-t border-border/70 p-3.5 sm:p-4 bg-muted/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendWhatsApp(detailOrder)}
                  className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrintOrder(detailOrder)}
                  className="h-8 text-xs font-semibold border-border rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </Button>
                {canUsePOS && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      !(
                        detailOrder.status === "listo" &&
                        (detailOrder.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) || 0) > 0
                      )
                    }
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenChargePosModal(detailOrder);
                    }}
                    className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-25 disabled:pointer-events-none rounded-lg flex items-center gap-1.5 cursor-pointer"
                    title={
                      detailOrder.status === "listo"
                        ? "Cobrar presupuesto en Caja POS y marcar entregado"
                        : "Disponible cuando la orden esté en estado Listo y tenga presupuesto mayor a $0"
                    }
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Cobrar en Caja
                  </Button>
                )}
                {!isTechnician && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOrder(detailOrder)}
                    className="h-8 text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs font-semibold border-border rounded-lg"
                >
                  <a
                    href={getPublicTrackingUrl(detailOrder.trackingCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Portal Público
                  </a>
                </Button>
                {!detailOrder.budget?.approved ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenDiagModal(detailOrder);
                    }}
                    className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Editar Diagnóstico
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    disabled
                    className="h-8 bg-muted text-muted-foreground border border-border/70 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
                    title="El diagnóstico y presupuesto ya fue aprobado por el cliente (bloqueado para modificaciones)"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Presupuesto Aprobado
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL DE DIAGNÓSTICO Y PRESUPUESTO */}
      {showDiagModal && diagOrder && (
        <div
          onClick={() => setShowDiagModal(false)}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border/80 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 cursor-default"
          >
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Diagnóstico y Presupuesto
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Orden N°{" "}
                  <strong className="font-mono text-foreground">{diagOrder.trackingCode}</strong>{" "}
                  &bull; {diagOrder.deviceType} {diagOrder.deviceModel}
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

            <form onSubmit={handleSaveDiagnosis} className="p-4 sm:p-6 space-y-5">
              {/* Banner de Estado del Presupuesto */}
              {diagOrder.budget?.approved ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Presupuesto Aprobado por el Cliente</strong>{" "}
                      {diagOrder.budget.dateApproved && `el ${diagOrder.budget.dateApproved}`}
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                    Aprobado
                  </Badge>
                </div>
              ) : diagOrder.budget?.rejected ? (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center justify-between text-xs text-rose-400">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>Presupuesto Rechazado por el Cliente</strong>
                    </span>
                  </div>
                  <Badge className="bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold text-[10px]">
                    Rechazado
                  </Badge>
                </div>
              ) : diagOrder.budget?.items?.length ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-between text-xs text-amber-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Presupuesto Pendiente de Aprobación</strong> del cliente en el portal
                      público
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 text-amber-400 font-bold text-[10px]"
                  >
                    Pendiente
                  </Badge>
                </div>
              ) : null}

              {/* Diagnóstico Técnico */}
              <div className="space-y-2">
                <Label
                  htmlFor="diag-text"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Diagnóstico Técnico del Taller
                </Label>
                <Textarea
                  id="diag-text"
                  rows={4}
                  placeholder="Escribí el diagnóstico técnico (fallas detectadas en inspección, componentes a reemplazar...)"
                  value={diagText}
                  onChange={(e) => setDiagText(e.target.value)}
                  className="bg-background/80 border-border text-xs focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                />
              </div>

              {/* Presupuesto de Mano de Obra y Repuestos */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    Ítems del Presupuesto (Mano de obra y repuestos)
                  </Label>
                  <div className="flex items-center gap-2">
                    {inventoryItems.filter((inv) => inv.quantity > 0).length > 0 && (
                      <div className="relative">
                        <select
                          value={selectedInventoryId}
                          onChange={(e) => handleAddInventoryBudgetItem(e.target.value)}
                          className="h-7 bg-background border border-primary/40 text-primary rounded-lg px-2 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <option value="">+ Cargar repuesto de Stock</option>
                          {inventoryItems
                            .filter((inv) => inv.quantity > 0)
                            .map((inv) => (
                              <option key={inv._id} value={inv._id}>
                                {inv.name} (${Number(inv.price || 0).toLocaleString("es-AR")} •{" "}
                                {inv.quantity} u.)
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddBudgetItem}
                      className="h-7 text-[10px] font-bold border-primary/40 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar Ítem
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {budgetItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/50"
                    >
                      <div className="flex-grow min-w-0">
                        <Input
                          type="text"
                          placeholder="Descripción (ej: Reemplazo de módulo pantalla)"
                          value={item.desc}
                          onChange={(e) => handleBudgetItemChange(idx, "desc", e.target.value)}
                          className="bg-background text-xs h-8 w-full rounded-lg"
                        />
                        {item.inventoryId && (
                          <span className="text-[10px] text-primary font-semibold inline-flex items-center gap-1 mt-1">
                            <Package className="w-3 h-3" />
                            Vinculado a Inventario{" "}
                            {item.stockDeducted ? "(Stock ya descontado ✓)" : "(Restará 1 u.)"}
                          </span>
                        )}
                      </div>
                      <div className="relative w-28 sm:w-32 shrink-0">
                        <span className="absolute left-2.5 top-2 text-xs font-mono text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
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

                {budgetItems.some((i) => i.inventoryId && !i.stockDeducted) && (
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={deductStockOnSave}
                      onChange={(e) => setDeductStockOnSave(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>
                      Descontar automáticamente 1 unidad del stock de inventario al guardar
                    </span>
                  </label>
                )}

                {/* Total calculado */}
                <div className="flex justify-between items-baseline bg-primary/5 p-3 rounded-xl border border-primary/20 mt-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    TOTAL PRESUPUESTADO:
                  </span>
                  <span className="text-xl font-black font-outfit text-primary font-mono">
                    $
                    {budgetItems
                      .reduce((acc, i) => acc + Math.max(0, Number(i.price) || 0), 0)
                      .toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Cambiar Estado */}
              <div className="space-y-2 border-t border-border/60 pt-4">
                <Label
                  htmlFor="diag-status"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Actualizar Estado de la Orden
                </Label>
                <select
                  id="diag-status"
                  value={diagStatus}
                  onChange={(e) => setDiagStatus(e.target.value)}
                  className="w-full h-9 bg-background border border-border rounded-xl px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="diagnostico">En Diagnóstico</option>
                  <option value="presupuestado">
                    Presupuestado (Listo para envío al cliente)
                  </option>
                  <option value="reparacion">En Reparación</option>
                  <option value="listo">Listo para Retirar</option>
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

      {/* MODAL EDITAR DATOS DE RECEPCIÓN (FEATURE 3) */}
      {showEditReceptionModal && editReceptionOrder && (
        <div
          onClick={() => setShowEditReceptionModal(false)}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border/80 shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 cursor-default"
          >
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-primary" />
                  Editar Recepción del Equipo
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Orden N°{" "}
                  <strong className="font-mono text-foreground">
                    {editReceptionOrder.trackingCode}
                  </strong>
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditReceptionModal(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSaveReceptionEdit} className="p-4 sm:p-6 space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Categoría de Equipo
                  </Label>
                  <select
                    value={editDeviceType}
                    onChange={(e) => setEditDeviceType(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {["Celular", "Notebook / PC", "Tablet", "Consola", "Smartwatch", "Otro"].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Marca y Modelo
                  </Label>
                  <Input
                    type="text"
                    required
                    value={editDeviceModel}
                    onChange={(e) => setEditDeviceModel(e.target.value)}
                    placeholder="Ej. Samsung S23 Ultra"
                    className="h-9 text-xs bg-background rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Accesorios Entregados
                  </Label>
                  <Input
                    type="text"
                    value={editAccessories}
                    onChange={(e) => setEditAccessories(e.target.value)}
                    placeholder="Funda, cargador, bandeja SIM..."
                    className="h-9 text-xs bg-background rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Estado Estético
                  </Label>
                  <Input
                    type="text"
                    value={editCosmetic}
                    onChange={(e) => setEditCosmetic(e.target.value)}
                    placeholder="Rayones en tapa trasera..."
                    className="h-9 text-xs bg-background rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Falla Declarada por el Cliente
                </Label>
                <Textarea
                  rows={3}
                  required
                  value={editIssue}
                  onChange={(e) => setEditIssue(e.target.value)}
                  className="text-xs bg-background rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-border/60 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditReceptionModal(false)}
                  className="h-9 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingReception}
                  className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingReception ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL REGISTRAR COBRO DE ORDEN EN CAJA POS (FEATURE 2) */}
      {showChargePosModal && chargeOrder && (
        <div
          onClick={() => setShowChargePosModal(false)}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border/80 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
          >
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  Cobrar Orden en Caja POS
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Orden <strong className="font-mono text-foreground">#{chargeOrder.trackingCode}</strong>{" "}
                  &bull; {chargeOrder.deviceModel}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChargePosModal(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleConfirmChargePos} className="p-4 sm:p-6 space-y-4 text-left">
              <div className="bg-primary/10 border border-primary/25 rounded-xl p-4 flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Monto a Cobrar
                </span>
                <span className="text-2xl font-black font-outfit text-primary font-mono">
                  $
                  {(
                    chargeOrder.budget?.items?.reduce(
                      (s, i) => s + (Number(i.price) || 0),
                      0
                    ) ||
                    Number(chargeOrder.budget?.total) ||
                    0
                  ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Seleccioná el Medio de Pago
                </Label>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    { id: "efectivo", label: "Efectivo", icon: DollarSign },
                    { id: "transferencia", label: "Transferencia", icon: Smartphone },
                    { id: "debito", label: "Débito", icon: CreditCard },
                    { id: "credito", label: "Crédito", icon: Wallet },
                  ].map((m) => {
                    const Icon = m.icon;
                    const active = chargeMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setChargeMethod(m.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          active
                            ? "bg-primary/15 border-primary text-primary font-bold"
                            : "border-border/70 bg-background/60 hover:bg-muted/30 text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-primary" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={chargePrintTicket}
                  onChange={(e) => setChargePrintTicket(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Imprimir ticket de venta y marcar orden como Entregada</span>
              </label>

              <div className="flex justify-end gap-2.5 border-t border-border/60 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChargePosModal(false)}
                  className="h-9 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submittingCharge}
                  className="h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {submittingCharge ? "Registrando..." : "Confirmar Cobro y Entrega"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

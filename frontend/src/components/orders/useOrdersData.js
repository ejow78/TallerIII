import { normalizeText } from "@/lib/utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import { api, getLocalUser, normalizePlan, hasPOSAccess, cache } from "@/services/api";
import { sendBudgetReadyEmail, sendOrderReadyEmail } from "@/services/emailService";
import { printOrderReceipt, getOrderWhatsAppUrl } from "@/utils/printHelper";
import { toast } from "sonner";

export function useOrdersData(onDetailOrderUpdate) {
  const currentUser = getLocalUser();
  const isTechnician = currentUser?.role === "tecnico";
  const [effectivePlan, setEffectivePlan] = useState(
    normalizePlan(currentUser?.subscriptionPlan)
  );
  const canUsePOS = hasPOSAccess(effectivePlan);

  const venueId = currentUser?.venueId;
  const [orders, setOrders] = useState(() => cache.get(`orders_${venueId}`) || []);
  const [inventoryItems, setInventoryItems] = useState(() => cache.get(`inventory_${venueId}`) || []);
  const [loading, setLoading] = useState(() => !cache.has(`orders_${venueId}`));
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [profile, setProfile] = useState({
    name: "RepairIT - Taller Central",
    address: "Av. Sarmiento 1234, San Miguel de Tucumán",
    phone: "+54 381 4223344",
    email: "central@repairit.cloud",
  });

  const loadData = useCallback(async () => {
    try {
      const [ordersData, invData] = await Promise.all([
        api.orders.getAll(),
        api.inventory.getAll().catch(() => []),
      ]);
      setInventoryItems(Array.isArray(invData) ? invData : []);

      const sortedOrders = (ordersData || []).sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return (b._id || "").localeCompare(a._id || "");
      });

      setOrders(sortedOrders);
      if (onDetailOrderUpdate) {
        onDetailOrderUpdate(sortedOrders);
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
        console.warn("No se pudo cargar el perfil del taller:", err);
      }
    } catch (error) {
      toast.error("Error al cargar órdenes", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [onDetailOrderUpdate]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!isMounted) return;
      await loadData();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handlePrintOrder = useCallback((order) => {
    printOrderReceipt(order, profile);
  }, [profile]);

  const handleSendWhatsApp = useCallback((order) => {
    const waUrl = getOrderWhatsAppUrl(order, profile);
    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  }, [profile]);

  const handleStatusChange = useCallback(async (id, newStatus) => {
    const previousOrders = [...orders];

    const dateStr =
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
      });

    // Optimistic UI: actualización instantánea en memoria
    setOrders((prev) =>
      prev.map((order) => {
        if (order._id !== id) return order;
        const newHistory = [
          ...(Array.isArray(order.history) ? order.history : []),
          { date: dateStr, text: `Estado cambiado a ${newStatus.toUpperCase()}` },
        ];
        return { ...order, status: newStatus, history: newHistory };
      })
    );

    try {
      const updatedOrder = await api.orders.updateStatus(id, newStatus);
      toast.success("Estado actualizado con éxito", {
        description: `La orden ahora está en estado ${newStatus.toUpperCase()}.`,
      });

      const clientEmail = updatedOrder?.clientId?.email;
      if (clientEmail && clientEmail.includes("@")) {
        try {
          if (newStatus === "listo") {
            await sendOrderReadyEmail({
              to: clientEmail.trim(),
              clientName: updatedOrder.clientId?.name || "Cliente",
              orderCode: updatedOrder.trackingCode,
              deviceType: updatedOrder.deviceType,
              deviceModel: updatedOrder.deviceModel,
              workshopName: profile?.name || "RepairIT",
              workshopPhone: profile?.phone || "",
              workshopAddress: profile?.address || "",
            });
          } else if (newStatus === "presupuestado" && updatedOrder.budget?.total) {
            await sendBudgetReadyEmail({
              to: clientEmail.trim(),
              clientName: updatedOrder.clientId?.name || "Cliente",
              orderCode: updatedOrder.trackingCode,
              deviceType: updatedOrder.deviceType,
              deviceModel: updatedOrder.deviceModel,
              diagnosis: updatedOrder.diagnosis || "",
              budgetItems: updatedOrder.budget.items || [],
              budgetTotal: Number(updatedOrder.budget.total).toLocaleString("es-AR"),
              workshopName: profile?.name || "RepairIT",
              workshopPhone: profile?.phone || "",
              workshopAddress: profile?.address || "",
            });
          }
        } catch (emailErr) {
          console.warn("No se pudo enviar notificación por correo:", emailErr);
        }
      }

      await loadData();
    } catch (error) {
      setOrders(previousOrders);
      toast.error("Error al actualizar el estado", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  }, [orders, profile, loadData]);

  const handleDeleteOrder = useCallback(async (order) => {
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

    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o._id !== order._id));

    try {
      await api.orders.delete(order._id);
      toast.success("Orden eliminada", {
        description: `La orden #${order.trackingCode} fue eliminada del sistema.`,
      });
    } catch (error) {
      setOrders(previousOrders);
      toast.error("Error al eliminar orden", {
        description: error.message || "Intente nuevamente.",
      });
    }
  }, [isTechnician, orders]);

  const handleExportToExcel = useCallback(async () => {
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
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const client = o.clientId || {};
      const term = normalizeText(searchQuery);
      const matchesSearch =
        normalizeText(o.trackingCode).includes(term) ||
        normalizeText(client.name).includes(term) ||
        (client.dni && client.dni.includes(term)) ||
        normalizeText(o.deviceModel).includes(term) ||
        normalizeText(o.deviceType).includes(term);

      const matchesStatus =
        statusFilter === "todos" ||
        o.status === statusFilter ||
        (statusFilter === "en_reparacion" &&
          (o.status === "en_reparacion" || o.status === "reparacion")) ||
        (statusFilter === "reparacion" &&
          (o.status === "en_reparacion" || o.status === "reparacion"));

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getPublicTrackingUrl = useCallback((trackingCode) => {
    return window.location.hostname.includes("repairit.cloud")
      ? `https://tracking.repairit.cloud/seguimiento/${trackingCode}`
      : `/seguimiento/${trackingCode}`;
  }, []);

  return {
    orders,
    inventoryItems,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    profile,
    effectivePlan,
    canUsePOS,
    isTechnician,
    loadData,
    handleStatusChange,
    handleDeleteOrder,
    handlePrintOrder,
    handleSendWhatsApp,
    handleExportToExcel,
    filteredOrders,
    getPublicTrackingUrl,
  };
}

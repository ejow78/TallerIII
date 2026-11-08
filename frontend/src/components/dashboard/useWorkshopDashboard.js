import { useState, useEffect, useMemo } from "react";
import { api, normalizePlan, hasPOSAccess, cache } from "@/services/api";
import { toast } from "sonner";

export function useWorkshopDashboard(user) {
  const venueId = user?.venueId;
  const [loading, setLoading] = useState(() => !cache.has(`orders_${venueId}`));
  const [orders, setOrders] = useState(() => cache.get(`orders_${venueId}`) || []);
  const [inventory, setInventory] = useState(() => cache.get(`inventory_${venueId}`) || []);
  const [sales, setSales] = useState(() => cache.get(`sales_${venueId}`) || []);
  const [activePlan, setActivePlan] = useState(() => normalizePlan(user?.subscriptionPlan));

  // Controles de Gráficos Interactivos
  const [timeRange, setTimeRange] = useState("14d");
  const [chartMode, setChartMode] = useState("orders"); // "orders" | "revenue"
  const [breakdownMode, setBreakdownMode] = useState("status"); // "status" | "devices"

  const loadWorkshopData = async () => {
    try {
      const [ordersData, inventoryData, salesData, profileData] = await Promise.all([
        api.orders.getAll().catch(() => []),
        api.inventory.getAll().catch(() => []),
        api.sales.getAll().catch(() => []),
        api.auth.getProfile().catch(() => null),
      ]);
      if (profileData?.subscriptionPlan) {
        setActivePlan(normalizePlan(profileData.subscriptionPlan));
      }
      setOrders(ordersData || []);
      setInventory(inventoryData || []);
      setSales(salesData || []);
    } catch (err) {
      toast.error("Error al cargar datos del taller", {
        description: err.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!isMounted) return;
      await loadWorkshopData();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Procesamiento de serie temporal para el AreaChart (Shadcn Charts)
  const timeSeriesData = useMemo(() => {
    const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 14;
    const now = new Date();
    const daysMap = new Map();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit",
        month: "short",
      });
      daysMap.set(key, {
        dateKey: key,
        label,
        ingresados: 0,
        entregados: 0,
        facturacion: 0,
      });
    }

    // Contabilizar órdenes por fecha de creación
    orders.forEach((o) => {
      let key = null;
      if (o.created_at) {
        key = new Date(o.created_at).toISOString().split("T")[0];
      } else if (o.date && o.date.includes("/")) {
        const parts = o.date.split("/");
        if (parts.length === 3) {
          const [dd, mm, yyyy] = parts;
          key = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        }
      }

      if (key && daysMap.has(key)) {
        const entry = daysMap.get(key);
        entry.ingresados += 1;
        if (o.status === "entregado" || o.status === "listo") {
          entry.entregados += 1;
        }
        if (o.budget?.approved && Number(o.budget?.total) > 0) {
          entry.facturacion += Number(o.budget.total);
        }
      }
    });

    // Contabilizar ventas de caja (POS)
    sales.forEach((s) => {
      if (s.created_at) {
        const key = new Date(s.created_at).toISOString().split("T")[0];
        if (daysMap.has(key)) {
          const entry = daysMap.get(key);
          entry.facturacion += Number(s.total || 0);
        }
      }
    });

    return Array.from(daysMap.values());
  }, [orders, sales, timeRange]);

  // Procesamiento de distribución por Estado o por Tipo de Dispositivo
  const breakdownData = useMemo(() => {
    if (breakdownMode === "status") {
      const counts = {
        ingresado: 0,
        diagnostico: 0,
        presupuestado: 0,
        en_reparacion: 0,
        listo: 0,
        entregado: 0,
      };
      orders.forEach((o) => {
        const st = o.status === "reparacion" ? "en_reparacion" : o.status;
        if (st && st in counts) {
          counts[st] += 1;
        }
      });
      return [
        { name: "Ingresado", cantidad: counts.ingresado },
        { name: "Diagnóstico", cantidad: counts.diagnostico },
        { name: "Presupuesto", cantidad: counts.presupuestado },
        { name: "Reparación", cantidad: counts.en_reparacion },
        { name: "Listos", cantidad: counts.listo },
        { name: "Entregados", cantidad: counts.entregado },
      ];
    } else {
      const deviceCounts = {};
      orders.forEach((o) => {
        const type = o.deviceType || "Otro";
        deviceCounts[type] = (deviceCounts[type] || 0) + 1;
      });
      const entries = Object.entries(deviceCounts)
        .map(([name, cantidad]) => ({ name, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 6);

      if (entries.length === 0) {
        return [
          { name: "Smartphone", cantidad: 0 },
          { name: "Notebook", cantidad: 0 },
          { name: "PC Escritorio", cantidad: 0 },
          { name: "Consola", cantidad: 0 },
        ];
      }
      return entries;
    }
  }, [orders, breakdownMode]);

  // Métricas operativas dinámicas calculadas desde los datos reales de la sucursal activa
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "entregado" && o.status !== "rechazado"
  ).length;
  const diagnosticsCount = orders.filter(
    (o) => o.status === "diagnostico" || o.status === "ingresado"
  ).length;
  const repairCount = orders.filter(
    (o) => o.status === "reparacion" || o.status === "en_reparacion"
  ).length;
  const readyToPickupCount = orders.filter((o) => o.status === "listo").length;
  const activeOrdersDetail = `${diagnosticsCount} en revisión • ${repairCount} en reparación • ${readyToPickupCount} listos`;

  const deliveredCount = orders.filter((o) => o.status === "entregado").length;

  // Ingresos acumulados (Ventas POS + Presupuestos Aprobados)
  const totalSalesRevenue = sales.reduce((acc, s) => acc + Number(s.total || 0), 0);
  const approvedBudgetsRevenue = orders.reduce((acc, o) => {
    if (o.budget?.approved && Number(o.budget?.total) > 0) {
      return acc + Number(o.budget.total);
    }
    return acc;
  }, 0);
  const totalRevenue = totalSalesRevenue + approvedBudgetsRevenue;
  const isBasicPlan = !hasPOSAccess(activePlan);
  const nowDate = new Date();
  const monthlyOrdersCount = orders.filter((o) => {
    const rawDate = o.created_at || o.createdAt;
    const d = rawDate ? new Date(rawDate) : null;
    return d && d.getMonth() === nowDate.getMonth() && d.getFullYear() === nowDate.getFullYear();
  }).length;

  const totalItemsCount = inventory.length;
  const categoriesCount = new Set(inventory.map((item) => item.category).filter(Boolean)).size;

  const outOfStockItems = isBasicPlan
    ? []
    : inventory.filter((item) => (item.quantity || 0) <= 0);
  const outOfStockCount = outOfStockItems.length;

  const lowStockItems = isBasicPlan
    ? []
    : inventory.filter(
        (item) =>
          (item.quantity || 0) > 0 &&
          (item.quantity || 0) <= (item.minQuantity || item.min_quantity || 0)
      );
  const lowStockCount = lowStockItems.length;
  const stockHasAlert = outOfStockCount > 0 || lowStockCount > 0;
  const isCriticalNoStock = outOfStockCount > 0;
  const allAlertItems = [...outOfStockItems, ...lowStockItems];

  const lowStockDetail =
    !isBasicPlan && stockHasAlert
      ? isCriticalNoStock
        ? `${outOfStockCount} sin stock • ${lowStockCount} por reponer`
        : `${lowStockCount} repuestos requieren reposición`
      : `${totalItemsCount} insumos en ${categoriesCount} categorías`;

  return {
    loading,
    orders,
    inventory,
    sales,
    activePlan,
    timeRange,
    setTimeRange,
    chartMode,
    setChartMode,
    breakdownMode,
    setBreakdownMode,
    timeSeriesData,
    breakdownData,
    metrics: {
      activeOrdersCount,
      activeOrdersDetail,
      deliveredCount,
      readyToPickupCount,
      totalSalesRevenue,
      approvedBudgetsRevenue,
      totalRevenue,
      isBasicPlan,
      monthlyOrdersCount,
      totalItemsCount,
      categoriesCount,
      outOfStockCount,
      lowStockCount,
      stockHasAlert,
      isCriticalNoStock,
      allAlertItems,
      lowStockDetail,
    },
  };
}

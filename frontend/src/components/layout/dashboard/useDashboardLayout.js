import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api, normalizePlan } from "@/services/api";

export const prefetchRoute = (path) => {
  try {
    switch (path) {
      case "/dashboard":
        import("@/views/admin/DashboardPage");
        break;
      case "/dashboard/nuevo-ingreso":
        import("@/views/admin/NewOrderPage");
        break;
      case "/dashboard/ordenes":
        import("@/views/admin/OrdersPage");
        api.orders.getAll().catch(() => {});
        api.inventory.getAll().catch(() => {});
        break;
      case "/dashboard/clientes":
        import("@/views/admin/ClientsPage");
        api.clients.getAll().catch(() => {});
        api.orders.getAll().catch(() => {});
        break;
      case "/dashboard/inventario":
        import("@/views/admin/InventoryPage");
        api.inventory.getAll().catch(() => {});
        break;
      case "/dashboard/caja":
        import("@/views/admin/POSPage");
        api.orders.getAll().catch(() => {});
        api.inventory.getAll().catch(() => {});
        break;
      case "/dashboard/perfil":
        import("@/views/admin/ProfilePage");
        api.auth.getProfile().catch(() => {});
        break;
      case "/dashboard/cuentas":
        import("@/views/admin/VenueAccountsPage");
        api.venueAccounts.getAll().catch(() => {});
        break;
      case "/dashboard/usuarios":
        import("@/views/admin/SuperAdminUsersPage");
        break;
      default:
        break;
    }
  } catch {
    // Silencio en prefetch fallido
  }
};

export function useDashboardLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [venues, setVenues] = useState([]);
  const [activeVenue, setActiveVenue] = useState(null);
  const [sidebarStats, setSidebarStats] = useState({
    activeOrders: 0,
    lowStock: 0,
    outOfStock: 0,
    contactMessagesCount: 0,
  });

  const token =
    sessionStorage.getItem("repairit_token") ||
    localStorage.getItem("repairit_token");
  const user = useMemo(
    () =>
      JSON.parse(
        sessionStorage.getItem("repairit_user") ||
          localStorage.getItem("repairit_user") ||
          "{}"
      ),
    []
  );
  const isSuperAdmin = user.role === "superadmin";
  const effectivePlan = normalizePlan(
    activeVenue?.subscriptionPlan || user.subscriptionPlan
  );

  useEffect(() => {
    if (currentPath === "/dashboard/nuevo-ingreso")
      document.title = "RepairIT - Registrar Ingreso";
    else if (currentPath === "/dashboard/ordenes")
      document.title = "RepairIT - Órdenes de Servicio";
    else if (currentPath === "/dashboard/clientes")
      document.title = "RepairIT - Directorio de Clientes";
    else if (currentPath === "/dashboard/inventario")
      document.title = "RepairIT - Inventario de Insumos";
    else if (currentPath === "/dashboard/caja")
      document.title = "RepairIT - Control de Caja";
    else if (currentPath === "/dashboard/usuarios")
      document.title = "RepairIT - Gestión de Usuarios";
    else if (currentPath === "/dashboard/consultas")
      document.title = "RepairIT - Consultas Web";
    else if (currentPath === "/dashboard/cuentas")
      document.title = "RepairIT - Cuentas de Acceso";
    else if (currentPath === "/dashboard/perfil")
      document.title = "RepairIT - Configuración de Taller";
    else document.title = "RepairIT - Panel de Control";
  }, [currentPath]);

  useEffect(() => {
    let isMounted = true;
    if (isSuperAdmin) {
      api.super
        .getContactMessages()
        .then((msgs) => {
          if (!isMounted) return;
          setSidebarStats((prev) => ({
            ...prev,
            contactMessagesCount: Array.isArray(msgs) ? msgs.length : 0,
          }));
        })
        .catch(() => {});
    } else {
      const loadSidebarData = async () => {
        try {
          const [profile, venuesData, ordersData, inventoryData] =
            await Promise.all([
              api.auth.getProfile().catch(() => null),
              api.auth.getVenues().catch(() => []),
              api.orders.getAll().catch(() => []),
              api.inventory.getAll().catch(() => []),
            ]);

          if (!isMounted) return;

          if (profile) {
            setActiveVenue(profile);
            if (
              profile.subscriptionPlan &&
              profile.subscriptionPlan !== user.subscriptionPlan
            ) {
              const updatedLocal = {
                ...user,
                subscriptionPlan: profile.subscriptionPlan,
              };
              localStorage.setItem(
                "repairit_user",
                JSON.stringify(updatedLocal)
              );
              sessionStorage.setItem(
                "repairit_user",
                JSON.stringify(updatedLocal)
              );
            }
          }
          if (venuesData) setVenues(venuesData);

          const activeOrders = (ordersData || []).filter(
            (o) => o.status !== "entregado" && o.status !== "rechazado"
          ).length;
          const outOfStock = (inventoryData || []).filter(
            (item) => (item.quantity || 0) <= 0
          ).length;
          const lowStock = (inventoryData || []).filter(
            (item) =>
              (item.quantity || 0) > 0 &&
              (item.quantity || 0) <=
                (item.minQuantity || item.min_quantity || 0)
          ).length;

          setSidebarStats({ activeOrders, lowStock, outOfStock });
        } catch (err) {
          console.error("Error al cargar datos de navegación:", err.message);
        }
      };
      loadSidebarData();
    }
    return () => {
      isMounted = false;
    };
  }, [isSuperAdmin, location.pathname, user]);

  useEffect(() => {
    if (!token && window.location.hostname.includes("repairit.cloud")) {
      window.location.href = "https://app.repairit.cloud/login";
    }
  }, [token]);

  const handleHeaderSwitchVenue = useCallback(async (venueId) => {
    try {
      const updatedUser = await api.auth.switchVenue(venueId);
      const localUser = JSON.parse(
        localStorage.getItem("repairit_user") ||
          sessionStorage.getItem("repairit_user") ||
          "{}"
      );
      const nextUser = { ...localUser, venueId: updatedUser.venueId };
      localStorage.setItem("repairit_user", JSON.stringify(nextUser));
      sessionStorage.setItem("repairit_user", JSON.stringify(nextUser));
      toast.success("Sucursal cambiada correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (err) {
      toast.error("Error al cambiar de sucursal", { description: err.message });
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.auth.logout();
      toast.success("Sesión cerrada correctamente.");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      if (window.location.hostname.includes("repairit.cloud")) {
        window.location.href = "https://repairit.cloud";
      } else {
        window.location.href = "/";
      }
    }
  }, []);

  return {
    location,
    currentPath,
    venues,
    activeVenue,
    sidebarStats,
    token,
    user,
    isSuperAdmin,
    effectivePlan,
    handleHeaderSwitchVenue,
    handleLogout,
  };
}

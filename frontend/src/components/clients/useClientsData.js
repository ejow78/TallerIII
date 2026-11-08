import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, getLocalUser, cache } from "@/services/api";

export function useClientsData() {
  const currentUser = getLocalUser();
  const isTechnician = currentUser?.role === "tecnico";
  const venueId = currentUser?.venueId;
  const orgId = currentUser?.organizationId;

  const [clients, setClients] = useState(
    () => cache.get(`clients_${orgId}_${venueId}`) || []
  );
  const [orders, setOrders] = useState(
    () => cache.get(`orders_${venueId}`) || []
  );
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(
    () => !cache.has(`clients_${orgId}_${venueId}`)
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Modal de Alta / Edición de Cliente
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Modal de visualización de órdenes del cliente
  const [selectedClientForOrders, setSelectedClientForOrders] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // Modal de confirmación de borrado
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [clientsData, ordersData, profileData] = await Promise.all([
        api.clients.getAll(),
        api.orders.getAll(),
        api.auth.getProfile().catch(() => null),
      ]);
      setClients(clientsData || []);
      setOrders(ordersData || []);
      if (profileData) setProfile(profileData);
    } catch (error) {
      toast.error("Error al cargar datos", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchClients = async () => {
      if (!isMounted) return;
      await loadData();
    };
    fetchClients();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const openCreateModal = useCallback(() => {
    setEditingClient(null);
    setShowClientModal(true);
  }, []);

  const openEditModal = useCallback((client) => {
    setEditingClient(client);
    setShowClientModal(true);
  }, []);

  const closeClientModal = useCallback(() => {
    setShowClientModal(false);
    setEditingClient(null);
  }, []);

  const openOrdersModal = useCallback((client) => {
    setSelectedClientForOrders(client);
    setShowOrdersModal(true);
  }, []);

  const closeOrdersModal = useCallback(() => {
    setSelectedClientForOrders(null);
    setShowOrdersModal(false);
  }, []);

  const requestDeleteClient = useCallback(
    (client) => {
      if (isTechnician) {
        toast.error("Permiso denegado", {
          description: "Solo los administradores pueden eliminar clientes.",
        });
        return;
      }
      setClientToDelete(client);
      setShowDeleteAlert(true);
    },
    [isTechnician]
  );

  const confirmDeleteClient = useCallback(async () => {
    if (!clientToDelete) return;
    const targetId = clientToDelete._id;
    const targetName = clientToDelete.name;
    const previousClients = [...clients];

    // Optimistic UI: remover de memoria al instante (0 ms)
    setClients((prev) => prev.filter((c) => c._id !== targetId));
    setClientToDelete(null);
    setShowDeleteAlert(false);

    try {
      await api.clients.delete(targetId);
      toast.error("Cliente eliminado", {
        description: `${targetName} y su historial de órdenes asociadas fueron eliminados.`,
      });
    } catch (error) {
      setClients(previousClients);
      toast.error("Error al eliminar cliente", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  }, [clientToDelete, clients]);

  const cancelDelete = useCallback(() => {
    setClientToDelete(null);
    setShowDeleteAlert(false);
  }, []);

  const filteredClients = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter((c) => {
      const cId = c._id || "";
      return (
        cId.toLowerCase().includes(term) ||
        (c.name && c.name.toLowerCase().includes(term)) ||
        (c.dni && c.dni.replace(/\./g, "").includes(term.replace(/\./g, ""))) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term))
      );
    });
  }, [clients, searchQuery]);

  const handleExportToExcel = useCallback(async () => {
    if (clients.length === 0) {
      toast.error("No hay clientes registrados para exportar.");
      return;
    }

    try {
      toast.info("Generando archivo Excel de clientes...");
      const { default: writeXlsxFile } = await import("write-excel-file/browser");

      const columns = [
        {
          header: {
            value: "ID Cliente",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => ({
            type: String,
            value: c._id ? c._id.substring(c._id.length - 6).toUpperCase() : "N/A",
            align: "center",
          }),
          width: 14,
        },
        {
          header: {
            value: "Nombre y Apellido",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (c) => ({
            type: String,
            value: c.name || "Sin nombre",
            fontWeight: "bold",
          }),
          width: 28,
        },
        {
          header: {
            value: "DNI / CUIT",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => ({
            type: String,
            value: String(c.dni || "N/A"),
            align: "center",
          }),
          width: 16,
        },
        {
          header: {
            value: "Teléfono",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (c) => ({ type: String, value: c.phone || "N/A" }),
          width: 20,
        },
        {
          header: {
            value: "Correo Electrónico",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (c) => ({ type: String, value: c.email || "N/A" }),
          width: 28,
        },
        {
          header: {
            value: "Órdenes Registradas",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => {
            const count = orders.filter((o) => {
              const oClientId =
                typeof o.clientId === "object" ? o.clientId?._id : o.clientId;
              return oClientId === c._id;
            }).length;
            return { type: Number, value: count, align: "center" };
          },
          width: 20,
        },
        {
          header: {
            value: "Fecha Alta",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => {
            let formattedDate = "-";
            if (c.created_at) {
              formattedDate = new Date(c.created_at).toLocaleDateString("es-AR", {
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
      ];

      await writeXlsxFile(filteredClients, { columns }).toFile(
        `Clientes_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Listado de clientes exportado a Excel (.xlsx).");
    } catch (err) {
      console.error("Error al generar Excel de clientes:", err);
      toast.error("Error al exportar clientes a Excel.");
    }
  }, [clients.length, filteredClients, orders]);

  return {
    currentUser,
    isTechnician,
    clients,
    orders,
    profile,
    loading,
    searchQuery,
    setSearchQuery,
    filteredClients,
    loadData,
    showClientModal,
    editingClient,
    openCreateModal,
    openEditModal,
    closeClientModal,
    showOrdersModal,
    selectedClientForOrders,
    openOrdersModal,
    closeOrdersModal,
    clientToDelete,
    showDeleteAlert,
    requestDeleteClient,
    confirmDeleteClient,
    cancelDelete,
    handleExportToExcel,
  };
}

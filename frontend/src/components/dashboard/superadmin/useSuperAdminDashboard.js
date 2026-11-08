import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, normalizePlan } from "@/services/api";

export function useSuperAdminDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [planFilter, setPlanFilter] = useState("todos");
  const [viewingOrg, setViewingOrg] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);
  const [editOrgName, setEditOrgName] = useState("");
  const [editOrgPlan, setEditOrgPlan] = useState("Taller Básico");
  const [editOrgStatus, setEditOrgStatus] = useState("activo");
  const [editingVenue, setEditingVenue] = useState(null);
  const [submittingSuper, setSubmittingSuper] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSuperData = useCallback(async () => {
    try {
      setLoading(true);
      const orgsData = await api.super.getOrganizations();
      setOrganizations(orgsData || []);
    } catch (err) {
      toast.error("Error al cargar organizaciones de la plataforma", {
        description: err.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!isMounted) return;
      await loadSuperData();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [loadSuperData]);

  const handlePlanChange = useCallback(
    async (orgId, newPlan) => {
      try {
        await api.super.updateSubscription(orgId, newPlan, null);
        toast.success("Plan de suscripción actualizado", {
          description: `Se asignó el plan ${newPlan}.`,
        });
        loadSuperData();
      } catch (err) {
        toast.error("Error al cambiar plan", { description: err.message });
      }
    },
    [loadSuperData]
  );

  const handleStatusChange = useCallback(
    async (orgId, newStatus) => {
      try {
        await api.super.updateSubscription(orgId, null, newStatus);
        toast.success("Estado de suscripción actualizado", {
          description: `Nuevo estado: ${newStatus.toUpperCase()}.`,
        });
        loadSuperData();
      } catch (err) {
        toast.error("Error al cambiar estado", { description: err.message });
      }
    },
    [loadSuperData]
  );

  const handleOpenEditOrg = useCallback((org) => {
    setEditingOrg(org);
    setEditOrgName(org.name || "");
    setEditOrgPlan(normalizePlan(org.subscriptionPlan));
    setEditOrgStatus(org.subscriptionStatus || "activo");
  }, []);

  const handleSaveEditOrg = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editingOrg) return;
      try {
        setSubmittingSuper(true);
        await api.super.updateSubscription(
          editingOrg._id,
          editOrgPlan,
          editOrgStatus,
          editOrgName
        );
        toast.success("Taller actualizado con éxito");
        setEditingOrg(null);
        loadSuperData();
      } catch (err) {
        toast.error("Error al guardar taller", { description: err.message });
      } finally {
        setSubmittingSuper(false);
      }
    },
    [editingOrg, editOrgName, editOrgPlan, editOrgStatus, loadSuperData]
  );

  const handleDeleteOrg = useCallback(
    async (org) => {
      if (
        !window.confirm(
          `¿Estás seguro de eliminar el taller "${org.name}" y todos sus registros asociados? Esta acción no se puede deshacer.`
        )
      ) {
        return;
      }
      try {
        await api.super.deleteOrganization(org._id);
        toast.success("Taller eliminado", {
          description: `"${org.name}" fue eliminado de la plataforma.`,
        });
        if (viewingOrg?._id === org._id) setViewingOrg(null);
        if (editingOrg?._id === org._id) setEditingOrg(null);
        loadSuperData();
      } catch (err) {
        toast.error("Error al eliminar taller", { description: err.message });
      }
    },
    [viewingOrg, editingOrg, loadSuperData]
  );

  const handleSaveVenueAsSuper = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editingVenue) return;
      try {
        setSubmittingSuper(true);
        await api.super.updateVenueAsSuper(editingVenue.id, {
          name: editingVenue.name,
          address: editingVenue.address,
          phone: editingVenue.phone,
          email: editingVenue.email,
        });
        toast.success("Sucursal actualizada correctamente");
        setEditingVenue(null);
        const updatedOrgs = await api.super.getOrganizations();
        setOrganizations(updatedOrgs || []);
        if (viewingOrg) {
          const refreshed = updatedOrgs.find((o) => o._id === viewingOrg._id);
          if (refreshed) setViewingOrg(refreshed);
        }
      } catch (err) {
        toast.error("Error al actualizar sucursal", {
          description: err.message,
        });
      } finally {
        setSubmittingSuper(false);
      }
    },
    [editingVenue, viewingOrg]
  );

  const filteredOrgs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return organizations.filter((o) => {
      const matchesName = o.name?.toLowerCase().includes(q);
      const matchesVenue = (o.venues || []).some(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.address?.toLowerCase().includes(q) ||
          v.email?.toLowerCase().includes(q)
      );
      const matchesSearch = !q || matchesName || matchesVenue;
      const matchesStatus =
        statusFilter === "todos" || o.subscriptionStatus === statusFilter;
      const matchesPlan =
        planFilter === "todos" ||
        normalizePlan(o.subscriptionPlan) === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [organizations, searchQuery, statusFilter, planFilter]);

  const totalOrgs = organizations.length;
  const activeOrgs = useMemo(
    () => organizations.filter((o) => o.subscriptionStatus === "activo").length,
    [organizations]
  );
  const suspendedOrgs = useMemo(
    () => organizations.filter((o) => o.subscriptionStatus !== "activo").length,
    [organizations]
  );
  const totalVenues = useMemo(
    () =>
      organizations.reduce((acc, o) => acc + (o.venuesCount || 0), 0),
    [organizations]
  );

  return {
    organizations,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    viewingOrg,
    setViewingOrg,
    editingOrg,
    setEditingOrg,
    editOrgName,
    setEditOrgName,
    editOrgPlan,
    setEditOrgPlan,
    editOrgStatus,
    setEditOrgStatus,
    editingVenue,
    setEditingVenue,
    submittingSuper,
    loading,
    loadSuperData,
    handlePlanChange,
    handleStatusChange,
    handleOpenEditOrg,
    handleSaveEditOrg,
    handleDeleteOrg,
    handleSaveVenueAsSuper,
    filteredOrgs,
    totalOrgs,
    activeOrgs,
    suspendedOrgs,
    totalVenues,
  };
}

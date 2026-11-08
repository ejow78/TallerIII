import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, getLocalUser } from "@/services/api";

export function useSuperAdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [orgFilter, setOrgFilter] = useState("todas");

  // States for Manage User Modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalRole, setModalRole] = useState("tecnico");
  const [modalVenueId, setModalVenueId] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, orgsData, msgsData] = await Promise.all([
        api.super.getUsers(),
        api.super.getOrganizations().catch(() => []),
        api.super.getContactMessages().catch(() => []),
      ]);
      setUsers(usersData || []);
      setOrganizations(orgsData || []);
      setContactMessages(msgsData || []);
    } catch (err) {
      toast.error("Error al cargar datos de la plataforma", {
        description: err.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchSuperAdminData = async () => {
      if (!isMounted) return;
      await loadData();
    };
    fetchSuperAdminData();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleRoleChange = useCallback(
    async (userId, newRole) => {
      try {
        await api.super.updateUserRole(userId, newRole);
        toast.success("Rol de usuario actualizado con éxito");
        loadData();
      } catch (err) {
        toast.error("Error al actualizar rol", {
          description: err.message || "No se pudo cambiar el rol.",
        });
      }
    },
    [loadData]
  );

  const handleOpenManageModal = useCallback((userItem) => {
    setSelectedUser(userItem);
    setModalName(userItem.name || "");
    setModalEmail(userItem.email || "");
    setModalRole(userItem.role || "tecnico");
    setModalVenueId(userItem.venueId?.id || userItem.venue_id || "");
    setModalPassword("");
    setShowPassword(false);
    setShowManageModal(true);
  }, []);

  const handleCloseManageModal = useCallback(() => {
    setShowManageModal(false);
    setSelectedUser(null);
  }, []);

  const selectedOrgVenues = useMemo(() => {
    if (!selectedUser) return [];
    const orgId =
      selectedUser.organizationId?.id || selectedUser.organization_id;
    const foundOrg = organizations.find((o) => o._id === orgId);
    return foundOrg?.venues || [];
  }, [selectedUser, organizations]);

  const handleUpdateUser = useCallback(
    async (e) => {
      e.preventDefault();
      if (!modalName || !modalEmail || !modalRole) {
        toast.error("Complete todos los campos requeridos.");
        return;
      }

      try {
        setSubmitting(true);
        await api.super.manageUser(
          selectedUser._id,
          modalName,
          modalEmail,
          modalRole,
          modalPassword || null
        );

        // Si cambió la sucursal asignada, actualizar también venue_id
        const currentVenueId =
          selectedUser.venueId?.id || selectedUser.venue_id || "";
        if (modalVenueId !== currentVenueId) {
          await api.super.updateUserAssignment(selectedUser._id, {
            venue_id: modalVenueId || null,
          });
        }

        toast.success("¡Usuario actualizado correctamente!");
        setShowManageModal(false);
        loadData();
      } catch (err) {
        toast.error("Error al actualizar usuario", {
          description: err.message || "No se pudo guardar los cambios.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [
      modalName,
      modalEmail,
      modalRole,
      modalPassword,
      modalVenueId,
      selectedUser,
      loadData,
    ]
  );

  const handleDeleteUser = useCallback(
    async (userId, userName) => {
      const currentUser = getLocalUser();
      if (userId === currentUser?._id) {
        toast.error("No puede eliminar su propio usuario activo.");
        return;
      }

      if (
        !window.confirm(
          `¿Estás seguro de que deseás eliminar permanentemente al usuario "${userName}"? Esta acción no se puede deshacer.`
        )
      ) {
        return;
      }

      try {
        await api.super.deleteUser(userId);
        toast.success("Usuario eliminado", {
          description: `La cuenta de "${userName}" fue eliminada de la plataforma.`,
        });
        setShowManageModal(false);
        loadData();
      } catch (err) {
        toast.error("Error al eliminar usuario", {
          description: err.message || "No se pudo procesar la solicitud.",
        });
      }
    },
    [loadData]
  );

  const handleDeleteContactMessage = useCallback(async (msgId, senderName) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseás eliminar la consulta enviada por "${senderName}"?`
      )
    ) {
      return;
    }

    try {
      await api.super.deleteContactMessage(msgId);
      setContactMessages((prev) => prev.filter((m) => m._id !== msgId));
      toast.success("Consulta eliminada", {
        description: `Se eliminó el mensaje de ${senderName}.`,
      });
    } catch (err) {
      toast.error("Error al eliminar consulta", {
        description: err.message || "No se pudo eliminar el mensaje.",
      });
    }
  }, []);

  const filteredContactMessages = useMemo(() => {
    const q = messageSearchQuery.toLowerCase().trim();
    if (!q) return contactMessages;
    return contactMessages.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q))
    );
  }, [contactMessages, messageSearchQuery]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.organizationId?.name &&
          u.organizationId.name.toLowerCase().includes(q)) ||
        (u.venueId?.name && u.venueId.name.toLowerCase().includes(q));
      const matchesRole = roleFilter === "todos" || u.role === roleFilter;
      const uOrgId = u.organizationId?.id || u.organization_id;
      const matchesOrg = orgFilter === "todas" || uOrgId === orgFilter;
      return matchesSearch && matchesRole && matchesOrg;
    });
  }, [users, searchQuery, roleFilter, orgFilter]);

  const totalCount = users.length;
  const adminsCount = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users]
  );
  const techsCount = useMemo(
    () => users.filter((u) => u.role === "tecnico").length,
    [users]
  );
  const superCount = useMemo(
    () => users.filter((u) => u.role === "superadmin").length,
    [users]
  );

  return {
    loading,
    users,
    organizations,
    contactMessages,
    searchQuery,
    setSearchQuery,
    messageSearchQuery,
    setMessageSearchQuery,
    roleFilter,
    setRoleFilter,
    orgFilter,
    setOrgFilter,
    filteredUsers,
    filteredContactMessages,
    totalCount,
    adminsCount,
    techsCount,
    superCount,
    loadData,
    handleRoleChange,
    handleDeleteUser,
    handleDeleteContactMessage,
    showManageModal,
    selectedUser,
    modalName,
    setModalName,
    modalEmail,
    setModalEmail,
    modalRole,
    setModalRole,
    modalVenueId,
    setModalVenueId,
    modalPassword,
    setModalPassword,
    showPassword,
    setShowPassword,
    submitting,
    selectedOrgVenues,
    handleOpenManageModal,
    handleCloseManageModal,
    handleUpdateUser,
  };
}

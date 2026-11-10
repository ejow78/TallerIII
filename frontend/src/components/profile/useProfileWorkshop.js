import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { parseVenueAddress, formatVenueAddress } from "@/utils/venueHelper";
import {
  api,
  normalizePlan,
  getLocalUser,
  saveLocalUser,
} from "@/services/api";

export function useProfileWorkshop() {
  const initialUser = getLocalUser();
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [venues, setVenues] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState(
    normalizePlan(initialUser.subscriptionPlan)
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    initialUser.subscriptionStatus || "activo"
  );

  const [showPlansModal, setShowPlansModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Estados de Modal de Sucursal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" o "edit"
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalAddress, setModalAddress] = useState("");
  const [modalHours, setModalHours] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const data = await api.auth.getProfile();
      setVenueName(data.name || "");
      const parsedVenueData = parseVenueAddress(data.address || "");
      setAddress(parsedVenueData.address);
      setHours(parsedVenueData.hours);
      setPhone(data.phone || "");
      setEmail(data.email || "");
      if (data.subscriptionPlan) {
        setSubscriptionPlan(normalizePlan(data.subscriptionPlan));
      }
      if (data.subscriptionStatus) {
        setSubscriptionStatus(data.subscriptionStatus);
      }

      // Cargar todas las sucursales de la organización
      const venuesData = await api.auth.getVenues();
      setVenues(venuesData || []);
    } catch (error) {
      toast.error("Error al cargar perfil del taller", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  }, [
    setVenueName,
    setAddress,
    setHours,
    setPhone,
    setEmail,
    setSubscriptionPlan,
    setSubscriptionStatus,
    setVenues,
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      if (!isMounted) return;
      await fetchProfile();
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const fullAddress = formatVenueAddress(address, hours);
        await api.auth.updateProfile({
          name: venueName,
          address: fullAddress,
          phone,
          email,
        });
        toast.success("¡Configuración del Taller Guardada!", {
          description: `Los datos de la sucursal "${venueName}" han sido actualizados con éxito.`,
        });
        fetchProfile();
      } catch (error) {
        toast.error("Error al guardar configuración", {
          description: error.message || "No se pudieron guardar los cambios.",
        });
      }
    },
    [address, hours, venueName, phone, email, fetchProfile]
  );

  const handleOpenCreateModal = useCallback(() => {
    setModalMode("create");
    setEditingVenueId(null);
    setModalName("");
    setModalEmail("");
    setModalPhone("");
    setModalAddress("");
    setModalHours("");
    setShowModal(true);
  }, []);

  const handleOpenEditModal = useCallback((venue) => {
    setModalMode("edit");
    setEditingVenueId(venue._id);
    setModalName(venue.name || "");
    setModalEmail(venue.email || "");
    setModalPhone(venue.phone || "");
    const parsedModalVenue = parseVenueAddress(venue.address || "");
    setModalAddress(parsedModalVenue.address);
    setModalHours(parsedModalVenue.hours);
    setShowModal(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const fullModalAddress = formatVenueAddress(modalAddress, modalHours);
        if (modalMode === "create") {
          await api.auth.createVenue({
            name: modalName,
            email: modalEmail,
            phone: modalPhone,
            address: fullModalAddress,
          });
          toast.success("Nueva sucursal creada con éxito");
        } else {
          await api.auth.updateVenue(editingVenueId, {
            name: modalName,
            email: modalEmail,
            phone: modalPhone,
            address: fullModalAddress,
          });
          toast.success("Datos de sucursal actualizados con éxito");
        }
        setShowModal(false);
        fetchProfile();
      } catch (err) {
        toast.error("Error al procesar la sucursal", {
          description: err.message,
        });
      }
    },
    [
      modalAddress,
      modalHours,
      modalMode,
      modalName,
      modalEmail,
      modalPhone,
      editingVenueId,
      fetchProfile,
    ]
  );

  const handleSwitchActiveVenue = useCallback(async (venueId) => {
    try {
      const updatedUser = await api.auth.switchVenue(venueId);

      // Actualizar sesión guardada
      const localUser = getLocalUser();
      saveLocalUser({ ...localUser, venueId: updatedUser.venueId });

      toast.success("Sucursal activa cambiada", {
        description:
          "El panel de control se actualizará con el contexto de la nueva sucursal.",
      });

      // Forzar reload suave para recargar sidebar, órdenes e inventario
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err) {
      toast.error("Error al cambiar de sucursal", {
        description: err.message,
      });
    }
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    setIsDeletingAccount(true);
    try {
      await api.auth.deleteAccount();
      toast.success("Cuenta eliminada definitivamente", {
        description: "Todos los datos del taller fueron borrados con éxito.",
      });
      setTimeout(() => {
        window.location.href = window.location.hostname.includes("repairit.cloud")
          ? "https://repairit.cloud"
          : "/";
      }, 800);
    } catch (err) {
      toast.error("Error al eliminar la cuenta", {
        description: err.message || "Por favor, intentá nuevamente.",
      });
      setIsDeletingAccount(false);
    }
  }, []);

  return {
    venueName,
    setVenueName,
    address,
    setAddress,
    hours,
    setHours,
    phone,
    setPhone,
    email,
    setEmail,
    venues,
    subscriptionPlan,
    subscriptionStatus,
    showPlansModal,
    setShowPlansModal,
    showModal,
    setShowModal,
    modalMode,
    modalName,
    setModalName,
    modalEmail,
    setModalEmail,
    modalPhone,
    setModalPhone,
    modalAddress,
    setModalAddress,
    modalHours,
    setModalHours,
    isDeletingAccount,
    handleSave,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleModalSubmit,
    handleSwitchActiveVenue,
    handleDeleteAccount,
  };
}

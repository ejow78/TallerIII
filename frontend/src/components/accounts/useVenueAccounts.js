import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api, getLocalUser, hasMultiTallerAccess } from "@/services/api";

export function useVenueAccounts() {
  const user = getLocalUser();
  const isMultiTaller = hasMultiTallerAccess(user.subscriptionPlan);

  const [accounts, setAccounts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueId, setVenueId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isMultiTaller) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const accountsData = await api.venueAccounts.getAll();
      setAccounts(accountsData || []);

      const venuesData = await api.auth.getVenues();
      setVenues(venuesData || []);
      if (venuesData && venuesData.length > 0) {
        setVenueId(venuesData[0]._id);
      }
    } catch (error) {
      toast.error("Error al cargar datos", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [isMultiTaller]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!isMounted) return;
      await fetchData();
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const handleCreate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!name || !email || !password || !venueId) {
        toast.error("Complete todos los campos requeridos.");
        return;
      }

      try {
        setSubmitting(true);
        await api.venueAccounts.create({
          name,
          email,
          password,
          venueId,
        });
        toast.success("¡Cuenta de Acceso Creada!", {
          description: `Se registró la cuenta "${name}" correctamente.`,
        });
        setShowModal(false);
        setName("");
        setEmail("");
        setPassword("");
        fetchData();
      } catch (error) {
        toast.error("Error al crear cuenta", {
          description:
            error.message || "No se pudo registrar la cuenta en Supabase.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, password, venueId, fetchData]
  );

  const handleDelete = useCallback(
    async (accountId, accountName) => {
      if (
        !window.confirm(
          `¿Está seguro de que desea eliminar la cuenta "${accountName}"? El dispositivo perderá acceso inmediato al sistema.`
        )
      ) {
        return;
      }

      try {
        await api.venueAccounts.delete(accountId);
        toast.success("Cuenta eliminada", {
          description: `La cuenta de acceso "${accountName}" fue removida correctamente.`,
        });
        fetchData();
      } catch (error) {
        toast.error("Error al eliminar cuenta", {
          description: error.message || "No se pudo procesar la solicitud.",
        });
      }
    },
    [fetchData]
  );

  return {
    accounts,
    venues,
    loading,
    showModal,
    setShowModal,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    venueId,
    setVenueId,
    showPassword,
    setShowPassword,
    submitting,
    isMultiTaller,
    handleCreate,
    handleDelete,
  };
}

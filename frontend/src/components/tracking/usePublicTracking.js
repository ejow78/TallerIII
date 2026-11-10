import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/services/api";
import { parseVenueAddress } from "@/utils/venueHelper";

export const STEPS = [
  { key: "ingresado", label: "Ingresado" },
  { key: "diagnostico", label: "En Diagnóstico" },
  { key: "presupuestado", label: "Presupuestado" },
  { key: "reparacion", label: "En Reparación" },
  { key: "listo", label: "Listo para Retirar" },
  { key: "entregado", label: "Entregado" },
];

export function usePublicTracking() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [dniInput, setDniInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.orders.track(id);
      setOrder(data);
    } catch (error) {
      console.error(error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    document.title = id
      ? `RepairIT - Seguimiento ${id}`
      : "RepairIT - Seguimiento de Orden";
    if (!id) return;
    let isMounted = true;
    const fetchOrder = async () => {
      if (!isMounted) return;
      await loadOrder();
    };
    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id, loadOrder]);

  const handleApproveBudget = useCallback(async () => {
    if (!dniInput.trim()) {
      toast.error("Por favor, ingresá tu número de DNI para confirmar identidad.");
      return;
    }

    try {
      setApproving(true);
      const res = await api.orders.approveBudget(id, dniInput.trim());

      toast.success("¡Presupuesto Aprobado!", {
        description: res.message || "Tu aprobación ha sido registrada con éxito.",
      });

      setIsDialogOpen(false);
      loadOrder();
    } catch (error) {
      toast.error("Error al aprobar presupuesto", {
        description:
          error.message ||
          "El DNI ingresado no coincide con el titular de la orden.",
      });
    } finally {
      setApproving(false);
    }
  }, [dniInput, id, loadOrder]);

  const handleResetDemo = useCallback(() => {
    localStorage.removeItem("demo_order_approved");
    toast.info("Simulación reiniciada", {
      description: "Podés volver a probar el flujo de aprobación online.",
    });
    loadOrder();
  }, [loadOrder]);

  const isDemo = Boolean(id && id.toLowerCase().includes("demo"));

  const currentStepIndex = useMemo(() => {
    const rawStatus = (order?.status || "").toLowerCase().trim();
    if (rawStatus === "ingresado") return 0;
    if (rawStatus === "en_diagnostico" || rawStatus === "diagnostico") return 1;
    if (rawStatus === "presupuestado") return 2;
    if (rawStatus === "en_reparacion" || rawStatus === "reparacion") return 3;
    if (
      rawStatus === "listo_para_retirar" ||
      rawStatus === "listo" ||
      rawStatus === "finalizado"
    )
      return 4;
    if (rawStatus === "entregado") return 5;
    return 0;
  }, [order?.status]);

  const clientName =
    order?.clientId?.name ||
    order?.clientName ||
    order?.client_name ||
    "Cliente del Taller";

  const parsedVenue = useMemo(
    () => parseVenueAddress(order?.venueId?.address),
    [order?.venueId?.address]
  );
  const venueName = order?.venueId?.name || "Taller RepairIT";
  const venuePhone = order?.venueId?.phone;

  return {
    id,
    order,
    loading,
    dniInput,
    setDniInput,
    isDialogOpen,
    setIsDialogOpen,
    approving,
    handleApproveBudget,
    handleResetDemo,
    isDemo,
    currentStepIndex,
    clientName,
    parsedVenue,
    venueName,
    venuePhone,
  };
}

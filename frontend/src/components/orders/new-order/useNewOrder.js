import { normalizeText } from "@/lib/utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api, normalizePlan } from "@/services/api";
import { sendOrderCreatedEmail } from "@/services/emailService";
import { printOrderReceipt } from "@/utils/printHelper";

export function useNewOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  // Clientes existentes para autocompletado rápido
  const [existingClients, setExistingClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedExistingClient, setSelectedExistingClient] = useState(
    () => location.state?.client || null
  );

  // Estados del formulario
  const [clientName, setClientName] = useState(
    () => location.state?.client?.name || ""
  );
  const [clientDni, setClientDni] = useState(
    () => location.state?.client?.dni || ""
  );
  const [clientPhone, setClientPhone] = useState(
    () => location.state?.client?.phone || ""
  );
  const [clientEmail, setClientEmail] = useState(
    () => location.state?.client?.email || ""
  );
  const [deviceType, setDeviceType] = useState("Smartphone");
  const [deviceModel, setDeviceModel] = useState("");
  const [accessories, setAccessories] = useState("");
  const [cosmeticCondition, setCosmeticCondition] = useState("");
  const [issue, setIssue] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [autoPrint, setAutoPrint] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [monthlyOrdersCount, setMonthlyOrdersCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      try {
        const [p, cList, oList] = await Promise.all([
          api.auth.getProfile().catch(() => null),
          api.clients.getAll().catch(() => []),
          api.orders.getAll().catch(() => []),
        ]);
        if (!isMounted) return;
        if (p) setProfile(p);
        if (Array.isArray(cList)) setExistingClients(cList);
        if (Array.isArray(oList)) {
          const now = new Date();
          const mCount = oList.filter((o) => {
            const rawDate = o.created_at || o.createdAt;
            const d = rawDate ? new Date(rawDate) : null;
            return (
              d &&
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear()
            );
          }).length;
          setMonthlyOrdersCount(mCount);
        }
      } catch (err) {
        console.error("Error al cargar datos en useNewOrder:", err);
      }
    };
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.state?.client?.name) {
      toast.info(
        `Datos precargados para cliente: ${location.state.client.name}`
      );
    }
  }, [location.state]);

  // Coincidencias del buscador rápido de clientes
  const matchingClients = useMemo(() => {
    const q = normalizeText(clientSearch);
    if (!q) return [];
    return existingClients
      .filter(
        (c) =>
          normalizeText(c.name).includes(q) ||
          (c.dni && c.dni.replace(/\./g, "").includes(q.replace(/\./g, ""))) ||
          (c.phone && c.phone.includes(q))
      )
      .slice(0, 5);
  }, [clientSearch, existingClients]);

  // Coincidencia automática por DNI mientras tipea
  const dniMatchClient = useMemo(() => {
    const cleanDni = clientDni.replace(/\./g, "").trim();
    if (cleanDni.length < 6 || selectedExistingClient) return null;
    return existingClients.find(
      (c) => c.dni && c.dni.replace(/\./g, "").trim() === cleanDni
    );
  }, [clientDni, existingClients, selectedExistingClient]);

  const handleSelectClient = useCallback((c) => {
    setClientName(c.name || "");
    setClientDni(c.dni || "");
    setClientPhone(c.phone || "");
    setClientEmail(c.email || "");
    setSelectedExistingClient(c);
    setClientSearch("");
    toast.success(`Cliente seleccionado: ${c.name}`);
  }, []);

  const handleClearSelectedClient = useCallback(() => {
    setSelectedExistingClient(null);
    setClientName("");
    setClientDni("");
    setClientPhone("");
    setClientEmail("");
  }, []);

  // Registrar orden
  const handleRegisterOrder = useCallback(
    async (e) => {
      e.preventDefault();

      if (!acceptTerms) {
        toast.error("Debe confirmar las condiciones de recepción técnica.");
        return;
      }

      try {
        setSubmitting(true);

        // 1. Registrar o actualizar cliente mediante la API
        const client = await api.clients.create({
          name: clientName,
          dni: clientDni,
          phone: clientPhone,
          email: clientEmail,
        });

        const dateStr = new Date().toLocaleDateString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const timeStr = new Date().toLocaleTimeString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // 2. Crear la orden de servicio vinculada
        const order = await api.orders.create({
          clientId: client._id,
          deviceType,
          deviceModel,
          accessories: accessories || "Ninguno",
          cosmetic: cosmeticCondition || "Sin detalles",
          issue,
          date: dateStr,
          time: timeStr,
          status: "ingresado",
        });

        const hydratedOrder = {
          ...order,
          clientId: {
            _id: client._id,
            name: clientName,
            dni: clientDni,
            phone: clientPhone,
            email: clientEmail,
          },
        };

        toast.success(`¡Orden #${order.trackingCode} registrada!`, {
          description: `${deviceType} ${deviceModel} a nombre de ${clientName}.`,
        });

        // 3. Imprimir comprobante si está activado
        if (autoPrint) {
          printOrderReceipt(hydratedOrder, profile, hydratedOrder.clientId);
        }

        // 4. Enviar confirmación por correo electrónico automáticamente
        if (clientEmail && clientEmail.includes("@")) {
          try {
            await sendOrderCreatedEmail({
              to: clientEmail.trim(),
              clientName: clientName.trim(),
              clientDni: clientDni.trim(),
              clientPhone: clientPhone.trim(),
              orderCode: order.trackingCode,
              orderDate: `${dateStr} • ${timeStr} hs`,
              deviceType,
              deviceModel,
              accessories: accessories || "Ninguno",
              cosmetic: cosmeticCondition || "Sin detalles",
              issue,
              workshopName: profile?.name || "RepairIT",
              workshopPhone: profile?.phone || "",
              workshopAddress: profile?.address || "",
            });
          } catch (err) {
            console.warn("No se pudo enviar email de recepción:", err);
          }
        }

        navigate("/dashboard/ordenes");
      } catch (error) {
        toast.error("Error al registrar ingreso técnico", {
          description: error.message || "Por favor, intente nuevamente.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [
      acceptTerms,
      clientName,
      clientDni,
      clientPhone,
      clientEmail,
      deviceType,
      deviceModel,
      accessories,
      cosmeticCondition,
      issue,
      autoPrint,
      profile,
      navigate,
    ]
  );

  const isBasicCupoExceeded =
    normalizePlan(profile?.subscriptionPlan) === "Taller Básico" &&
    monthlyOrdersCount >= 100;

  return {
    clientSearch,
    setClientSearch,
    selectedExistingClient,
    clientName,
    setClientName,
    clientDni,
    setClientDni,
    clientPhone,
    setClientPhone,
    clientEmail,
    setClientEmail,
    deviceType,
    setDeviceType,
    deviceModel,
    setDeviceModel,
    accessories,
    setAccessories,
    cosmeticCondition,
    setCosmeticCondition,
    issue,
    setIssue,
    acceptTerms,
    setAcceptTerms,
    autoPrint,
    setAutoPrint,
    submitting,
    profile,
    monthlyOrdersCount,
    matchingClients,
    dniMatchClient,
    handleSelectClient,
    handleClearSelectedClient,
    handleRegisterOrder,
    isBasicCupoExceeded,
    navigate,
  };
}

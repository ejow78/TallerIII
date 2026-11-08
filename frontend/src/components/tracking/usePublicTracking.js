import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/services/api";
import { parseVenueAddress } from "@/utils/venueHelper";
import { escapeHtml, printHtml } from "@/utils/printHelper";

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

  const handleDownloadPdf = useCallback(() => {
    if (!order) return;

    const clientName = escapeHtml(order.clientId?.name || "Cliente");
    const venueName = escapeHtml(order.venueId?.name || "Taller RepairIT");
    const parsedPdfVenue = parseVenueAddress(order.venueId?.address);
    const venueAddress = escapeHtml(
      parsedPdfVenue.address || "Sucursal Central"
    );
    const venueHours = escapeHtml(parsedPdfVenue.hours || "");
    const safeTrackingCode = escapeHtml(order.trackingCode || "");
    const safeStatus = escapeHtml(
      (order.status || "INGRESADO").replace("_", " ")
    );
    const safeDate = escapeHtml(
      order.created_at
        ? `${new Date(order.created_at).toLocaleDateString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })} ${new Date(order.created_at).toLocaleTimeString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })} hs`
        : order.date || ""
    );
    const safeDevice = escapeHtml(
      `${order.deviceType || ""} ${order.deviceModel || ""}`.trim() ||
        "Dispositivo"
    );
    const safeIssue = escapeHtml(
      order.issue || "Sin falla declarada en recepción."
    );
    const safeDiag = escapeHtml(
      order.diagnosis || "En evaluación diagnóstica en laboratorio."
    );

    const budgetRows =
      order.budget?.items?.length > 0
        ? order.budget.items
            .map(
              (i) => `
          <tr>
            <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px;">${escapeHtml(
              i.desc
            )}</td>
            <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-align: right; font-family: monospace; font-weight: bold;">$${Number(
              i.price || 0
            ).toLocaleString("es-AR")}</td>
          </tr>`
            )
            .join("")
        : `<tr><td colspan="2" style="padding: 8px; font-size: 11px; color: #64748b; text-align: center;">Presupuesto pendiente de emisión.</td></tr>`;

    const totalBudget =
      order.budget?.items?.reduce(
        (sum, i) => sum + (Number(i.price) || 0),
        0
      ) || 0;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.4;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h1 style="font-size: 20px; font-weight: 800; color: #0284c7; margin: 0 0 4px 0;">RepairIT</h1>
            <p style="font-size: 11px; color: #64748b; margin: 0;">${venueName} &bull; ${venueAddress}</p>
            ${
              venueHours
                ? `<p style="font-size: 10px; color: #94a3b8; margin: 2px 0 0 0;">${venueHours}</p>`
                : ""
            }
          </div>
          <div style="text-align: right;">
            <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; border: 1px solid #cbd5e1;">#${safeTrackingCode}</span>
            <p style="font-size: 10px; color: #64748b; margin: 4px 0 0 0;">${safeDate}</p>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 13px; font-weight: bold; margin: 0 0 6px 0; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">Ficha del Dispositivo</h2>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Equipo:</strong> ${safeDevice}</p>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Titular:</strong> ${clientName}</p>
          <p style="margin: 0; font-size: 12px;"><strong>Estado Actual:</strong> <span style="font-weight: bold; color: #0284c7;">${safeStatus}</span></p>
        </div>

        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0; color: #475569; text-transform: uppercase;">Falla en Recepción</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 11px; color: #334155;">
            ${safeIssue}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0; color: #7c3aed; text-transform: uppercase;">Diagnóstico Especializado</h3>
          <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 10px; font-size: 11px; color: #4c1d95;">
            ${safeDiag}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0; color: #475569; text-transform: uppercase;">Detalle de Presupuesto</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 4px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 6px 8px; text-align: left; font-size: 10px; font-weight: bold; color: #475569; border-bottom: 1px solid #cbd5e1;">Concepto / Repuesto</th>
                <th style="padding: 6px 8px; text-align: right; font-size: 10px; font-weight: bold; color: #475569; border-bottom: 1px solid #cbd5e1;">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${budgetRows}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 8px; font-weight: bold; font-size: 12px; text-align: right;">TOTAL ESTIMADO:</td>
                <td style="padding: 8px; font-weight: 800; font-size: 14px; text-align: right; color: #0284c7; font-family: monospace;">$${totalBudget.toLocaleString(
                  "es-AR"
                )}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 10px; color: #94a3b8;">
          <p style="margin: 0 0 2px 0;">Consultá el avance en vivo ingresando a: <strong>https://repairit.cloud/consulta</strong></p>
          <p style="margin: 0;">Comprobante de seguimiento emitido por RepairIT Cloud OS</p>
        </div>
      </div>
    `;

    printHtml(htmlContent, `Seguimiento_${order.trackingCode}`);
  }, [order]);

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
    handleDownloadPdf,
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

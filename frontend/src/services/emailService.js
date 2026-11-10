import { supabase } from "./supabaseClient";
import { parseVenueAddress } from "@/utils/venueHelper";

function cleanWorkshopAddress(rawAddress) {
  const parsed = parseVenueAddress(rawAddress);
  return parsed.address || "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

/**
 * Función base para despachar correos usando plantillas nativas de Resend
 * exclusivamente a través de la función RPC segura en el servidor de Supabase.
 */
async function sendResendTemplate({ to, templateId, variables }) {
  if (!to || !to.includes("@")) {
    console.warn("[emailService] Destinatario inválido o no provisto:", to);
    return false;
  }

  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc("send_resend_template_email", {
      p_to: to,
      p_template_id: templateId,
      p_variables: variables,
    });

    if (!rpcErr && rpcData?.success) {
      console.log(`[emailService] Plantilla "${templateId}" enviada con éxito a:`, to);
      return true;
    }

    if (rpcErr) {
      console.warn("[emailService] Error en RPC send_resend_template_email:", rpcErr.message);
    }
    return false;
  } catch (err) {
    console.error("[emailService] Error al enviar plantilla:", err);
    return false;
  }
}

/**
 * 1. Enviar comprobante de orden ingresada
 */
export async function sendOrderCreatedEmail({
  to,
  clientName,
  clientDni = "",
  clientPhone = "",
  orderCode,
  orderDate = "",
  deviceType,
  deviceModel,
  accessories = "",
  cosmetic = "",
  issue,
  workshopName = "RepairIT",
  workshopPhone = "",
  workshopAddress = ""
}) {
  return sendResendTemplate({
    to,
    templateId: "orden-ingresada",
    variables: {
      client_name: clientName || "Cliente",
      client_dni: clientDni || "N/A",
      client_phone: clientPhone || "N/A",
      order_code: orderCode,
      order_date: orderDate || new Date().toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      device_type: deviceType || "Dispositivo",
      device_model: deviceModel || "",
      accessories: accessories || "Ninguno",
      cosmetic: cosmetic || "Sin detalles",
      issue: issue || "Revisión general",
      workshop_name: workshopName,
      workshop_phone: workshopPhone,
      workshop_address: cleanWorkshopAddress(workshopAddress)
    }
  });
}

/**
 * 2. Enviar aviso de presupuesto disponible
 */
export async function sendBudgetReadyEmail({
  to,
  clientName,
  orderCode,
  deviceType,
  deviceModel,
  diagnosis,
  budgetItems = [],
  budgetTotal = "0",
  workshopName = "RepairIT",
  workshopPhone = "",
  workshopAddress = ""
}) {
  // Construir tabla HTML estilizada para los ítems del presupuesto
  let budgetItemsHtml = "";
  if (Array.isArray(budgetItems) && budgetItems.length > 0) {
    const rows = budgetItems.map(item => `
      <tr>
        <td style="padding: 6px 0; color: #374151; font-size: 13px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(item.desc)}</td>
        <td align="right" style="padding: 6px 0; font-weight: 600; color: #111827; font-size: 13px; border-bottom: 1px solid #f3f4f6; font-family: monospace;">$${Number(item.price || 0).toLocaleString("es-AR")}</td>
      </tr>
    `).join("");

    budgetItemsHtml = `
      <table border="0" width="100%" cellPadding="0" cellSpacing="0" style="margin-bottom: 12px; border-top: 1px solid #e5e7eb; padding-top: 8px;">
        ${rows}
      </table>
    `;
  }

  return sendResendTemplate({
    to,
    templateId: "presupuesto-listo",
    variables: {
      client_name: clientName || "Cliente",
      order_code: orderCode,
      device_type: deviceType || "Dispositivo",
      device_model: deviceModel || "",
      diagnosis: diagnosis || "Inspección técnica completada.",
      budget_items_html: budgetItemsHtml,
      budget_total: budgetTotal,
      workshop_name: workshopName,
      workshop_phone: workshopPhone,
      workshop_address: cleanWorkshopAddress(workshopAddress)
    }
  });
}

/**
 * 3. Enviar aviso de equipo listo para retirar
 */
export async function sendOrderReadyEmail({
  to,
  clientName,
  orderCode,
  deviceType,
  deviceModel,
  workshopName = "RepairIT",
  workshopPhone = "",
  workshopAddress = ""
}) {
  return sendResendTemplate({
    to,
    templateId: "equipo-listo",
    variables: {
      client_name: clientName || "Cliente",
      order_code: orderCode,
      device_type: deviceType || "Dispositivo",
      device_model: deviceModel || "",
      workshop_name: workshopName,
      workshop_phone: workshopPhone,
      workshop_address: cleanWorkshopAddress(workshopAddress)
    }
  });
}

/**
 * 4. Enviar mensaje de contacto desde la Landing Page
 */
export async function sendContactEmail({ name, email, message }) {
  if (!name || !email || !message) {
    return { ok: false, error: "Por favor complete todos los campos obligatorios." };
  }

  try {
    const { data, error } = await supabase.rpc("send_contact_email", {
      p_name: name,
      p_email: email,
      p_message: message,
    });

    if (error) {
      console.error("[emailService] Error al llamar a RPC send_contact_email:", error);
      return { ok: false, error: error.message || "Error al procesar la solicitud en el servidor." };
    }

    if (data && data.success === false) {
      return { ok: false, error: data.error || "No se pudo enviar el mensaje." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[emailService] Error al enviar mensaje de contacto:", err);
    return { ok: false, error: "Error de conexión al enviar el mensaje." };
  }
}


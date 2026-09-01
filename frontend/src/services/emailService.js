import { supabase } from "./supabaseClient";

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const SENDER_EMAIL = "RepairIT <notificaciones@repairit.cloud>";

/**
 * Función base para despachar correos usando plantillas nativas de Resend
 */
async function sendResendTemplate({ to, templateId, variables }) {
  if (!to || !to.includes("@")) {
    console.warn("[emailService] Destinatario inválido o no provisto:", to);
    return false;
  }

  // 1. Despachar a través de Supabase RPC (servidor)
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
  } catch (err) {
    console.warn("[emailService] RPC de template no disponible, intentando fetch directo:", err);
  }

  // 2. Fallback fetch directo a Resend API
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [to],
        template: {
          id: templateId,
          variables: variables
        }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[emailService] Error de Resend:", data);
      return false;
    }

    console.log(`[emailService] Plantilla "${templateId}" enviada a:`, to, data.id);
    return true;
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
  orderCode,
  deviceType,
  deviceModel,
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
      order_code: orderCode,
      device_type: deviceType || "Dispositivo",
      device_model: deviceModel || "",
      issue: issue || "Revisión general",
      workshop_name: workshopName,
      workshop_phone: workshopPhone,
      workshop_address: workshopAddress
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
  budgetTotal = "0",
  workshopName = "RepairIT",
  workshopPhone = "",
  workshopAddress = ""
}) {
  return sendResendTemplate({
    to,
    templateId: "presupuesto-listo",
    variables: {
      client_name: clientName || "Cliente",
      order_code: orderCode,
      device_type: deviceType || "Dispositivo",
      device_model: deviceModel || "",
      diagnosis: diagnosis || "Inspección técnica completada.",
      budget_total: budgetTotal,
      workshop_name: workshopName,
      workshop_phone: workshopPhone,
      workshop_address: workshopAddress
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
      workshop_address: workshopAddress
    }
  });
}

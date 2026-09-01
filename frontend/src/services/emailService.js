import { supabase } from "./supabaseClient";

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const SENDER_EMAIL = "RepairIT <notificaciones@repairit.cloud>";

/**
 * Función base para despachar correos por Resend API (vía RPC Supabase pg_net o Directo)
 */
async function sendResendEmail({ to, subject, html }) {
  if (!to || !to.includes("@")) {
    console.warn("[emailService] Destinatario inválido o no provisto:", to);
    return false;
  }

  // 1. Intentar envío seguro a través de Supabase RPC (sin bloqueo de CORS de navegador)
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc("send_resend_email", {
      p_to: to,
      p_subject: subject,
      p_html: html,
    });

    if (!rpcErr && rpcData?.success) {
      console.log("[emailService] Correo enviado exitosamente vía Supabase RPC:", to);
      return true;
    }
  } catch (err) {
    console.warn("[emailService] RPC no disponible, intentando vía fetch directo:", err);
  }

  // 2. Fallback por fetch directo si la RPC aún no está creada
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
        subject: subject,
        html: html
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[emailService] Error devuelto por Resend:", data);
      return false;
    }

    console.log("[emailService] Correo enviado exitosamente a:", to, data.id);
    return true;
  } catch (err) {
    console.error("[emailService] Error de conexión al enviar correo:", err);
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
  const subject = `Recibimos tu equipo en el taller - ${orderCode}`;
  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="es">
<head>
  <meta content="width=device-width" name="viewport"/>
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
  <title>Comprobante de Recepción - RepairIT</title>
</head>
<body dir="ltr" lang="es" style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#111827;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Tu equipo ingresó a revisión. Seguí el avance en vivo desde tu celular.
  </div>
  <table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center" style="background-color:#ffffff;padding:24px 8px;">
    <tbody>
      <tr>
        <td align="center">
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;width:100%;text-align:left;">
            <tbody>
              <tr>
                <td>
                  <table border="0" width="100%" cellPadding="0" cellSpacing="0" style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
                    <tr>
                      <td align="left" style="vertical-align: middle;">
                        <span style="font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">
                          Repair<span style="color: #2563eb;">IT</span>
                        </span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="font-size: 13px; font-weight: 700; color: #2563eb; background-color: #eff6ff; padding: 4px 10px; border-radius: 6px; font-family: monospace;">
                          ${orderCode}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;font-weight:700;color:#111827;">
                    ¡Recibimos tu equipo en el taller! 🛠️
                  </h1>

                  <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                    Hola <strong>${clientName || "Cliente"}</strong>,
                  </p>

                  <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#374151;">
                    Tu equipo ya ingresó a nuestro laboratorio técnico para revisión y diagnóstico:
                  </p>

                  <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:24px;">
                    <table width="100%" border="0" cellPadding="0" cellSpacing="0" style="font-size: 13px; line-height: 1.8; color: #374151;">
                      <tr>
                        <td style="color: #6b7280; width: 35%; padding-bottom: 4px;">Dispositivo:</td>
                        <td style="font-weight: 600; color: #111827; padding-bottom: 4px;">${deviceType || ""} ${deviceModel || ""}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding-bottom: 4px;">Falla reportada:</td>
                        <td style="font-weight: 500; color: #111827; padding-bottom: 4px;">${issue || "Revisión general"}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280;">Taller / Sucursal:</td>
                        <td style="font-weight: 500; color: #111827;">${workshopName}</td>
                      </tr>
                    </table>
                  </div>

                  <table border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:0 0 24px 0;">
                    <tbody>
                      <tr>
                        <td align="left">
                          <a href="https://tracking.repairit.cloud/seguimiento/${orderCode}" target="_blank" rel="noopener noreferrer" style="color:#ffffff;text-decoration:none;display:inline-block;padding:12px 24px;background-color:#2563eb;border-radius:6px;font-weight:600;font-size:14px;text-align:center;box-shadow:0 2px 4px rgba(37,99,235,0.2);">
                            Seguir Estado de mi Orden en Vivo →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:#6b7280;">
                    Te notificaremos por este medio en cuanto nuestros técnicos finalicen la revisión y emitan el presupuesto.
                  </p>

                  <hr style="width:100%;border:none;border-top:1px solid #e5e7eb;margin:0 0 20px 0;" />

                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    ${workshopName} ${workshopPhone ? `• ${workshopPhone}` : ""} ${workshopAddress ? `• ${workshopAddress}` : ""}<br>
                    Plataforma provista por <a href="https://repairit.cloud" target="_blank" style="color:#2563eb;text-decoration:none;font-weight:600;">repairit.cloud</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

  return sendResendEmail({ to, subject, html });
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
  const subject = `Presupuesto disponible para tu equipo - ${orderCode}`;
  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="es">
<head>
  <meta content="width=device-width" name="viewport"/>
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
  <title>Presupuesto Listo - RepairIT</title>
</head>
<body dir="ltr" lang="es" style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#111827;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Finalizamos la revisión técnica. Consultá el diagnóstico y aprobá tu presupuesto online.
  </div>
  <table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center" style="background-color:#ffffff;padding:24px 8px;">
    <tbody>
      <tr>
        <td align="center">
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;width:100%;text-align:left;">
            <tbody>
              <tr>
                <td>
                  <table border="0" width="100%" cellPadding="0" cellSpacing="0" style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
                    <tr>
                      <td align="left" style="vertical-align: middle;">
                        <span style="font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">
                          Repair<span style="color: #2563eb;">IT</span>
                        </span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="font-size: 13px; font-weight: 700; color: #2563eb; background-color: #eff6ff; padding: 4px 10px; border-radius: 6px; font-family: monospace;">
                          ${orderCode}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;font-weight:700;color:#111827;">
                    Tenemos el presupuesto de tu equipo 📋
                  </h1>

                  <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                    Hola <strong>${clientName || "Cliente"}</strong>,
                  </p>

                  <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#374151;">
                    Finalizamos la inspección de tu <strong>${deviceType || ""} ${deviceModel || ""}</strong> y tenemos listo el diagnóstico y presupuesto:
                  </p>

                  <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:24px;">
                    <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">
                      Diagnóstico del Técnico:
                    </div>
                    <div style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 14px;">
                      ${diagnosis || "Inspección técnica finalizada."}
                    </div>
                    <table border="0" width="100%" cellPadding="0" cellSpacing="0" style="border-top: 1px dashed #d1d5db; padding-top: 10px;">
                      <tr>
                        <td align="left" style="font-size: 13px; color: #6b7280;">
                          Total Presupuestado:
                        </td>
                        <td align="right" style="font-size: 20px; font-weight: 800; color: #2563eb; font-family: monospace;">
                          $${budgetTotal}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <table border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:0 0 24px 0;">
                    <tbody>
                      <tr>
                        <td align="left">
                          <a href="https://tracking.repairit.cloud/seguimiento/${orderCode}" target="_blank" rel="noopener noreferrer" style="color:#ffffff;text-decoration:none;display:inline-block;padding:12px 24px;background-color:#2563eb;border-radius:6px;font-weight:600;font-size:14px;text-align:center;box-shadow:0 2px 4px rgba(37,99,235,0.2);">
                            Ver Detalle y Aprobar Presupuesto →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:#6b7280;">
                    Al ingresar al enlace podés revisar el desglose de repuestos/mano de obra y aprobarlo directamente con un botón.
                  </p>

                  <hr style="width:100%;border:none;border-top:1px solid #e5e7eb;margin:0 0 20px 0;" />

                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    ${workshopName} ${workshopPhone ? `• ${workshopPhone}` : ""} ${workshopAddress ? `• ${workshopAddress}` : ""}<br>
                    Plataforma provista por <a href="https://repairit.cloud" target="_blank" style="color:#2563eb;text-decoration:none;font-weight:600;">repairit.cloud</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

  return sendResendEmail({ to, subject, html });
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
  const subject = `¡Tu equipo está listo para retirar! - ${orderCode}`;
  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="es">
<head>
  <meta content="width=device-width" name="viewport"/>
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
  <title>Equipo Listo - RepairIT</title>
</head>
<body dir="ltr" lang="es" style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#111827;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Finalizamos la reparación de tu equipo. Ya podés pasar a retirarlo por nuestra sucursal.
  </div>
  <table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center" style="background-color:#ffffff;padding:24px 8px;">
    <tbody>
      <tr>
        <td align="center">
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;width:100%;text-align:left;">
            <tbody>
              <tr>
                <td>
                  <table border="0" width="100%" cellPadding="0" cellSpacing="0" style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
                    <tr>
                      <td align="left" style="vertical-align: middle;">
                        <span style="font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">
                          Repair<span style="color: #2563eb;">IT</span>
                        </span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="font-size: 12px; font-weight: 700; color: #16a34a; background-color: #f0fdf4; padding: 4px 10px; border-radius: 6px; font-family: monospace;">
                          LISTO PARA RETIRAR
                        </span>
                      </td>
                    </tr>
                  </table>

                  <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;font-weight:700;color:#111827;">
                    ¡Tu equipo ya está reparado y listo! 🎉
                  </h1>

                  <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                    Hola <strong>${clientName || "Cliente"}</strong>,
                  </p>

                  <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#374151;">
                    Te informamos que finalizamos la reparación de tu <strong>${deviceType || ""} ${deviceModel || ""}</strong> (Orden <strong>${orderCode}</strong>). Ya podés pasar a retirarlo por nuestro local.
                  </p>

                  <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:24px;">
                    <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">
                      Punto de Retiro:
                    </div>
                    <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;">
                      ${workshopName}
                    </div>
                    <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
                      📍 ${workshopAddress || "Casa Central"}<br>
                      ${workshopPhone ? `📞 ${workshopPhone}` : ""}
                    </div>
                  </div>

                  <table border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:0 0 24px 0;">
                    <tbody>
                      <tr>
                        <td align="left">
                          <a href="https://tracking.repairit.cloud/seguimiento/${orderCode}" target="_blank" rel="noopener noreferrer" style="color:#ffffff;text-decoration:none;display:inline-block;padding:12px 24px;background-color:#2563eb;border-radius:6px;font-weight:600;font-size:14px;text-align:center;box-shadow:0 2px 4px rgba(37,99,235,0.2);">
                            Ver Comprobante Digital →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:#6b7280;">
                    Recordá presentar tu número de orden o DNI al momento de retirar el equipo.
                  </p>

                  <hr style="width:100%;border:none;border-top:1px solid #e5e7eb;margin:0 0 20px 0;" />

                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    ${workshopName} ${workshopPhone ? `• ${workshopPhone}` : ""} ${workshopAddress ? `• ${workshopAddress}` : ""}<br>
                    Plataforma provista por <a href="https://repairit.cloud" target="_blank" style="color:#2563eb;text-decoration:none;font-weight:600;">repairit.cloud</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

  return sendResendEmail({ to, subject, html });
}

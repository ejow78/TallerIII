// Utilidades centralizadas de Impresión Directa (sin bloqueo de pop-ups) y WhatsApp

export function printHtml(htmlContent) {
  try {
    const existingFrame = document.getElementById("repairit-print-frame");
    if (existingFrame) {
      existingFrame.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "repairit-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    let printed = false;
    const triggerPrint = () => {
      if (printed) return;
      printed = true;
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Error al invocar ventana de impresión:", err);
      }
    };

    // Esperar a que carguen las imágenes (ej. QR) con fallback rápido de 650ms
    const images = Array.from(doc.images || []);
    if (images.length === 0) {
      setTimeout(triggerPrint, 120);
    } else {
      let loadedCount = 0;
      const checkAllLoaded = () => {
        loadedCount += 1;
        if (loadedCount >= images.length) {
          setTimeout(triggerPrint, 100);
        }
      };
      images.forEach((img) => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener("load", checkAllLoaded, { once: true });
          img.addEventListener("error", checkAllLoaded, { once: true });
        }
      });
      setTimeout(triggerPrint, 700);
    }
  } catch (error) {
    console.error("Error preparando impresión:", error);
  }
}

export function printOrderReceipt(order, profile = {}, clientOverride = null) {
  if (!order) return;
  const client = clientOverride || order.clientId || {};
  const venueName = profile?.name || "Taller RepairIT";
  const venueAddress = profile?.address || "Sucursal Central";
  const venuePhone = profile?.phone || "";
  const venueEmail = profile?.email || "";
  const trackingUrl = `https://tracking.repairit.cloud/seguimiento/${order.trackingCode}`;

  const budgetItemsHtml =
    order.budget?.items
      ?.map(
        (i) => `
      <tr>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0;">${i.desc}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">$${Number(
          i.price
        ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
      </tr>
    `
      )
      .join("") || "";

  const totalBudget =
    order.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) || 0;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Orden de Servicio #${order.trackingCode} - ${venueName}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            font-size: 11px;
            line-height: 1.4;
            margin: 0;
            padding: 10px;
            background: #ffffff;
          }
          .header-table { width: 100%; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 12px; }
          .logo-text { font-size: 20px; font-weight: 900; color: #0f172a; }
          .logo-sub { font-size: 10px; color: #64748b; font-weight: 500; }
          .order-badge { background: #0284c7; color: #ffffff; padding: 4px 10px; font-size: 13px; font-weight: 800; border-radius: 4px; display: inline-block; }
          .code-text { font-family: monospace; font-size: 16px; font-weight: 900; color: #0284c7; margin-top: 4px; }
          
          .box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 10px; background: #ffffff; }
          .box-title { font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
          
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
          
          .field-label { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
          .field-val { font-size: 12px; font-weight: 600; color: #0f172a; }
          
          table.data-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
          table.data-table th { background: #f1f5f9; padding: 6px 8px; font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
          
          .terms { font-size: 9px; color: #64748b; line-height: 1.3; text-align: justify; margin-top: 10px; padding: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
          .sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; text-align: center; }
          .sign-line { border-top: 1px dashed #64748b; padding-top: 5px; font-size: 10px; font-weight: 600; color: #475569; }
          
          .footer-info { margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8; }
          
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td style="vertical-align: top; width: 60%;">
              <div class="logo-text">${venueName}</div>
              <div class="logo-sub">${venueAddress}</div>
              <div class="logo-sub">Tel: ${venuePhone || "N/A"} &bull; Email: ${venueEmail || "N/A"}</div>
            </td>
            <td style="vertical-align: top; text-align: right; width: 40%;">
              <span class="order-badge">ORDEN DE SERVICIO</span>
              <div class="code-text">N° ${order.trackingCode}</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Fecha: ${
                order.date || new Date().toLocaleDateString("es-AR")
              } ${order.time ? `&bull; ${order.time} hs` : ""}</div>
            </td>
          </tr>
        </table>

        <div class="grid-2">
          <div class="box">
            <div class="box-title">Datos del Cliente</div>
            <div style="margin-bottom: 6px;">
              <div class="field-label">Nombre / Razón Social</div>
              <div class="field-val">${client.name || "Cliente General"}</div>
            </div>
            <div class="grid-2">
              <div>
                <div class="field-label">DNI / CUIT</div>
                <div class="field-val">${client.dni || "N/A"}</div>
              </div>
              <div>
                <div class="field-label">Teléfono</div>
                <div class="field-val">${client.phone || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="box" style="display: flex; align-items: center; gap: 12px; background: #f8fafc;">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=0&data=${encodeURIComponent(
                trackingUrl
              )}" 
              alt="QR Seguimiento" 
              style="width: 75px; height: 75px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; background: #fff;"
            />
            <div style="flex: 1;">
              <div class="field-label" style="color: #0284c7; font-weight: 800;">Seguimiento en Línea 24/7</div>
              <div style="font-size: 10px; color: #334155; margin-bottom: 4px;">Escaneá con tu celular para consultar el estado y aprobar el presupuesto.</div>
              <div style="font-size: 9px; font-family: monospace; color: #64748b; word-break: break-all;">${trackingUrl}</div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="box-title">Detalles del Equipo Ingresado</div>
          <div class="grid-3" style="margin-bottom: 8px;">
            <div>
              <div class="field-label">Tipo de Dispositivo</div>
              <div class="field-val">${order.deviceType || "N/A"}</div>
            </div>
            <div>
              <div class="field-label">Marca y Modelo</div>
              <div class="field-val">${order.deviceModel || "N/A"}</div>
            </div>
            <div>
              <div class="field-label">Accesorios Recibidos</div>
              <div class="field-val">${order.accessories || "Ninguno"}</div>
            </div>
          </div>
          <div>
            <div class="field-label">Estado Cosmético / Observaciones Visuales</div>
            <div class="field-val" style="font-weight: 400; font-size: 11px;">${
              order.cosmetic || "Sin observaciones específicas"
            }</div>
          </div>
        </div>

        <div class="box">
          <div class="box-title">Falla Declarada por el Cliente</div>
          <div style="font-size: 11px; color: #0f172a; white-space: pre-wrap; padding: 4px 0;">${
            order.issue || "Sin falla detallada"
          }</div>
          
          ${
            order.diagnosis
              ? `
            <div style="border-top: 1px dashed #cbd5e1; margin-top: 6px; padding-top: 6px;">
              <div class="field-label" style="color: #0284c7;">Diagnóstico Técnico</div>
              <div style="font-size: 11px; color: #0f172a; font-weight: 600;">${order.diagnosis}</div>
            </div>
          `
              : ""
          }
        </div>

        ${
          budgetItemsHtml
            ? `
          <div class="box">
            <div class="box-title">Presupuesto Estimado</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Concepto / Repuesto</th>
                  <th style="text-align: right; width: 120px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${budgetItemsHtml}
              </tbody>
            </table>
            <div style="text-align: right; font-size: 13px; font-weight: 900; color: #0284c7; padding-top: 8px;">
              TOTAL ESTIMADO: $${totalBudget.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        `
            : ""
        }

        <div class="terms">
          <strong>Condiciones de Servicio:</strong> El cliente autoriza la revisión y diagnóstico del equipo. Los presupuestos tienen una validez de 15 días corridos. Las reparaciones cuentan con una garantía legal de 90 días sobre los repuestos instalados y la mano de obra realizada. Pasados los 60 días desde la notificación de finalización, los equipos no retirados se considerarán abandonados conforme a las normativas comerciales vigentes.
        </div>

        <div class="sign-grid">
          <div>
            <div class="sign-line">Firma del Cliente (Conformidad de Ingreso)</div>
          </div>
          <div>
            <div class="sign-line">Firma y Sello del Taller / Responsable</div>
          </div>
        </div>

        <div class="footer-info">
          <span>RepairIT &bull; Software de Gestión para Servicio Técnico (repairit.cloud)</span>
          <span>Comprobante Oficial emitido electrónicamente</span>
        </div>
      </body>
    </html>
  `;

  printHtml(html);
}

export function printPosReceipt(sale, profile = {}) {
  if (!sale) return;
  const venueName = profile?.name || "RepairIT Taller";
  const venueAddress = profile?.address || "Sucursal Activa";
  const venuePhone = profile?.phone || "";
  const dateStr = new Date(sale.created_at || Date.now()).toLocaleString("es-AR");

  const itemsHtml = (sale.items || [])
    .map(
      (i) => `
    <tr>
      <td style="padding: 4px 0; text-align: left;">${i.quantity}x ${i.name}</td>
      <td style="padding: 4px 0; text-align: right;">$${(
        Number(i.price) * Number(i.quantity)
      ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Ticket de Venta - ${venueName}</title>
        <style>
          @page { margin: 5mm; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            width: 280px;
            margin: 0 auto;
            padding: 10px 5px;
            color: #000;
            background: #fff;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .total-row { font-size: 14px; font-weight: bold; }
          .footer { font-size: 10px; margin-top: 14px; text-align: center; color: #333; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: 16px;">${venueName.toUpperCase()}</div>
        <div class="center" style="font-size: 11px;">${venueAddress}</div>
        ${venuePhone ? `<div class="center" style="font-size: 11px;">Tel: ${venuePhone}</div>` : ""}
        <div class="divider"></div>
        <div><strong>COMPROBANTE DE VENTA</strong></div>
        <div>Fecha: ${dateStr}</div>
        <div>Pago: ${(sale.payment_method || "efectivo").toUpperCase()}</div>
        ${sale.id ? `<div>Ref: #${String(sale.id).slice(0, 8).toUpperCase()}</div>` : ""}
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 1px solid #000; padding-bottom: 4px;">CANT / DETALLE</th>
              <th style="text-align: right; border-bottom: 1px solid #000; padding-bottom: 4px;">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div class="divider"></div>
        <table>
          <tr class="total-row">
            <td style="text-align: left;">TOTAL:</td>
            <td style="text-align: right;">$${Number(sale.total || 0).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}</td>
          </tr>
          ${
            sale.cashReceived && Number(sale.cashReceived) >= Number(sale.total)
              ? `
            <tr>
              <td style="text-align: left; padding-top: 4px;">Abona con:</td>
              <td style="text-align: right; padding-top: 4px;">$${Number(
                sale.cashReceived
              ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="text-align: left;">Su vuelto:</td>
              <td style="text-align: right;">$${(
                Number(sale.cashReceived) - Number(sale.total)
              ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
            </tr>
          `
              : ""
          }
        </table>
        <div class="divider"></div>
        <div class="footer">
          ¡Gracias por su compra!<br/>
          Documento no válido como factura fiscal.<br/>
          <strong>RepairIT Cloud POS</strong>
        </div>
      </body>
    </html>
  `;

  printHtml(html);
}

export function normalizeWhatsAppPhone(rawPhone) {
  if (!rawPhone) return "";
  let digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  // Si tiene 10 dígitos (ej. 3815551234 o 1144445555), anteponer 549 para Argentina
  if (digits.length === 10) {
    digits = `549${digits}`;
  } else if (digits.length === 12 && digits.startsWith("54") && !digits.startsWith("549")) {
    digits = `549${digits.slice(2)}`;
  }
  return digits;
}

export function getOrderWhatsAppUrl(order, profile = {}, clientOverride = null) {
  if (!order) return null;
  const client = clientOverride || order.clientId || {};
  const phone = normalizeWhatsAppPhone(client.phone);
  const venueName = profile?.name || "nuestro taller";
  const trackingUrl = window.location.hostname.includes("repairit.cloud")
    ? `https://tracking.repairit.cloud/seguimiento/${order.trackingCode}`
    : `${window.location.origin}/seguimiento/${order.trackingCode}`;

  const totalBudget =
    order.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) || 0;

  let statusNote = `El estado actual es *${(order.status || "ingresado").toUpperCase()}*.`;
  if (order.status === "presupuestado" && totalBudget > 0) {
    statusNote = `Ya tenés disponible el diagnóstico y presupuesto por *$${totalBudget.toLocaleString(
      "es-AR"
    )}* para revisarlo y aprobarlo en línea.`;
  } else if (order.status === "listo") {
    statusNote = `¡Tu equipo ya está *LISTO PARA RETIRAR*!`;
  } else if (order.status === "reparacion") {
    statusNote = `Tu equipo se encuentra actualmente *EN REPARACIÓN* en nuestro laboratorio.`;
  }

  const message =
    `Hola ${client.name || ""}! 👋 Te escribimos de *${venueName}*.\n\n` +
    `Te compartimos el código y enlace de seguimiento en tiempo real de tu equipo *${order.deviceType || ""} ${
      order.deviceModel || ""
    }* (Orden *#${order.trackingCode}*):\n\n` +
    `${statusNote}\n\n` +
    `🔗 *Seguimiento online:* ${trackingUrl}`;

  if (!phone) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getClientWhatsAppUrl(client, profile = {}) {
  if (!client) return null;
  const phone = normalizeWhatsAppPhone(client.phone);
  const venueName = profile?.name || "RepairIT Servicio Técnico";
  const message = `Hola ${client.name || ""}! 👋 Te escribimos de *${venueName}*.`;
  if (!phone) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

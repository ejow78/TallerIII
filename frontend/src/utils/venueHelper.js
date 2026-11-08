/**
 * Utilidades para parsear y formatear la información de sucursales / talleres,
 * permitiendo almacenar y consultar dirección física y horarios de atención.
 */

export function parseVenueAddress(rawAddress) {
  if (!rawAddress || typeof rawAddress !== "string") {
    return { address: "", hours: "" };
  }

  // Patrón estándar: "Dirección [Horario: Lun a Vie 9 a 18 hs]"
  const bracketMatch = rawAddress.match(/^(.*?)\s*\[Horario:\s*(.*?)\]\s*$/i);
  if (bracketMatch) {
    return {
      address: bracketMatch[1].trim(),
      hours: bracketMatch[2].trim(),
    };
  }

  // Patrón alternativo: "Dirección || Horarios: Lun a Vie..."
  if (rawAddress.includes(" || Horarios: ")) {
    const [addr, h] = rawAddress.split(" || Horarios: ");
    return {
      address: addr.trim(),
      hours: h.trim(),
    };
  }

  // Patrón alternativo: "Dirección • Horario: Lun a Vie..."
  if (rawAddress.includes(" • Horario: ")) {
    const [addr, h] = rawAddress.split(" • Horario: ");
    return {
      address: addr.trim(),
      hours: h.trim(),
    };
  }

  return {
    address: rawAddress.trim(),
    hours: "",
  };
}

export function formatVenueAddress(address, hours) {
  const cleanAddr = (address || "").trim();
  const cleanHours = (hours || "").trim();
  if (!cleanHours) return cleanAddr;
  return `${cleanAddr} [Horario: ${cleanHours}]`;
}

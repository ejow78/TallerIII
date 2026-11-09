import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normaliza un texto para búsquedas insensibles a mayúsculas, minúsculas y acentos/tildes.
 * Ej: "Batería" -> "bateria", "Módulo" -> "modulo"
 */
export function normalizeText(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Retorna la fecha en formato YYYY-MM-DD en la zona horaria de Argentina (America/Argentina/Buenos_Aires).
 */
export function getArgentinaDateString(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("sv-SE", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

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

/**
 * Categorías oficiales y preestablecidas para talleres y puntos de venta.
 */
export const DEFAULT_CATEGORIES = [
  "Pantallas",
  "Baterías",
  "Almacenamiento",
  "Memorias",
  "Microelectrónica",
  "Repuestos",
  "Accesorios",
  "Cables y Cargadores",
  "Insumos",
  "Herramientas",
  "Audio",
  "Conectividad",
];

// Mapa de corrección rápida para variaciones comunes (sin tildes, plurales/singulares)
const CATEGORY_ALIASES = {
  pantalla: "Pantallas",
  pantallas: "Pantallas",
  modulo: "Pantallas",
  modulos: "Pantallas",
  display: "Pantallas",
  displays: "Pantallas",
  bateria: "Baterías",
  baterias: "Baterías",
  almacenamiento: "Almacenamiento",
  disco: "Almacenamiento",
  discos: "Almacenamiento",
  ssd: "Almacenamiento",
  memoria: "Memorias",
  memorias: "Memorias",
  ram: "Memorias",
  microelectronica: "Microelectrónica",
  microelectrónica: "Microelectrónica",
  repuesto: "Repuestos",
  repuestos: "Repuestos",
  accesorio: "Accesorios",
  accesorios: "Accesorios",
  cable: "Cables y Cargadores",
  cables: "Cables y Cargadores",
  cargador: "Cables y Cargadores",
  cargadores: "Cables y Cargadores",
  "cables y cargadores": "Cables y Cargadores",
  insumo: "Insumos",
  insumos: "Insumos",
  herramienta: "Herramientas",
  herramientas: "Herramientas",
  audio: "Audio",
  conectividad: "Conectividad",
};

/**
 * Normaliza cualquier string de categoría:
 * - Limpia espacios en blanco
 * - Corrige variaciones conocidas y tildes
 * - Capitaliza cada palabra si es una categoría personalizada nueva (Title Case)
 */
export function normalizeCategory(cat) {
  if (!cat || typeof cat !== "string") return "Insumos";
  const trimmed = cat.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Insumos";

  const lower = trimmed.toLowerCase();
  if (CATEGORY_ALIASES[lower]) {
    return CATEGORY_ALIASES[lower];
  }

  // Si no está en el mapa de alias, dar formato Capitalizado (Title Case)
  // Ej: "consolas de videojuegos" -> "Consolas de Videojuegos"
  return trimmed
    .split(" ")
    .map((word, index) => {
      const wLower = word.toLowerCase();
      // Palabras de enlace en español
      if (index > 0 && ["y", "de", "e", "en", "para", "con"].includes(wLower)) {
        return wLower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Extrae y unifica todas las categorías disponibles a partir de la lista de productos
 * y las categorías predeterminadas del sistema.
 */
export function getAvailableCategories(items = []) {
  const fromItems = items
    .map((i) => i.category)
    .filter(Boolean)
    .map(normalizeCategory);

  return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromItems]));
}

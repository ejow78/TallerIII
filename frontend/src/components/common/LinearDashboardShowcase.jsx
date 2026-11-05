import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  Package,
  ShoppingCart,
  Settings,
  KeyRound,
  LogOut,
  Wrench,
  AlertTriangle,
  ChevronDown,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
  Search,
  CheckCircle,
  Printer,
  QrCode,
  Smartphone,
  Laptop,
  Download,
  FileSpreadsheet,
  UserPlus,
  Stethoscope,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  Minus,
  ArrowLeft,
  User,
  CreditCard,
  X,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";

export default function LinearDashboardShowcase() {
  // Tab principal activa de la barra lateral
  const [activeNav, setActiveNav] = useState("inicio"); // "inicio" | "nuevo-ingreso" | "ordenes" | "clientes" | "inventario" | "caja"

  // Tabs internas del Panel de Control (Inicio)
  const [metricTab, setMetricTab] = useState("ordenes"); // "ordenes" | "facturacion"
  const [rangeTab, setRangeTab] = useState("14d"); // "7d" | "14d" | "30d"
  const [statusTab, setStatusTab] = useState("estados"); // "estados" | "equipos"

  // Tab de filtro para Órdenes de Servicio
  const [orderFilter, setOrderFilter] = useState("todos");

  // Tab de filtro para Inventario
  const [inventoryCategory, setInventoryCategory] = useState("todos");

  // Tab para Punto de Venta
  const [posTab, setPosTab] = useState("venta"); // "venta" | "historial"
  const [posPaymentMethod, setPosPaymentMethod] = useState("efectivo");

  // Fechas dinámicas para el gráfico
  const chartDates = {
    "7d": ["29-oct", "31-oct", "01-nov", "02-nov", "03-nov", "04-nov", "05-nov"],
    "14d": ["24-oct", "26-oct", "28-oct", "30-oct", "01-nov", "03-nov", "05-nov"],
    "30d": ["06-oct", "12-oct", "18-oct", "24-oct", "30-oct", "02-nov", "05-nov"],
  };

  const statusBars = {
    estados: [
      { label: "Ingresado", width: "16%" },
      { label: "Diagnóstico", width: "3%" },
      { label: "Presupuesto", width: "16%" },
      { label: "Reparación", width: "16%" },
      { label: "Listos", width: "32%" },
      { label: "Entregados", width: "95%" },
    ],
    equipos: [
      { label: "Smartphones", width: "80%" },
      { label: "Notebooks", width: "50%" },
      { label: "Consolas", width: "32%" },
      { label: "Tablets", width: "16%" },
      { label: "Smartwatches", width: "16%" },
      { label: "Otros", width: "5%" },
    ],
  };

  const navTitles = {
    "inicio": "Inicio",
    "nuevo-ingreso": "Nuevo Ingreso",
    "ordenes": "Órdenes de Servicio",
    "clientes": "Directorio de Clientes",
    "inventario": "Stock e Inventario",
    "caja": "Caja y Punto de Venta",
  };

  // Datos simulados 1:1 de Órdenes
  const mockOrders = [
    {
      id: "ord-1",
      code: "TK-9281",
      date: "05/11/2026 • 10:30 hs",
      client: {
        name: "Mariana López",
        dni: "38.291.840",
        phone: "+54 9 11 5829-1049",
      },
      deviceType: "Smartphone",
      deviceModel: "iPhone 14 Pro Max 256GB",
      diagnosis: "Display quebrado tras caída. Requiere reemplazo de panel OLED y sellado perimetral IP68.",
      budget: { amount: "$165.000", approved: true },
      status: "en_reparacion",
      statusLabel: "En Reparación",
      statusColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
    },
    {
      id: "ord-2",
      code: "TK-9280",
      date: "04/11/2026 • 16:45 hs",
      client: {
        name: "Santiago Rossi",
        dni: "35.104.220",
        phone: "+54 9 11 4102-9912",
      },
      deviceType: "Notebook",
      deviceModel: "MacBook Pro 14\" M2",
      diagnosis: "Batería hinchada al 62% de capacidad. Se instaló celda OEM nueva y calibración de ciclos.",
      budget: { amount: "$280.000", approved: true },
      status: "listo",
      statusLabel: "Listo",
      statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    },
    {
      id: "ord-3",
      code: "TK-9279",
      date: "04/11/2026 • 11:20 hs",
      client: {
        name: "Esteban Giménez",
        dni: "41.882.910",
        phone: "+54 9 11 6392-8811",
      },
      deviceType: "Consola",
      deviceModel: "PlayStation 5 Digital",
      diagnosis: "Sin salida de video tras tirón de cable. Pines internos del puerto HDMI 2.1 doblados.",
      budget: { amount: "$95.000", approved: false, pending: true },
      status: "diagnostico",
      statusLabel: "En Diagnóstico",
      statusColor: "bg-purple-500/10 text-purple-400 border-purple-500/25",
    },
    {
      id: "ord-4",
      code: "TK-9278",
      date: "03/11/2026 • 18:10 hs",
      client: {
        name: "Valeria Benítez",
        dni: "39.400.123",
        phone: "+54 9 11 7201-4455",
      },
      deviceType: "Smartphone",
      deviceModel: "Samsung S24 Ultra",
      diagnosis: "Falla en puerto de carga Tipo-C y antena NFC. Presupuesto enviado por WhatsApp.",
      budget: { amount: "$78.000", approved: true },
      status: "presupuestado",
      statusLabel: "Presupuestado",
      statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    },
    {
      id: "ord-5",
      code: "TK-9275",
      date: "02/11/2026 • 09:15 hs",
      client: {
        name: "Nicolás Castro",
        dni: "36.712.500",
        phone: "+54 9 11 3190-2210",
      },
      deviceType: "Tablet",
      deviceModel: "iPad Air 5 M1",
      diagnosis: "Reemplazo de cristal táctil touch y limpieza de placa. Entregado conforme.",
      budget: { amount: "$120.000", approved: true },
      status: "entregado",
      statusLabel: "Entregado",
      statusColor: "bg-muted text-muted-foreground border-border",
    },
  ];

  const filteredOrders = mockOrders.filter((ord) => {
    if (orderFilter === "todos") return true;
    if (orderFilter === "en_reparacion") return ord.status === "en_reparacion";
    return ord.status === orderFilter;
  });

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-[#10131a] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden text-foreground flex flex-col md:flex-row min-h-[660px] text-xs select-none">
      {/* ========================================================================= */}
      {/* 1. SIDEBAR IZQUIERDA (Clickeable y con tabs funcionales) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-56 lg:w-60 bg-[#0e1017] border-b md:border-b-0 md:border-r border-border/80 flex flex-col shrink-0">
        {/* Cabecera del Sidebar con Logo Oficial */}
        <div className="h-14 sm:h-16 px-4 flex items-center border-b border-border/80">
          <span className="font-outfit text-xl font-black tracking-tight text-foreground">
            Repair<span className="text-primary">IT</span>
          </span>
        </div>

        {/* Grupos de Navegación Interactivos */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto no-scrollbar">
          {/* Grupo 1: Operaciones de Taller */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-1.5">
              Operaciones de Taller
            </div>

            {/* Inicio */}
            <button
              onClick={() => setActiveNav("inicio")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-semibold transition-all text-left cursor-pointer ${
                activeNav === "inicio"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Inicio</span>
            </button>

            {/* Nuevo Ingreso */}
            <button
              onClick={() => setActiveNav("nuevo-ingreso")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-semibold transition-all text-left cursor-pointer ${
                activeNav === "nuevo-ingreso"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Nuevo Ingreso</span>
            </button>

            {/* Órdenes de Servicio */}
            <button
              onClick={() => setActiveNav("ordenes")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-semibold transition-all text-left cursor-pointer ${
                activeNav === "ordenes"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>Órdenes de Servicio</span>
            </button>

            {/* Directorio de Clientes */}
            <button
              onClick={() => setActiveNav("clientes")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-semibold transition-all text-left cursor-pointer ${
                activeNav === "clientes"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Clientes</span>
            </button>
          </div>

          {/* Grupo 2: Gestión y Caja */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-1.5">
              Gestión y Stock
            </div>

            {/* Inventario */}
            <button
              onClick={() => setActiveNav("inventario")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-semibold transition-all text-left cursor-pointer ${
                activeNav === "inventario"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Inventario</span>
            </button>

            {/* Caja / POS */}
            <button
              onClick={() => setActiveNav("caja")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-semibold transition-all text-left cursor-pointer ${
                activeNav === "caja"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Caja y POS</span>
            </button>
          </div>
        </div>

        {/* Perfil del Taller en la parte inferior */}
        <div className="p-3 border-t border-border/80 bg-[#0c0e14]">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-card/40 border border-border/60">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              TR
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[11px] text-foreground truncate">
                TechRepair Central
              </div>
              <div className="text-[9px] text-emerald-400 font-mono truncate">
                Plan Taller Pro • Activo
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL DINÁMICO */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#10131a] overflow-hidden">
        {/* Barra superior de estado / breadcrumb */}
        <header className="h-14 sm:h-16 px-4 sm:px-6 border-b border-border/80 flex items-center justify-between shrink-0 bg-[#0e1017]">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <span className="hidden sm:inline">Panel Técnico</span>
            <span className="hidden sm:inline text-muted-foreground/40">/</span>
            <span className="text-foreground font-bold">{navTitles[activeNav]}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Operativo en Línea
            </span>
            <button
              onClick={() => setActiveNav("nuevo-ingreso")}
              className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-primary/25"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nuevo Ingreso</span>
            </button>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* VISTA 1: INICIO (DASHBOARD REAL) */}
        {/* ===================================================================== */}
        {activeNav === "inicio" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* KPI Cards Superiores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Órdenes Activas */}
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Órdenes Activas
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground tracking-tight">
                    5
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    1 en revisión • 1 en reparación • 2 listos
                  </div>
                </div>
              </div>

              {/* Card 2: Equipos Entregados */}
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Equipos Entregados
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground tracking-tight">
                    6
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-0.5 truncate">
                    + 2 listos esperando retiro
                  </div>
                </div>
              </div>

              {/* Card 3: Facturación */}
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Facturación
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground tracking-tight">
                    $1.450.000
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+24.5% vs. período anterior</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Ticket Promedio */}
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Ticket Promedio
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground tracking-tight">
                    $131.818
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    Basado en 11 reparaciones
                  </div>
                </div>
              </div>
            </div>

            {/* Fila Central: Gráfico de Métricas + Estado del Taller */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Gráfico Principal */}
              <div className="lg:col-span-8 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-1 bg-[#10131a] p-1 rounded-lg border border-border/70">
                    <button
                      onClick={() => setMetricTab("ordenes")}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        metricTab === "ordenes"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Órdenes Registradas
                    </button>
                    <button
                      onClick={() => setMetricTab("facturacion")}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        metricTab === "facturacion"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Facturación ($)
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-[#10131a] p-1 rounded-lg border border-border/70 self-start sm:self-auto">
                    {["7d", "14d", "30d"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRangeTab(r)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all uppercase cursor-pointer ${
                          rangeTab === r
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 sm:h-52 w-full pt-2 flex flex-col justify-end">
                  <div className="relative flex-1 w-full flex items-end">
                    <svg
                      viewBox="0 0 600 180"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="chartGradientSim" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 140 Q 60 130 100 100 T 200 90 T 300 40 T 400 60 T 500 20 T 600 30 L 600 180 L 0 180 Z"
                        fill="url(#chartGradientSim)"
                      />
                      <path
                        d="M 0 140 Q 60 130 100 100 T 200 90 T 300 40 T 400 60 T 500 20 T 600 30"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />
                      <circle cx="500" cy="20" r="4.5" fill="#38bdf8" stroke="#0e1017" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[10px] text-muted-foreground/70 font-mono pt-3 border-t border-border/30">
                    {chartDates[rangeTab].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estado del Taller */}
              <div className="lg:col-span-4 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <h4 className="font-outfit text-sm font-bold text-foreground">
                    Estado del Taller
                  </h4>
                  <div className="flex items-center gap-1 bg-[#10131a] p-0.5 rounded-lg border border-border/70">
                    <button
                      onClick={() => setStatusTab("estados")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        statusTab === "estados"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Estados
                    </button>
                    <button
                      onClick={() => setStatusTab("equipos")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        statusTab === "equipos"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Equipos
                    </button>
                  </div>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {statusBars[statusTab].map((bar, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">{bar.label}</span>
                      </div>
                      <div className="h-2 w-full bg-[#10131a] rounded-full overflow-hidden border border-border/40">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: bar.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fila Inferior: Ingresos Recientes + Críticos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Ingresos Recientes con Estilos y Colores de Órdenes de Servicio */}
              <div className="lg:col-span-8 rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-foreground">
                      Ingresos Recientes
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Últimas órdenes registradas en el laboratorio
                    </p>
                  </div>
                  <span
                    onClick={() => setActiveNav("ordenes")}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Ver todas (18)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                        <th className="py-2.5">Código QR / Orden</th>
                        <th className="py-2.5">Cliente</th>
                        <th className="py-2.5">Equipo</th>
                        <th className="py-2.5 text-right">Estado Actual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr className="hover:bg-card/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">
                          <span className="inline-flex items-center gap-1 hover:underline cursor-pointer">
                            <span>TK-9281</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </span>
                        </td>
                        <td className="py-3 font-medium text-foreground">Mariana López</td>
                        <td className="py-3 text-muted-foreground">
                          Smartphone • iPhone 14 Pro Max
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-[10px] uppercase font-bold py-0.5 px-2.5 rounded-md border inline-block bg-indigo-500/10 text-indigo-400 border-indigo-500/25">
                            En Reparación
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-card/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">
                          <span className="inline-flex items-center gap-1 hover:underline cursor-pointer">
                            <span>TK-9280</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </span>
                        </td>
                        <td className="py-3 font-medium text-foreground">Santiago Rossi</td>
                        <td className="py-3 text-muted-foreground">
                          Notebook • MacBook Pro 14" M2
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-[10px] uppercase font-bold py-0.5 px-2.5 rounded-md border inline-block bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
                            Listo
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-card/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">
                          <span className="inline-flex items-center gap-1 hover:underline cursor-pointer">
                            <span>TK-9279</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </span>
                        </td>
                        <td className="py-3 font-medium text-foreground">Esteban Giménez</td>
                        <td className="py-3 text-muted-foreground">
                          Consola • PlayStation 5 Digital
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-[10px] uppercase font-bold py-0.5 px-2.5 rounded-md border inline-block bg-purple-500/10 text-purple-400 border-purple-500/25">
                            En Diagnóstico
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-card/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">
                          <span className="inline-flex items-center gap-1 hover:underline cursor-pointer">
                            <span>TK-9278</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </span>
                        </td>
                        <td className="py-3 font-medium text-foreground">Valeria Benítez</td>
                        <td className="py-3 text-muted-foreground">
                          Smartphone • Samsung S24 Ultra
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-[10px] uppercase font-bold py-0.5 px-2.5 rounded-md border inline-block bg-amber-500/10 text-amber-400 border-amber-500/25">
                            Presupuestado
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Críticos de Inventario */}
              <div className="lg:col-span-4 rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-foreground">
                      Críticos de Inventario
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Control de umbral de reposición
                    </p>
                  </div>
                  <span
                    onClick={() => setActiveNav("inventario")}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Inventario
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 pt-1">
                  <div className="rounded-xl bg-destructive/10 border border-destructive/25 text-foreground p-3 flex items-start gap-2.5 text-left">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold font-outfit leading-snug text-foreground">
                          Módulo OLED iPhone 13 Pro
                        </span>
                        <Badge
                          variant="destructive"
                          className="text-[9px] font-bold py-0.5 px-1.5 uppercase tracking-wider shrink-0 select-none whitespace-nowrap"
                        >
                          Stock: 1
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Mínimo sugerido: 3 u. • Pantallas
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-destructive/10 border border-destructive/25 text-foreground p-3 flex items-start gap-2.5 text-left">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold font-outfit leading-snug text-foreground">
                          Batería Original MacBook A1708
                        </span>
                        <Badge
                          variant="destructive"
                          className="text-[9px] font-bold py-0.5 px-1.5 uppercase tracking-wider shrink-0 select-none whitespace-nowrap"
                        >
                          Stock: 0
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Mínimo sugerido: 2 u. • Baterías
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-destructive/10 border border-destructive/25 text-foreground p-3 flex items-start gap-2.5 text-left">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold font-outfit leading-snug text-foreground">
                          Conector HDMI 2.1 PS5 OEM
                        </span>
                        <Badge
                          variant="destructive"
                          className="text-[9px] font-bold py-0.5 px-1.5 uppercase tracking-wider shrink-0 select-none whitespace-nowrap"
                        >
                          Stock: 2
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Mínimo sugerido: 4 u. • Puertos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 2: NUEVO INGRESO (RÉPLICA 1:1 DE NewOrderPage.jsx) */}
        {/* ===================================================================== */}
        {activeNav === "nuevo-ingreso" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* Cabecera Superior 1:1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span>Nuevo Ingreso de Equipo</span>
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Recepción técnica rápida con autocompletado de clientes y emisión de comprobante QR.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveNav("ordenes")}
                  className="h-8 px-3 text-xs font-semibold border border-border/80 bg-card/60 hover:bg-muted/40 rounded-lg flex items-center gap-1.5 cursor-pointer text-foreground"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ver Órdenes</span>
                </button>
              </div>
            </div>

            {/* Formulario 1:1 en 2 Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* COLUMNA IZQUIERDA (5 cols): 1. Datos del Cliente */}
              <div className="lg:col-span-5 rounded-xl border border-border/80 bg-card/40 p-4 sm:p-5 shadow-sm space-y-4">
                <div className="border-b border-border/50 pb-3">
                  <div className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>1. Datos del Cliente</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Buscá un cliente habitual o completá los datos de uno nuevo.
                  </p>
                </div>

                {/* Buscador de clientes */}
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, DNI o teléfono..."
                    defaultValue=""
                    className="w-full bg-background/85 border border-border text-xs pl-9 pr-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Nombre y Apellido <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="Mariana López"
                      className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        DNI / CUIT <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        defaultValue="38.291.840"
                        className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground font-mono focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        Teléfono / WhatsApp <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        defaultValue="+54 9 11 5829-1049"
                        className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground font-mono focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Correo Electrónico (Notificaciones de Estado)
                    </label>
                    <input
                      type="email"
                      defaultValue="mariana.lopez@gmail.com"
                      className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA (7 cols): 2. Especificaciones del Equipo y Falla */}
              <div className="lg:col-span-7 rounded-xl border border-border/80 bg-card/40 p-4 sm:p-5 shadow-sm space-y-4">
                <div className="border-b border-border/50 pb-3">
                  <div className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span>2. Especificaciones del Equipo y Falla</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Detallá las características del equipo ingresado y los síntomas reportados.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Tipo de dispositivo con nombres únicos sin / */}
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Tipo de Dispositivo <span className="text-destructive">*</span>
                    </label>
                    <select
                      defaultValue="Smartphone"
                      className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Smartphone">Smartphone</option>
                      <option value="Notebook">Notebook</option>
                      <option value="Tablet">Tablet</option>
                      <option value="PC Escritorio">PC Escritorio</option>
                      <option value="Consola">Consola</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Marca y Modelo <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="iPhone 14 Pro Max 256GB Deep Purple"
                      className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Accesorios Dejados
                    </label>
                    <input
                      type="text"
                      defaultValue="Funda de silicona transparente y cable Lightning"
                      className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Estado Cosmético / Detalles Visuales
                    </label>
                    <input
                      type="text"
                      defaultValue="Microrrayones en biseles de acero, módulo sin golpes en cámaras"
                      className="w-full bg-background/85 border border-border text-xs px-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Falla Declarada por el Cliente <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="Pantalla totalmente apagada tras caída. Vibra al conectar a cargador y recibe llamadas pero no emite imagen ni respuesta táctil."
                    className="w-full bg-background/85 border border-border text-xs p-3 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none leading-relaxed"
                  />
                </div>

                {/* Checkbox de Términos */}
                <div className="flex items-start space-x-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="sim-terms"
                    defaultChecked
                    className="mt-0.5 rounded border-border accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="sim-terms"
                    className="text-xs text-muted-foreground leading-snug cursor-pointer select-none"
                  >
                    El cliente acepta las condiciones de revisión técnica y deja constancia del estado cosmético declarado.
                  </label>
                </div>

                {/* Checkbox Imprimir Comprobante: sin icono y oculto en móvil */}
                <div className="hidden sm:flex items-center space-x-3 bg-primary/5 p-3 rounded-xl border border-primary/20">
                  <input
                    type="checkbox"
                    id="sim-print"
                    defaultChecked
                    className="rounded border-border accent-primary cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="sim-print"
                    className="text-xs font-semibold text-foreground leading-snug cursor-pointer select-none flex-1 min-w-0"
                  >
                    <span className="text-primary font-bold mr-1">
                      Imprimir Comprobante:
                    </span>
                    Abrir ventana de comprobante A4 automáticamente al registrar
                  </label>
                </div>

                {/* Botón de Submit */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveNav("ordenes")}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 px-6 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/15 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Registrar Orden y Generar Comprobante</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 3: ÓRDENES DE SERVICIO (RÉPLICA 1:1 DE OrdersPage.jsx) */}
        {/* ===================================================================== */}
        {activeNav === "ordenes" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* Cabecera Superior 1:1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span>Órdenes de Servicio</span>
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Seguimiento técnico del taller, ficha detallada de equipos, presupuestos y avisos por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  className="h-8 px-3 border border-border/80 hover:bg-muted/40 text-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg bg-card/60"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Exportar Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNav("nuevo-ingreso")}
                  className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Ingreso</span>
                </button>
              </div>
            </div>

            {/* Contenedor Principal 1:1 */}
            <div className="rounded-xl border border-border/80 bg-card/30 p-3 sm:p-5 shadow-sm space-y-4 overflow-hidden">
              {/* Barra de Búsqueda + Píldoras de Estado */}
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-border/50 pb-3.5">
                <div className="relative w-full lg:max-w-xs flex items-center">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar N° orden, cliente, DNI o equipo..."
                    className="bg-background/85 border border-border text-xs w-full pl-9 pr-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Píldoras de filtro rápido */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                  {[
                    { key: "todos", label: "Todos" },
                    { key: "ingresado", label: "Ingresado" },
                    { key: "diagnostico", label: "En Diagnóstico" },
                    { key: "presupuestado", label: "Presupuestado" },
                    { key: "en_reparacion", label: "En Reparación" },
                    { key: "listo", label: "Listo" },
                    { key: "entregado", label: "Entregado" },
                  ].map((st) => {
                    const isActive = orderFilter === st.key;
                    return (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setOrderFilter(st.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          isActive
                            ? "bg-primary/15 text-primary border-primary/30 font-bold"
                            : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tabla Completa 1:1 de Órdenes */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-2.5">N° de Orden</th>
                      <th className="py-3 px-2.5">Cliente</th>
                      <th className="py-3 px-2.5">Dispositivo</th>
                      <th className="py-3 px-2.5">Diagnóstico / Presupuesto</th>
                      <th className="py-3 px-2.5">Estado</th>
                      <th className="py-3 px-2.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="border-b border-border/40 hover:bg-card/40 transition-colors"
                      >
                        {/* N° de Orden */}
                        <td className="py-3.5 px-2.5">
                          <div className="font-mono font-bold text-primary flex items-center gap-1.5">
                            <span className="hover:underline cursor-pointer">{ord.code}</span>
                            <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5 whitespace-nowrap">
                            <span>{ord.date}</span>
                          </div>
                        </td>

                        {/* Cliente */}
                        <td className="py-3.5 px-2.5">
                          <span className="font-semibold text-foreground block">
                            {ord.client.name}
                          </span>
                          <div className="flex flex-col text-[10px] text-muted-foreground font-mono">
                            <span>DNI: {ord.client.dni}</span>
                            <span>Tel: {ord.client.phone}</span>
                          </div>
                        </td>

                        {/* Dispositivo */}
                        <td className="py-3.5 px-2.5">
                          <span className="font-semibold text-foreground block">
                            {ord.deviceModel}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {ord.deviceType}
                          </span>
                        </td>

                        {/* Diagnóstico / Presupuesto */}
                        <td className="py-3.5 px-2.5 max-w-[220px]">
                          <div className="space-y-1">
                            <span
                              className="font-medium text-foreground truncate block"
                              title={ord.diagnosis}
                            >
                              {ord.diagnosis}
                            </span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="text-[11px] font-mono font-bold text-emerald-400">
                                {ord.budget.amount}
                              </span>
                              {ord.budget.approved ? (
                                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0 rounded">
                                  Aprobado ✓
                                </span>
                              ) : (
                                <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold px-1.5 py-0 rounded">
                                  Pendiente
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Estado: Dropdown estilizado 1:1 */}
                        <td className="py-3.5 px-2.5">
                          <button
                            type="button"
                            className={`h-7 border px-2.5 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${ord.statusColor}`}
                          >
                            <span>{ord.statusLabel}</span>
                            <ChevronDown className="w-3 h-3 opacity-70" />
                          </button>
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-2.5 text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <button
                              type="button"
                              className="h-7 px-2 text-xs font-bold border border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Diagnóstico</span>
                            </button>
                            <button
                              type="button"
                              className="h-7 w-7 border border-border/70 hover:bg-muted/40 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                              title="Ver ficha"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="h-7 w-7 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center cursor-pointer shrink-0"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="h-7 w-7 border border-border/70 hover:bg-muted/40 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                              title="Imprimir Comprobante"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 4: CLIENTES (RÉPLICA 1:1 DE ClientsPage.jsx) */}
        {/* ===================================================================== */}
        {activeNav === "clientes" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* Cabecera Superior 1:1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span>Directorio de Clientes</span>
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Gestión de fichas de clientes e historial técnico de reparaciones asociadas.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  className="h-8 px-3 border border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg bg-card/60 hover:bg-muted/40 text-foreground"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exportar Excel</span>
                </button>
                <button
                  type="button"
                  className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nuevo Cliente</span>
                </button>
              </div>
            </div>

            {/* Contenedor Principal 1:1 */}
            <div className="rounded-xl border border-border/80 bg-card/30 p-3 sm:p-5 shadow-sm space-y-4">
              {/* Buscador y Contador */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-border/50 pb-3.5">
                <div className="relative w-full sm:max-w-sm flex items-center">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, DNI, teléfono o email..."
                    className="bg-background/85 border border-border text-xs w-full pl-9 pr-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
                  Total: 124 Clientes
                </span>
              </div>

              {/* Tabla Completa 1:1 de Clientes */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-2.5">ID</th>
                      <th className="py-3 px-2.5">Nombre y Apellido</th>
                      <th className="py-3 px-2.5">DNI / CUIT</th>
                      <th className="py-3 px-2.5">Contacto</th>
                      <th className="py-3 px-2.5 text-center">Órdenes</th>
                      <th className="py-3 px-2.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "CL-842", name: "Mariana López", dni: "38.291.840", phone: "+54 9 11 5829-1049", email: "mariana.lopez@gmail.com", orders: 3 },
                      { id: "CL-841", name: "Santiago Rossi", dni: "35.104.220", phone: "+54 9 11 4102-9912", email: "santiago.rossi@outlook.com", orders: 2 },
                      { id: "CL-840", name: "Esteban Giménez", dni: "41.882.910", phone: "+54 9 11 6392-8811", email: "esteban.gimenez@hotmail.com", orders: 1 },
                      { id: "CL-839", name: "Valeria Benítez", dni: "39.400.123", phone: "+54 9 11 7201-4455", email: "valeria.b@gmail.com", orders: 4 },
                      { id: "CL-838", name: "Nicolás Castro", dni: "36.712.500", phone: "+54 9 11 3190-2210", email: "nicolas.castro@empresa.com", orders: 2 },
                    ].map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border/40 hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3.5 px-2.5 font-mono font-bold text-primary">
                          {c.id}
                        </td>
                        <td className="py-3.5 px-2.5 font-semibold text-foreground">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-2.5 font-mono text-muted-foreground">
                          {c.dni}
                        </td>
                        <td className="py-3.5 px-2.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{c.phone}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {c.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2.5 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                            {c.orders}
                          </span>
                        </td>
                        <td className="py-3.5 px-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              className="h-7 w-7 border border-border/70 hover:bg-muted/40 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Ver ficha del cliente"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="h-7 w-7 border border-border/70 hover:bg-muted/40 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Editar cliente"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="h-7 w-7 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center cursor-pointer"
                              title="Enviar WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 5: INVENTARIO (RÉPLICA 1:1 DE InventoryPage.jsx) */}
        {/* ===================================================================== */}
        {activeNav === "inventario" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* Cabecera Superior 1:1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span>Stock e Inventario</span>
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Control de repuestos e insumos del taller, alertas de reposición y precios de venta.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  className="h-8 px-3 border border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg bg-card/60 hover:bg-muted/40 text-foreground"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exportar Excel</span>
                </button>
                <button
                  type="button"
                  className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Insumo</span>
                </button>
              </div>
            </div>

            {/* Contenedor Principal 1:1 */}
            <div className="rounded-xl border border-border/80 bg-card/30 p-3 sm:p-5 shadow-sm space-y-4">
              {/* Buscador + Filtros por Categoría */}
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-border/50 pb-3.5">
                <div className="relative w-full lg:max-w-xs flex items-center">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, SKU o categoría..."
                    className="bg-background/85 border border-border text-xs w-full pl-9 pr-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                  {[
                    { key: "todos", label: "Todos (148)" },
                    { key: "pantallas", label: "Pantallas" },
                    { key: "baterias", label: "Baterías" },
                    { key: "conectores", label: "Conectores" },
                    { key: "herramientas", label: "Herramientas" },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setInventoryCategory(cat.key)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                        inventoryCategory === cat.key
                          ? "bg-primary/15 text-primary border-primary/30 font-bold"
                          : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabla Completa 1:1 de Stock */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-2.5">SKU</th>
                      <th className="py-3 px-2.5">Artículo / Insumo</th>
                      <th className="py-3 px-2.5">Categoría</th>
                      <th className="py-3 px-2.5">Precio Venta</th>
                      <th className="py-3 px-2.5 text-center">Stock Actual</th>
                      <th className="py-3 px-2.5 text-center">Stock Mínimo</th>
                      <th className="py-3 px-2.5">Estado</th>
                      <th className="py-3 px-2.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        sku: "MOD-IP14PM",
                        name: "Módulo OLED iPhone 14 Pro Max",
                        desc: "Display Super Retina XDR 120Hz ProMotion Original",
                        cat: "Pantallas",
                        price: "$145.000,00",
                        qty: 1,
                        min: 3,
                        status: "CRÍTICO",
                        statusClass: "bg-destructive/15 text-destructive border-destructive/30",
                      },
                      {
                        sku: "BAT-MBP14M2",
                        name: "Batería Original MacBook Pro 14\" M2",
                        desc: "Celda de polímero de litio A2519 70Wh OEM",
                        cat: "Baterías",
                        price: "$185.000,00",
                        qty: 0,
                        min: 2,
                        status: "SIN STOCK",
                        statusClass: "bg-destructive/15 text-destructive border-destructive/30",
                      },
                      {
                        sku: "CON-HDMI-PS5",
                        name: "Conector HDMI 2.1 PlayStation 5",
                        desc: "Puerto reforzado 19 pines blindado de alta velocidad",
                        cat: "Conectores",
                        price: "$28.000,00",
                        qty: 2,
                        min: 4,
                        status: "BAJO",
                        statusClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                      },
                      {
                        sku: "MOD-S24U",
                        name: "Módulo Display Samsung S24 Ultra",
                        desc: "Dynamic AMOLED 2X 120Hz con marco titanio",
                        cat: "Pantallas",
                        price: "$195.000,00",
                        qty: 6,
                        min: 2,
                        status: "ÓPTIMO",
                        statusClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                      },
                      {
                        sku: "PIN-TYPEC-U",
                        name: "Pin de Carga USB Tipo-C Hembra",
                        desc: "Conector universal reversible 16 pines",
                        cat: "Conectores",
                        price: "$4.500,00",
                        qty: 42,
                        min: 10,
                        status: "ÓPTIMO",
                        statusClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                      },
                    ].map((item) => (
                      <tr
                        key={item.sku}
                        className="border-b border-border/40 hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3 px-2.5 font-mono text-[11px] text-muted-foreground">
                          {item.sku}
                        </td>
                        <td className="py-3 px-2.5">
                          <span className="font-semibold text-foreground block leading-snug">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-light block max-w-xs truncate">
                            {item.desc}
                          </span>
                        </td>
                        <td className="py-3 px-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-secondary text-secondary-foreground">
                            {item.cat}
                          </span>
                        </td>
                        <td className="py-3 px-2.5 font-mono text-foreground font-bold">
                          {item.price}
                        </td>
                        <td className="py-3 px-2.5 text-center">
                          <div className="inline-flex items-center gap-1 border border-border/70 rounded-md px-1.5 py-0.5 bg-background/60">
                            <button className="text-muted-foreground hover:text-foreground">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-xs px-1 min-w-[20px]">
                              {item.qty}
                            </span>
                            <button className="text-muted-foreground hover:text-foreground">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-2.5 text-center font-mono text-muted-foreground">
                          {item.min} u.
                        </td>
                        <td className="py-3 px-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border inline-block ${item.statusClass}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-2.5 text-right">
                          <button
                            type="button"
                            className="h-7 w-7 border border-border/70 hover:bg-muted/40 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Editar insumo"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 6: CAJA Y POS (RÉPLICA 1:1 DE POSPage.jsx) */}
        {/* ===================================================================== */}
        {activeNav === "caja" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* Cabecera Superior 1:1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span>Caja y Punto de Venta</span>
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Facturación rápida de repuestos y accesorios con descuento automático de stock e impresión de ticket.
                </p>
              </div>

              {/* Selector de Vista: Punto de Venta vs Historial */}
              <div className="flex items-center bg-card/80 border border-border/80 rounded-xl p-1 self-start sm:self-auto shadow-sm select-none">
                <button
                  type="button"
                  onClick={() => setPosTab("venta")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    posTab === "venta"
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Punto de Venta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPosTab("historial")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    posTab === "historial"
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Historial de Caja</span>
                </button>
              </div>
            </div>

            {/* Tarjetas de Arqueo / KPIs de Caja 1:1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    Total en Caja Hoy (8 ops)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold font-outfit text-foreground mt-0.5">
                    $837.500
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Cobros de Taller (3 órdenes)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold font-outfit text-foreground mt-0.5">
                    $536.000
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card/40 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Ventas de Mostrador (5 tickets)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold font-outfit text-foreground mt-0.5">
                    $301.500
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground shrink-0">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Layout 2 Columnas de POS (7 cols catálogo, 5 cols ticket actual) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Columna Izquierda (7 cols): Catálogo de Productos */}
              <div className="xl:col-span-7 rounded-xl border border-border/80 bg-card/30 p-4 sm:p-5 shadow-sm space-y-4">
                <div className="space-y-3 border-b border-border/50 pb-3.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o código de barra..."
                      className="w-full bg-background/85 border border-border text-xs pl-9 pr-3 h-9 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {["Todos", "Accesorios", "Cables", "Cargadores", "Fundas"].map((c, i) => (
                      <button
                        key={c}
                        type="button"
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                          i === 0
                            ? "bg-primary/15 text-primary border-primary/30 font-bold"
                            : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de Artículos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Cargador Rápido 35W Dual USB-C", code: "ACC-CH35", price: "$24.500", stock: 14 },
                    { name: "Cable Lightning a USB-C Trenzado 1.5m", code: "CAB-LT15", price: "$12.000", stock: 22 },
                    { name: "Vidrio Templado 9D Curvo Antiespía", code: "VID-9D01", price: "$8.500", stock: 35 },
                    { name: "Funda Armor Antigolpes iPhone 14 Pro", code: "FUN-IP14", price: "$15.000", stock: 8 },
                  ].map((p) => (
                    <div
                      key={p.code}
                      className="rounded-xl border border-border/70 bg-background/50 p-3 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-xs text-foreground leading-snug">
                            {p.name}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
                          SKU: {p.code} • Stock: {p.stock} u.
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-border/30">
                        <span className="font-mono font-bold text-sm text-foreground">
                          {p.price}
                        </span>
                        <button
                          type="button"
                          className="h-7 px-2.5 bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Derecha (5 cols): Ticket de Venta Actual */}
              <div className="xl:col-span-5 rounded-xl border border-border/80 bg-card/40 p-4 sm:p-5 shadow-sm space-y-4">
                <div className="border-b border-border/50 pb-3 flex items-center justify-between">
                  <div>
                    <div className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                      <span>Ticket de Venta Actual</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      3 artículos cargados al comprobante
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Mesa #01
                  </span>
                </div>

                {/* Cliente Asignado */}
                <div className="rounded-lg bg-background/60 border border-border/60 p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold">Cliente</span>
                    <span className="font-bold text-xs text-foreground">Mariana López</span>
                    <span className="text-[10px] text-muted-foreground font-mono block">DNI: 38.291.840</span>
                  </div>
                  <span className="text-[10px] text-primary hover:underline font-semibold cursor-pointer">
                    Cambiar
                  </span>
                </div>

                {/* Lista de Ítems en el Carrito */}
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  <div className="p-2 rounded-lg bg-background/50 border border-border/50 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-semibold text-foreground truncate">Cargador Rápido 35W Dual USB-C</div>
                      <div className="text-[10px] text-muted-foreground">1 x $24.500</div>
                    </div>
                    <span className="font-mono font-bold text-foreground">$24.500</span>
                  </div>

                  <div className="p-2 rounded-lg bg-background/50 border border-border/50 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-semibold text-foreground truncate">Vidrio Templado 9D Curvo Antiespía</div>
                      <div className="text-[10px] text-muted-foreground">2 x $8.500</div>
                    </div>
                    <span className="font-mono font-bold text-foreground">$17.000</span>
                  </div>

                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-semibold text-primary truncate">Reparación TK-9281 (Módulo OLED)</div>
                      <div className="text-[10px] text-muted-foreground">Orden de Servicio Lista</div>
                    </div>
                    <span className="font-mono font-bold text-primary">$165.000</span>
                  </div>
                </div>

                {/* Desglose de Totales */}
                <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold text-foreground">$206.500</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Descuento Promoción (10%):</span>
                    <span className="font-mono font-semibold text-emerald-400">-$20.650</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
                    <span className="text-sm font-bold text-foreground">Total a Cobrar:</span>
                    <span className="font-mono text-2xl font-black text-emerald-400">$185.850</span>
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Método de Pago
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: "efectivo", label: "Efectivo", icon: DollarSign },
                      { id: "transferencia", label: "Transferencia", icon: Smartphone },
                      { id: "debito", label: "Débito", icon: CreditCard },
                      { id: "credito", label: "Crédito", icon: CreditCard },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSel = posPaymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPosPaymentMethod(m.id)}
                          className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            isSel
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                              : "bg-background/60 text-muted-foreground border-border/70 hover:text-foreground"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Cobro */}
                <button
                  type="button"
                  className="w-full h-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all mt-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Cobrar Ticket e Imprimir Recibo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

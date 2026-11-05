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
  const [orderFilter, setOrderFilter] = useState("todas");

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
    "inventario": "Inventario de Insumos",
    "caja": "Control de Caja y POS",
  };

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
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs">Inicio</span>
            </button>

            {/* Nuevo Ingreso */}
            <button
              onClick={() => setActiveNav("nuevo-ingreso")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer ${
                activeNav === "nuevo-ingreso"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs">Nuevo Ingreso</span>
            </button>

            {/* Órdenes de Servicio */}
            <button
              onClick={() => setActiveNav("ordenes")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer ${
                activeNav === "ordenes"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="text-xs">Órdenes de Servicio</span>
            </button>

            {/* Clientes */}
            <button
              onClick={() => setActiveNav("clientes")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer ${
                activeNav === "clientes"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="text-xs">Clientes</span>
            </button>
          </div>

          {/* Grupo 2: Stock y Finanzas */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-1.5">
              Stock y Finanzas
            </div>

            {/* Inventario */}
            <button
              onClick={() => setActiveNav("inventario")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer ${
                activeNav === "inventario"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="text-xs">Inventario de Insumos</span>
            </button>

            {/* Caja */}
            <button
              onClick={() => setActiveNav("caja")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer ${
                activeNav === "caja"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="text-xs">Caja</span>
            </button>
          </div>

          {/* Grupo 3: Administración */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-1.5">
              Administración
            </div>

            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <Settings className="w-4 h-4 shrink-0" />
              <span className="text-xs">Configuración de Taller</span>
            </div>

            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span className="text-xs">Cuentas de Acceso</span>
            </div>
          </div>
        </div>

        {/* Footer del Sidebar con Usuario Activo */}
        <div className="p-3 border-t border-border/80 bg-card/30 space-y-2.5 shrink-0">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-[10px] text-primary uppercase shrink-0">
              SC
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold block truncate leading-none text-foreground">
                Sucursal Centro
              </span>
              <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                Javier Ortiz (Admin)
              </span>
            </div>
          </div>

          <div className="w-full bg-background border border-border/70 text-muted-foreground text-[11px] font-medium py-1.5 rounded flex items-center justify-center gap-1.5">
            <LogOut className="w-3 h-3" />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL DINÁMICO SEGÚN LA TAB ACTIVA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#10131a] overflow-hidden">
        {/* Cabecera Superior del Dashboard */}
        <header className="h-14 sm:h-16 border-b border-border/80 flex items-center justify-between px-4 sm:px-6 bg-card/20 shrink-0 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded border border-border/80 flex items-center justify-center text-muted-foreground">
              <div className="w-2 h-2 border-l border-t border-current" />
            </div>
            <span className="text-xs font-medium text-foreground">{navTitles[activeNav]}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] font-mono text-muted-foreground">
              Sucursal:
            </span>
            <div className="h-7 border border-border/80 bg-card/60 px-2 text-[10px] font-bold rounded flex items-center gap-1.5 text-foreground">
              <span>Sucursal Centro</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* VISTA 1: INICIO (PANEL DE CONTROL REAL) */}
        {/* ===================================================================== */}
        {activeNav === "inicio" && (
          <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto no-scrollbar">
            {/* Título de la Sección */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Panel de Control
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Resumen operativo del taller y control de stock de insumos técnicos de la sucursal activa.
              </p>
            </div>

            {/* 4 KPI CARDS */}
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
                    $837.500
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    8 ventas POS • $536.000 en órdenes
                  </div>
                </div>
              </div>

              {/* Card 4: Estado de Stock */}
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Estado de Stock
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-red-400 tracking-tight">
                    3 Alertas
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    3 repuestos requieren reposición
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICOS GEMELOS CON TABS FUNCIONALES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Gráfico 1 (Izquierda): Flujo de Equipos */}
              <div className="lg:col-span-8 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>
                        {metricTab === "ordenes"
                          ? "Flujo de Equipos: Ingresados vs. Entregados"
                          : "Evolución de Facturación Diaria"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {metricTab === "ordenes"
                        ? "Comparativa diaria de órdenes recibidas y equipos completados"
                        : "Ingresos por órdenes de reparación y ventas de mostrador POS"}
                    </p>
                  </div>

                  {/* Filtros Funcionales */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="flex rounded-md p-0.5 bg-background border border-border/70 text-[10px]">
                      <button
                        onClick={() => setMetricTab("ordenes")}
                        className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                          metricTab === "ordenes"
                            ? "bg-primary text-black font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Órdenes
                      </button>
                      <button
                        onClick={() => setMetricTab("facturacion")}
                        className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                          metricTab === "facturacion"
                            ? "bg-primary text-black font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Facturación
                      </button>
                    </div>

                    <div className="flex rounded-md p-0.5 bg-background border border-border/70 text-[10px]">
                      {["7d", "14d", "30d"].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRangeTab(r)}
                          className={`px-1.5 py-0.5 rounded font-medium transition-all cursor-pointer ${
                            rangeTab === r
                              ? "bg-card text-foreground font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gráfico Vectorial Dinámico */}
                <div className="h-44 sm:h-52 w-full pt-2">
                  <svg viewBox="0 0 540 180" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="30" y1="20" x2="530" y2="20" stroke="#242938" strokeDasharray="3 3" />
                    <text x="10" y="24" fill="#64748b" fontSize="9" fontFamily="monospace">
                      {metricTab === "ordenes" ? "4" : "$300k"}
                    </text>

                    <line x1="30" y1="60" x2="530" y2="60" stroke="#242938" strokeDasharray="3 3" />
                    <text x="10" y="64" fill="#64748b" fontSize="9" fontFamily="monospace">
                      {metricTab === "ordenes" ? "3" : "$200k"}
                    </text>

                    <line x1="30" y1="100" x2="530" y2="100" stroke="#242938" strokeDasharray="3 3" />
                    <text x="10" y="104" fill="#64748b" fontSize="9" fontFamily="monospace">
                      {metricTab === "ordenes" ? "2" : "$100k"}
                    </text>

                    <line x1="30" y1="140" x2="530" y2="140" stroke="#242938" strokeDasharray="3 3" />
                    <text x="10" y="144" fill="#64748b" fontSize="9" fontFamily="monospace">
                      {metricTab === "ordenes" ? "1" : "$50k"}
                    </text>

                    <line x1="30" y1="160" x2="530" y2="160" stroke="#242938" />
                    <text x="10" y="164" fill="#64748b" fontSize="9" fontFamily="monospace">0</text>

                    {metricTab === "ordenes" ? (
                      <>
                        <path
                          d="M 40 140 L 120 140 L 140 160 L 530 160 L 530 160 L 40 160 Z"
                          fill="url(#emeraldArea)"
                        />
                        <path
                          d="M 40 140 L 120 140 L 140 160 L 530 160"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 40 140 L 100 140 Q 130 90 145 100 T 190 160 Q 210 90 230 100 T 270 160 L 530 160 L 530 160 L 40 160 Z"
                          fill="url(#cyanArea)"
                        />
                        <path
                          d="M 40 140 L 100 140 Q 130 90 145 100 T 190 160 Q 210 90 230 100 T 270 160 L 530 160"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M 40 150 Q 100 80 160 110 T 280 40 T 400 90 T 520 50 L 520 160 L 40 160 Z"
                          fill="url(#blueArea)"
                        />
                        <path
                          d="M 40 150 Q 100 80 160 110 T 280 40 T 400 90 T 520 50"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                  </svg>
                </div>

                {/* Leyenda y Fechas */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-border/60 text-[10px] font-mono text-muted-foreground gap-2">
                  <div className="flex items-center gap-4">
                    {metricTab === "ordenes" ? (
                      <>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                          <span>Equipos Entregados</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                          <span>Equipos Ingresados</span>
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                        <span>Facturación Diaria ($)</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    {chartDates[rangeTab].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gráfico 2 (Derecha): Estados de Taller (Barras limpias) */}
              <div className="lg:col-span-4 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-foreground">
                      {statusTab === "estados" ? "Estados de Taller" : "Equipos en Taller"}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">Volumen por etapa operativa</p>
                  </div>
                  <div className="flex rounded-md p-0.5 bg-background border border-border/70 text-[10px]">
                    <button
                      onClick={() => setStatusTab("estados")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        statusTab === "estados"
                          ? "bg-primary text-black font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      Estados
                    </button>
                    <button
                      onClick={() => setStatusTab("equipos")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        statusTab === "equipos"
                          ? "bg-primary text-black font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      Equipos
                    </button>
                  </div>
                </div>

                <div className="space-y-3 py-1">
                  {statusBars[statusTab].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-xs">
                      <span className="w-20 text-[11px] text-muted-foreground text-right shrink-0 truncate">
                        {item.label}
                      </span>
                      <div className="flex-1 h-5 bg-background/50 rounded overflow-hidden flex items-center">
                        <div
                          className="h-full bg-[#38bdf8] rounded transition-all duration-300"
                          style={{ width: item.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 pl-24 pr-2 pt-1 border-t border-border/60">
                  <span>0</span>
                  <span>2</span>
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                </div>
              </div>
            </div>

            {/* FILA INFERIOR: INGRESOS RECIENTES & CRÍTICOS DE INVENTARIO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
              {/* Tabla de Ingresos Recientes */}
              <div className="lg:col-span-2 rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3">
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
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>Ver todas</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
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
                          <Badge className="text-[9px] uppercase font-bold py-0.5 px-2 border bg-primary text-primary-foreground">
                            En Reparación
                          </Badge>
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
                          <Badge className="text-[9px] uppercase font-bold py-0.5 px-2 border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                            Listo
                          </Badge>
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
                          <Badge
                            variant="outline"
                            className="text-[9px] uppercase font-bold py-0.5 px-2 border text-amber-400 border-amber-400/40"
                          >
                            En Diagnóstico
                          </Badge>
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
                          <Badge
                            variant="outline"
                            className="text-[9px] uppercase font-bold py-0.5 px-2 border text-purple-400 border-purple-400/40"
                          >
                            Presupuestado
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Críticos de Inventario */}
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3 flex flex-col justify-between">
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
        {/* VISTA 2: NUEVO INGRESO */}
        {/* ===================================================================== */}
        {activeNav === "nuevo-ingreso" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Registrar Nuevo Ingreso de Equipo
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Ficha de recepción técnica, generación de código QR y orden con impresión térmica.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Formulario Principal */}
              <div className="lg:col-span-8 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 space-y-4">
                {/* Datos del Cliente */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-1">
                    1. Datos del Cliente
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        defaultValue="Mariana López"
                        className="w-full bg-[#10131a] border border-border/80 rounded h-8 px-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">WhatsApp / Teléfono</label>
                      <input
                        type="text"
                        defaultValue="+54 9 11 5829-1049"
                        className="w-full bg-[#10131a] border border-border/80 rounded h-8 px-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">DNI / Identificación</label>
                      <input
                        type="text"
                        defaultValue="38.291.840"
                        className="w-full bg-[#10131a] border border-border/80 rounded h-8 px-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Dispositivo */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-1">
                    2. Dispositivo y Falla
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Tipo y Marca</label>
                      <input
                        type="text"
                        defaultValue="Smartphone • Apple iPhone 14 Pro Max"
                        className="w-full bg-[#10131a] border border-border/80 rounded h-8 px-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Número de Serie / IMEI</label>
                      <input
                        type="text"
                        defaultValue="F2LZM891N70K"
                        className="w-full bg-[#10131a] border border-border/80 rounded h-8 px-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Avería Reportada / Diagnóstico Preliminar</label>
                    <textarea
                      rows={3}
                      defaultValue="Pantalla astillada con líneas verticales. Táctil responde parcialmente en zona inferior. Batería al 84% de salud. Se requiere cambio de módulo OLED y sellado estanco."
                      className="w-full bg-[#10131a] border border-border/80 rounded p-2 text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Previsualización de Comprobante */}
              <div className="lg:col-span-4 rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Previsualización de Ticket
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-border/60 text-center space-y-2">
                    <div className="font-outfit font-black text-sm text-foreground">
                      Repair<span className="text-primary">IT</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      ORDEN #TK-9282 • SUCURSAL CENTRO
                    </div>
                    <div className="w-24 h-24 mx-auto bg-white p-1.5 rounded flex items-center justify-center">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Escaneá para seguir tu reparación
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all">
                  <CheckCircle className="w-4 h-4" />
                  <span>Crear Orden y Emitir Ticket</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 3: ÓRDENES DE SERVICIO */}
        {/* ===================================================================== */}
        {activeNav === "ordenes" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Órdenes de Servicio
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Seguimiento técnico del taller, fichas detalladas y presupuestos online.
                </p>
              </div>

              <button
                onClick={() => setActiveNav("nuevo-ingreso")}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-primary/25"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nuevo Ingreso</span>
              </button>
            </div>

            {/* Filtros de Estado */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-border/50 text-[11px]">
              {["todas", "diagnostico", "reparacion", "listo", "entregado"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1 rounded-md font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                    orderFilter === st
                      ? "bg-primary text-black font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
                >
                  {st === "todas" ? "Todas (18)" : st === "listo" ? "Listo" : st}
                </button>
              ))}
            </div>

            {/* Listado de Órdenes */}
            <div className="space-y-3">
              {[
                {
                  code: "TK-9281",
                  device: "iPhone 14 Pro Max 256GB",
                  client: "Mariana López",
                  issue: "Cambio de Módulo OLED + Sellado IP68",
                  tech: "Lucas R.",
                  status: "En Reparación",
                  badgeClass: "bg-primary text-primary-foreground",
                  amount: "$165.000",
                },
                {
                  code: "TK-9280",
                  device: "MacBook Pro 14\" M2",
                  client: "Santiago Rossi",
                  issue: "Reemplazo de Batería OEM y Mantenimiento Térmico",
                  tech: "Martín G.",
                  status: "Listo",
                  badgeClass: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                  amount: "$280.000",
                },
                {
                  code: "TK-9279",
                  device: "PlayStation 5 Digital Edition",
                  client: "Esteban Giménez",
                  issue: "Reemplazo conector HDMI 2.1 y cambio de Metal Líquido",
                  tech: "Lucas R.",
                  status: "En Diagnóstico",
                  badgeClass: "text-amber-400 border border-amber-400/40",
                  amount: "$95.000",
                },
              ].map((ord) => (
                <div
                  key={ord.code}
                  className="rounded-xl border border-border/70 bg-[#151821] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary text-xs">{ord.code}</span>
                      <span className="text-muted-foreground/30">•</span>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">{ord.device}</h4>
                      <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 ${ord.badgeClass}`}>
                        {ord.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{ord.issue}</p>
                    <div className="text-[11px] text-muted-foreground/80">
                      Cliente: <span className="text-foreground">{ord.client}</span> • Técnico asignado:{" "}
                      <span className="text-foreground">{ord.tech}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                    <div className="text-left md:text-right">
                      <div className="font-mono font-bold text-sm text-foreground">{ord.amount}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Presupuesto Aprobado</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button title="Imprimir Ticket" className="w-7 h-7 rounded border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button title="QR del Cliente" className="w-7 h-7 rounded border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 4: CLIENTES */}
        {/* ===================================================================== */}
        {activeNav === "clientes" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Directorio de Clientes
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Base de clientes centralizada con historial completo de visitas y reparaciones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                { name: "Mariana López", dni: "38.291.840", phone: "+54 9 11 5829-1049", visits: 3, total: "$240.000" },
                { name: "Santiago Rossi", dni: "35.104.220", phone: "+54 9 11 4102-9912", visits: 2, total: "$380.000" },
                { name: "Esteban Giménez", dni: "41.882.910", phone: "+54 9 11 6392-8811", visits: 1, total: "$95.000" },
                { name: "Valeria Benítez", dni: "39.400.123", phone: "+54 9 11 7201-4455", visits: 4, total: "$510.000" },
                { name: "Nicolás Castro", dni: "36.712.500", phone: "+54 9 11 3190-2210", visits: 2, total: "$180.000" },
                { name: "Camila Duarte", dni: "42.001.990", phone: "+54 9 11 8840-1122", visits: 1, total: "$120.000" },
              ].map((c) => (
                <div key={c.name} className="rounded-xl border border-border/70 bg-[#151821] p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{c.name}</h4>
                      <p className="text-[10px] font-mono text-muted-foreground">DNI: {c.dni}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {c.visits} reparaciones
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">{c.phone}</div>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Facturación total:</span>
                    <span className="font-mono font-bold text-foreground">{c.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 5: INVENTARIO */}
        {/* ===================================================================== */}
        {activeNav === "inventario" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Inventario de Insumos y Repuestos
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Control de stock con alerta de reposición por umbral mínimo y lector de código de barras.
                </p>
              </div>

              <div className="h-8 border border-border/80 bg-[#151821] px-2.5 rounded text-xs flex items-center gap-2 self-start sm:self-auto">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar repuesto..."
                  className="bg-transparent border-none text-xs text-foreground focus:outline-none w-36"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-[#151821] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-card/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <th className="p-3">Insumo / Repuesto</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Precio Venta</th>
                    <th className="p-3">Stock Actual</th>
                    <th className="p-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {[
                    { name: "Módulo Display OLED iPhone 13 Pro", cat: "Pantallas", price: "$145.000", stock: 1, min: 3, alert: true },
                    { name: "Batería OEM MacBook Pro A1708", cat: "Baterías", price: "$82.000", stock: 0, min: 2, alert: true },
                    { name: "Conector HDMI 2.1 PlayStation 5", cat: "Puertos", price: "$28.000", stock: 2, min: 4, alert: true },
                    { name: "Módulo Pantalla Samsung A54 5G", cat: "Pantallas", price: "$65.000", stock: 8, min: 2, alert: false },
                    { name: "Pin de Carga Tipo-C Universal", cat: "Conectores", price: "$4.500", stock: 42, min: 10, alert: false },
                  ].map((it) => (
                    <tr key={it.name} className="hover:bg-card/40 transition-colors">
                      <td className="p-3 font-semibold text-foreground">{it.name}</td>
                      <td className="p-3 text-muted-foreground">{it.cat}</td>
                      <td className="p-3 font-mono font-bold text-foreground">{it.price}</td>
                      <td className="p-3 font-mono">
                        <span className={it.alert ? "text-red-400 font-bold" : "text-foreground"}>
                          {it.stock} u.
                        </span>{" "}
                        <span className="text-[10px] text-muted-foreground/60">(Mín: {it.min})</span>
                      </td>
                      <td className="p-3 text-right">
                        {it.alert ? (
                          <Badge variant="destructive" className="text-[9px] font-bold py-0.5 px-2">
                            Reponer
                          </Badge>
                        ) : (
                          <Badge className="text-[9px] font-bold py-0.5 px-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Óptimo
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VISTA 6: CAJA Y POS */}
        {/* ===================================================================== */}
        {activeNav === "caja" && (
          <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Control de Caja y Punto de Venta
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Arqueo de caja diaria, cobro directo de órdenes terminadas y ventas de mostrador.
              </p>
            </div>

            {/* Resumen de Caja */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Total en Caja Hoy
                </span>
                <div className="text-2xl font-extrabold font-outfit text-foreground">$837.500</div>
                <div className="text-[10px] text-emerald-400 font-mono">Caja abierta a las 09:00</div>
              </div>

              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Cobros de Reparaciones
                </span>
                <div className="text-2xl font-extrabold font-outfit text-primary">$536.000</div>
                <div className="text-[10px] text-muted-foreground font-mono">3 órdenes liquidadas</div>
              </div>

              <div className="rounded-xl border border-border/70 bg-[#151821] p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Ventas de Accesorios / POS
                </span>
                <div className="text-2xl font-extrabold font-outfit text-emerald-400">$301.500</div>
                <div className="text-[10px] text-muted-foreground font-mono">8 ventas en mostrador</div>
              </div>
            </div>

            {/* Órdenes Listas para Cobrar */}
            <div className="rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3">
              <h4 className="font-bold text-xs sm:text-sm text-foreground">Órdenes Listas para Cobro y Entrega</h4>
              <div className="space-y-2">
                <div className="p-3 bg-card/40 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-foreground">TK-9280 • MacBook Pro 14" M2</div>
                    <div className="text-[10px] text-muted-foreground">Cliente: Santiago Rossi • Estado: Listo</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-foreground">$280.000</span>
                    <button className="px-3 py-1.5 rounded bg-primary text-black font-bold text-xs cursor-pointer hover:bg-primary/90">
                      Cobrar en Caja
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

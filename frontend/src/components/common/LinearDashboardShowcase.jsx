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
} from "@/components/icons";

export default function LinearDashboardShowcase() {
  const [metricTab, setMetricTab] = useState("ordenes");
  const [rangeTab, setRangeTab] = useState("14d");
  const [statusTab, setStatusTab] = useState("estados");

  return (
    <div className="w-full rounded-2xl border border-border bg-[#10131a] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden text-foreground flex flex-col md:flex-row min-h-[640px] text-xs select-none">
      {/* ========================================================================= */}
      {/* 1. SIDEBAR IZQUIERDA (Idéntica al Dashboard Real de RepairIT) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-56 lg:w-60 bg-[#0e1017] border-b md:border-b-0 md:border-r border-border/80 flex flex-col shrink-0">
        {/* Cabecera del Sidebar con Logo Oficial */}
        <div className="h-14 sm:h-16 px-4 flex items-center justify-between border-b border-border/80">
          <span className="font-outfit text-xl font-black tracking-tight text-foreground">
            Repair<span className="text-primary">IT</span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 bg-card/60 px-1.5 py-0.5 rounded border border-border/60">
            PRO
          </span>
        </div>

        {/* Grupos de Navegación */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto no-scrollbar">
          {/* Grupo 1: Operaciones de Taller */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-1.5">
              Operaciones de Taller
            </div>
            {/* Inicio (Activo) */}
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm shadow-primary/10">
              <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs">Inicio</span>
            </div>

            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs">Nuevo Ingreso</span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span className="text-xs">Órdenes de Servicio</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold">
                5
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <Users className="w-4 h-4 shrink-0" />
              <span className="text-xs">Clientes</span>
            </div>
          </div>

          {/* Grupo 2: Stock y Finanzas */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-1.5">
              Stock y Finanzas
            </div>

            <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 shrink-0" />
                <span className="text-xs">Inventario de Insumos</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                ▲ 3
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="text-xs">Caja</span>
            </div>
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
      {/* 2. CONTENIDO PRINCIPAL: PANEL DE CONTROL DE REPAIRIT */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#10131a] overflow-hidden">
        {/* Cabecera Superior del Dashboard */}
        <header className="h-14 sm:h-16 border-b border-border/80 flex items-center justify-between px-4 sm:px-6 bg-card/20 shrink-0 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded border border-border/80 flex items-center justify-center text-muted-foreground">
              <div className="w-2 h-2 border-l border-t border-current" />
            </div>
            <span className="text-xs font-medium text-foreground">Inicio</span>
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

        {/* Cuerpo del Dashboard */}
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

          {/* ===================================================================== */}
          {/* 4 KPI CARDS (Idénticas a la imagen 2 de RepairIT) */}
          {/* ===================================================================== */}
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

          {/* ===================================================================== */}
          {/* GRÁFICOS GEMELOS: FLUJO DE EQUIPOS & ESTADOS DE TALLER */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Gráfico 1 (Izquierda): Flujo de Equipos */}
            <div className="lg:col-span-8 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>Flujo de Equipos: Ingresados vs. Entregados</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Comparativa diaria de órdenes recibidas y equipos completados
                  </p>
                </div>

                {/* Filtros de Métricas y Días */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="flex rounded-md p-0.5 bg-background border border-border/70 text-[10px]">
                    <button
                      onClick={() => setMetricTab("ordenes")}
                      className={`px-2 py-0.5 rounded font-medium transition-all ${
                        metricTab === "ordenes"
                          ? "bg-primary text-black font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Órdenes
                    </button>
                    <button
                      onClick={() => setMetricTab("facturacion")}
                      className={`px-2 py-0.5 rounded font-medium transition-all ${
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
                        className={`px-1.5 py-0.5 rounded font-medium transition-all ${
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

              {/* Render Vectorial SVG del Gráfico de Curvas con Área Degradada */}
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
                  </defs>

                  {/* Líneas Guía Horizontales */}
                  <line x1="30" y1="20" x2="530" y2="20" stroke="#242938" strokeDasharray="3 3" />
                  <text x="15" y="24" fill="#64748b" fontSize="10" fontFamily="monospace">4</text>

                  <line x1="30" y1="60" x2="530" y2="60" stroke="#242938" strokeDasharray="3 3" />
                  <text x="15" y="64" fill="#64748b" fontSize="10" fontFamily="monospace">3</text>

                  <line x1="30" y1="100" x2="530" y2="100" stroke="#242938" strokeDasharray="3 3" />
                  <text x="15" y="104" fill="#64748b" fontSize="10" fontFamily="monospace">2</text>

                  <line x1="30" y1="140" x2="530" y2="140" stroke="#242938" strokeDasharray="3 3" />
                  <text x="15" y="144" fill="#64748b" fontSize="10" fontFamily="monospace">1</text>

                  <line x1="30" y1="160" x2="530" y2="160" stroke="#242938" />
                  <text x="15" y="164" fill="#64748b" fontSize="10" fontFamily="monospace">0</text>

                  {/* Curva 1: Equipos Entregados (Verde Esmeralda #10b981) */}
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

                  {/* Curva 2: Equipos Ingresados (Celeste/Cyan #38bdf8) */}
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
                </svg>
              </div>

              {/* Leyenda y Fechas Inferiores */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-border/60 text-[10px] font-mono text-muted-foreground gap-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span>Equipos Entregados</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                    <span>Equipos Ingresados</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground/70">
                  <span>24-oct</span>
                  <span>26-oct</span>
                  <span>28-oct</span>
                  <span>30-oct</span>
                  <span>01-nov</span>
                  <span>03-nov</span>
                  <span>05-nov</span>
                </div>
              </div>
            </div>

            {/* Gráfico 2 (Derecha): Estados de Taller */}
            <div className="lg:col-span-4 rounded-xl border border-border/70 bg-[#151821] p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-foreground">Estados de Taller</h4>
                  <p className="text-[11px] text-muted-foreground">Volumen por etapa operativa</p>
                </div>
                <div className="flex rounded-md p-0.5 bg-background border border-border/70 text-[10px]">
                  <button
                    onClick={() => setStatusTab("estados")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      statusTab === "estados"
                        ? "bg-primary text-black font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    Estados
                  </button>
                  <button
                    onClick={() => setStatusTab("equipos")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      statusTab === "equipos"
                        ? "bg-primary text-black font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    Equipos
                  </button>
                </div>
              </div>

              {/* Barras Horizontales Idénticas a la Imagen 2 */}
              <div className="space-y-3 py-1">
                {[
                  { label: "Ingresado", count: 1, width: "16%" },
                  { label: "Diagnóstico", count: 0, width: "2%" },
                  { label: "Presupuesto", count: 1, width: "16%" },
                  { label: "Reparación", count: 1, width: "16%" },
                  { label: "Listos", count: 2, width: "32%" },
                  { label: "Entregados", count: 6, width: "95%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-[11px] text-muted-foreground text-right shrink-0 truncate">
                      {item.label}
                    </span>
                    <div className="flex-1 h-5 bg-background/50 rounded overflow-hidden flex items-center">
                      <div
                        className="h-full bg-[#38bdf8] rounded transition-all duration-500 shadow-sm shadow-[#38bdf8]/30 flex items-center justify-end pr-1.5 text-[10px] font-bold text-black"
                        style={{ width: item.width }}
                      >
                        {item.count > 0 && item.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eje Numérico Inferior */}
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 pl-24 pr-2 pt-1 border-t border-border/60">
                <span>0</span>
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* FILA INFERIOR: INGRESOS RECIENTES & CRÍTICOS DE INVENTARIO */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
            {/* Ingresos Recientes */}
            <div className="lg:col-span-7 rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">Ingresos Recientes</h4>
                  <p className="text-[10px] text-muted-foreground">Últimas órdenes registradas en el laboratorio</p>
                </div>
                <span className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium cursor-pointer">
                  <span>Ver todas</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>

              <div className="divide-y divide-border/60 text-xs">
                <div className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">iPhone 14 Pro Max 256GB</div>
                    <div className="text-[10px] text-muted-foreground">Cliente: Mariana López • Hace 20 min</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/25 font-bold">
                      En Reparación
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">$165.000</span>
                  </div>
                </div>

                <div className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">MacBook Pro 14" M2</div>
                    <div className="text-[10px] text-muted-foreground">Cliente: Santiago Rossi • Listo hace 1h</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                      Listo p/ Retiro
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">$280.000</span>
                  </div>
                </div>

                <div className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">PlayStation 5 Digital</div>
                    <div className="text-[10px] text-muted-foreground">Cliente: Esteban Giménez • Ingresado 10:15</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/25 font-bold">
                      En Diagnóstico
                    </span>
                    <span className="font-mono text-xs font-bold text-muted-foreground">Revisión</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Críticos de Inventario */}
            <div className="lg:col-span-5 rounded-xl border border-border/70 bg-[#151821] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">Críticos de Inventario</h4>
                  <p className="text-[10px] text-muted-foreground">Control de umbral de reposición</p>
                </div>
                <span className="text-[11px] text-primary hover:underline font-medium cursor-pointer">
                  Inventario
                </span>
              </div>

              <div className="divide-y divide-border/60 text-xs">
                <div className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">Módulo OLED iPhone 13 Pro</div>
                    <div className="text-[10px] text-muted-foreground">SKU: DISP-IP13P-OEM</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      1 un. restante
                    </span>
                  </div>
                </div>

                <div className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">Batería Original MacBook A1708</div>
                    <div className="text-[10px] text-muted-foreground">SKU: BAT-MBA1708-OEM</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                      Agotado (0 un.)
                    </span>
                  </div>
                </div>

                <div className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">Conector HDMI 2.1 PS5 OEM</div>
                    <div className="text-[10px] text-muted-foreground">SKU: PRT-HDMI-PS5</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      2 un. restantes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

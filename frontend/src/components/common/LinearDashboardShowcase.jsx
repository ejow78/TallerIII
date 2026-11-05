import { useState } from "react";
import {
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  QrCode,
  Printer,
  Search,
  Plus,
  ArrowUpRight,
  Smartphone,
  Laptop,
  Store,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
} from "@/components/icons";

export default function LinearDashboardShowcase() {
  const [activeTab, setActiveTab] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    {
      id: "ORD-2048",
      device: "iPhone 14 Pro Max 256GB",
      deviceType: "phone",
      issue: "Cambio de Módulo OLED Super Retina XDR + Sellado IP68",
      client: "Mariana López",
      dni: "38.291.840",
      tech: "Lucas R.",
      status: "reparacion",
      statusLabel: "En Reparación",
      statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/25",
      dotColor: "bg-blue-400 animate-pulse",
      amount: "$165.000",
      paymentStatus: "Presupuesto Aprobado",
      time: "Hace 20 min",
    },
    {
      id: "ORD-2047",
      device: "MacBook Pro 14\" M2 Pro",
      deviceType: "laptop",
      issue: "Reemplazo de Batería OEM & Mantenimiento Térmico",
      client: "Santiago Rossi",
      dni: "35.104.220",
      tech: "Martín G.",
      status: "listo",
      statusLabel: "Listo para Retiro",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      dotColor: "bg-emerald-400",
      amount: "$280.000",
      paymentStatus: "Cobro Habilitado POS",
      time: "Listo hace 1h",
    },
    {
      id: "ORD-2046",
      device: "PlayStation 5 Digital",
      deviceType: "console",
      issue: "Reemplazo conector HDMI 2.1 & Metal Líquido",
      client: "Esteban Giménez",
      dni: "41.882.910",
      tech: "Lucas R.",
      status: "diagnostico",
      statusLabel: "En Diagnóstico",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/25",
      dotColor: "bg-amber-400",
      amount: "$95.000",
      paymentStatus: "Pendiente Aprobación",
      time: "Ingresado hoy 10:15",
    },
    {
      id: "ORD-2045",
      device: "Samsung Galaxy S24 Ultra",
      deviceType: "phone",
      issue: "Micro-soldadura en Placa Base (IC de Carga rápida)",
      client: "Valeria Benítez",
      dni: "39.400.123",
      tech: "Martín G.",
      status: "repuesto",
      statusLabel: "Esperando Repuesto",
      statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/25",
      dotColor: "bg-purple-400",
      amount: "$195.000",
      paymentStatus: "Repuesto en Tránsito",
      time: "Ayer 16:40",
    },
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "reparacion" && o.status !== "reparacion") return false;
    if (activeTab === "listo" && o.status !== "listo") return false;
    if (activeTab === "diagnostico" && o.status !== "diagnostico") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.device.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q) ||
        o.dni.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#0d0e14] shadow-2xl overflow-hidden text-foreground">
      {/* 1. Barra de Título / Sistema estilo Linear */}
      <div className="h-10 border-b border-white/8 bg-[#0a0b10] px-3.5 flex items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eb5757]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f2c94c]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27ae60]/80 inline-block" />
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Store className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground/90 font-medium">Laboratorio Central</span>
            <span className="text-white/30">/</span>
            <span>Órdenes de Trabajo</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Sistema en Vivo</span>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/8">
            app.repairit.cloud
          </div>
        </div>
      </div>

      {/* 2. Barra de Control / Filtros rápidos estilo Linear */}
      <div className="p-3 sm:p-4 border-b border-white/6 bg-[#0f1017] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filtros por estado */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveTab("todas")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "todas"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Todas <span className="text-[10px] opacity-75 font-mono ml-1">28</span>
          </button>
          <button
            onClick={() => setActiveTab("reparacion")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "reparacion"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            En Reparación <span className="text-[10px] opacity-75 font-mono ml-0.5">7</span>
          </button>
          <button
            onClick={() => setActiveTab("listo")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "listo"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Listos <span className="text-[10px] opacity-75 font-mono ml-0.5">8</span>
          </button>
          <button
            onClick={() => setActiveTab("diagnostico")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "diagnostico"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            En Diagnóstico <span className="text-[10px] opacity-75 font-mono ml-0.5">4</span>
          </button>
        </div>

        {/* Buscador y Botón Acción */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar equipo, cliente o # orden..."
              className="w-full bg-[#161722] border border-white/8 rounded h-8 pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 font-sans"
            />
          </div>
          <div className="hidden md:flex items-center gap-1 bg-primary text-white font-medium text-xs px-2.5 h-8 rounded shadow-sm shadow-primary/25 cursor-pointer hover:bg-primary/90 transition-colors select-none shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Ingreso</span>
          </div>
        </div>
      </div>

      {/* 3. Listado de Órdenes Interactivo con diseño Linear */}
      <div className="divide-y divide-white/6 overflow-x-auto">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="p-3 sm:p-4 hover:bg-white/[0.025] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 group"
          >
            {/* Columna Izquierda: Identificador + Dispositivo + Falla */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded bg-white/5 border border-white/8 flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                {order.deviceType === "laptop" ? (
                  <Laptop className="w-4 h-4" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{order.id}</span>
                  <span className="text-white/20">•</span>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {order.device}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${order.statusColor}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${order.dotColor}`} />
                    {order.statusLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{order.issue}</p>
              </div>
            </div>

            {/* Columna Derecha: Cliente + Técnico + Monto + Acciones rápidas */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="text-left md:text-right">
                <div className="text-xs font-medium text-foreground">{order.client}</div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  Téc: <span className="text-white/80">{order.tech}</span>
                </div>
              </div>

              <div className="text-right min-w-[90px]">
                <div className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  {order.amount}
                </div>
                <div className="text-[10px] font-mono text-emerald-400/90 truncate">
                  {order.paymentStatus}
                </div>
              </div>

              {/* Botones de acción rápida Linear */}
              <div className="flex items-center gap-1">
                <button
                  title="Código QR del Cliente"
                  className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Imprimir Ticket Térmico"
                  className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Barra Inferior de Métricas Operativas en Tiempo Real */}
      <div className="p-3 bg-[#0a0b10] border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 rounded bg-white/[0.02] border border-white/5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
            Órdenes Activas
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-sm sm:text-base font-bold text-foreground">14</span>
            <span className="text-[10px] text-emerald-400 font-mono">+3 hoy</span>
          </div>
        </div>

        <div className="p-2 rounded bg-white/[0.02] border border-white/5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
            Facturación Hoy
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-sm sm:text-base font-bold text-foreground">
              $615.000
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">8 cobros</span>
          </div>
        </div>

        <div className="p-2 rounded bg-white/[0.02] border border-white/5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
            Tiempo de Entrega
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-sm sm:text-base font-bold text-foreground">
              24 horas
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">98% a tiempo</span>
          </div>
        </div>

        <div className="p-2 rounded bg-white/[0.02] border border-white/5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
            Alertas de Stock
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-sm sm:text-base font-bold text-amber-400">
              2 repuestos
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">Bajo umbral</span>
          </div>
        </div>
      </div>
    </div>
  );
}

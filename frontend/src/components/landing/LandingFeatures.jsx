import {
  Activity,
  Laptop,
  Download,
  CheckCircle2,
  Stethoscope,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

export function LandingFeatures() {
  return (
    <section className="py-20 px-6 bg-card/10 border-t border-border/50 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 block">
            Funcionalidades con Propósito
          </span>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Herramientas reales pensadas para el servicio técnico
          </h2>
          <p className="text-muted-foreground text-sm font-light">
            Sin funciones de relleno. Cada módulo resuelve una fricción operativa concreta de tu taller.
          </p>
        </div>

        {/* BENTO GRID (Layout Asimétrico) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Bento Item 1 (8 cols): Seguimiento de Clientes en Vivo */}
          <div className="lg:col-span-8 rounded-2xl bg-card/45 border border-border/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-border transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-foreground">
                Portal de Seguimiento del Cliente
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-xl">
                Tus clientes consultan el estado de su equipo ingresando su código único. Ven el diagnóstico, notas técnicas y el avance en tiempo real sin llamar al taller.
              </p>
            </div>

            {/* Micro-UI: Vista simulada idéntica al diseño Bento de Tracking */}
            <div className="rounded-xl bg-background/90 border border-border/70 p-4 sm:p-5 space-y-4 font-sans select-none shadow-inner">
              {/* Header de Orden estilo Tracking */}
              <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block">
                      ORDEN #DEMO-ID
                    </span>
                    <span className="font-outfit font-bold text-xs sm:text-sm text-foreground block">
                      Notebook Lenovo ThinkPad E14 Gen 2
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-card/60 px-2.5 py-1 rounded-md border border-border/60">
                  <Download className="w-3 h-3 text-primary" />
                  <span>Comprobante</span>
                </div>
              </div>

              {/* Stepper horizontal con círculos estilo Tracking */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2 pt-0.5 text-center items-start">
                {/* Step 1: Ingresado */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1.5 leading-tight font-medium text-foreground/90 min-h-[26px] sm:min-h-0 flex items-start justify-center">
                    Ingresado
                  </span>
                </div>
                {/* Step 2: En Diagnóstico */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1.5 leading-tight font-medium text-foreground/90 min-h-[26px] sm:min-h-0 flex items-start justify-center">
                    En Diagnóstico
                  </span>
                </div>
                {/* Step 3: Presupuestado (Activo con glow primario) */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground font-black flex items-center justify-center text-xs shadow-md shadow-primary/30 ring-2 sm:ring-4 ring-primary/20 shrink-0">
                    3
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1.5 leading-tight font-bold text-primary min-h-[26px] sm:min-h-0 flex items-start justify-center">
                    Presupuestado
                  </span>
                </div>
                {/* Step 4: En Reparación */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground/40 border border-border/40 flex items-center justify-center text-xs font-bold shrink-0">
                    4
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1.5 leading-tight font-light text-muted-foreground/60 min-h-[26px] sm:min-h-0 flex items-start justify-center">
                    En Reparación
                  </span>
                </div>
                {/* Step 5: Listo para Retirar */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground/40 border border-border/40 flex items-center justify-center text-xs font-bold shrink-0">
                    5
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1.5 leading-tight font-light text-muted-foreground/60 min-h-[26px] sm:min-h-0 flex items-start justify-center">
                    Listo para Retirar
                  </span>
                </div>
                {/* Step 6: Entregado */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground/40 border border-border/40 flex items-center justify-center text-xs font-bold shrink-0">
                    6
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-1.5 leading-tight font-light text-muted-foreground/60 min-h-[26px] sm:min-h-0 flex items-start justify-center">
                    Entregado
                  </span>
                </div>
              </div>

              {/* Sub-cards de Diagnóstico y Presupuesto simétricas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Sub-card Diagnóstico con pill púrpura e icono estetoscopio */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-card/60 border border-border/60 space-y-2 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" /> Diagnóstico del Técnico Especialista
                  </span>
                  <div className="bg-purple-500/5 p-2.5 rounded-lg border border-purple-500/20 text-xs text-foreground font-light leading-relaxed flex-grow">
                    Falla en circuito primario de alimentación 19V. Cortocircuito en mosfet de entrada y chip IC PMIC dañados.
                  </div>
                </div>

                {/* Sub-card Historial de Movimientos (Trazabilidad en Vivo) */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-card/60 border border-border/60 flex flex-col justify-between space-y-2">
                  <div className="flex items-center border-b border-border/40 pb-1.5">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Historial de Movimientos
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs flex-grow">
                    <div className="flex items-start gap-2 text-[11px] border-b border-border/20 pb-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 bg-muted/40 px-1.5 py-0.5 rounded border border-border/30">
                        11:30 hs
                      </span>
                      <span className="text-foreground/90 font-light leading-snug">
                        Diagnóstico finalizado. Presupuesto cargado y notificado.
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] border-b border-border/20 pb-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 bg-muted/40 px-1.5 py-0.5 rounded border border-border/30">
                        10:15 hs
                      </span>
                      <span className="text-foreground/80 font-light leading-snug">
                        Ingreso a laboratorio técnico para revisión de placa madre.
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px]">
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 bg-muted/40 px-1.5 py-0.5 rounded border border-border/30">
                        09:30 hs
                      </span>
                      <span className="text-foreground/70 font-light leading-snug">
                        Recepción en mostrador y emisión de orden #RT-9L4X7V3B.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 2 (4 cols): Aprobación Digital con DNI */}
          <div className="lg:col-span-4 rounded-2xl bg-card/45 border border-border/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-border transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-foreground">
                Aprobación con DNI
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                El cliente aprueba el costo desglosado desde su celular con su documento. Se acabó el clásico «yo nunca autoricé ese gasto».
              </p>
            </div>

            {/* Micro-UI: Idéntica a la tarjeta de Cotización aceptada en TrackingPage */}
            <div className="rounded-xl bg-background/90 border border-border/70 p-4 sm:p-5 space-y-4 font-sans shadow-inner select-none">
              {/* Header idéntico a TrackingPage */}
              <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Cotización
                  </span>
                  <h4 className="font-outfit text-sm font-bold text-foreground leading-tight">
                    Presupuesto Oficial
                  </h4>
                </div>
              </div>

              {/* Desglose idéntico al seguimiento */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-start text-xs border-b border-border/30 pb-2">
                  <span className="text-foreground/80 font-light pr-2 leading-tight">
                    Reemplazo de Mosfet e IC Regulador PMIC
                  </span>
                  <span className="font-mono font-bold text-primary shrink-0">
                    $18.500
                  </span>
                </div>
                <div className="flex justify-between items-start text-xs">
                  <span className="text-foreground/80 font-light pr-2 leading-tight">
                    Mantenimiento térmico y limpieza de placa madre
                  </span>
                  <span className="font-mono font-bold text-primary shrink-0">
                    $6.500
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-border/50">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="text-xl font-black font-outfit text-primary font-mono">
                  $25.000
                </span>
              </div>

              {/* Banner verde idéntico al tracking cuando se aprueba */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <div className="leading-tight">Presupuesto Aprobado</div>
                  <div className="text-[10px] font-normal text-emerald-400/80">
                    Orden autorizada para reparación.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 3 (4 cols): Stock con Stepper & Alertas */}
          <div className="lg:col-span-4 rounded-2xl bg-card/45 border border-border/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-border transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-foreground">
                Stock & Insumos Críticos
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Alertas amarillas preventivas para insumos por agotarse y rojas para stock cero. Ajustá cantidades con un clic.
              </p>
            </div>

            {/* Micro-UI: Insumos de taller con Stepper */}
            <div className="rounded-xl bg-background/80 border border-border/70 p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="min-w-0">
                  <span className="font-bold text-foreground block truncate">Batería iPhone 13</span>
                  <span className="text-[10px] text-amber-400 font-semibold">Stock: 1 (Mín: 3)</span>
                </div>
                <span className="rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 uppercase">
                  Bajo Stock
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <span className="font-bold text-foreground block truncate">Pasta Térmica MX-4</span>
                  <span className="text-[10px] text-muted-foreground">Stock: 8 (Mín: 2)</span>
                </div>
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-bold px-1.5 py-0.5 uppercase">
                  Óptimo
                </span>
              </div>
            </div>
          </div>

          {/* Bento Item 4 (8 cols): Caja POS & Facturación Clara */}
          <div className="lg:col-span-8 rounded-2xl bg-card/45 border border-border/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-border transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-foreground">
                Caja y Punto de Venta
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-xl">
                Cobros de órdenes y ventas de mostrador con múltiples medios de pago. Cierre de caja diario sin descuadres ni faltantes.
              </p>
            </div>

            {/* Micro-UI: Balance y cobro en vivo */}
            <div className="rounded-xl bg-background/80 border border-border/70 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-lg bg-card/50 border border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Total Cobrado Hoy
                </span>
                <span className="font-outfit text-xl font-black text-foreground block mt-1">
                  $837.500
                </span>
                <span className="text-[10px] text-muted-foreground">8 cobros registrados</span>
              </div>
              <div className="p-3 rounded-lg bg-card/50 border border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Efectivo en Caja
                </span>
                <span className="font-outfit text-xl font-black text-emerald-400 block mt-1">
                  $420.000
                </span>
                <span className="text-[10px] text-emerald-400">Ventas de mostrador y señas</span>
              </div>
              <div className="p-3 rounded-lg bg-card/50 border border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Digital / Transferencias
                </span>
                <span className="font-outfit text-xl font-black text-sky-400 block mt-1">
                  $417.500
                </span>
                <span className="text-[10px] text-sky-400">Tarjetas y transferencias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

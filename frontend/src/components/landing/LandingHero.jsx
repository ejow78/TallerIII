import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Search, Lock, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingHero({ registerUrl, trackingUrl, onOpenModal }) {
  return (
    <section className="relative py-14 lg:py-20 px-6 flex items-center justify-center overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Fondo GridPattern técnico con desvanecimiento radial */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        squares={[
          [4, 3],
          [2, 1],
          [7, 3],
          [10, 2],
          [12, 6],
          [15, 4],
          [18, 5],
          [8, 7],
          [14, 8],
          [20, 2],
          [24, 5],
        ]}
        className={cn(
          "stroke-white/[0.07] fill-white/[0.03] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,white,transparent_80%)]"
        )}
      />

      <div className="relative z-10 max-w-[1380px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Columna Izquierda: Propuesta de Valor & CTA */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-6">
          <h1 className="font-outfit text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-extrabold text-foreground tracking-tight leading-[1.06]">
            Tu taller, todas tus operaciones en un solo lugar
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
            Controlá órdenes de servicio, stock de repuestos y caja en tiempo real. Brindá seguimiento con código QR y aprobación de presupuestos online sin fricción.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-7 h-11 rounded-lg shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              <a href={registerUrl}>Comenzar Ahora</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-border/80 bg-card/40 hover:bg-card/80 text-foreground font-semibold px-6 h-11 rounded-lg gap-2 cursor-pointer"
            >
              <a href={trackingUrl}>
                <Search className="w-4 h-4 text-primary" />
                Consultar Estado de Equipo
              </a>
            </Button>
          </div>
        </div>

        {/* Columna Derecha: Captura Real del Panel de Control con Frame de Navegador & Zoom */}
        <div className="lg:col-span-7 flex items-center justify-center">
          <div
            onClick={onOpenModal}
            className="group relative w-full max-w-[840px] rounded-xl border border-border/80 bg-card/80 shadow-2xl ring-1 ring-border/50 overflow-hidden select-none cursor-zoom-in transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10 hover:shadow-2xl"
          >
            {/* Barra superior estilo navegador */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-card/95 border-b border-border/70 select-none">
              <div className="flex items-center gap-1.5 shrink-0 w-12 sm:w-16">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-background/60 border border-border/50 text-[10px] sm:text-[11px] font-mono text-muted-foreground/80 whitespace-nowrap overflow-hidden max-w-[210px] sm:max-w-none">
                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                <span className="truncate">app.repairit.cloud/dashboard</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-12 sm:w-16">
                <Maximize2 className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">Ampliar</span>
              </div>
            </div>

            {/* Imagen con badge flotante en hover */}
            <div className="relative">
              <picture>
                <source srcSet="/hero-dashboard.webp?v=2" type="image/webp" />
                <img
                  src="/hero-dashboard.png?v=2"
                  alt="Panel de Control de RepairIT con métricas, gráficos e inventario en vivo"
                  className="w-full h-auto block object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={840}
                  height={480}
                />
              </picture>
              <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 text-foreground border border-border/80 text-xs font-semibold shadow-2xl backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5 text-primary" />
                  <span>Hacé clic para ver el panel en tamaño completo</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

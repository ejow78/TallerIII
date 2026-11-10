import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentsStatic from "@/components/stageshow/device-pair";

export function LandingHero({ registerUrl, trackingUrl, onOpenModal }) {
  return (
    <section className="relative py-14 lg:py-20 px-4 sm:px-6 flex items-center justify-center overflow-hidden min-h-[calc(100vh-4rem)]">
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

      <div className="relative z-10 max-w-[1480px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
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

        {/* Columna Derecha: Stageshow Device-Pair (Window and Phone) Stock */}
        <div className="lg:col-span-7 flex items-center justify-center">
          <PaymentsStatic />
        </div>
      </div>
    </section>
  );
}

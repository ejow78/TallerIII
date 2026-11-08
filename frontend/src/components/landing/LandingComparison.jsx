import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export function LandingComparison({ registerUrl }) {
  return (
    <section className="py-20 px-6 bg-card/15 border-t border-border/50 relative z-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 block">
            La Diferencia en el Día a Día
          </span>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Tu taller en orden, sin el caos del papel ni las dudas
          </h2>
          <p className="text-muted-foreground text-sm font-light">
            Dejá atrás los malentendidos con clientes y el descontrol de repuestos en el banco de trabajo.
          </p>
        </div>

        {/* Comparativa horizontal (carrusel deslizable en móvil, 2 columnas en desktop) */}
        <div className="flex md:grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth -mx-6 px-6 py-6 md:mx-0 md:px-0 md:py-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Columna 1: Taller Tradicional */}
          <Card className="w-[86vw] max-w-[440px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between bg-card/45 border-border/60 hover:border-border transition-all duration-200">
            <CardHeader className="space-y-1.5 pb-2">
              <CardTitle className="font-outfit text-xl sm:text-2xl font-bold text-muted-foreground">
                Taller Tradicional
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-light">
                El desorden operativo del día a día
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="border-t border-border/40 my-2" />
              <ul className="space-y-3.5 text-xs text-muted-foreground font-light leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold shrink-0 mt-0.5">✕</span>
                  <span>Papelitos de recepción extraviados o con letra ilegible.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold shrink-0 mt-0.5">✕</span>
                  <span>Teléfono y WhatsApp saturados de clientes preguntando si su equipo ya está listo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold shrink-0 mt-0.5">✕</span>
                  <span>Discusiones al retirar: «Yo nunca autoricé ese costo ni ese cambio de repuesto».</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold shrink-0 mt-0.5">✕</span>
                  <span>Stock a ojo: te enterás de que te falta un repuesto con el cliente esperando en el mostrador.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold shrink-0 mt-0.5">✕</span>
                  <span>Cierres de caja confusos al final del día sin saber cuánto fue en efectivo o digital.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Columna 2: Con RepairIT */}
          <Card className="w-[86vw] max-w-[440px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between bg-card/45 border-border/60 hover:border-border transition-all duration-200">
            <CardHeader className="space-y-1.5 pb-2">
              <CardTitle className="font-outfit text-xl sm:text-2xl font-bold text-foreground flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Con</span>
                <span className="font-black tracking-tight text-foreground">
                  Repair<span className="text-primary">IT</span>
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-light">
                Control profesional y trazabilidad en cada etapa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="border-t border-border/40 my-2" />
              <ul className="space-y-3.5 text-xs text-foreground font-medium leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Comprobante digital y físico con código QR único para el equipo y el cliente.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Seguimiento online automático: el cliente consulta solo desde su celular.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Presupuesto detallado aprobado con DNI en el portal de seguimiento antes de comenzar la reparación.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Stock en tiempo real con alertas de reposición antes de quedarte en cero.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Cierre y balance diario de caja con desglose instantáneo de cobros en efectivo, tarjetas y transferencias bancarias.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA centrado debajo de la comparativa */}
        <div className="flex flex-col items-center justify-center pt-2">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
          >
            <a href={registerUrl} className="flex items-center gap-2">
              <span>Comenzar a ordenar mi taller</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

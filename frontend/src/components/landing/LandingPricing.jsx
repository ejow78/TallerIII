import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function LandingPricing({
  registerUrl,
  pricingCarouselRef,
  handlePricingScroll,
  activePlanIndex,
  scrollToPlan,
}) {
  return (
    <section id="precios" className="py-20 px-6 bg-card/10 border-t border-border/50 relative z-10 scroll-mt-16">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
            Planes a tu Medida
          </h2>
          <p className="text-muted-foreground text-sm font-light">
            Elegí el nivel de potencia y gestión que tu taller necesita para crecer.
          </p>
        </div>

        {/* Carrusel deslizable en móvil, Grid 3 columnas en desktop */}
        <div
          ref={pricingCarouselRef}
          onScroll={handlePricingScroll}
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 pt-6 pb-2 items-stretch overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Tier 1: Taller Básico */}
          <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="space-y-2">
              <CardTitle className="font-outfit text-xl font-bold text-foreground">Taller Básico</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-light">
                Para técnicos independientes o talleres que dan sus primeros pasos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-foreground font-outfit">$7.500</span>
                <span className="text-muted-foreground text-xs font-light">ARS / mes</span>
              </div>
              <div className="border-t border-border/40 my-4" />
              <ul className="space-y-3 text-xs text-muted-foreground font-light">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Hasta 100 órdenes de servicio al mes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Gestión de clientes y catálogo de repuestos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Comprobantes A4 imprimibles con código QR</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Portal web para que el cliente consulte su equipo</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Avisos por correo electrónico y WhatsApp</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/30 bg-muted/20">
              <Button
                asChild
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer"
                variant="outline"
              >
                <a href={registerUrl}>Elegir Plan Básico</a>
              </Button>
            </CardFooter>
          </Card>

          {/* Tier 2: Taller Pro */}
          <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="space-y-2">
              <CardTitle className="font-outfit text-xl font-bold text-foreground">Taller Pro</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-light">
                Para talleres medianos con flujo constante de clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-foreground font-outfit">$14.900</span>
                <span className="text-muted-foreground text-xs font-light">ARS / mes</span>
              </div>
              <div className="border-t border-border/40 my-4" />
              <ul className="space-y-3 text-xs text-muted-foreground font-light">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Órdenes de servicio e inventario ilimitados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Módulo de Caja y Punto de Venta (POS)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Panel de métricas y gráficos financieros</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Alertas de stock crítico y exportación a Excel</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Aprobación digital de presupuestos con DNI</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/30 bg-muted/20">
              <Button
                asChild
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer"
                variant="outline"
              >
                <a href={registerUrl}>Suscribirse Ahora</a>
              </Button>
            </CardFooter>
          </Card>

          {/* Tier 3: Multi-Taller Pro */}
          <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="space-y-2">
              <CardTitle className="font-outfit text-xl font-bold text-foreground">Multi-Taller Pro</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-light">
                Para redes de talleres o negocios con varias sucursales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-foreground font-outfit">$29.900</span>
                <span className="text-muted-foreground text-xs font-light">ARS / mes</span>
              </div>
              <div className="border-t border-border/40 my-4" />
              <ul className="space-y-3 text-xs text-muted-foreground font-light">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Todo lo incluido en <strong>Taller Pro</strong> (Caja POS + Métricas)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Administración de múltiples sucursales</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Cuentas de acceso para técnicos por sucursal</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Cambio rápido de sede desde el panel admin</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Soporte prioritario y asistencia dedicada</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/30 bg-muted/20">
              <Button
                asChild
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer"
                variant="outline"
              >
                <a href="#contacto">Contactar Ventas</a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Indicadores de carrusel interactivos para móvil */}
        <div className="flex md:hidden items-center justify-center gap-2 pt-2">
          {[
            { label: "Taller Básico", idx: 0 },
            { label: "Taller Pro", idx: 1 },
            { label: "Multi-Taller Pro", idx: 2 },
          ].map(({ label, idx }) => (
            <button
              key={idx}
              onClick={() => scrollToPlan(idx)}
              className={`transition-colors duration-200 rounded-full cursor-pointer h-2 ${
                activePlanIndex === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Ver ${label}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

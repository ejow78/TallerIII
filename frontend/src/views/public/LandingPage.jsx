import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";

export default function LandingPage() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Estado del formulario de contacto
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/seguimiento/${trackingId.trim()}`);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error("Debe aceptar los términos de privacidad.");
      return;
    }

    // Simulación del envío de mensaje de contacto
    toast.success("¡Mensaje enviado con éxito!", {
      description: `Gracias por contactarte, ${contactName}. Te responderemos a la brevedad.`,
    });

    // Resetear formulario
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setAcceptTerms(false);
  };

  return (
    <div className="flex-grow flex flex-col">
      {/* Sección Hero sin cuadrícula y sin tag de servicio */}
      <section className="relative pt-20 pb-24 px-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[80vh]">
        {/* Glow Central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">

          {/* Título Principal */}
          <h1 className="font-outfit text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
            Tu taller de servicio técnico, más{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              transparente
            </span>{" "}
            que nunca
          </h1>

          {/* Subtítulo */}
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Hacemos el seguimiento de tu reparación simple. Consultá   el estado de tu equipo en tiempo real y aprobá presupuestos con un solo clic, sin contraseñas.
          </p>

          {/* Buscador de NanoID (CTA) - Optimizado para móviles */}
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto flex flex-row gap-2 bg-card/60 p-2 rounded-xl border border-border/80 shadow-2xl backdrop-blur w-full"
          >
            <Input
              type="text"
              placeholder={isMobile ? "Código (ej. RT-2026)" : "Código de seguimiento (ej. RT-2026)"}
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-grow bg-transparent border-0 border-none px-2 sm:px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
              required
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 sm:px-6 py-3 cursor-pointer select-none shrink-0"
            >
              <span className="hidden sm:inline">Consultar Estado</span>
              <span className="sm:hidden">Consultar</span>
            </Button>
          </form>

          {/* Ejemplo rápido para testing */}
          <div className="text-xs text-muted-foreground font-medium">
            ¿Querés probar? Ingresá <span onClick={() => setTrackingId("demo-id")} className="text-primary hover:underline cursor-pointer font-bold">demo-id</span> para ver una reparación simulada.
          </div>

        </div>
      </section>

      {/* Sección de Características */}
      <section id="caracteristicas" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              ¿Por qué elegir RepairIT?
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Nuestra plataforma está diseñada para ofrecerte una visión transparente en cada etapa de la reparación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">

            {/* Feature 1 con Card de shadcn */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Trazabilidad Instantánea</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Olvidate de las llamadas telefónicas. A través de tu enlace único podés ver si tu equipo está ingresado, diagnosticado o listo para retirar.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 con Card de shadcn */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Aprobación Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Visualizá el presupuesto de mano de obra y repuestos en detalle. Podés aprobar o rechazar la reparación desde tu misma interfaz de consulta.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 con Card de shadcn */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Control de Insumos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  El sistema audita el stock técnico y descuenta automáticamente los componentes utilizados, asegurando que siempre tengamos repuestos disponibles.
                </p>
              </CardContent>
            </Card>

          </div>

        </div>
      </section>

      {/* Sección de Precios */}
      <section id="precios" className="py-20 px-6 bg-card/10 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Planes a tu Medida
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Escogé el nivel de potencia y gestión que tu taller necesita para crecer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-stretch">

            {/* Tier 1: Inicial */}
            <Card className="flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="space-y-2">
                <CardTitle className="font-outfit text-xl font-bold text-foreground">Plan Inicial</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light">Ideal para técnicos independientes que comienzan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground font-outfit">$1</span>
                  <span className="text-muted-foreground text-xs font-light">/ mes</span>
                </div>
                <div className="border-t border-border/40 my-4" />
                <ul className="space-y-3 text-xs text-muted-foreground font-light">
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sed do eiusmod tempor incididunt ut labore.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ut enim ad minim veniam, quis nostrud.</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/30 bg-muted/20">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer" variant="outline">
                  Comenzar gratis
                </Button>
              </CardFooter>
            </Card>

            {/* Tier 2: Taller Pro (Highlighted/Popular) */}
            <Card className="flex flex-col justify-between min-h-[480px] overflow-visible bg-card/60 border-primary/50 hover:border-primary transition-all duration-200 hover:-translate-y-1 relative ring-1 ring-primary/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-primary hover:bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                  Más Popular
                </Badge>
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="font-outfit text-xl font-bold text-foreground">Taller Pro</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light">Para talleres medianos con flujo constante de clientes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground font-outfit">$1</span>
                  <span className="text-muted-foreground text-xs font-light">/ mes</span>
                </div>
                <div className="border-t border-border/40 my-4" />
                <ul className="space-y-3 text-xs text-muted-foreground font-light">
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Duis aute irure dolor in reprehenderit in voluptate.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Excepteur sint occaecat cupidatat non proident.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sunt in culpa qui officia deserunt mollit.</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/30 bg-primary/5">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-lg cursor-pointer">
                  Suscribirse Ahora
                </Button>
              </CardFooter>
            </Card>

            {/* Tier 3: Multi-Sucursal */}
            <Card className="flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="space-y-2">
                <CardTitle className="font-outfit text-xl font-bold text-foreground">Multi-Sucursal</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light">Para redes de talleres o franquicias de soporte técnico.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground font-outfit">$1</span>
                  <span className="text-muted-foreground text-xs font-light">/ mes</span>
                </div>
                <div className="border-t border-border/40 my-4" />
                <ul className="space-y-3 text-xs text-muted-foreground font-light">
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Velit esse cillum dolore eu fugiat nulla pariatur.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mollis pretium lorem primis iaculis cubilia.</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/30 bg-muted/20">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer" variant="outline">
                  Contactar Ventas
                </Button>
              </CardFooter>
            </Card>

          </div>

        </div>
      </section>

      {/* Sección de Preguntas Frecuentes (FAQ) */}
      <section id="faq" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">

          <div className="text-center space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Todo lo que necesitás saber sobre RepairIT y nuestro sistema de trazabilidad.
            </p>
          </div>

          <div className="pt-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit">
                  ¿Cómo funciona el seguimiento de mi reparación?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Vas a recibir un código de seguimiento único al registrar tu equipo en nuestro taller. Solo tenes que ingresarlo en el buscador de la página de inicio para ver el estado de tu equipo en tiempo real, sin necesidad de crear una cuenta o recordar contraseñas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit">
                  ¿Puedo aprobar presupuestos en línea?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Sí. Cuando el técnico realice el diagnóstico y cargue el presupuesto de mano de obra e insumos, podrás visualizar el detalle en tu panel de seguimiento y aprobar o rechazar la reparación de forma digital con un solo clic.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit">
                  ¿Tienen cargos ocultos adicionales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  No, para nada. La transparencia es nuestro pilar fundamental. Desglosamos cada centavo en el presupuesto de repuestos y mano de obra. Los planes de suscripción de taller también están fijados sin sorpresas ni letra chica.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit">
                  ¿Mis datos personales y del dispositivo están seguros?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Absolutamente. Cumplimos rigurosamente con las normativas locales de protección de datos personales. Toda tu información y la de tus equipos está cifrada y almacenada en servidores de alta seguridad.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit">
                  ¿Qué sucede si tengo más de una sucursal o taller?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Disponemos de un plan Multi-Sucursal especialmente diseñado para redes de soporte técnico. Te permite gestionar múltiples tenants o locaciones con perfiles independientes pero administrados centralmente.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
      </section>

      {/* Sección de Contacto e Integración Typography */}
      <section id="contacto" className="py-20 px-6 bg-card/10 border-t border-border/50 relative z-10">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Ponete en Contacto
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              ¿Tenés alguna consulta técnica o comercial sobre nuestro servicio? Escribinos.
            </p>
          </div>

          <Card className="bg-card/60 border-border p-6 shadow-xl backdrop-blur-md">
            <form onSubmit={handleContactSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Nombre Completo</label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Edgar Ortiz"
                    className="bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Email</label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="edgar@repairit.cloud"
                    className="bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Mensaje / Consulta</label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Detallá tu consulta aquí..."
                  className="bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary text-sm resize-none"
                />
              </div>

              {/* Checkbox de Privacidad */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="privacy"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked)}
                  className="mt-0.5 border-border focus-visible:ring-primary"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="privacy"
                    className="text-xs text-muted-foreground font-light leading-tight select-none cursor-pointer"
                  >
                    Acepto que mis datos sean tratados de acuerdo con las{" "}
                    <span className="text-primary hover:underline font-semibold cursor-pointer">Políticas de Privacidad</span> y los{" "}
                    <span className="text-primary hover:underline font-semibold cursor-pointer">Términos de Servicio</span> de RepairIT.
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg transition-all mt-2 cursor-pointer select-none"
              >
                Enviar Consulta
              </Button>

            </form>
          </Card>
        </div>
      </section>

    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  QrCode, 
  DollarSign, 
  PackageCheck, 
  Printer, 
  Building2, 
  BarChart3, 
  Wrench, 
  Check,
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock 
} from "lucide-react";

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const pricingCarouselRef = useRef(null);
  const [activePlanIndex, setActivePlanIndex] = useState(1); // 0: Inicial, 1: Pro, 2: Multi-Sucursal

  useEffect(() => {
    document.title = "RepairIT | Software de Servicio Técnico y Gestión para Talleres";
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Centrar horizontalmente en el Plan Pro (centro) al cargar en móvil sin desplazar la ventana
    const centerProCard = () => {
      if (pricingCarouselRef.current && window.innerWidth < 768) {
        const el = pricingCarouselRef.current;
        const cards = el.querySelectorAll(".pricing-card");
        if (cards[1]) {
          const cardLeft = cards[1].offsetLeft;
          const cardWidth = cards[1].offsetWidth;
          const containerWidth = el.offsetWidth;
          el.scrollLeft = cardLeft - (containerWidth - cardWidth) / 2;
          setActivePlanIndex(1);
        }
      }
      window.scrollTo(0, 0);
    };
    const timer = setTimeout(centerProCard, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const scrollToPlan = (index) => {
    if (pricingCarouselRef.current) {
      const el = pricingCarouselRef.current;
      const cards = el.querySelectorAll(".pricing-card");
      if (cards[index]) {
        const cardLeft = cards[index].offsetLeft;
        const cardWidth = cards[index].offsetWidth;
        const containerWidth = el.offsetWidth;
        el.scrollTo({
          left: cardLeft - (containerWidth - cardWidth) / 2,
          behavior: "smooth"
        });
        setActivePlanIndex(index);
      }
    }
  };

  const handlePricingScroll = () => {
    if (pricingCarouselRef.current && window.innerWidth < 768) {
      const el = pricingCarouselRef.current;
      const cards = el.querySelectorAll(".pricing-card");
      const center = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 1;
      let minDiff = Infinity;
      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(center - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActivePlanIndex(closestIdx);
    }
  };

  // Estado del formulario de contacto y anti-spam
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // 1. Trampa Honeypot para bots automáticos (si viene lleno, es un bot)
    if (honeypot.trim()) {
      toast.success("¡Mensaje enviado con éxito!", {
        description: "Gracias por contactarte.",
      });
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      return;
    }

    if (!acceptTerms) {
      toast.error("Debe aceptar los términos de privacidad.");
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error("Por favor complete todos los campos.");
      return;
    }

    setIsSendingContact(true);
    try {
      const { sendContactEmail } = await import("@/services/emailService");
      const res = await sendContactEmail({
        name: contactName.trim(),
        email: contactEmail.trim(),
        message: contactMessage.trim(),
      });

      if (res?.ok) {
        toast.success("¡Mensaje enviado con éxito!", {
          description: `Gracias por contactarte, ${contactName}. Te responderemos a la brevedad.`,
        });
        setContactName("");
        setContactEmail("");
        setContactMessage("");
        setAcceptTerms(false);
      } else {
        toast.error(res?.error || "No se pudo enviar el mensaje. Podés escribirnos directo a contacto@repairit.cloud");
      }
    } catch (err) {
      console.error("[LandingPage] Error:", err);
      toast.error("Error al enviar el mensaje.");
    } finally {
      setIsSendingContact(false);
    }
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
            Controlá órdenes de servicio, repuestos e ingresos en tiempo real. Brindá seguimiento público a tus clientes y aprobá presupuestos sin fricción.
          </p>
        </div>
      </section>

      {/* Sección de Características (Servicios para Dueños de Taller) */}
      <section id="caracteristicas" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Soluciones Diseñadas para tu Taller
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Potenciá la productividad de tu taller, automatizá la atención a clientes y mantené el control total de tus ingresos e inventario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">

            {/* Feature 1 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <QrCode className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Seguimiento en Vivo y Avisos por Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Tus clientes consultan el avance escaneando el código QR de su comprobante o desde la web. Además, reciben notificaciones automáticas por correo cuando su equipo ingresa o está listo para retirar.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Wrench className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Presupuestos y Aprobación Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Cargá diagnósticos y presupuestos claros. Tu cliente revisa el detalle de repuestos y mano de obra desde su celular y lo aprueba con un clic, agilizando el trabajo sin malentendidos.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Printer className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Recepción Ágil y Comprobantes con QR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Registrá equipos en segundos documentando fallas, accesorios y estado cosmético. Emití comprobantes térmicos o en formato A4 listos para imprimir con código QR de seguimiento.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Control de Stock y Repuestos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Llevá el registro de piezas, accesorios e insumos. Consultá cantidades disponibles, recibí avisos de stock mínimo y exportá el catálogo completo a Excel (.xlsx) en 1 clic.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Ventas de Mostrador y Cobros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Registrá ventas directas de accesorios, señas y cobros finales de reparaciones con distintos medios de pago, emitiendo tickets de venta de manera sencilla.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Multi-Sucursal y Gestión de Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Supervisá una o varias sucursales desde un mismo panel unificado. Asigná accesos para recepcionistas, técnicos y administradores con total trazabilidad.
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

          {/* Carrusel deslizable en móvil, Grid 3 columnas en desktop */}
          <div
            ref={pricingCarouselRef}
            onScroll={handlePricingScroll}
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 pt-6 pb-2 items-stretch overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >

            {/* Tier 1: Inicial */}
            <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
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
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Hasta 100 Órdenes de Servicio al mes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>1 Sucursal activa</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Portal de seguimiento online para clientes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Impresión de fichas físicas de recepción</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/30 bg-muted/20">
                <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer" variant="outline">
                  <a href={window.location.hostname.includes("repairit.cloud") ? "https://app.repairit.cloud/register" : "/register"}>
                    Comenzar gratis
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Tier 2: Taller Pro (Highlighted/Popular) */}
            <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/60 border-primary/50 hover:border-primary transition-all duration-200 hover:-translate-y-1 relative ring-1 ring-primary/20 shadow-lg shadow-primary/5">
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
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Órdenes de Servicio ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Control de Inventario y Alertas de Stock</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Control de Caja y Arqueos Diarios</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Aprobación de Presupuestos Online</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Exportación a Excel (.xlsx) en 1 clic</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/30 bg-primary/5">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-lg cursor-pointer">
                  <a href={window.location.hostname.includes("repairit.cloud") ? "https://app.repairit.cloud/register" : "/register"}>
                    Suscribirse Ahora
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Tier 3: Multi-Sucursal */}
            <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
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
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Todo lo incluido en el Plan Taller Pro</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Sucursales ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Gestión de Perfiles (SuperAdmin / Técnico / Recepción)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Soporte Técnico Prioritario 24/7</span>
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

          {/* Indicadores de carrusel interactivos para móvil */}
          <div className="flex md:hidden items-center justify-center gap-2 pt-2">
            {[
              { label: "Plan Inicial", idx: 0 },
              { label: "Taller Pro", idx: 1 },
              { label: "Multi-Sucursal", idx: 2 }
            ].map(({ label, idx }) => (
              <button
                key={idx}
                onClick={() => scrollToPlan(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
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

      {/* Sección de Preguntas Frecuentes (FAQ) */}
      <section id="faq" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">

          <div className="text-center space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Respuestas claras a las dudas más comunes sobre la implementación de RepairIT en tu negocio.
            </p>
          </div>

          <div className="pt-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Qué necesito para empezar a utilizar RepairIT en mi taller?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Solo necesitás un navegador web (Chrome, Firefox o Edge) en tu computadora, tablet o celular. No requiere instalar ningún software ni configurar servidores locales. Podés crear tu cuenta y empezar a cargar órdenes en 2 minutos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Cómo reduce RepairIT las llamadas telefónicas de mis clientes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Al ingresar un equipo, el sistema genera un código único y un comprobante con código QR. Además, envía notificaciones automáticas por correo electrónico al cliente cuando el equipo ingresa, cuando se actualiza el presupuesto y en el momento exacto en que está listo para retirar, permitiéndole consultar los avances desde su celular sin necesidad de llamar al taller.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Pueden mis clientes aprobar o rechazar presupuestos en línea?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Exacto. Cuando cargás el diagnóstico y los ítems del presupuesto, el cliente puede revisar el detalle de repuestos y mano de obra desde su celular y presionar "Aprobar Presupuesto", dejando constancia digital con fecha y hora.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Cómo funciona el control de inventario y caja?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  RepairIT descuenta automáticamente del stock los repuestos e insumos utilizados en cada reparación. Además, registra las señas, ventas de mostrador y cobros finales en tu balance de caja diario por sucursal.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Qué tan segura está la información de mi taller y mis clientes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Toda la información viaja y se almacena de forma cifrada y protegida en la nube. La plataforma cuenta con aislamiento estricto por taller, lo que garantiza que solo vos y tu personal autorizado puedan acceder a los datos de tus clientes, órdenes de servicio, inventario y movimientos de caja.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Puedo administrar múltiples talleres o sucursales desde una sola cuenta?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Sí. Nuestro plan Multi-Sucursal permite gestionar múltiples sucursales con inventarios, cajas y técnicos independientes, supervisados centralmente desde un panel de administración unificado.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Qué rubros de servicio técnico pueden utilizar RepairIT?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  RepairIT está adaptado para talleres de reparación de celulares y smartphones, servicio técnico de notebooks y computadoras, consolas de videojuegos, electrodomésticos, audio, televisión y mecánica general. La gestión de estados y presupuestos es completamente flexible.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Cómo se imprimen los comprobantes de recepción de equipos?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  El sistema genera automáticamente comprobantes digitales de recepción listos para imprimir en impresoras térmicas de tickets (80mm) o formato estándar A4. Cada comprobante incluye los datos del taller, falla declarada y el código QR de seguimiento online para el cliente.
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
                    placeholder="Ej. Juan Pérez"
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
                    placeholder="contacto@ejemplo.com"
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

              {/* Campo Honeypot invisible para humanos, trampa para bots */}
              <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                <label htmlFor="company_fax">Empresa o Fax</label>
                <input
                  id="company_fax"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isSendingContact}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg transition-all mt-2 cursor-pointer select-none"
              >
                {isSendingContact ? "Enviando mensaje..." : "Enviar Consulta"}
              </Button>

            </form>
          </Card>
        </div>
      </section>

    </div>
  );
}

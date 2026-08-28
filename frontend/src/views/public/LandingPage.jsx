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
import { 
  QrCode, 
  DollarSign, 
  PackageCheck, 
  Printer, 
  Building2, 
  BarChart3, 
  Wrench, 
  Search, 
  Check,
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock 
} from "lucide-react";

export default function LandingPage() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.title = "RepairIT";
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
      if (window.location.hostname.includes("repairit.cloud")) {
        window.location.href = `https://tracking.repairit.cloud/seguimiento/${trackingId.trim()}`;
      } else {
        navigate(`/seguimiento/${trackingId.trim()}`);
      }
    }
  };

  const handleDemoClick = () => {
    setTrackingId("demo-id");
    if (window.location.hostname.includes("repairit.cloud")) {
      window.location.href = "https://tracking.repairit.cloud/seguimiento/demo-id";
    } else {
      navigate("/seguimiento/demo-id");
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
            Controlá órdenes de servicio, repuestos e ingresos en tiempo real. Brindá seguimiento público a tus clientes y aprobá presupuestos sin fricción.
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
            ¿Querés probar? Ingresá <span onClick={handleDemoClick} className="text-primary hover:underline cursor-pointer font-bold">demo-id</span> para ver una reparación simulada.
          </div>

        </div>
      </section>

      {/* Sección de Características (Servicios para Dueños de Taller) */}
      <section id="caracteristicas" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Soluciones Diseñadas para Dueños y Laboratorios Técnicos
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
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Portal de Seguimiento 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Reducí hasta un 80% las llamadas de consulta. Tus clientes siguen el estado técnico en vivo y aprueban presupuestos online desde su celular.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Control de Caja y Arqueos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Administrá señas, cobros de mano de obra y ventas de repuestos. Mantené el balance financiero de tus sucursales sin desfasajes ni pérdidas.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Inventario y Alertas de Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Controlá el stock de pantallas, módulos, integrados y baterías. El sistema descuenta insumos al reparar y te avisa cuando necesitás reponer.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Printer className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Ingreso Rápido y Fichas Físicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Registrá dispositivos en menos de 30 segundos. Imprimí el comprobante físico de recepción para el cliente y pegá la etiqueta al equipo.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Multi-Sucursal y Permisos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Gestioná múltiples locales o laboratorios desde una sola cuenta. Asigná roles específicos para recepcionistas, técnicos y administradores.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-card/45 border-border/60 hover:border-border transition-colors duration-200">
              <CardHeader className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-semibold text-foreground">Exportación a Excel en 1 Clic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Descargá en 1 solo clic todos los historiales de servicios, facturación e inventario en formato Excel CSV para tu gestión contable.
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
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Hasta 100 Órdenes de Servicio al mes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>1 Sucursal o Laboratorio activo</span>
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
                    <span>Exportación a Excel CSV en 1 clic</span>
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
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Todo lo incluido en el Plan Taller Pro</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Sucursales y Laboratorios ilimitados</span>
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

        </div>
      </section>

      {/* Sección de Preguntas Frecuentes (FAQ B2B para Dueños de Taller) */}
      <section id="faq" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">

          <div className="text-center space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Preguntas Frecuentes de Dueños de Taller
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
                  Al ingresar un equipo, el sistema genera un código único de seguimiento (ej. RT-8K9M2P4X). Tus clientes ingresan a la web desde su celular para ver si su equipo está en diagnóstico, presupuestado o listo para retirar sin necesidad de llamarte.
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
                  Utilizamos arquitectura de base de datos PostgreSQL con Row Level Security (RLS). Los datos de tu taller están totalmente aislados e inalterables, protegidos bajo cifrado HTTPS/TLS de grado bancario.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors">
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Puedo administrar múltiples talleres o sucursales desde una sola cuenta?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Sí. Nuestro plan Multi-Sucursal permite gestionar múltiples laboratorios con inventarios, cajas y técnicos independientes, supervisados centralmente desde un panel de administración unificado.
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

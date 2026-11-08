import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Activity,
  BarChart3,
  DollarSign,
  PackageCheck,
  Building2,
  Wrench,
  Check,
  Search,
  CheckCircle2,
  QrCode,
  Smartphone,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  Receipt,
  Sparkles,
  Calculator,
  Sliders,
  AlertTriangle,
  Minus,
  Plus,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const pricingCarouselRef = useRef(null);
  const [activePlanIndex, setActivePlanIndex] = useState(1); // 0: Inicial, 1: Pro, 2: Multi-Sucursal

  // Estado para la Calculadora de Ahorro para el Taller
  const [monthlyDevices, setMonthlyDevices] = useState(60);
  const savedHours = Math.round(monthlyDevices * 0.45);
  const estimatedSavings = (savedHours * 4500).toLocaleString("es-AR");

  useEffect(() => {
    document.title = "RepairIT | Software de Servicio Técnico y Gestión para Talleres";
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

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
          behavior: "smooth",
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
        toast.error(
          res?.error ||
            "No se pudo enviar el mensaje. Podés escribirnos directo a contacto@repairit.cloud"
        );
      }
    } catch (err) {
      console.error("[LandingPage] Error:", err);
      toast.error("Error al enviar el mensaje.");
    } finally {
      setIsSendingContact(false);
    }
  };

  const registerUrl = window.location.hostname.includes("repairit.cloud")
    ? "https://app.repairit.cloud/register"
    : "/register";

  const trackingUrl = window.location.hostname.includes("repairit.cloud")
    ? "https://tracking.repairit.cloud/consulta"
    : "/consulta";

  return (
    <div className="flex-grow flex flex-col">
      {/* SECCIÓN 1: HERO PRINCIPAL CON TEXTURA DE PRECISIÓN TÉCNICA */}
      <section className="relative py-14 lg:py-20 px-6 flex items-center justify-center overflow-hidden min-h-[calc(100vh-4rem)]">
        {/* Textura Dot Pattern con desvanecimiento radial de bordes */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_65%,transparent_100%)] pointer-events-none" />

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

          {/* Columna Derecha: Captura Real del Panel de Control */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="relative w-full max-w-[840px] rounded-xl border border-border/80 bg-card/60 shadow-2xl ring-1 ring-border/50 overflow-hidden select-none">
              <img
                src="/hero-dashboard.png"
                alt="Panel de Control de RepairIT con métricas, gráficos e inventario en vivo"
                className="w-full h-auto block object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: FLUJO DE TRABAJO EN 3 PASOS */}
      <section className="py-20 px-6 bg-card/15 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 block">
              Flujo de Trabajo
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Del ingreso a la entrega en 3 simples pasos
            </h2>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Diseñado para eliminar pasos manuales, reducir llamadas repetitivas y dar claridad total en cada orden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Paso 1 */}
            <div className="relative rounded-2xl bg-card/40 border border-border/70 p-6 sm:p-7 space-y-4 hover:border-border transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md">
                  Paso 01
                </span>
                <QrCode className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-outfit text-lg font-bold text-foreground">
                Recepción & Comprobante QR
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Registrás el equipo en 30 segundos con su estado cosmético y accesorios. El sistema genera un link de seguimiento único y comprobante con código QR para que el cliente pueda ver el seguimiento en vivo.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="relative rounded-2xl bg-card/40 border border-border/70 p-6 sm:p-7 space-y-4 hover:border-border transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">
                  Paso 02
                </span>
                <Smartphone className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-outfit text-lg font-bold text-foreground">
                Diagnóstico & Aprobación Web
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Cargás el presupuesto desglosado. El cliente recibe el aviso por WhatsApp o email y aprueba el monto ingresando su DNI en el portal de seguimiento antes de comenzar la reparación.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="relative rounded-2xl bg-card/40 border border-border/70 p-6 sm:p-7 space-y-4 hover:border-border transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-md">
                  Paso 03
                </span>
                <Receipt className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-outfit text-lg font-bold text-foreground">
                Cobro en Caja & Retiro
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Al marcar el equipo como entregado, se registra el cobro en el módulo de caja, se descuentan automáticamente los repuestos del stock y el cliente se va con su equipo listo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: BENTO GRID DE FUNCIONALIDADES CON MICRO-INTERFACES REALES */}
      <section id="caracteristicas" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
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

              {/* Micro-UI: Vista simulada de la consulta pública */}
              <div className="rounded-xl bg-background/80 border border-border/70 p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs border-b border-border/50 pb-2.5">
                  <span className="font-mono text-muted-foreground">Orden: <strong>#ORD-1084</strong></span>
                  <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold uppercase">
                    Listo
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground block">iPhone 14 Pro Max</span>
                    <span className="text-[11px] text-muted-foreground">Cambio de Módulo Display • Garantía 90 días</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-sm">$89.000</span>
                </div>
                {/* Stepper horizontal de estados */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1 text-center text-[10px] font-semibold text-muted-foreground">
                  <div className="p-1 rounded bg-muted/60 text-foreground">1. Ingresado</div>
                  <div className="p-1 rounded bg-muted/60 text-foreground">2. Presupuestado</div>
                  <div className="p-1 rounded bg-muted/60 text-foreground">3. Reparación</div>
                  <div className="p-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">4. Listo</div>
                  <div className="p-1 rounded bg-muted/40 text-muted-foreground border border-border/40">5. Entregado</div>
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

              {/* Micro-UI: Presupuesto validado */}
              <div className="rounded-xl bg-background/80 border border-border/70 p-4 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Módulo OLED:</span>
                  <span className="text-foreground">$89.000</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Mano de Obra:</span>
                  <span className="text-foreground">$25.000</span>
                </div>
                <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-foreground">
                  <span>Total:</span>
                  <span className="text-primary">$114.000</span>
                </div>
                <div className="rounded bg-emerald-500/10 border border-emerald-500/25 p-2 text-center text-emerald-400 text-[10px] font-bold">
                  ✓ Aprobado digitalmente por Juan Pérez (DNI 38.450.123)
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
                    Por Reponer
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

      {/* SECCIÓN 4: COMPARATIVA REAL (TALLER TRADICIONAL VS CON REPAIRIT) */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Columna 1: Taller Tradicional */}
            <div className="rounded-2xl bg-card/45 border border-border/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-border transition-colors">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/60 text-xs font-semibold uppercase tracking-wider">
                  <span>Taller Tradicional</span>
                </div>
                <h3 className="font-outfit text-xl font-bold text-foreground">
                  El desorden operativo de siempre
                </h3>
                <ul className="space-y-3.5 text-xs text-muted-foreground font-light leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold shrink-0">✕</span>
                    <span>Papelitos de recepción extraviados o con letra ilegible.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold shrink-0">✕</span>
                    <span>Teléfono y WhatsApp saturados de clientes preguntando si su equipo ya está listo.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold shrink-0">✕</span>
                    <span>Discusiones al retirar: «Yo nunca autoricé ese costo ni ese cambio de repuesto».</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold shrink-0">✕</span>
                    <span>Stock a ojo: te enterás de que te falta un módulo con el cliente esperando en el mostrador.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold shrink-0">✕</span>
                    <span>Cierres de caja confusos al final del día sin saber cuánto fue en efectivo o digital.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Columna 2: Con RepairIT */}
            <div className="rounded-2xl bg-card/45 border border-border/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-border transition-colors">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/25 text-xs font-semibold uppercase tracking-wider">
                  <span>Con RepairIT</span>
                </div>
                <h3 className="font-outfit text-xl font-bold text-foreground">
                  Control profesional en cada etapa
                </h3>
                <ul className="space-y-3.5 text-xs text-foreground font-medium leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold shrink-0">✓</span>
                    <span>Comprobante digital y físico con código QR único para el equipo y el cliente.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold shrink-0">✓</span>
                    <span>Seguimiento online automático: el cliente consulta solo desde su celular.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold shrink-0">✓</span>
                    <span>Presupuesto detallado aprobado con DNI en el portal de seguimiento antes de comenzar la reparación.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold shrink-0">✓</span>
                    <span>Stock en tiempo real con alertas de reposición antes de quedarte en cero.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold shrink-0">✓</span>
                    <span>Caja cuadrada con desglose instantáneo de cobros en efectivo, tarjetas y transferencias bancarias.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA centrado debajo de la comparativa */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-2.5">
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
            <span className="text-[11px] text-muted-foreground font-light">
              Sin tarjeta de crédito requerida • 14 días de prueba gratuita
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: PLANES DE PRECIOS */}
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
                  <span className="text-4xl font-extrabold text-foreground font-outfit">Gratis</span>
                  <span className="text-muted-foreground text-xs font-light">/ mes</span>
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
                  <a href={registerUrl}>Comenzar gratis</a>
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

      {/* SECCIÓN 6: PREGUNTAS FRECUENTES (FAQ) */}
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
              <AccordionItem
                value="item-1"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Qué necesito para empezar a utilizar RepairIT en mi taller?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Solo necesitás un navegador web (Chrome, Firefox o Edge) en tu computadora, tablet o celular. No requiere instalar ningún software ni configurar servidores locales. Podés crear tu cuenta y empezar a cargar órdenes en 2 minutos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Cómo reduce RepairIT las llamadas telefónicas de mis clientes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Al ingresar un equipo, el sistema genera un código único y un comprobante con código QR. Además, envía notificaciones automáticas por correo electrónico al cliente cuando el equipo ingresa, cuando se actualiza el presupuesto y en el momento exacto en que está listo para retirar, permitiéndole consultar los avances desde su celular sin necesidad de llamar al taller.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Pueden mis clientes aprobar o rechazar presupuestos en línea?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Exacto. Cuando cargás el diagnóstico y los ítems del presupuesto, el cliente puede revisar el detalle de repuestos y mano de obra desde su celular y presionar "Aprobar Presupuesto", dejando constancia digital con fecha, hora y validación por DNI.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Cómo funciona el control de inventario y caja?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  RepairIT descuenta automáticamente del stock los repuestos e insumos utilizados en cada reparación. Además, registra las señas, ventas de mostrador y cobros finales en tu balance de caja diario por sucursal.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Qué tan segura está la información de mi taller y mis clientes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Toda la información viaja y se almacena de forma cifrada y protegida en la nube con Supabase y PostgreSQL. La plataforma cuenta con aislamiento estricto por taller, lo que garantiza que solo vos y tu personal autorizado puedan acceder a los datos de tus clientes, órdenes de servicio, inventario y movimientos de caja.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Puedo administrar múltiples talleres o sucursales desde una sola cuenta?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  Sí. Nuestro plan Multi-Sucursal permite gestionar múltiples sucursales con inventarios, cajas y técnicos independientes, supervisados centralmente desde un panel de administración unificado.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-7"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-base text-foreground font-semibold py-4 hover:no-underline font-outfit text-left">
                  ¿Qué rubros de servicio técnico pueden utilizar RepairIT?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-light pb-4 leading-relaxed">
                  RepairIT está adaptado para talleres de reparación de celulares y smartphones, servicio técnico de notebooks y computadoras, consolas de videojuegos, electrodomésticos, audio, televisión y mecánica general. La gestión de estados y presupuestos es completamente flexible.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-8"
                className="border border-border/60 bg-card/45 rounded-lg px-4 hover:border-border transition-colors"
              >
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

      {/* SECCIÓN 7: CONTACTO */}
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
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                  >
                    Nombre Completo
                  </label>
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
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                  >
                    Email
                  </label>
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
                <label
                  htmlFor="message"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Mensaje / Consulta
                </label>
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

              {/* Checkbox de Privacidad Accesible (WCAG H44/H65) */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  aria-required="true"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border bg-input/30 text-primary accent-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer transition-colors"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="privacy"
                    className="text-xs text-muted-foreground font-light leading-tight select-none cursor-pointer"
                  >
                    Acepto que mis datos sean tratados de acuerdo con las{" "}
                    <span className="text-primary hover:underline font-semibold cursor-pointer">
                      Políticas de Privacidad
                    </span>{" "}
                    y los{" "}
                    <span className="text-primary hover:underline font-semibold cursor-pointer">
                      Términos de Servicio
                    </span>{" "}
                    de RepairIT.
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

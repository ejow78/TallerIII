import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  QrCode,
  DollarSign,
  PackageCheck,
  Printer,
  Building2,
  Wrench,
  Check,
  ClipboardList,
  ShoppingCart,
  Package,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Square,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const pricingCarouselRef = useRef(null);
  const [activePlanIndex, setActivePlanIndex] = useState(1); // 0: Inicial, 1: Pro, 2: Multi-Sucursal
  const [heroTab, setHeroTab] = useState("ordenes"); // "ordenes" | "presupuestos" | "inventario" | "caja"

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
      {/* Sección Hero Split con Ventana en Perspectiva 3D */}
      <section className="relative pt-12 pb-20 md:py-24 px-6 flex items-center justify-center overflow-hidden min-h-[82vh]">
        {/* Glow Ambiental */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/3 -translate-y-1/2 w-[480px] h-[380px] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Columna Izquierda: Propuesta de Valor & CTA */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            <h1 className="font-outfit text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-foreground tracking-tight leading-[1.08]">
              Tu taller técnico, más{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">
                transparente
              </span>{" "}
              que nunca
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
                  <span>Seguimiento de Equipo</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Columna Derecha: Ventana Interactiva en Perspectiva 3D (Estilo Entropy) */}
          <div
            className="lg:col-span-7 flex items-center justify-center"
            style={{ perspective: "1300px" }}
          >
            <div
              className="w-full max-w-[660px] rounded-xl border border-border/80 bg-[#141417]/95 backdrop-blur-xl shadow-[-25px_30px_65px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out hover:[transform:rotateY(-6deg)_rotateX(2deg)] lg:[transform:rotateY(-14deg)_rotateX(5deg)_rotateZ(0.5deg)] overflow-hidden select-none"
            >
              {/* Barra Superior de la Ventana */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#18181c]">
                <div className="flex items-center gap-2">
                  <span className="font-outfit text-xs font-black tracking-widest uppercase text-foreground">
                    REPAIR<span className="text-primary">IT</span>
                  </span>
                  <span className="text-[10px] font-mono text-primary/80 font-bold">v2.4</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground/60">
                  <Minus className="w-3 h-3" />
                  <Square className="w-2.5 h-2.5" />
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Barra de Pestañas Superiores Interactivas */}
              <div className="flex items-center gap-1 sm:gap-3 px-4 py-2.5 border-b border-white/10 bg-[#16161a] overflow-x-auto">
                {[
                  { id: "ordenes", label: "Órdenes", icon: ClipboardList },
                  { id: "presupuestos", label: "Presupuestos", icon: Wrench },
                  { id: "inventario", label: "Inventario", icon: Package },
                  { id: "caja", label: "Caja POS", icon: ShoppingCart },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = heroTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setHeroTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer shrink-0 ${
                        active
                          ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cuerpo Interior de la Ventana */}
              <div className="grid grid-cols-12 min-h-[300px] text-left">
                {/* Sub-menú lateral izquierdo (estilo Entropy) */}
                <div className="hidden sm:flex sm:col-span-3 flex-col justify-between border-r border-white/10 p-3.5 bg-[#151519] text-xs">
                  <div className="space-y-1.5">
                    <div className="px-2.5 py-1.5 rounded bg-primary/10 text-primary font-semibold border-l-2 border-primary">
                      {heroTab === "ordenes" && "Laboratorio"}
                      {heroTab === "presupuestos" && "Cotizaciones"}
                      {heroTab === "inventario" && "Catálogo Stock"}
                      {heroTab === "caja" && "Turno Actual"}
                    </div>
                    <div className="px-2.5 py-1.5 text-muted-foreground/70">Recepción QR</div>
                    <div className="px-2.5 py-1.5 text-muted-foreground/70">Notificaciones</div>
                    <div className="px-2.5 py-1.5 text-muted-foreground/70">Historial DNI</div>
                    <div className="px-2.5 py-1.5 text-muted-foreground/70">Exportar XLSX</div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-black/30 p-2.5 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">
                      Sucursal Activa
                    </span>
                    <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Sede Central
                    </span>
                  </div>
                </div>

                {/* Panel Derecho Dinámico */}
                <div className="col-span-12 sm:col-span-9 p-4 sm:p-5 bg-[#121215]">
                  <div className="rounded-lg border border-primary/25 bg-[#17171c] p-4 h-full flex flex-col justify-between space-y-4">
                    {heroTab === "ordenes" && (
                      <>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              Trazabilidad de Equipos en Vivo
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Sincronizado con portal público QR
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-mono text-[10px] font-bold">
                            12 Activas
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            {
                              code: "RT-TESIS2026",
                              device: 'MacBook Pro 14" M2',
                              client: "Martín Gómez",
                              status: "Presupuestado",
                              color: "text-purple-400 bg-purple-500/10 border-purple-500/25",
                            },
                            {
                              code: "RT-8N2K5W9P",
                              device: "HP Pavilion 15",
                              client: "Lucía Fernández",
                              status: "Listo p/ Retirar",
                              color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
                            },
                            {
                              code: "RT-2W8Q4Z7E",
                              device: "iPhone 13 Pro 128GB",
                              client: "Sofía Albornoz",
                              status: "En Reparación",
                              color: "text-sky-400 bg-sky-500/10 border-sky-500/25",
                            },
                          ].map((row) => (
                            <div
                              key={row.code}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-black/35 border border-white/5 text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-primary text-[11px]">
                                    {row.code}
                                  </span>
                                  <span className="font-semibold text-foreground">{row.device}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground block">
                                  Cliente: {row.client}
                                </span>
                              </div>
                              <span
                                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${row.color}`}
                              >
                                {row.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {heroTab === "presupuestos" && (
                      <>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              Orden #RT-TESIS2026 • MacBook Pro M2
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Aprobación digital validada con DNI del titular
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                            Aprobado
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between p-2 rounded bg-black/30 border border-white/5">
                            <span className="text-muted-foreground">
                              Reparación placa lógica PPBUS_AON
                            </span>
                            <span className="font-mono font-bold text-foreground">$85.000</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-black/30 border border-white/5">
                            <span className="text-muted-foreground">
                              Controlador USB-C CD3217 + Lavado ultrasónico
                            </span>
                            <span className="font-mono font-bold text-foreground">$35.000</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <span className="text-[11px] text-muted-foreground">
                              Firmado con DNI 38.123.456
                            </span>
                            <span className="font-outfit text-base font-black text-primary">
                              Total: $120.000
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {heroTab === "inventario" && (
                      <>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              Control de Repuestos e Insumos
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Lectura con escáner de código de barras (100ms)
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold">
                            Alertas Activas
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/35 border border-white/5">
                            <div>
                              <span className="font-semibold text-foreground block">
                                Módulo Display iPhone 13 OLED
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                SKU: MOD-IP13-OR • $115.000
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              6 en stock
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/35 border border-destructive/30">
                            <div>
                              <span className="font-semibold text-foreground block">
                                Módulo Samsung Galaxy A54 5G
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                SKU: MOD-A54-SAM • Mínimo: 4 u.
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-destructive bg-destructive/15 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> 2 u.
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {heroTab === "caja" && (
                      <>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              Punto de Venta & Caja Diaria
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Cobros multimedio y emisión de tickets 80mm
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-mono text-[10px] font-bold">
                            Turno Abierto
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className="p-3 rounded-lg bg-black/35 border border-white/5">
                            <span className="text-[10px] text-muted-foreground block">
                              Efectivo en Caja
                            </span>
                            <span className="font-outfit text-lg font-black text-emerald-400">
                              $123.500
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-black/35 border border-white/5">
                            <span className="text-[10px] text-muted-foreground block">
                              Transferencias / Tarjetas
                            </span>
                            <span className="font-outfit text-lg font-black text-sky-400">
                              $178.000
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Barra de progreso inferior tipo slider */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Sincronización Cloud en tiempo real</span>
                      <span className="font-mono text-primary font-bold">SSL / RLS Activo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Características con Títulos Mejorados y Textos Concisos */}
      <section id="caracteristicas" className="py-20 px-6 bg-background border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
              Todo lo que tu Taller Necesita
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Automatizá la recepción de equipos, eliminá consultas repetitivas y llevá el control exacto de tus finanzas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Feature 1 */}
            <Card className="bg-card/45 border-border/60 hover:border-primary/40 transition-colors duration-200">
              <CardHeader className="space-y-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <QrCode className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground">
                  Seguimiento con QR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Tus clientes escanean el QR de su ticket para ver el estado en vivo y reciben avisos automáticos por email.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card/45 border-border/60 hover:border-primary/40 transition-colors duration-200">
              <CardHeader className="space-y-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Wrench className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground">
                  Presupuestos Online
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Enviá diagnósticos detallados para que el cliente apruebe el costo desde su celular validando su DNI.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card/45 border-border/60 hover:border-primary/40 transition-colors duration-200">
              <CardHeader className="space-y-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Printer className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground">
                  Tickets Térmicos y A4
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Registrá equipos en segundos y emití comprobantes de recepción en 80mm o hoja A4 listos para imprimir.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-card/45 border-border/60 hover:border-primary/40 transition-colors duration-200">
              <CardHeader className="space-y-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground">
                  Stock e Inventario Ágil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Controlá repuestos con lector de código de barras, alertas de bajo stock y exportación directa a Excel.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-card/45 border-border/60 hover:border-primary/40 transition-colors duration-200">
              <CardHeader className="space-y-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground">
                  Caja y Punto de Venta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Registrá ventas de mostrador y cobros de órdenes con múltiples medios de pago y cálculo de vuelto.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-card/45 border-border/60 hover:border-primary/40 transition-colors duration-200">
              <CardHeader className="space-y-3 pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <CardTitle className="font-outfit text-lg font-bold text-foreground">
                  Control Multi-Sucursal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Supervisá todas tus sedes desde una sola cuenta y asigná accesos individuales para cada técnico.
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
                <CardDescription className="text-xs text-muted-foreground font-light">
                  Ideal para técnicos independientes que comienzan.
                </CardDescription>
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
                <Button
                  asChild
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2 rounded-lg cursor-pointer"
                  variant="outline"
                >
                  <a href={registerUrl}>Comenzar gratis</a>
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
                <CardDescription className="text-xs text-muted-foreground font-light">
                  Para talleres medianos con flujo constante de clientes.
                </CardDescription>
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
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-lg cursor-pointer"
                >
                  <a href={registerUrl}>Suscribirse Ahora</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Tier 3: Multi-Sucursal */}
            <Card className="pricing-card w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col justify-between min-h-[480px] overflow-visible bg-card/45 border-border/60 hover:border-border transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="space-y-2">
                <CardTitle className="font-outfit text-xl font-bold text-foreground">Multi-Sucursal</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light">
                  Para redes de talleres o franquicias de soporte técnico.
                </CardDescription>
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
              { label: "Plan Inicial", idx: 0 },
              { label: "Taller Pro", idx: 1 },
              { label: "Multi-Sucursal", idx: 2 },
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
                  Exacto. Cuando cargás el diagnóstico y los ítems del presupuesto, el cliente puede revisar el detalle de repuestos y mano de obra desde su celular y presionar "Aprobar Presupuesto", dejando constancia digital con fecha y hora.
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
                  Toda la información viaja y se almacena de forma cifrada y protegida en la nube. La plataforma cuenta con aislamiento estricto por taller, lo que garantiza que solo vos y tu personal autorizado puedan acceder a los datos de tus clientes, órdenes de servicio, inventario y movimientos de caja.
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

      {/* Sección de Contacto */}
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

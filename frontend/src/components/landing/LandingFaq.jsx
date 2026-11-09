import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function LandingFaq() {
  return (
    <section id="faq" className="py-20 px-6 bg-background border-t border-border/50 relative z-10 scroll-mt-16">
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
          <Accordion type="single" collapsible className="w-full space-y-3.5">
            <AccordionItem
              value="item-1"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Qué necesito para empezar a utilizar RepairIT en mi taller?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                Solo necesitás un navegador web (Chrome, Firefox o Edge) en tu computadora, tablet o celular. No requiere instalar ningún software ni configurar servidores locales. Podés crear tu cuenta y empezar a cargar órdenes en 2 minutos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Cómo reduce RepairIT las llamadas telefónicas de mis clientes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                Al ingresar un equipo, el sistema genera un código único y un comprobante con código QR. Además, envía notificaciones automáticas por correo electrónico al cliente cuando el equipo ingresa, cuando se actualiza el presupuesto y en el momento exacto en que está listo para retirar, permitiéndole consultar los avances desde su celular sin necesidad de llamar al taller.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Pueden mis clientes aprobar o rechazar presupuestos en línea?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                Exacto. Cuando cargás el diagnóstico y los ítems del presupuesto, el cliente puede revisar el detalle de repuestos y mano de obra desde su celular y presionar "Aprobar Presupuesto", dejando constancia digital con fecha, hora y validación por DNI.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Cómo funciona el control de inventario y caja?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                RepairIT descuenta automáticamente del stock los repuestos e insumos utilizados en cada reparación. Además, registra las señas, ventas de mostrador y cobros finales en tu balance de caja diario por sucursal.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Qué tan segura está la información de mi taller y mis clientes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                Toda la información viaja y se almacena de forma cifrada y protegida en la nube. La plataforma cuenta con aislamiento estricto por taller, lo que garantiza que solo vos y tu personal autorizado puedan acceder a los datos de tus clientes, órdenes de servicio, inventario y movimientos de caja.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Puedo administrar múltiples talleres o sucursales desde una sola cuenta?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                Sí. Nuestro plan Multi-Sucursal permite gestionar múltiples sucursales con inventarios, cajas y técnicos independientes, supervisados centralmente desde un panel de administración unificado.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-7"
              className="border border-border/70 bg-card/45 rounded-xl px-5 hover:border-primary/40 hover:bg-card/65 transition-all shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base text-foreground font-bold py-4 hover:no-underline font-outfit text-left">
                ¿Qué rubros de servicio técnico pueden utilizar RepairIT?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm font-light pb-4 leading-relaxed">
                RepairIT está adaptado para talleres de reparación de celulares y smartphones, servicio técnico de notebooks y computadoras, consolas de videojuegos, electrodomésticos, audio, televisión y mecánica general. La gestión de estados y presupuestos es completamente flexible.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

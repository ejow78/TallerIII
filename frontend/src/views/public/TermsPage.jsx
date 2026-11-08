import { Link } from "react-router-dom";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, CheckCircle2, ShieldCheck, Store, Wrench } from "lucide-react";

export default function TermsPage() {
  document.title = "RepairIT - Términos de Servicio";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 flex flex-col justify-center items-center overflow-hidden">
      <GridPattern
        width={36}
        height={36}
        x={-1}
        y={-1}
        className="opacity-25 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-8 animate-fade-in">
        {/* Header con botón volver */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group w-fit"
          >
            <div className="w-7 h-7 rounded-lg bg-card/60 border border-border/60 flex items-center justify-center group-hover:border-primary/50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Volver al Inicio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono border-border/60 text-muted-foreground bg-card/40">
              Versión 2.0 • Noviembre 2026
            </Badge>
          </div>
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl bg-card/45 backdrop-blur-md border border-border/70 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                Acuerdo Operativo & Legal
              </span>
              <h1 className="font-outfit text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Términos de Servicio
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Bienvenido a <strong>RepairIT</strong>. Al crear una cuenta, acceder o utilizar nuestra plataforma de gestión operativa y trazabilidad para talleres de servicio técnico, aceptás cumplir con los siguientes Términos de Servicio.
          </p>

          {/* Quick Pillars Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 text-[11px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Suscripción Flexible</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Store className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Roles & Multisede</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Validez DNI Online</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Garantía de Servicio</span>
            </div>
          </div>
        </div>

        {/* Content Bento Card */}
        <div className="rounded-2xl bg-card/45 backdrop-blur-md border border-border/70 p-6 sm:p-10 shadow-xl space-y-8 text-foreground text-sm leading-relaxed divide-y divide-border/40">
          <div className="space-y-3 pt-2 first:pt-0">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">01.</span>
              Descripción del Servicio
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              RepairIT es una plataforma Software como Servicio (SaaS) diseñada para la administración integral de talleres de reparación técnica. Incluye herramientas para recepción de equipos, emisión de comprobantes A4 con código QR, catálogo de repuestos, módulo de Caja y Punto de Venta (POS), portal público de seguimiento en tiempo real con lector de cámara QR y notificaciones por correo electrónico y WhatsApp.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">02.</span>
              Planes de Suscripción y Alcance Operativo
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              El acceso a las funcionalidades de la plataforma se rige según el plan activo de cada organización:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
              <li>
                <strong className="text-foreground font-semibold">Plan Taller Básico ($7.500 ARS / mes):</strong> Habilita 1 sucursal operativa, hasta 100 órdenes de servicio mensuales, gestión de clientes, inventario de repuestos, comprobantes con código QR y portal público de seguimiento. No incluye módulo de Caja POS ni gráficos de métricas financieras.
              </li>
              <li>
                <strong className="text-foreground font-semibold">Plan Taller Pro:</strong> Incluye órdenes de servicio e inventario ilimitados, módulo de Caja y Punto de Venta (POS), panel de métricas y gráficos de evolución en tiempo real, alertas de bajo stock y exportación de datos para 1 sucursal.
              </li>
              <li>
                <strong className="text-foreground font-semibold">Plan Multi-Taller Pro:</strong> Incorpora todas las prestaciones del Plan Taller Pro más la administración de múltiples sucursales, cambio rápido de sede y creación de cuentas de acceso individuales para técnicos asignados por sucursal.
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">03.</span>
              Cuentas de Acceso y Permisos por Rol
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Los titulares o administradores del taller son responsables de resguardar sus credenciales y de las cuentas creadas para su equipo técnico. Por razones de seguridad operativa, los usuarios con rol <strong>Técnico</strong> operan exclusivamente dentro de su sucursal designada y pueden registrar o actualizar órdenes, clientes e insumos, pero no poseen permisos para eliminar clientes ni artículos del inventario ni modificar la configuración general del taller.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <h2 className="font-outfit text-base sm:text-lg font-bold text-purple-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-mono text-base">04.</span>
                Seguimiento con Código QR, Uso de Cámara y Aprobación de Presupuestos
              </h2>
              <p className="text-xs text-foreground/90 font-light leading-relaxed">
                Cada orden de servicio genera un código alfanumérico único y un código QR impreso en el comprobante de recepción. El cliente final puede consultar el estado de su equipo ingresando el código manualmente o utilizando la cámara de su dispositivo desde el navegador (cuyo procesamiento de imagen se realiza de manera 100% local sin almacenar video). Asimismo, el cliente puede aprobar en línea el presupuesto detallado validando su número de DNI, quedando registrada la constancia digital en el historial de la orden.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">05.</span>
              Delimitación de Responsabilidad sobre Reparaciones y Equipos
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              RepairIT provee exclusivamente la infraestructura tecnológica de software para la gestión administrativa y trazabilidad digital. La ejecución técnica de las reparaciones, el diagnóstico, la garantía de los repuestos utilizados, los cobros efectuados y la custodia física de los equipos entregados por los clientes son de exclusiva responsabilidad comercial y legal del taller prestador del servicio.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">06.</span>
              Propiedad de los Datos y Disponibilidad
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Todos los datos de clientes, órdenes e inventario pertenecen al taller titular de la cuenta. RepairIT mantiene copias de respaldo y estándares de alta disponibilidad en la nube, permitiendo la exportación de la información en formatos abiertos en cualquier momento.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">07.</span>
              Modificaciones y Contacto
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Nos reservamos el derecho de actualizar estos términos para acompañar nuevas funcionalidades o normativas vigentes. Ante cualquier consulta comercial o técnica, podés escribirnos a <code className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">contacto@repairit.cloud</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

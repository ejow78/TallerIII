import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  document.title = "RepairIT - Términos de Servicio";

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider"
        >
          &larr; Volver al Inicio
        </Link>
        <h1 className="font-outfit text-4xl font-black text-foreground tracking-tight leading-none pt-2">
          Términos de Servicio
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Última actualización: 2 de Noviembre de 2026
        </p>
      </div>

      <Separator />

      <article className="prose prose-slate dark:prose-invert text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          Bienvenido a <strong>RepairIT</strong>. Al crear una cuenta, acceder o utilizar nuestra plataforma de gestión operativa y trazabilidad para talleres de servicio técnico, aceptás cumplir con los siguientes Términos de Servicio.
        </p>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            1. Descripción del Servicio
          </h2>
          <p>
            RepairIT es una plataforma Software como Servicio (SaaS) diseñada para la administración integral de talleres de reparación técnica. Incluye herramientas para recepción de equipos, emisión de comprobantes A4 con código QR, catálogo de repuestos, módulo de Caja y Punto de Venta (POS), portal público de seguimiento en tiempo real con lector de cámara QR y notificaciones por correo electrónico y WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            2. Planes de Suscripción y Alcance Operativo
          </h2>
          <p>
            El acceso a las funcionalidades de la plataforma se rige según el plan activo de cada organización:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Plan Taller Básico (Gratuito):</strong> Habilita 1 sucursal operativa, hasta 100 órdenes de servicio mensuales, gestión de clientes, inventario de repuestos, comprobantes con código QR y portal público de seguimiento. No incluye módulo de Caja POS ni gráficos de métricas financieras.
            </li>
            <li>
              <strong>Plan Taller Pro:</strong> Incluye órdenes de servicio e inventario ilimitados, módulo de Caja y Punto de Venta (POS), panel de métricas y gráficos de evolución en tiempo real, alertas de bajo stock y exportación de datos para 1 sucursal.
            </li>
            <li>
              <strong>Plan Multi-Taller Pro:</strong> Incorpora todas las prestaciones del Plan Taller Pro más la administración de múltiples sucursales, cambio rápido de sede y creación de cuentas de acceso individuales para técnicos asignados por sucursal.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            3. Cuentas de Acceso y Permisos por Rol
          </h2>
          <p>
            Los titulares o administradores del taller son responsables de resguardar sus credenciales y de las cuentas creadas para su equipo técnico. Por razones de seguridad operativa, los usuarios con rol <strong>Técnico</strong> operan exclusivamente dentro de su sucursal designada y pueden registrar o actualizar órdenes, clientes e insumos, pero no poseen permisos para eliminar clientes ni artículos del inventario ni modificar la configuración general del taller.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            4. Seguimiento con Código QR, Uso de Cámara y Aprobación de Presupuestos
          </h2>
          <p>
            Cada orden de servicio genera un código alfanumérico único y un código QR impreso en el comprobante de recepción. El cliente final puede consultar el estado de su equipo ingresando el código manualmente o utilizando la cámara de su dispositivo desde el navegador (cuyo procesamiento de imagen se realiza de manera 100% local sin almacenar video). Asimismo, el cliente puede aprobar en línea el presupuesto detallado validando su número de DNI, quedando registrada la constancia digital en el historial de la orden.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            5. Delimitación de Responsabilidad sobre Reparaciones y Equipos
          </h2>
          <p>
            RepairIT provee exclusivamente la infraestructura tecnológica de software para la gestión administrativa y trazabilidad digital. La ejecución técnica de las reparaciones, el diagnóstico, la garantía de los repuestos utilizados, los cobros efectuados y la custodia física de los equipos entregados por los clientes son de exclusiva responsabilidad comercial y legal del taller prestador del servicio.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            6. Propiedad de los Datos y Disponibilidad
          </h2>
          <p>
            Todos los datos de clientes, órdenes e inventario pertenecen al taller titular de la cuenta. RepairIT mantiene copias de respaldo y estándares de alta disponibilidad en la nube, permitiendo la exportación de la información en formatos abiertos en cualquier momento.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            7. Modificaciones y Contacto
          </h2>
          <p>
            Nos reservamos el derecho de actualizar estos términos para acompañar nuevas funcionalidades o normativas vigentes. Ante cualquier consulta comercial o técnica, podés escribirnos a <code>contacto@repairit.cloud</code>.
          </p>
        </div>
      </article>
    </div>
  );
}

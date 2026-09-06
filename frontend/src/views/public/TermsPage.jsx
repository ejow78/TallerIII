import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  document.title = "RepairIT - Términos de Servicio";

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider">
          &larr; Volver al Inicio
        </Link>
        <h1 className="font-outfit text-4xl font-black text-foreground tracking-tight leading-none pt-2">
          Términos de Servicio
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Última actualización: 6 de Septiembre de 2026
        </p>
      </div>

      <Separator />

      <article className="prose prose-slate dark:prose-invert text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          Bienvenido a <strong>RepairIT</strong>. Al acceder o utilizar nuestra plataforma de gestión operativa y trazabilidad para talleres de servicio técnico, aceptas cumplir con los siguientes Términos de Servicio.
        </p>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            1. Descripción del Servicio
          </h2>
          <p>
            RepairIT es una plataforma Software como Servicio (SaaS) orientada a la administración de talleres de reparación técnica. Incluye herramientas para el registro de órdenes de trabajo, emisión de comprobantes con código QR, catálogo de repuestos, registro de ventas en mostrador, portal de seguimiento online para clientes y notificaciones automáticas por correo electrónico.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            2. Cuentas de Acceso y Responsabilidad Operativa
          </h2>
          <p>
            Los talleres registrados son responsables de mantener la confidencialidad de sus credenciales y de administrar adecuadamente los roles de sus colaboradores (administradores, técnicos y recepcionistas). Cada taller es responsable de la veracidad de los diagnósticos, costos de repuestos y estados técnicos cargados en la plataforma.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            3. Seguimiento Online y Aprobación Digital de Presupuestos
          </h2>
          <p>
            El sistema genera un código único de seguimiento y un comprobante con código QR para cada equipo ingresado. La plataforma habilita al cliente final a consultar el avance técnico y prestar su aprobación digital al presupuesto presentado por el taller, quedando registrada la constancia electrónica de dicha conformidad.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            4. Notificaciones Automáticas por Correo Electrónico
          </h2>
          <p>
            RepairIT provee un canal de comunicación automatizado que notifica al cliente cuando su equipo ingresa, cuando se emite un presupuesto y cuando el dispositivo se encuentra listo para su retiro. Estas notificaciones tienen carácter informativo para facilitar la interacción entre el taller y su cliente.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            5. Delimitación de Responsabilidad y Custodia de Equipos
          </h2>
          <p>
            RepairIT provee exclusivamente la infraestructura de software para la gestión y seguimiento digital. La ejecución material de las reparaciones, la calidad y garantía de los repuestos instalados, así como la custodia física de los dispositivos en el establecimiento comercial, son de exclusiva responsabilidad entre el taller prestador y sus respectivos clientes.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            6. Propiedad de los Datos y Exportación
          </h2>
          <p>
            La información operativa, cartera de clientes y registros de inventario ingresados por cada taller son de su exclusiva propiedad. RepairIT no comercializa estos datos y provee herramientas nativas para la exportación de reportes en formato estándar (.xlsx) y comprobantes imprimibles en cualquier momento.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            7. Modificaciones y Contacto
          </h2>
          <p>
            Nos reservamos el derecho de actualizar estos términos para reflejar mejoras operativas o normativas. Para cualquier duda legal o de servicio, podés contactarnos a través de <code>contacto@repairit.cloud</code>.
          </p>
        </div>
      </article>
    </div>
  );
}

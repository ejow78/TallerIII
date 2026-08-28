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
          Última actualización: 28 de Agosto de 2026
        </p>
      </div>

      <Separator />

      <article className="prose prose-slate dark:prose-invert text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          Bienvenido a <strong>RepairIT</strong>. Al acceder o utilizar nuestra plataforma de gestión de talleres y trazabilidad de ordenes de servicio técnico, aceptas cumplir con los siguientes Términos de Servicio.
        </p>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            1. Descripción del Servicio
          </h2>
          <p>
            RepairIT es una plataforma Software como Servicio (SaaS) diseñada para la administración integral de talleres de reparación técnica. Permite el control de órdenes de servicio, presupuestos, inventario de repuestos, arqueos de caja y consulta de seguimiento online para clientes finales.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            2. Cuentas de Usuario y Seguridad
          </h2>
          <p>
            Los talleres registrados son responsables de mantener la confidencialidad de sus credenciales de acceso. Cada usuario es responsable de todas las actividades operativas, cargas de presupuesto y cambios de estado ejecutados bajo su cuenta.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            3. Uso del Sistema de Seguimiento Online
          </h2>
          <p>
            El código único de seguimiento generado por el sistema (ej. <code>RT-8K9M2P4X</code>) permite a los clientes consultar el avance técnico de su dispositivo. Los talleres se comprometen a cargar diagnósticos y presupuestos veraces en el sistema.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            4. Disponibilidad y Propiedad Intelectual
          </h2>
          <p>
            RepairIT realiza esfuerzos continuos para garantizar una disponibilidad del 99.9% del servicio. El diseño, código fuente, marca y logotipos de RepairIT son propiedad exclusiva de la plataforma.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            5. Modificaciones de los Términos
          </h2>
          <p>
            Nos reservamos el derecho de actualizar estos Términos de Servicio en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente tras su publicación en <code>https://repairit.cloud/terminos</code>.
          </p>
        </div>
      </article>
    </div>
  );
}

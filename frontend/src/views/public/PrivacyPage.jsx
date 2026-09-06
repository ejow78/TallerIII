import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  document.title = "RepairIT - Políticas de Privacidad";

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider">
          &larr; Volver al Inicio
        </Link>
        <h1 className="font-outfit text-4xl font-black text-foreground tracking-tight leading-none pt-2">
          Políticas de Privacidad
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Última actualización: 6 de Septiembre de 2026
        </p>
      </div>

      <Separator />

      <article className="prose prose-slate dark:prose-invert text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          En <strong>RepairIT</strong> priorizamos la privacidad, confidencialidad y protección de los datos de nuestros usuarios, talleres asociados y sus clientes finales. Esta política describe de forma transparente la información que se gestiona en la plataforma, su finalidad y las medidas de protección implementadas.
        </p>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            1. Información que se Gestiona en la Plataforma
          </h2>
          <p>
            Para brindar el servicio integral de gestión de talleres y seguimiento de reparaciones, la plataforma procesa:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Datos de Talleres y Cuentas de Acceso:</strong> Nombre o razón social, correo electrónico, teléfono de contacto y configuración de sucursales y personal técnico.</li>
            <li><strong>Datos de Clientes del Taller:</strong> Nombre, DNI/Identificación, teléfono y correo electrónico ingresados por el taller al momento de recepcionar un equipo.</li>
            <li><strong>Información Técnica de Reparación:</strong> Tipo de equipo, marca, modelo, accesorios recibidos, fallas declaradas, diagnósticos técnicos y presupuestos.</li>
            <li><strong>Registros Operativos:</strong> Ventas de mostrador, insumos y catálogo de repuestos ingresados por el taller.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            2. Finalidad del Uso de la Información
          </h2>
          <p>
            La información cargada en el sistema se utiliza exclusivamente con fines operativos y de servicio:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permitir a los clientes consultar en tiempo real el avance de su reparación mediante código único o escaneo de código QR.</li>
            <li>Enviar notificaciones automáticas por correo electrónico al cliente cuando su equipo ingresa, cuando se genera un presupuesto o cuando el dispositivo está listo para ser retirado.</li>
            <li>Facilitar a los talleres el registro organizado de sus servicios técnicos, stock de repuestos y comprobantes de recepción.</li>
            <li>Autenticación y control de accesos seguro para administradores y técnicos.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            3. Propiedad y No Comercialización de Datos
          </h2>
          <p>
            <strong>RepairIT no vende, no alquila ni comparte bajo ningún concepto la base de datos de clientes o talleres con terceros, empresas de publicidad o intermediarios.</strong> La información de clientes cargada por cada taller es de propiedad exclusiva del titular de la cuenta y se utiliza únicamente para el funcionamiento del servicio contratado.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            4. Seguridad y Aislamiento de la Información
          </h2>
          <p>
            Toda la información viaja y se almacena de forma cifrada y segura en la nube. La plataforma implementa un estricto esquema de aislamiento de datos por taller, lo que garantiza que ninguna cuenta pueda visualizar, consultar o modificar datos pertenecientes a otro taller o sucursal.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            5. Portabilidad y Exportación de Datos
          </h2>
          <p>
            Reconocemos el derecho de cada taller a disponer de su propia información. Los administradores pueden exportar en cualquier momento sus listados de órdenes, cartera de clientes e inventario de insumos a archivos de hoja de cálculo estándar (.xlsx) y comprobantes imprimibles.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            6. Sesiones y Almacenamiento Local
          </h2>
          <p>
            Para garantizar la seguridad en computadoras y terminales compartidas de taller, los tokens de acceso del personal se gestionan de forma segura y se destruyen al cerrar la sesión o cerrar el navegador, impidiendo accesos no autorizados.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            7. Contacto y Consultas de Privacidad
          </h2>
          <p>
            Para consultas relacionadas con la privacidad, actualización o baja de cuentas, podés comunicarte directamente con nuestro equipo a través de <code>contacto@repairit.cloud</code>.
          </p>
        </div>
      </article>
    </div>
  );
}

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
          Última actualización: 28 de Agosto de 2026
        </p>
      </div>

      <Separator />

      <article className="prose prose-slate dark:prose-invert text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          En <strong>RepairIT</strong> nos tomamos muy en serio la privacidad y la protección de los datos de nuestros usuarios, talleres adheridos y clientes finales. Esta política describe la información que recopilamos, cómo la utilizamos y las medidas de seguridad aplicadas.
        </p>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            1. Información que Recopilamos
          </h2>
          <p>
            Para brindar el servicio de trazabilidad y gestión de talleres técnicos, recopilamos los siguientes datos:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Datos de Talleres y Usuarios Administradores:</strong> Nombre completo, correo electrónico, teléfono de contacto y razón social o nombre comercial del taller.</li>
            <li><strong>Datos de Clientes del Taller:</strong> Nombre completo, DNI/Identificación, teléfono y correo electrónico ingresados al registrar una orden de servicio.</li>
            <li><strong>Información Técnica de Dispositivos:</strong> Tipo de equipo, marca, modelo, accesorios recibidos, estado cosmético, falla reportada y diagnósticos del taller técnico.</li>
            <li><strong>Datos Operativos y de Caja:</strong> Registros de presupuestos, ventas, movimientos de caja e inventario de insumos técnicos.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            2. Uso de la Información
          </h2>
          <p>
            La información recopilada se utiliza exclusivamente para los siguientes fines:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permitir a los clientes consultar el estado de reparación de sus dispositivos en tiempo real mediante su código único de seguimiento.</li>
            <li>Facilitar a los talleres la gestión operativa de sus órdenes de servicio, control de inventario y caja.</li>
            <li>Gestionar la autenticación de usuarios y la seguridad del sistema mediante Supabase Auth.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            3. Seguridad y Aislamiento de Datos (Multi-Tenant)
          </h2>
          <p>
            RepairIT utiliza arquitectura <strong>PostgreSQL con Row Level Security (RLS)</strong>. Esto garantiza que la información de cada taller esté completamente aislada a nivel de base de datos, impidiendo que usuarios de otros talleres accedan a datos ajenos. Las transmisiones de datos están cifradas mediante protocolos HTTPS/TLS.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            4. Cookies y Almacenamiento Local
          </h2>
          <p>
            Utilizamos <code>sessionStorage</code> del navegador para mantener la sesión de usuario activa únicamente mientras la ventana permanezca abierta. Al cerrar el navegador, los tokens de autenticación se destruyen automáticamente por seguridad.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            5. Derechos del Usuario y Contacto
          </h2>
          <p>
            Los usuarios pueden solicitar el acceso, corrección o eliminación de sus datos personales poniéndose en contacto con el administrador del servicio a través de <code>contacto@repairit.cloud</code>.
          </p>
        </div>
      </article>
    </div>
  );
}

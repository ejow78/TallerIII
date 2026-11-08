import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GridPattern } from "@/components/ui/grid-pattern";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "RepairIT - Políticas de Privacidad";
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 flex flex-col justify-center items-center overflow-hidden">
      <GridPattern
        width={36}
        height={36}
        x={-1}
        y={-1}
        className="opacity-25 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-6 animate-fade-in">
        {/* Header con botón volver */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group w-fit"
          >
            <div className="w-7 h-7 rounded-lg bg-card/60 border border-border/60 flex items-center justify-center group-hover:border-primary/50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl bg-card/45 backdrop-blur-md border border-border/70 p-6 sm:p-10 shadow-xl space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-1">
            <h1 className="font-outfit text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Políticas de Privacidad
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Última actualización: Noviembre de 2026
            </p>
          </div>

          <p>
            En <strong>RepairIT</strong> priorizamos la privacidad, confidencialidad y protección de los datos de nuestros usuarios, talleres asociados y sus clientes finales. Esta política describe de forma transparente la información que se gestiona en la plataforma, el uso de permisos del dispositivo y las medidas de seguridad implementadas.
          </p>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              1. Información que se Gestiona en la Plataforma
            </h2>
            <p>
              Para brindar el servicio integral de gestión de talleres y trazabilidad de reparaciones, la plataforma procesa:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Datos de Talleres y Cuentas de Acceso:</strong> Nombre comercial, correo electrónico, teléfono de contacto, dirección de sucursales y cuentas de personal técnico asignado.
              </li>
              <li>
                <strong className="text-foreground">Datos de Clientes del Taller:</strong> Nombre completo, DNI/Identificación, teléfono y correo electrónico registrados por el taller al recepcionar un equipo.
              </li>
              <li>
                <strong className="text-foreground">Información Técnica de Reparación:</strong> Tipo de dispositivo, marca, modelo, estado estético, accesorios recibidos, fallas declaradas, diagnósticos técnicos, historial de estados y presupuestos.
              </li>
              <li>
                <strong className="text-foreground">Registros Operativos y Comerciales:</strong> Catálogo de repuestos, control de stock e historial de cobros y ventas de mostrador (POS).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              2. Finalidad del Uso de la Información
            </h2>
            <p>
              La información cargada en el sistema se utiliza exclusivamente con fines operativos y de prestación del servicio:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Permitir a los clientes consultar en tiempo real el progreso de su reparación mediante su código único de orden o escaneo de código QR.
              </li>
              <li>
                Habilitar la aprobación digital de presupuestos en línea validando la identidad del titular mediante su número de DNI.
              </li>
              <li>
                Enviar notificaciones automáticas por correo electrónico y facilitar avisos directos por WhatsApp cuando un equipo ingresa, cuando se emite un presupuesto o cuando está listo para retirar.
              </li>
              <li>
                Brindar a los talleres control sobre sus órdenes de servicio, stock de insumos, caja diaria y métricas de rendimiento según su plan contratado.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              3. Uso de la Cámara para Escaneo de Código QR
            </h2>
            <p>
              En el portal público de consulta de seguimiento (<code>/consulta</code>), el usuario puede optar por utilizar la función <strong>Escanear QR con Cámara</strong> para leer el código impreso en su comprobante de ingreso.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Acceso bajo consentimiento:</strong> La cámara del dispositivo solo se activa cuando el usuario presiona voluntariamente el botón de escaneo y otorga el permiso en su navegador.
              </li>
              <li>
                <strong className="text-foreground">Procesamiento 100% local:</strong> La lectura del código QR se realiza íntegramente en la memoria local del navegador del usuario. <strong>RepairIT no graba, no almacena, no captura fotografías ni transmite imágenes o flujo de video de la cámara a ningún servidor propio ni de terceros.</strong>
              </li>
              <li>
                <strong className="text-foreground">Cierre inmediato:</strong> Una vez detectado el código de la orden o cerrado el lector, la transmisión de la cámara se detiene y libera de forma automática.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              4. Propiedad y No Comercialización de Datos
            </h2>
            <p>
              <strong>RepairIT no vende, no alquila ni comparte bajo ningún concepto la base de datos de clientes o talleres con terceros, anunciantes ni intermediarios.</strong> La información operativa cargada por cada taller es de propiedad exclusiva del titular de la cuenta.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              5. Seguridad, Aislamiento por Sucursal y Roles
            </h2>
            <p>
              Toda la información se transmite mediante conexiones cifradas (HTTPS/TLS) y se resguarda con políticas de seguridad a nivel de fila (Row Level Security). La plataforma garantiza un estricto aislamiento multisede: cada taller únicamente puede acceder a su propia información, y las cuentas de rol técnico quedan restringidas exclusivamente a la sucursal que les fue asignada sin permisos de eliminación de clientes ni catálogo.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              6. Portabilidad y Exportación de Datos
            </h2>
            <p>
              Los administradores del taller pueden exportar en cualquier momento sus órdenes de servicio, cartera de clientes e inventario de repuestos en formatos estándar compatibles con hojas de cálculo (.csv / Excel), así como emitir comprobantes A4 imprimibles.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground">
              7. Contacto y Consultas de Privacidad
            </h2>
            <p>
              Para consultas relacionadas con la privacidad, ejercicio de derechos de acceso, rectificación o baja de cuentas, podés comunicarte directamente con nuestro equipo a través de <code>contacto@repairit.cloud</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck, Lock, Camera, Server, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  document.title = "RepairIT - Políticas de Privacidad";

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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                Transparencia & Seguridad
              </span>
              <h1 className="font-outfit text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Políticas de Privacidad
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            En <strong>RepairIT</strong> priorizamos la privacidad, confidencialidad y protección de los datos de nuestros usuarios, talleres asociados y sus clientes finales. Esta política describe de forma transparente la información que se gestiona en la plataforma, el uso de permisos del dispositivo y las medidas de seguridad implementadas.
          </p>

          {/* Quick Pillars Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 text-[11px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cero Venta de Datos</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Camera className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Cámara QR 100% Local</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Server className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Aislamiento Multisede</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Cifrado SSL / TLS</span>
            </div>
          </div>
        </div>

        {/* Content Bento Card */}
        <div className="rounded-2xl bg-card/45 backdrop-blur-md border border-border/70 p-6 sm:p-10 shadow-xl space-y-8 text-foreground text-sm leading-relaxed divide-y divide-border/40">
          <div className="space-y-3 pt-2 first:pt-0">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">01.</span>
              Información que se Gestiona en la Plataforma
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light">
              Para brindar el servicio integral de gestión de talleres y trazabilidad de reparaciones, la plataforma procesa:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground font-light">
              <li>
                <strong className="text-foreground font-medium">Datos de Talleres y Cuentas de Acceso:</strong> Nombre comercial, correo electrónico, teléfono de contacto, dirección de sucursales y cuentas de personal técnico asignado.
              </li>
              <li>
                <strong className="text-foreground font-medium">Datos de Clientes del Taller:</strong> Nombre completo, DNI/Identificación, teléfono y correo electrónico registrados por el taller al recepcionar un equipo.
              </li>
              <li>
                <strong className="text-foreground font-medium">Información Técnica de Reparación:</strong> Tipo de dispositivo, marca, modelo, estado estético, accesorios recibidos, fallas declaradas, diagnósticos técnicos, historial de estados y presupuestos.
              </li>
              <li>
                <strong className="text-foreground font-medium">Registros Operativos y Comerciales:</strong> Catálogo de repuestos, control de stock e historial de cobros y ventas de mostrador (POS).
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">02.</span>
              Finalidad del Uso de la Información
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light">
              La información cargada en el sistema se utiliza exclusivamente con fines operativos y de prestación del servicio:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground font-light">
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

          <div className="space-y-3 pt-6">
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-2">
              <h2 className="font-outfit text-base sm:text-lg font-bold text-sky-400 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="font-mono text-base">03.</span>
                Uso de la Cámara para Escaneo de Código QR
              </h2>
              <p className="text-xs text-foreground/90 font-light leading-relaxed">
                En el portal público de consulta de seguimiento (<code className="font-mono text-sky-300">/consulta</code>), el usuario puede optar por utilizar la función <strong>Escanear QR con Cámara</strong> para leer el código impreso en su comprobante de ingreso.
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground font-light">
              <li>
                <strong className="text-foreground font-medium">Acceso bajo consentimiento:</strong> La cámara del dispositivo solo se activa cuando el usuario presiona voluntariamente el botón de escaneo y otorga el permiso en su navegador.
              </li>
              <li>
                <strong className="text-foreground font-medium">Procesamiento 100% local:</strong> La lectura del código QR se realiza íntegramente en la memoria local del navegador del usuario. <strong>RepairIT no graba, no almacena, no captura fotografías ni transmite imágenes o flujo de video de la cámara a ningún servidor propio ni de terceros.</strong>
              </li>
              <li>
                <strong className="text-foreground font-medium">Cierre inmediato:</strong> Una vez detectado el código de la orden o cerrado el lector, la transmisión de la cámara se detiene y libera de forma automática.
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">04.</span>
              Propiedad y No Comercialización de Datos
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              <strong className="text-foreground">RepairIT no vende, no alquila ni comparte bajo ningún concepto la base de datos de clientes o talleres con terceros, anunciantes ni intermediarios.</strong> La información operativa cargada por cada taller es de propiedad exclusiva del titular de la cuenta.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">05.</span>
              Seguridad, Aislamiento por Sucursal y Roles
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Toda la información se transmite mediante conexiones cifradas (HTTPS/TLS) y se resguarda con políticas de seguridad a nivel de fila (Row Level Security). La plataforma garantiza un estricto aislamiento multisede: cada taller únicamente puede acceder a su propia información, y las cuentas de rol técnico quedan restringidas exclusivamente a la sucursal que les fue asignada sin permisos de eliminación de clientes ni catálogo.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">06.</span>
              Portabilidad y Exportación de Datos
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Los administradores del taller pueden exportar en cualquier momento sus órdenes de servicio, cartera de clientes e inventario de repuestos en formatos estándar compatibles con hojas de cálculo (.csv / Excel), así como emitir comprobantes A4 imprimibles.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-primary text-base">07.</span>
              Contacto y Consultas de Privacidad
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Para consultas relacionadas con la privacidad, ejercicio de derechos de acceso, rectificación o baja de cuentas, podés comunicarte directamente con nuestro equipo a través de <code className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">contacto@repairit.cloud</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

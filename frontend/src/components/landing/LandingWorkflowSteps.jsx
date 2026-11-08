import { QrCode, Smartphone, Receipt } from "lucide-react";

export function LandingWorkflowSteps() {
  return (
    <section className="py-20 px-6 bg-card/15 border-t border-border/50 relative z-10">
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 block">
            Flujo de Trabajo
          </span>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Del ingreso a la entrega en 3 simples pasos
          </h2>
          <p className="text-muted-foreground text-sm font-light leading-relaxed">
            Diseñado para eliminar pasos manuales, reducir llamadas repetitivas y dar claridad total en cada orden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Paso 1 */}
          <div className="relative rounded-2xl bg-card/40 border border-border/70 p-6 sm:p-7 space-y-4 hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                Paso 01
              </span>
              <QrCode className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-outfit text-lg font-bold text-foreground">
              Recepción & Comprobante QR
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Registrás el equipo en 30 segundos con su estado cosmético y accesorios. El sistema genera un link de seguimiento único y comprobante con código QR para que el cliente pueda ver el seguimiento en vivo.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="relative rounded-2xl bg-card/40 border border-border/70 p-6 sm:p-7 space-y-4 hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                Paso 02
              </span>
              <Smartphone className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-outfit text-lg font-bold text-foreground">
              Diagnóstico & Aprobación Web
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Cargás el presupuesto desglosado. El cliente recibe el aviso por WhatsApp o email y aprueba el monto ingresando su DNI en el portal de seguimiento antes de comenzar la reparación.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="relative rounded-2xl bg-card/40 border border-border/70 p-6 sm:p-7 space-y-4 hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Paso 03
              </span>
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-outfit text-lg font-bold text-foreground">
              Entrega, Cobro y Garantía
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Al finalizar, marcás la orden lista para retirar, emitís el comprobante de entrega en papel o digital y registrás el cobro en caja con garantía asociada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

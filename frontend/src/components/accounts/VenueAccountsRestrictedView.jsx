import { Card } from "@/components/ui/card";
import { KeyRound, Shield } from "lucide-react";

export function VenueAccountsRestrictedView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h2 className="font-outfit text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-primary shrink-0" />
          <span>Cuentas de Acceso de Sucursal</span>
        </h2>
        <p className="text-xs text-muted-foreground font-light">
          Administración de cuentas para las PCs de cada una de sus sedes.
        </p>
      </div>

      <Card className="bg-card/25 border-border border-dashed p-6 sm:p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Shield className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="font-outfit text-lg font-bold text-foreground">
            Función Exclusiva de Multi-Taller Pro
          </h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            La creación de usuarios de acceso independientes para las computadoras de cada sucursal requiere una licencia activa del plan{" "}
            <span className="text-primary font-bold">Multi-Taller Pro</span>.
          </p>
          <p className="text-xs text-muted-foreground font-light">
            Mejore su plan en la pestaña de perfil para habilitar esta funcionalidad.
          </p>
        </div>
      </Card>
    </div>
  );
}

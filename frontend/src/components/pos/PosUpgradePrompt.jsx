import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function PosUpgradePrompt() {
  return (
    <div className="flex h-[70vh] items-center justify-center p-4">
      <Card className="bg-card/40 border-border/80 max-w-md w-full p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            Control de Caja no incluido en Taller Básico
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            El módulo de Caja y Punto de Venta (POS) está disponible a partir del plan{" "}
            <span className="text-primary font-semibold">Taller Pro</span> y{" "}
            <span className="text-primary font-semibold">Multi-Taller Pro</span>.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/dashboard/perfil">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-6 h-10 rounded-xl cursor-pointer">
              Ver Planes en Configuración
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

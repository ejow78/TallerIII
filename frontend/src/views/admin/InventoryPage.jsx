import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { toast } from "sonner";

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
          Inventario de Insumos
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Control de stock y alertas de reposición de componentes técnicos.
        </p>
      </div>

      <Card className="bg-card/25 border-border shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-foreground/90 font-bold text-sm">Módulo de Inventario en Desarrollo</p>
            <p className="max-w-md mx-auto text-xs text-muted-foreground leading-relaxed font-light">
              En la siguiente iteración de la Fase I implementaremos el control cuantitativo de insumos, auditoría automática de repuestos y la simulación de alerta de bajo suministro.
            </p>
          </div>
          <Button variant="outline" className="text-xs font-bold border-border" onClick={() => toast.info("Módulo en desarrollo.")}>
            Simular Escaneo de Stock
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

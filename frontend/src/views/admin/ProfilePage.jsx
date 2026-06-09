import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Store, 
  Save, 
  CheckCircle
} from "lucide-react";

export default function ProfilePage() {
  const [venueName, setVenueName] = useState("RepairIT Tucumán Centro");
  const [address, setAddress] = useState("San Martín 650, San Miguel de Tucumán");
  const [phone, setPhone] = useState("+54 381 4223344");
  const [email, setEmail] = useState("tucuman@repairit.cloud");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("¡Configuración del Taller Guardada!", {
      description: `Los datos de la sucursal "${venueName}" han sido actualizados con éxito.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Store className="w-8 h-8 text-primary" />
          Perfil de Taller (Venue)
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Gestión del perfil del local y estado de la suscripción de la sucursal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda (2/3): Datos principales del taller */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Datos de la Sucursal */}
          <Card className="bg-card/40 border-border p-6 shadow-xl backdrop-blur-sm">
            <CardHeader className="p-0 pb-5 border-b border-border/50">
              <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2 border-0 pb-0">
                Datos del Establecimiento
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Información de contacto que se mostrará en los recibos y el seguimiento del cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-name" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Nombre del Taller</Label>
                    <Input 
                      id="venue-name"
                      type="text" 
                      required 
                      value={venueName} 
                      onChange={(e) => setVenueName(e.target.value)} 
                      placeholder="RepairIT Tucumán Centro"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-email" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email de Contacto</Label>
                    <Input 
                      id="venue-email"
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="tucuman@repairit.cloud"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-phone" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Teléfono Comercial</Label>
                    <Input 
                      id="venue-phone"
                      type="text" 
                      required 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="+54 381 4223344"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-address" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Dirección Física</Label>
                    <Input 
                      id="venue-address"
                      type="text" 
                      required 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="San Martín 650, San Miguel de Tucumán"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-6 rounded-md transition-all cursor-pointer flex items-center gap-2 select-none"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>

        {/* Columna Derecha (1/3): Suscripción */}
        <div className="space-y-6">
          
          {/* Card 2: Suscripción */}
          <Card className="bg-card/25 border-border p-6 shadow-sm space-y-4">
            <h3 className="font-outfit text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              Suscripción
            </h3>
            
            <div className="space-y-3.5 text-xs font-light">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan Licenciado</span>
                <Badge className="bg-primary hover:bg-primary text-primary-foreground text-[10px] font-extrabold uppercase">Multi-Taller Pro</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                <span className="text-muted-foreground">Vencimiento</span>
                <span className="text-foreground font-mono font-medium">31/12/2026</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                <span className="text-muted-foreground">Estado del Pago</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 fill-emerald-400/10" />
                  Al Día
                </span>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}

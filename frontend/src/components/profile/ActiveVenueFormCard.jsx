import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function ActiveVenueFormCard({
  venueName,
  setVenueName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  hours,
  setHours,
  onSubmit,
}) {
  return (
    <Card className="bg-card/40 border-border p-6 shadow-xl backdrop-blur-sm">
      <CardHeader className="p-0 pb-5 border-b border-border/50">
        <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2 border-0 pb-0">
          Datos del Establecimiento Activo
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Información de contacto que se mostrará en los recibos y el seguimiento del cliente.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="venue-name"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Nombre del Taller
              </Label>
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
              <Label
                htmlFor="venue-email"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Email de Contacto
              </Label>
              <Input
                id="venue-email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
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
              <Label
                htmlFor="venue-phone"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Teléfono Comercial
              </Label>
              <Input
                id="venue-phone"
                type="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 381 4223344"
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="venue-address"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Dirección Física
              </Label>
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

          <div className="space-y-1.5">
            <Label
              htmlFor="venue-hours"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Horarios de Atención
            </Label>
            <Input
              id="venue-hours"
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Ej. Lunes a Viernes de 9:00 a 18:00 hs • Sábados de 9:00 a 13:00 hs"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
            <p className="text-[11px] text-muted-foreground font-light">
              Estos horarios se mostrarán a tus clientes en el portal de seguimiento online y en los comprobantes.
            </p>
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
  );
}

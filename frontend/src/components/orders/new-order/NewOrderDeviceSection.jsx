import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Smartphone, PlusCircle } from "lucide-react";

export function NewOrderDeviceSection({
  deviceType,
  setDeviceType,
  deviceModel,
  setDeviceModel,
  accessories,
  setAccessories,
  cosmeticCondition,
  setCosmeticCondition,
  issue,
  setIssue,
  acceptTerms,
  setAcceptTerms,
  autoPrint,
  setAutoPrint,
  submitting,
  isBasicCupoExceeded,
}) {
  return (
    <Card className="lg:col-span-7 bg-card/40 border-border/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="border-b border-border/50 pb-3">
        <CardTitle className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-primary" />
          2. Especificaciones del Equipo y Falla
        </CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          Detallá el modelo recibido, estado estético, accesorios y motivo de ingreso.
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label
            htmlFor="device-type"
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
          >
            Tipo de Dispositivo
          </Label>
          <select
            id="device-type"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="w-full h-9 bg-background/85 border border-border rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Smartphone">Smartphone</option>
            <option value="Notebook">Notebook</option>
            <option value="Tablet">Tablet</option>
            <option value="PC Escritorio">PC Escritorio</option>
            <option value="Consola">Consola</option>
            <option value="Monitor">Monitor</option>
            <option value="Otro">Otro Dispositivo</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="device-model"
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
          >
            Marca y Modelo Exacto
          </Label>
          <Input
            id="device-model"
            type="text"
            required
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            placeholder="Ej. iPhone 14 Pro, Samsung S23, Lenovo Legion..."
            className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label
            htmlFor="accessories"
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
          >
            Accesorios Entregados
          </Label>
          <Input
            id="accessories"
            type="text"
            value={accessories}
            onChange={(e) => setAccessories(e.target.value)}
            placeholder="Ej. Cargador, funda (opcional)"
            className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="cosmetic"
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
          >
            Estado Cosmético de Recepción
          </Label>
          <Input
            id="cosmetic"
            type="text"
            value={cosmeticCondition}
            onChange={(e) => setCosmeticCondition(e.target.value)}
            placeholder="Ej. Rayón leve en tapa, pantalla impecable"
            className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="device-issue"
          className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
        >
          Falla Reportada / Trabajo Solicitado
        </Label>
        <Textarea
          id="device-issue"
          rows={3}
          required
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Describí con precisión la falla informada por el cliente al dejar el equipo..."
          className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs resize-none rounded-lg"
        />
      </div>

      {/* Opciones de confirmación e impresión */}
      <div className="space-y-2.5 pt-2 border-t border-border/50">
        <div className="flex items-start space-x-2.5 bg-background/50 p-3 rounded-lg border border-border/60">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="terms"
            className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer select-none"
          >
            El cliente acepta las condiciones de revisión técnica y deja constancia del estado
            cosmético declarado.
          </Label>
        </div>

        <div className="hidden sm:flex items-start space-x-2.5 bg-background/50 p-3 rounded-lg border border-border/60">
          <Checkbox
            id="auto-print"
            checked={autoPrint}
            onCheckedChange={(checked) => setAutoPrint(checked === true)}
            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="auto-print"
            className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer select-none"
          >
            Abrir ventana para imprimir el comprobante
          </Label>
        </div>
      </div>

      <div className="pt-1 flex flex-col sm:flex-row justify-end gap-2.5">
        <Button
          type="submit"
          disabled={submitting || isBasicCupoExceeded}
          className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 px-6 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/15 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {submitting ? "Registrando Ingreso..." : "Registrar Orden de Servicio"}
        </Button>
      </div>
    </Card>
  );
}

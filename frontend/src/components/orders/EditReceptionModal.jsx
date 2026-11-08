import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, X, Save } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function EditReceptionModal({ order, onClose, onSuccess }) {
  const [deviceType, setDeviceType] = useState(() => order?.deviceType || "Celular");
  const [deviceModel, setDeviceModel] = useState(() => order?.deviceModel || "");
  const [accessories, setAccessories] = useState(() => order?.accessories || "Ninguno");
  const [cosmetic, setCosmetic] = useState(() => order?.cosmetic || "Sin detalles");
  const [issue, setIssue] = useState(() => order?.issue || "");
  const [saving, setSaving] = useState(false);

  if (!order) return null;

  const handleSaveReceptionEdit = async (e) => {
    e.preventDefault();
    if (!deviceModel.trim() || !issue.trim()) {
      toast.error("Completá el modelo del equipo y la falla reportada.");
      return;
    }

    try {
      setSaving(true);
      const currentHistory = Array.isArray(order.history) ? order.history : [];
      const updatedHistory = [
        ...currentHistory,
        {
          date:
            new Date().toLocaleDateString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) +
            " " +
            new Date().toLocaleTimeString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          text: `Datos de recepción editados (${deviceType} ${deviceModel.trim()})`,
        },
      ];

      await api.orders.update(order._id, {
        device_type: deviceType,
        device_model: deviceModel.trim(),
        accessories: accessories.trim() || "Ninguno",
        cosmetic: cosmetic.trim() || "Sin detalles",
        issue: issue.trim(),
        history: updatedHistory,
      });

      toast.success("Datos de recepción actualizados", {
        description: `Se modificó la ficha de la orden ${order.trackingCode}.`,
      });
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Error al editar recepción", {
        description: error.message || "Intente nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/80 shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 cursor-default"
      >
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2">
              <Pencil className="w-4 h-4 text-primary" />
              Editar Recepción del Equipo
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Orden N°{" "}
              <strong className="font-mono text-foreground">{order.trackingCode}</strong>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSaveReceptionEdit} className="p-4 sm:p-6 space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Categoría de Equipo
              </Label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {["Celular", "Notebook / PC", "Tablet", "Consola", "Smartwatch", "Otro"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Marca y Modelo
              </Label>
              <Input
                type="text"
                required
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="Ej. Samsung S23 Ultra"
                className="h-9 text-xs bg-background rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Accesorios Entregados
              </Label>
              <Input
                type="text"
                value={accessories}
                onChange={(e) => setAccessories(e.target.value)}
                placeholder="Funda, cargador, bandeja SIM..."
                className="h-9 text-xs bg-background rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Estado Estético
              </Label>
              <Input
                type="text"
                value={cosmetic}
                onChange={(e) => setCosmetic(e.target.value)}
                placeholder="Rayones en tapa trasera..."
                className="h-9 text-xs bg-background rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Falla Declarada por el Cliente
            </Label>
            <Textarea
              rows={3}
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="text-xs bg-background rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2.5 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

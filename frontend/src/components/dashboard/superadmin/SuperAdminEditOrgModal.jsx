import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Trash2 } from "lucide-react";

export function SuperAdminEditOrgModal({
  editingOrg,
  onClose,
  editOrgName,
  setEditOrgName,
  editOrgPlan,
  setEditOrgPlan,
  editOrgStatus,
  setEditOrgStatus,
  onSave,
  onDelete,
  submittingSuper,
}) {
  if (!editingOrg) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left cursor-default"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="space-y-1">
          <h3 className="font-outfit text-lg font-bold text-foreground">
            Editar Taller y Suscripción
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Modificá el nombre comercial de la organización, su plan activo y el estado de su licencia.
          </p>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Nombre del Taller / Organización
            </Label>
            <Input
              value={editOrgName}
              onChange={(e) => setEditOrgName(e.target.value)}
              required
              className="bg-background/85 border-border text-xs h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Plan Contratado
            </Label>
            <select
              value={editOrgPlan}
              onChange={(e) => setEditOrgPlan(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Taller Básico">Taller Básico</option>
              <option value="Taller Pro">Taller Pro</option>
              <option value="Multi-Taller Pro">Multi-Taller Pro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Estado de Licencia
            </Label>
            <select
              value={editOrgStatus}
              onChange={(e) => setEditOrgStatus(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="activo">Activo (Operación Habilitada)</option>
              <option value="suspendido">Suspendido (Acceso Bloqueado)</option>
              <option value="vencido">Vencido (Requiere Renovación)</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onDelete(editingOrg)}
              className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer flex items-center justify-center gap-1.5 order-last sm:order-first"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar Taller
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs flex-1 sm:flex-none cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingSuper}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {submittingSuper ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

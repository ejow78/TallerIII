import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  Store,
  Users,
  X,
  Pencil,
  MapPin,
  Phone,
  Mail,
  Save,
  ArrowUpRight,
} from "lucide-react";
import { normalizePlan } from "@/services/api";

export function SuperAdminViewOrgModal({
  viewingOrg,
  onClose,
  editingVenue,
  setEditingVenue,
  handleSaveVenueAsSuper,
  submittingSuper,
  onOpenEditOrg,
}) {
  if (!viewingOrg) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left cursor-default"
      >
        <div className="flex items-start justify-between border-b border-border/60 pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-outfit text-xl font-bold text-foreground">
                {viewingOrg.name}
              </h3>
              <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] font-bold uppercase">
                {normalizePlan(viewingOrg.subscriptionPlan)}
              </Badge>
              <Badge
                variant={
                  viewingOrg.subscriptionStatus === "activo"
                    ? "success"
                    : "destructive"
                }
                className="text-[10px] font-bold uppercase"
              >
                {viewingOrg.subscriptionStatus || "activo"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-light">
              Inspección de sucursales operativas y cuentas de personal vinculadas a este taller.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Sección Sucursales */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-outfit text-sm font-bold text-foreground flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              Sucursales del Taller ({(viewingOrg.venues || []).length})
            </h4>
          </div>

          {editingVenue && (
            <form
              onSubmit={handleSaveVenueAsSuper}
              className="p-4 rounded-xl border border-primary/40 bg-primary/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Editando Sucursal: {editingVenue.name}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingVenue(null)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Nombre de Sucursal
                  </Label>
                  <Input
                    value={editingVenue.name || ""}
                    onChange={(e) =>
                      setEditingVenue({
                        ...editingVenue,
                        name: e.target.value,
                      })
                    }
                    required
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Email Comercial
                  </Label>
                  <Input
                    value={editingVenue.email || ""}
                    onChange={(e) =>
                      setEditingVenue({
                        ...editingVenue,
                        email: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Teléfono
                  </Label>
                  <Input
                    value={editingVenue.phone || ""}
                    onChange={(e) =>
                      setEditingVenue({
                        ...editingVenue,
                        phone: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                    Dirección Física
                  </Label>
                  <Input
                    value={editingVenue.address || ""}
                    onChange={(e) =>
                      setEditingVenue({
                        ...editingVenue,
                        address: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submittingSuper}
                  size="sm"
                  className="h-8 bg-primary text-primary-foreground text-xs font-bold cursor-pointer gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar Sucursal
                </Button>
              </div>
            </form>
          )}

          {(viewingOrg.venues || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(viewingOrg.venues || []).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm text-foreground">
                        {v.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingVenue({ ...v })}
                        className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary cursor-pointer gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        Editar
                      </Button>
                    </div>
                    {v.address && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0 text-primary/70" />
                        <span className="truncate">{v.address}</span>
                      </p>
                    )}
                    {v.phone && (
                      <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                        <Phone className="w-3 h-3 shrink-0 text-primary/70" />
                        <span>{v.phone}</span>
                      </p>
                    )}
                    {v.email && (
                      <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 shrink-0 text-primary/70" />
                        <span className="truncate">{v.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-light italic">
              Este taller no posee sucursales registradas.
            </p>
          )}
        </div>

        {/* Sección Cuentas de Usuario del Taller */}
        <div className="space-y-3 border-t border-border/50 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-outfit text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Cuentas de Acceso Vinculadas ({(viewingOrg.profiles || []).length})
            </h4>
            <Link to="/dashboard/usuarios">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] font-semibold rounded-lg gap-1 cursor-pointer"
              >
                Ir a Gestión de Usuarios
                <ArrowUpRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {(viewingOrg.profiles || []).length > 0 ? (
            <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-background/40 overflow-hidden">
              {(viewingOrg.profiles || []).map((p) => {
                const assignedVenue = (viewingOrg.venues || []).find(
                  (v) => v.id === p.venue_id
                );
                return (
                  <div
                    key={p.id}
                    className="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-foreground block truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono block truncate">
                        {p.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {assignedVenue && (
                        <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                          {assignedVenue.name}
                        </span>
                      )}
                      <Badge
                        variant={p.role === "admin" ? "default" : "secondary"}
                        className="text-[9px] uppercase font-bold"
                      >
                        {p.role === "admin" ? "Admin" : "Técnico"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-light italic">
              No hay cuentas de usuario asociadas a este taller.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              const org = viewingOrg;
              onClose();
              onOpenEditOrg(org);
            }}
            className="text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar Taller y Plan
          </Button>
          <Button
            onClick={onClose}
            className="bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

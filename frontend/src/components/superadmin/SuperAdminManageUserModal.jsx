import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Eye, EyeOff, Trash2 } from "lucide-react";

export function SuperAdminManageUserModal({
  isOpen,
  onClose,
  selectedUser,
  modalName,
  setModalName,
  modalEmail,
  setModalEmail,
  modalRole,
  setModalRole,
  modalVenueId,
  setModalVenueId,
  modalPassword,
  setModalPassword,
  showPassword,
  setShowPassword,
  submitting,
  selectedOrgVenues,
  onSubmit,
  onDeleteUser,
}) {
  if (!isOpen || !selectedUser) return null;

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
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="space-y-1">
          <h3 className="font-outfit text-lg font-bold text-foreground">
            Gestionar Cuenta de Usuario
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Modificá el nombre, email, rol, sucursal asignada o contraseña de acceso.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="manage-name"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Nombre Completo
            </Label>
            <Input
              id="manage-name"
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="manage-email"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Email de Acceso
            </Label>
            <Input
              id="manage-email"
              type="email"
              required
              placeholder="Ej. juan@taller.com"
              value={modalEmail}
              onChange={(e) => setModalEmail(e.target.value)}
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="manage-role"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Rol del Sistema
              </Label>
              <select
                id="manage-role"
                value={modalRole}
                onChange={(e) => setModalRole(e.target.value)}
                disabled={selectedUser.role === "superadmin"}
                className="w-full h-10 rounded-xl border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
              >
                <option value="tecnico">Técnico (Sucursal)</option>
                <option value="admin">Administrador (Taller)</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="manage-venue"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Sucursal Asignada
              </Label>
              <select
                id="manage-venue"
                value={modalVenueId}
                onChange={(e) => setModalVenueId(e.target.value)}
                disabled={selectedOrgVenues.length === 0}
                className="w-full h-10 rounded-xl border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
              >
                <option value="">Sin sede específica</option>
                {selectedOrgVenues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="manage-password"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between"
            >
              <span>Nueva Contraseña</span>
              <span className="text-[9px] text-muted-foreground font-light lowercase">
                dejar vacío para no cambiar
              </span>
            </Label>
            <div className="relative">
              <Input
                id="manage-password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña nueva (mín. 6 caracteres)"
                value={modalPassword}
                onChange={(e) => setModalPassword(e.target.value)}
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs pr-10 h-10 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-border/40">
            {selectedUser.role !== "superadmin" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onDeleteUser(selectedUser._id, selectedUser.name)
                }
                className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer flex items-center justify-center gap-1.5 order-last sm:order-first"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar Usuario
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs flex-1 sm:flex-none border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

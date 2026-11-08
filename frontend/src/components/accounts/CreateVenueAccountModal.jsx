import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff, Save } from "lucide-react";

export function CreateVenueAccountModal({
  isOpen,
  onClose,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  venueId,
  setVenueId,
  venues,
  showPassword,
  setShowPassword,
  submitting,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative cursor-default"
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
          <h3 className="font-outfit text-base font-bold text-foreground">
            Registrar Cuenta de Acceso
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Crea credenciales específicas para una de las sucursales de tu organización.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="modal-account-name"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Nombre Identificador
            </Label>
            <Input
              id="modal-account-name"
              type="text"
              required
              placeholder="Ej. Técnico Yerba Buena"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="modal-account-email"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Email de Acceso
            </Label>
            <Input
              id="modal-account-email"
              type="email"
              required
              placeholder="Ej. yerbabuena@repairit.cloud"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="modal-account-password"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="modal-account-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Contraseña del equipo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="modal-account-venue"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Sucursal Asociada
            </Label>
            <select
              id="modal-account-venue"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
            >
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {submitting ? "Creando..." : "Crear Acceso"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

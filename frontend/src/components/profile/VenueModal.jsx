import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Clock, Save } from "lucide-react";

export function VenueModal({
  isOpen,
  onClose,
  modalMode,
  modalName,
  setModalName,
  modalAddress,
  setModalAddress,
  modalHours,
  setModalHours,
  modalPhone,
  setModalPhone,
  modalEmail,
  setModalEmail,
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
        className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 cursor-default"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h3 className="font-outfit text-base font-bold text-foreground">
            {modalMode === "create"
              ? "Registrar Nueva Sucursal"
              : "Editar Detalles de Sucursal"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="modal-name"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Nombre del Taller / Sucursal
            </Label>
            <Input
              id="modal-name"
              type="text"
              required
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              placeholder="Ej. RepairIT - Yerba Buena"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="modal-address"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Dirección Física
            </Label>
            <Input
              id="modal-address"
              type="text"
              required
              value={modalAddress}
              onChange={(e) => setModalAddress(e.target.value)}
              placeholder="Ej. Av. Aconquija 1300, Yerba Buena"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="modal-hours"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-primary" />
              Horarios de Atención
            </Label>
            <Input
              id="modal-hours"
              type="text"
              value={modalHours}
              onChange={(e) => setModalHours(e.target.value)}
              placeholder="Ej. Lunes a Viernes de 08:30 a 18:30 hs • Sábados de 09:00 a 13:00 hs"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="modal-phone"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Teléfono de Contacto
              </Label>
              <Input
                id="modal-phone"
                type="tel"
                inputMode="tel"
                required
                value={modalPhone}
                onChange={(e) => setModalPhone(e.target.value)}
                placeholder="Ej. +54 381 4889900"
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="modal-email"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Email Comercial
              </Label>
              <Input
                id="modal-email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                required
                value={modalEmail}
                onChange={(e) => setModalEmail(e.target.value)}
                placeholder="Ej. yerbabuena@repairit.cloud"
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
              />
            </div>
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {modalMode === "create" ? "Crear Sucursal" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

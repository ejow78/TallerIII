import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

export function ClientModal({
  isOpen,
  onClose,
  client = null,
  clientsList = [],
  onSaved,
}) {
  const isEditing = Boolean(client?._id);

  const [name, setName] = useState(() => client?.name || "");
  const [dni, setDni] = useState(() => client?.dni || "");
  const [phone, setPhone] = useState(() => client?.phone || "");
  const [email, setEmail] = useState(() => client?.email || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.clients.update(client._id, {
          name,
          dni,
          phone,
          email,
        });
        toast.success("¡Ficha de Cliente Actualizada!", {
          description: `Los datos de ${name} fueron actualizados.`,
        });
      } else {
        const exists = clientsList.some(
          (c) =>
            c.dni.replace(/\./g, "").trim() === dni.replace(/\./g, "").trim()
        );
        if (exists) {
          toast.error("El DNI ingresado ya pertenece a un cliente registrado.");
          return;
        }

        await api.clients.create({
          name,
          dni,
          phone,
          email,
        });
        toast.success("¡Cliente Registrado!", {
          description: `${name} fue dado de alta.`,
        });
      }

      onClose();
      if (onSaved) onSaved();
    } catch (error) {
      toast.error("Error al guardar cliente", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/80 shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 relative cursor-default"
      >
        <div className="flex items-start justify-between border-b border-border/60 pb-3">
          <div className="space-y-0.5 text-left">
            <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              {isEditing ? "Editar Ficha de Cliente" : "Nuevo Cliente"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {isEditing
                ? `Modificá los datos de contacto de ${name}.`
                : "Registrá un nuevo cliente en el directorio del taller."}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1.5">
            <Label
              htmlFor="c-name"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Nombre Completo
            </Label>
            <Input
              id="c-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="c-dni"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                DNI / Identificación
              </Label>
              <Input
                id="c-dni"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                disabled={isEditing}
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej. 38.450.123"
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="c-phone"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Teléfono (WhatsApp)
              </Label>
              <Input
                id="c-phone"
                type="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 381 1234567"
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="c-email"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Email
            </Label>
            <Input
              id="c-email"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border/60">
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
              disabled={submitting}
              className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 rounded-lg cursor-pointer"
            >
              {submitting
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Registrar Cliente"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

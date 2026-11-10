import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

export function DangerZoneCard({ onDeleteAccount, isDeletingAccount }) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    await onDeleteAccount();
    setOpen(false);
  };

  return (
    <Card className="bg-card/25 border-destructive/30 p-6 shadow-sm space-y-4">
      <h3 className="font-outfit text-base font-bold text-destructive border-b border-destructive/20 pb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Zona de Peligro</span>
      </h3>

      <p className="text-xs text-muted-foreground font-light leading-relaxed">
        Si eliminás tu cuenta, se borrarán de forma permanente todos los datos del taller, órdenes de servicio, clientes, inventario y sucursales.
      </p>

      <div className="pt-1">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeletingAccount}
              className="w-full text-[11px] font-bold uppercase gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeletingAccount ? "Eliminando cuenta..." : "Eliminar Cuenta"}</span>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="sm:max-w-md border-destructive/30">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/15 text-destructive">
                <AlertTriangle className="w-5 h-5" />
              </AlertDialogMedia>
              <AlertDialogTitle className="font-outfit font-bold text-foreground">
                ¿Estás seguro de eliminar tu cuenta?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs leading-relaxed text-muted-foreground">
                Si eliminás la cuenta se borrarán <strong className="text-foreground font-semibold">todos los datos</strong> del taller (órdenes de servicio, clientes, inventario, historial de caja, sucursales y cuentas de acceso) y <strong className="text-destructive font-semibold">esta acción es irreversible</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeletingAccount}
                className="text-xs cursor-pointer"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeletingAccount}
                onClick={handleConfirm}
                className="text-xs font-bold cursor-pointer"
              >
                {isDeletingAccount ? "Eliminando..." : "Sí, eliminar mi cuenta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}

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
    <Card className="bg-card/25 border-border p-6 shadow-sm space-y-4">
      <h3 className="font-outfit text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
        <span>Eliminar Cuenta</span>
      </h3>

      <p className="text-xs text-muted-foreground font-light leading-relaxed">
        Si eliminás tu cuenta, se borrarán de forma permanente todos los datos del taller.
      </p>

      <div className="pt-2 border-t border-border/30">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingAccount}
              className="w-full bg-background hover:bg-red-950/20 text-muted-foreground hover:text-red-400 border-border hover:border-red-950/50 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeletingAccount ? "Eliminando cuenta..." : "Eliminar mi cuenta"}</span>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="sm:max-w-md border-border">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-muted text-muted-foreground border border-border">
                <AlertTriangle className="w-5 h-5" />
              </AlertDialogMedia>
              <AlertDialogTitle className="font-outfit font-bold text-foreground">
                ¿Estás seguro de eliminar tu cuenta?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs leading-relaxed text-muted-foreground">
                Si eliminás la cuenta se borrarán <strong className="text-foreground font-semibold">todos los datos</strong> del taller y <strong className="text-foreground font-semibold">esta acción es irreversible</strong>.
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
                variant="outline"
                disabled={isDeletingAccount}
                onClick={handleConfirm}
                className="bg-background hover:bg-red-950/20 text-muted-foreground hover:text-red-400 border-border hover:border-red-950/50 text-xs font-bold transition-all cursor-pointer"
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

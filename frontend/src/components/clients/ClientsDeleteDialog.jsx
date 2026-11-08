import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ClientsDeleteDialog({
  isOpen,
  onOpenChange,
  client,
  onConfirm,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-border text-left">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-outfit text-lg font-bold text-foreground">
            ¿Confirmás la eliminación del cliente?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-normal">
            Al eliminar a {client?.name}, también se eliminarán del historial de forma
            permanente todas las órdenes de servicio asociadas. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-xs">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold"
          >
            Sí, Eliminar Todo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

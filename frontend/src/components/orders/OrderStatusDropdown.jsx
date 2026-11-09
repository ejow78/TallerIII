import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrderStatusDropdown({ orderId, currentStatus, onStatusChange }) {
  let colorClass;
  let statusLabel;

  switch (currentStatus) {
    case "ingresado":
      colorClass = "bg-sky-500/10 text-sky-400 border-sky-500/25 hover:bg-sky-500/20";
      statusLabel = "Ingresado";
      break;
    case "diagnostico":
      colorClass = "bg-purple-500/10 text-purple-400 border-purple-500/25 hover:bg-purple-500/20";
      statusLabel = "En Diagnóstico";
      break;
    case "presupuestado":
      colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20";
      statusLabel = "Presupuestado";
      break;
    case "reparacion":
    case "en_reparacion":
      colorClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20";
      statusLabel = "En Reparación";
      break;
    case "listo":
      colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20";
      statusLabel = "Listo para retirar";
      break;
    case "entregado":
      colorClass = "bg-muted text-muted-foreground border-border hover:bg-muted/80";
      statusLabel = "Entregado";
      break;
    default:
      colorClass = "bg-secondary text-secondary-foreground";
      statusLabel = currentStatus;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 border px-2.5 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${colorClass}`}
        >
          {statusLabel}
          <ChevronDown className="w-3 h-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border text-foreground">
        <DropdownMenuItem
          onClick={() => onStatusChange(orderId, "ingresado")}
          className="text-xs cursor-pointer"
        >
          Ingresado
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(orderId, "diagnostico")}
          className="text-xs cursor-pointer"
        >
          En Diagnóstico
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(orderId, "presupuestado")}
          className="text-xs cursor-pointer"
        >
          Presupuestado
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(orderId, "en_reparacion")}
          className="text-xs cursor-pointer"
        >
          En Reparación
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(orderId, "listo")}
          className="text-xs cursor-pointer"
        >
          Listo para retirar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(orderId, "entregado")}
          className="text-xs cursor-pointer"
        >
          Entregado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

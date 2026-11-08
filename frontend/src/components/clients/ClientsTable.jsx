import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";

export function ClientsTable({
  loading = false,
  clients = [],
  orders = [],
  isTechnician = false,
  onNewOrder,
  onViewOrders,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="text-center py-14 text-xs text-muted-foreground font-light">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Cargando directorio de clientes...
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-xs font-light">
        No se encontraron clientes que coincidan con la búsqueda.
      </div>
    );
  }

  return (
    <>
      {/* Vista Móvil (< md): Tarjetas de Clientes */}
      <div className="space-y-3 md:hidden">
        {clients.map((client) => {
          const clientOrders = orders.filter((o) => {
            const oClientId =
              typeof o.clientId === "object" ? o.clientId?._id : o.clientId;
            return oClientId === client._id;
          });
          return (
            <div
              key={client._id}
              className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2.5 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-foreground text-sm block leading-snug">
                    {client.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground block mt-0.5">
                    DNI: {client.dni} • ID:{" "}
                    {client._id.substring(client._id.length - 6).toUpperCase()}
                  </span>
                </div>
                <Badge
                  variant={clientOrders.length > 0 ? "default" : "secondary"}
                  className="text-[10px] font-bold shrink-0"
                >
                  {clientOrders.length}{" "}
                  {clientOrders.length === 1 ? "orden" : "órdenes"}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-0.5 pt-2 border-t border-border/40">
                {client.phone && (
                  <div className="text-foreground/90 font-medium">
                    Tel: {client.phone}
                  </div>
                )}
                {client.email && (
                  <div className="text-[11px] truncate">{client.email}</div>
                )}
              </div>

              <div className="flex items-center justify-between gap-1.5 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNewOrder(client)}
                  className="h-8 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex-1 gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Nueva Orden
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onViewOrders(client)}
                    disabled={clientOrders.length === 0}
                    className="h-8 w-8 text-muted-foreground hover:text-primary border-border/80 disabled:opacity-30 rounded-lg cursor-pointer"
                    title="Ver órdenes"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onEdit(client)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {!isTechnician && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onDelete(client)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-400 border-border/80 rounded-lg cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista Escritorio (>= md): Tabla completa */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-2.5">ID</th>
              <th className="py-3 px-2.5">Nombre y Apellido</th>
              <th className="py-3 px-2.5">DNI / CUIT</th>
              <th className="py-3 px-2.5">Contacto</th>
              <th className="py-3 px-2.5 text-center">Órdenes</th>
              <th className="py-3 px-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const clientOrders = orders.filter((o) => {
                const oClientId =
                  typeof o.clientId === "object" ? o.clientId?._id : o.clientId;
                return oClientId === client._id;
              });
              return (
                <tr
                  key={client._id}
                  className="border-b border-border/40 hover:bg-card/40 transition-colors"
                >
                  <td className="py-3.5 px-2.5 font-mono font-bold text-primary">
                    {client._id.substring(client._id.length - 6).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-2.5 font-semibold text-foreground">
                    {client.name}
                  </td>
                  <td className="py-3.5 px-2.5 font-mono text-muted-foreground">
                    {client.dni}
                  </td>
                  <td className="py-3.5 px-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {client.phone}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {client.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5 text-center">
                    <Badge
                      variant={clientOrders.length > 0 ? "default" : "secondary"}
                      className="text-[10px] font-bold"
                    >
                      {clientOrders.length}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNewOrder(client)}
                        className="h-8 px-2.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer"
                        title="Registrar nuevo equipo para este cliente"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Orden
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onViewOrders(client)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 rounded-lg cursor-pointer"
                        title="Ver historial de órdenes del cliente"
                        disabled={clientOrders.length === 0}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(client)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                        title="Editar ficha de cliente"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {!isTechnician && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(client)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                          title="Eliminar cliente permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

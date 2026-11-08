import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Trash2 } from "lucide-react";

export function VenueAccountsTable({ accounts, onDelete }) {
  return (
    <Card className="bg-card/30 border-border shadow-xl backdrop-blur-sm">
      <CardContent className="p-0">
        {accounts.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-muted-foreground">
              <Store className="w-6 h-6" />
            </div>
            <p className="text-xs font-light text-muted-foreground">
              No hay cuentas de acceso adicionales registradas.
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Presione el botón superior para crear la primera cuenta.
            </p>
          </div>
        ) : (
          <>
            {/* Vista Mobile */}
            <div className="space-y-3 p-3.5 md:hidden">
              {accounts.map((acc) => (
                <div
                  key={acc._id}
                  className="rounded-xl border border-border/70 bg-background/50 p-3.5 flex items-center justify-between gap-3 text-left"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm truncate">
                        {acc.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[9px] uppercase font-bold px-1.5 py-0"
                      >
                        Técnico
                      </Badge>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground block truncate">
                      {acc.email}
                    </span>
                    <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      {acc.venueId?.name || "Sucursal"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(acc._id, acc.name)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg shrink-0"
                    title="Eliminar cuenta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Vista Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground font-medium uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-5">Nombre Identificador</th>
                    <th className="py-4 px-5">Email de Acceso</th>
                    <th className="py-4 px-5">Sucursal Asociada</th>
                    <th className="py-4 px-5">Rol Asignado</th>
                    <th className="py-4 px-5">Fecha Alta</th>
                    <th className="py-4 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {accounts.map((acc) => (
                    <tr
                      key={acc._id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="py-4 px-5 font-bold text-foreground">
                        {acc.name}
                      </td>
                      <td className="py-4 px-5 font-mono text-muted-foreground">
                        {acc.email}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-primary/70" />
                          <span className="text-foreground">
                            {acc.venueId?.name || "Desconocida"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <Badge
                          variant="secondary"
                          className="text-[9px] uppercase font-bold px-1.5 py-0.5"
                        >
                          Técnico
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground font-mono text-[10px]">
                        {new Date(acc.created_at).toLocaleDateString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(acc._id, acc.name)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-full"
                          title="Eliminar cuenta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

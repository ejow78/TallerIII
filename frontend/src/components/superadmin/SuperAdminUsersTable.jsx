import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  UserCheck,
  UserCog,
  Edit,
  Trash2,
  Building2,
  Store,
} from "lucide-react";
import { normalizePlan } from "@/services/api";

export function SuperAdminUsersTable({
  filteredUsers,
  onOpenManageModal,
  onRoleChange,
  onDeleteUser,
}) {
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-xs font-light">
        No se encontraron usuarios que coincidan con la búsqueda.
      </div>
    );
  }

  return (
    <>
      {/* Vista Mobile (< md): Tarjetas de Usuario */}
      <div className="space-y-3 md:hidden">
        {filteredUsers.map((item) => {
          const isCurrentSuper = item.role === "superadmin";
          const orgPlan = item.organizationId?.subscription_plan
            ? normalizePlan(item.organizationId.subscription_plan)
            : null;

          return (
            <div
              key={item._id}
              className="p-4 rounded-2xl border border-border/70 bg-background/50 space-y-3 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-sm text-foreground block truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono block truncate">
                    {item.email}
                  </span>
                </div>
                <Badge
                  variant={
                    item.role === "superadmin"
                      ? "success"
                      : item.role === "admin"
                      ? "default"
                      : "secondary"
                  }
                  className="text-[9px] uppercase font-bold shrink-0"
                >
                  {item.role === "superadmin"
                    ? "Super Admin"
                    : item.role === "admin"
                    ? "Admin"
                    : "Técnico"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                  {item.organizationId?.name || "Plataforma Central"}
                </span>
                <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                  {item.venueId?.name || "Sin sede"}
                </span>
                {orgPlan && (
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/25 font-bold">
                    {orgPlan}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenManageModal(item)}
                  className="h-8 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer flex-1"
                >
                  <Edit className="w-3.5 h-3.5 text-primary" />
                  Gestionar Cuenta
                </Button>
                {!isCurrentSuper && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteUser(item._id, item.name)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista Escritorio (>= md): Tabla Completa */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3.5 px-3">Usuario</th>
              <th className="py-3.5 px-3">Taller / Organización</th>
              <th className="py-3.5 px-3">Sucursal Asignada</th>
              <th className="py-3.5 px-3">Rol del Sistema</th>
              <th className="py-3.5 px-3">Fecha Alta</th>
              <th className="py-3.5 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredUsers.map((item) => {
              let roleBadge = "secondary";
              let roleLabel = "Técnico";
              if (item.role === "superadmin") {
                roleBadge = "success";
                roleLabel = "Super Admin";
              } else if (item.role === "admin") {
                roleBadge = "default";
                roleLabel = "Administrador";
              }

              const isCurrentSuper = item.role === "superadmin";
              const orgPlan = item.organizationId?.subscription_plan
                ? normalizePlan(item.organizationId.subscription_plan)
                : null;

              return (
                <tr
                  key={item._id}
                  className="hover:bg-card/40 transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-foreground text-sm block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {item.email}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary/80 shrink-0" />
                        {item.organizationId?.name || "Plataforma Central"}
                      </span>
                      {orgPlan && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/25 inline-block">
                          {orgPlan}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                      {item.venueId?.name || "Taller Global"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {isCurrentSuper ? (
                      <Badge
                        variant={roleBadge}
                        className="text-[9px] uppercase font-bold px-2 py-0.5 border"
                      >
                        {roleLabel}
                      </Badge>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border border-border/70 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Badge
                              variant={roleBadge}
                              className="text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                            >
                              {roleLabel}
                            </Badge>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground">
                          <DropdownMenuItem
                            onClick={() => onRoleChange(item._id, "tecnico")}
                            className="text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                            Técnico de Sucursal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRoleChange(item._id, "admin")}
                            className="text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <UserCog className="w-3.5 h-3.5 text-amber-400" />
                            Administrador de Taller
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-muted-foreground font-mono text-[11px]">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenManageModal(item)}
                        className="h-8 px-2.5 text-xs font-semibold border-border/70 hover:border-primary/40 hover:text-primary cursor-pointer rounded-lg gap-1.5"
                        title="Gestionar credenciales, rol y sucursal"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Gestionar
                      </Button>
                      {!isCurrentSuper && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteUser(item._id, item.name)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

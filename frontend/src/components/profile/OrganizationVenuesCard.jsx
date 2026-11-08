import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Plus, Clock, Edit, RefreshCw } from "lucide-react";
import { parseVenueAddress } from "@/utils/venueHelper";
import { hasMultiTallerAccess } from "@/services/api";

export function OrganizationVenuesCard({
  venues,
  activeVenueName,
  subscriptionPlan,
  onOpenCreateModal,
  onOpenEditModal,
  onSwitchActiveVenue,
  onOpenPlansModal,
}) {
  const hasAccess = hasMultiTallerAccess(subscriptionPlan);

  return (
    <Card className="bg-card/30 border-border p-6 shadow-xl backdrop-blur-sm space-y-4">
      <div className="border-b border-border/50 pb-3 flex items-center justify-between">
        <div>
          <CardTitle className="font-outfit text-base font-bold text-foreground">
            Sucursales de la Organización
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Gestioná o alterná las sedes de servicio de tu negocio.
          </CardDescription>
        </div>
        {hasAccess && (
          <Button
            onClick={onOpenCreateModal}
            className="bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] font-extrabold uppercase py-1.5 px-3 rounded flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Sucursal
          </Button>
        )}
      </div>
      <CardContent className="p-0">
        {!hasAccess ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3 bg-muted/5 rounded-lg border border-dashed border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Store className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex flex-col items-center">
              <h4 className="font-outfit text-sm font-bold text-foreground">
                Gestión de Sucursales Limitada
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm font-light leading-relaxed mb-1">
                Mejorá tu plan al nivel{" "}
                <span className="text-primary font-semibold">
                  Multi-Taller Pro
                </span>{" "}
                para poder gestionar y alternar entre múltiples sucursales de tu negocio.
              </p>
              <Button
                onClick={onOpenPlansModal}
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/25 font-bold text-[10px] uppercase py-1.5 px-4 rounded-md cursor-pointer transition-all shrink-0 mt-1"
              >
                Ver Planes Disponibles
              </Button>
            </div>
          </div>
        ) : venues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.map((v) => {
              const isActive = v.name === activeVenueName;
              const parsed = parseVenueAddress(v.address);

              return (
                <div
                  key={v._id}
                  className={`p-4 rounded-lg border text-xs space-y-2 flex flex-col justify-between ${
                    isActive
                      ? "bg-primary/5 border-primary/45 shadow-sm"
                      : "bg-card/20 border-border/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-foreground truncate text-sm">
                        {v.name}
                      </span>
                      {isActive && (
                        <Badge className="bg-primary/15 text-primary border border-primary/30 text-[8px] font-bold uppercase py-0.5 px-1 shrink-0">
                          Activa
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground font-light leading-tight">
                      {parsed.address || "Sin dirección"}
                    </p>
                    {parsed.hours && (
                      <p className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{parsed.hours}</span>
                      </p>
                    )}
                    <p className="text-muted-foreground font-mono text-[10px]">
                      Tel: {v.phone}
                    </p>
                    <p className="text-muted-foreground font-mono text-[10px] truncate">
                      {v.email}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/25 pt-2.5 mt-1 gap-2">
                    <Button
                      onClick={() => onOpenEditModal(v)}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 hover:bg-muted/50 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </Button>

                    {!isActive && (
                      <Button
                        onClick={() => onSwitchActiveVenue(v._id)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px] font-bold uppercase border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center gap-1 px-2.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Activar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-muted-foreground font-light">
            No hay sucursales adicionales registradas.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

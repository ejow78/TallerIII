import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, MessageCircle, Printer, X } from "lucide-react";
import { getOrderWhatsAppUrl, printOrderReceipt } from "@/utils/printHelper";

export function ClientOrdersModal({
  isOpen,
  onClose,
  client = null,
  orders = [],
  profile = null,
}) {
  if (!isOpen || !client) return null;

  const clientOrders = orders.filter((o) => {
    const oClientId =
      typeof o.clientId === "object" ? o.clientId?._id : o.clientId;
    return oClientId === client._id;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/80 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 cursor-default"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="space-y-1 text-left">
            <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2 border-0 pb-0">
              <ClipboardList className="w-4 h-4 text-primary" />
              Reparaciones de {client.name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              DNI: {client.dni} &bull; Tel: {client.phone}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {clientOrders.length === 0 ? (
            <p className="text-center py-8 text-xs text-muted-foreground font-light">
              No hay reparaciones registradas para este cliente.
            </p>
          ) : (
            clientOrders.map((o) => {
              const waUrl = getOrderWhatsAppUrl(o, profile, client);
              return (
                <div
                  key={o._id}
                  className="border border-border/60 bg-background/50 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary text-xs">
                        #{o.trackingCode}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase font-bold py-0 px-1.5 border-border"
                      >
                        {(o.status || "").toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {o.date}
                      </span>
                    </div>
                    <span className="font-semibold text-xs text-foreground block">
                      {o.deviceModel} ({o.deviceType})
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {o.issue}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {waUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(waUrl, "_blank", "noopener,noreferrer")
                        }
                        className="h-8 text-xs font-bold border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1 cursor-pointer"
                        title="Enviar seguimiento por WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => printOrderReceipt(o, profile, client)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer"
                      title="Imprimir comprobante"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

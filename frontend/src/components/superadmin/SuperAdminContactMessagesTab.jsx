import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, MessageSquare, Mail, Calendar, Trash2 } from "lucide-react";

export function SuperAdminContactMessagesTab({
  filteredContactMessages,
  messageSearchQuery,
  setMessageSearchQuery,
  onDeleteContactMessage,
}) {
  return (
    <Card className="bg-card/30 border-border/80 p-4 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-3">
        <div className="text-left">
          <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
            <MessageSquare className="w-4.5 h-4.5 text-primary" />
            Bandeja de Consultas Web
          </CardTitle>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 self-start sm:self-auto"
        >
          {filteredContactMessages.length} consultas
        </Badge>
      </div>

      {/* Buscador de Consultas */}
      <div className="relative w-full sm:max-w-sm flex items-center">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por nombre, correo o contenido..."
          value={messageSearchQuery}
          onChange={(e) => setMessageSearchQuery(e.target.value)}
          className="bg-background/85 border-border text-xs w-full pl-10 h-10 rounded-xl"
        />
        {messageSearchQuery && (
          <button
            type="button"
            onClick={() => setMessageSearchQuery("")}
            className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {filteredContactMessages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContactMessages.map((msg) => (
            <div
              key={msg._id}
              className="rounded-2xl border border-border/70 bg-background/50 p-4 sm:p-5 flex flex-col justify-between gap-4 text-left hover:border-primary/30 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-outfit font-bold text-sm text-foreground truncate">
                      {msg.name || "Remitente sin nombre"}
                    </h4>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1 mt-0.5 truncate"
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      <span>{msg.email}</span>
                    </a>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground inline-flex items-center gap-1 shrink-0 bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                    <Calendar className="w-3 h-3 text-primary/70" />
                    {msg.createdAt
                      ? `${new Date(msg.createdAt).toLocaleDateString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })} ${new Date(msg.createdAt).toLocaleTimeString("es-AR", {
                          timeZone: "America/Argentina/Buenos_Aires",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })} hs`
                      : "Sin fecha"}
                  </span>
                </div>

                <div className="rounded-xl bg-card/70 border border-border/50 p-3 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg gap-1.5 cursor-pointer"
                >
                  <a
                    href={`mailto:${encodeURIComponent(msg.email || "")}?subject=${encodeURIComponent(
                      "Respuesta a tu consulta en RepairIT"
                    )}&body=${encodeURIComponent(
                      `Hola ${msg.name || ""},\n\nGracias por comunicarte con RepairIT.\n\nRespecto a tu consulta:\n"${msg.message || ""}"\n\n`
                    )}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Responder por Correo
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onDeleteContactMessage(msg._id, msg.name || msg.email)
                  }
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                  title="Eliminar consulta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 space-y-2 text-muted-foreground">
          <MessageSquare className="w-8 h-8 opacity-30 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs font-light">
            No hay consultas web registradas en este momento.
          </p>
        </div>
      )}
    </Card>
  );
}

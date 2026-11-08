import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Search, X, UserCheck } from "lucide-react";

export function NewOrderClientSection({
  clientSearch,
  setClientSearch,
  matchingClients,
  selectedExistingClient,
  clientName,
  setClientName,
  clientDni,
  setClientDni,
  clientPhone,
  setClientPhone,
  clientEmail,
  setClientEmail,
  dniMatchClient,
  onSelectClient,
  onClearClient,
}) {
  return (
    <Card className="lg:col-span-5 bg-card/40 border-border/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div>
          <CardTitle className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            1. Datos del Cliente
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Buscá un cliente habitual o completá los datos de uno nuevo.
          </CardDescription>
        </div>
        {selectedExistingClient && (
          <button
            type="button"
            onClick={onClearClient}
            className="text-[10px] font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-md cursor-pointer"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Buscador rápido de cliente registrado */}
      <div className="relative space-y-1.5">
        <Label className="text-[10px] font-bold text-primary uppercase tracking-wider block">
          Autocompletar Cliente Registrado (Opcional)
        </Label>
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
          <Input
            type="text"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI o teléfono..."
            className="bg-background/90 border-primary/25 focus-visible:ring-1 focus-visible:ring-primary text-xs pl-8 h-9 rounded-lg"
          />
          {clientSearch && (
            <button
              type="button"
              onClick={() => setClientSearch("")}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {matchingClients.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-xl divide-y divide-border/50 overflow-hidden z-20">
            {matchingClients.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => onSelectClient(c)}
                className="w-full px-3 py-2 text-left hover:bg-primary/10 transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    DNI: {c.dni} • Tel: {c.phone}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-primary shrink-0 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Elegir
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <div className="space-y-1.5">
          <Label
            htmlFor="client-name"
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
          >
            Nombre y Apellido
          </Label>
          <Input
            id="client-name"
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej. Juan Pérez"
            className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="client-dni"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              DNI / CUIT
            </Label>
            <Input
              id="client-dni"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={clientDni}
              onChange={(e) => setClientDni(e.target.value)}
              placeholder="Ej. 38450123"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="client-phone"
              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
            >
              Teléfono (WhatsApp)
            </Label>
            <Input
              id="client-phone"
              type="tel"
              inputMode="tel"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Ej. 381 555-1234"
              className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
            />
          </div>
        </div>

        {/* Sugerencia automática si escribe un DNI existente */}
        {dniMatchClient && (
          <button
            type="button"
            onClick={() => onSelectClient(dniMatchClient)}
            className="w-full p-2 rounded-lg bg-primary/10 border border-primary/25 text-left flex items-center justify-between text-xs text-primary hover:bg-primary/15 transition-colors cursor-pointer"
          >
            <span className="truncate">
              DNI registrado: <strong>{dniMatchClient.name}</strong>
            </span>
            <span className="text-[10px] font-bold underline shrink-0 ml-2">
              Autocompletar
            </span>
          </button>
        )}

        <div className="space-y-1.5">
          <Label
            htmlFor="client-email"
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
          >
            Correo Electrónico
          </Label>
          <Input
            id="client-email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            required
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="cliente@ejemplo.com"
            className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
}

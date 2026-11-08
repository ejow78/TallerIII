import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Printer,
  DollarSign,
  Smartphone,
  CreditCard,
  Wallet,
} from "lucide-react";

export function PosCartCheckout({
  cart = [],
  setCart,
  onUpdateCartQty,
  onRemoveFromCart,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  onCashKeyDown,
  total = 0,
  submitting = false,
  onCheckout,
}) {
  return (
    <Card className="xl:col-span-5 bg-card/40 border-border/80 shadow-md flex flex-col overflow-hidden">
      <CardHeader className="border-b border-border/60 p-5 sm:p-6 flex flex-row items-center justify-between space-y-0 bg-muted/15">
        <div>
          <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-4.5 h-4.5 text-primary" />
            Ticket de Venta Actual
          </CardTitle>
          <CardDescription className="text-xs font-light mt-1">
            {cart.length === 0
              ? "Seleccioná artículos del catálogo para cobrar"
              : `${cart.reduce((a, b) => a + b.quantity, 0)} unidades seleccionadas`}
          </CardDescription>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => setCart([])}
            className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-destructive/10"
          >
            Vaciar
          </button>
        )}
      </CardHeader>

      <CardContent className="p-5 sm:p-6 flex flex-col justify-between space-y-5">
        {/* Lista de Ítems del Carrito */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 py-12 px-6 border border-dashed border-border/60 rounded-2xl bg-background/30">
            <ShoppingCart className="w-9 h-9 opacity-25 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground/80">
              El carrito está vacío
            </p>
            <p className="text-xs text-muted-foreground/75 max-w-[250px] leading-relaxed">
              Tocá cualquier producto del listado izquierdo para sumarlo al ticket.
            </p>
          </div>
        ) : (
          <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-background/70 p-3.5 rounded-xl border border-border/60 text-xs gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1 text-left">
                  <span className="text-sm font-semibold text-foreground block truncate leading-snug">
                    {item.name}
                  </span>
                  <span className="text-xs text-primary font-mono font-bold block">
                    $
                    {(item.price * item.quantity).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-[11px] text-muted-foreground font-normal">
                      (${item.price.toLocaleString("es-AR")} c/u)
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-border/80 rounded-lg bg-card">
                    <button
                      type="button"
                      onClick={() => onUpdateCartQty(item.id, -1)}
                      className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-bold text-foreground font-mono text-xs">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateCartQty(item.id, 1)}
                      className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFromCart(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bloque de Pago y Total */}
        <div className="border-t border-border/60 pt-5 space-y-4 text-left">
          {/* Selector de Medio de Pago en 4 píldoras */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Medio de Pago [F4]
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
              {[
                { id: "efectivo", label: "Efectivo", icon: DollarSign },
                { id: "transferencia", label: "Transferencia", icon: Smartphone },
                { id: "debito", label: "Débito", icon: CreditCard },
                { id: "credito", label: "Crédito", icon: Wallet },
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      active
                        ? "bg-primary/15 border-primary text-primary font-bold shadow-xs"
                        : "border-border/70 bg-background/60 hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-primary" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculadora de Vuelto (Solo Efectivo y cuando hay ítems) */}
          {paymentMethod === "efectivo" && total > 0 && (
            <div className="bg-background/60 border border-border/70 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="cash-received"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Abona con (Opcional)
                </Label>
                <button
                  type="button"
                  onClick={() => setCashReceived(total.toString())}
                  className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  Pago Justo (${total.toLocaleString("es-AR")})
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-mono text-muted-foreground">
                  $
                </span>
                <Input
                  id="cash-received"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder={total.toString()}
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  onKeyDown={onCashKeyDown}
                  className="pl-8 h-10 text-sm font-mono bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                />
              </div>
              {cashReceived !== "" && Number(cashReceived) > total && (
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs text-muted-foreground">
                    Vuelto a entregar:
                  </span>
                  <span className="text-base font-black font-outfit text-emerald-400 font-mono">
                    $
                    {(Number(cashReceived) - total).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              {cashReceived !== "" &&
                Number(cashReceived) > 0 &&
                Number(cashReceived) < total && (
                  <div className="text-xs text-destructive font-semibold">
                    Faltan: $
                    {(total - Number(cashReceived)).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                )}
            </div>
          )}

          {/* Totalizador */}
          <div className="flex justify-between items-baseline bg-primary/10 p-4 sm:p-5 rounded-xl border border-primary/25">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-primary uppercase">
              TOTAL A COBRAR:
            </span>
            <span className="text-2xl sm:text-3xl font-black font-outfit text-primary font-mono">
              $
              {total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Botón Principal de Cobro e Impresión */}
          <Button
            onClick={onCheckout}
            disabled={
              submitting ||
              cart.length === 0 ||
              (paymentMethod === "efectivo" &&
                cashReceived !== "" &&
                Number(cashReceived) > 0 &&
                Number(cashReceived) < total)
            }
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2.5 h-12"
          >
            <Printer className="w-4.5 h-4.5" />
            {submitting
              ? "Procesando cobro..."
              : "Confirmar y Emitir Ticket [F8]"}
          </Button>

          <p className="hidden md:block text-[11px] text-center text-muted-foreground font-mono">
            Atajos: [F2] Buscar • [F4] Medio de Pago • [F8] Cobrar
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

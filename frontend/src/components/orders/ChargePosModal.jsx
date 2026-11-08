import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  X,
  DollarSign,
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { api } from "@/services/api";
import { printPosReceipt } from "@/utils/printHelper";
import { toast } from "sonner";

export default function ChargePosModal({ order, profile, onClose, onSuccess }) {
  const [chargeMethod, setChargeMethod] = useState("efectivo");
  const [chargePrintTicket, setChargePrintTicket] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!order) return null;

  const totalBudget =
    order.budget?.items?.reduce((s, i) => s + (Number(i.price) || 0), 0) ||
    Number(order.budget?.total) ||
    0;

  const handleConfirmChargePos = async (e) => {
    e.preventDefault();
    if (totalBudget <= 0) {
      toast.error("La orden no posee un monto presupuestado mayor a $0 para cobrar en Caja.");
      return;
    }

    try {
      setSubmitting(true);
      const saleItems = [
        {
          id: `order-${order._id}`,
          name: `Orden #${order.trackingCode} - ${order.deviceType || ""} ${order.deviceModel || ""}`.trim(),
          code: order.trackingCode,
          price: totalBudget,
          quantity: 1,
          isServiceOrder: true,
        },
      ];

      const createdSale = await api.sales.create({
        items: saleItems,
        total: totalBudget,
        paymentMethod: chargeMethod,
      });

      await api.orders.updateStatus(
        order._id,
        "entregado",
        `Equipo entregado y cobrado en Caja POS ($${totalBudget.toLocaleString("es-AR")} - ${chargeMethod.toUpperCase()})`
      );

      if (chargePrintTicket) {
        printPosReceipt(
          {
            id: createdSale._id,
            items: saleItems,
            total: totalBudget,
            payment_method: chargeMethod,
            created_at: createdSale.created_at || new Date().toISOString(),
          },
          profile || {}
        );
      }

      toast.success("¡Cobro registrado en Caja POS!", {
        description: `Orden #${order.trackingCode} marcada como Entregada ($${totalBudget.toLocaleString("es-AR")}).`,
      });
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Error al registrar cobro en Caja", {
        description: error.message || "Intente nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/80 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
      >
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              Cobrar Orden en Caja POS
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Orden <strong className="font-mono text-foreground">#{order.trackingCode}</strong>{" "}
              &bull; {order.deviceModel}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleConfirmChargePos} className="p-4 sm:p-6 space-y-4 text-left">
          <div className="bg-primary/10 border border-primary/25 rounded-xl p-4 flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Monto a Cobrar
            </span>
            <span className="text-2xl font-black font-outfit text-primary font-mono">
              $
              {totalBudget.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Seleccioná el Medio de Pago
            </Label>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { id: "efectivo", label: "Efectivo", icon: DollarSign },
                { id: "transferencia", label: "Transferencia", icon: Smartphone },
                { id: "debito", label: "Débito", icon: CreditCard },
                { id: "credito", label: "Crédito", icon: Wallet },
              ].map((m) => {
                const Icon = m.icon;
                const active = chargeMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setChargeMethod(m.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      active
                        ? "bg-primary/15 border-primary text-primary font-bold"
                        : "border-border/70 bg-background/60 hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-primary" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={chargePrintTicket}
              onChange={(e) => setChargePrintTicket(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>Imprimir ticket de venta y marcar orden como Entregada</span>
          </label>

          <div className="flex justify-end gap-2.5 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {submitting ? "Registrando..." : "Confirmar Cobro y Entrega"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

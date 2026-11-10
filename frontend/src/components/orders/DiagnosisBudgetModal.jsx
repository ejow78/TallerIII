import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Stethoscope,
  X,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  Package,
  Plus,
  Save,
  ChevronDown,
} from "lucide-react";
import { api } from "@/services/api";
import { sendBudgetReadyEmail } from "@/services/emailService";
import { toast } from "sonner";

export default function DiagnosisBudgetModal({
  order,
  inventoryItems = [],
  profile,
  onClose,
  onSuccess,
}) {
  const [diagText, setDiagText] = useState(() => order?.diagnosis || "");
  const [budgetItems, setBudgetItems] = useState(() => {
    if (order?.budget && Array.isArray(order.budget.items) && order.budget.items.length > 0) {
      return order.budget.items.map((i) => ({
        desc: i.desc,
        price: i.price?.toString() || "",
        inventoryId: i.inventoryId || null,
        stockDeducted: Boolean(i.stockDeducted),
      }));
    }
    return [{ desc: "", price: "", inventoryId: null, stockDeducted: false }];
  });
  const [deductStockOnSave, setDeductStockOnSave] = useState(true);
  const [savingDiag, setSavingDiag] = useState(false);

  const handleAddBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      { desc: "", price: "", inventoryId: null, stockDeducted: false },
    ]);
  };

  const handleAddInventoryBudgetItem = (invId) => {
    if (!invId) return;
    const invItem = inventoryItems.find((i) => i._id === invId);
    if (!invItem) return;

    const newItem = {
      desc: `${invItem.name}${invItem.code ? ` (${invItem.code})` : ""}`,
      price: String(Math.max(0, Number(invItem.price) || 0)),
      inventoryId: invItem._id,
      stockDeducted: false,
    };

    if (
      budgetItems.length === 1 &&
      !budgetItems[0].desc.trim() &&
      !budgetItems[0].price
    ) {
      setBudgetItems([newItem]);
    } else {
      setBudgetItems([...budgetItems, newItem]);
    }
    toast.info(`Repuesto agregado al presupuesto: ${invItem.name}`);
  };

  const handleRemoveBudgetItem = (index) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const handleBudgetItemChange = (index, field, value) => {
    const updated = [...budgetItems];
    updated[index][field] = value;
    setBudgetItems(updated);
  };

  const handleSaveDiagnosis = async (e) => {
    e.preventDefault();
    if (order?.budget?.approved) {
      toast.error("El presupuesto ya fue aprobado por el cliente y no puede modificarse.");
      return;
    }
    try {
      setSavingDiag(true);

      const processedItems = [];
      for (const i of budgetItems) {
        if (!i.desc || i.desc.trim() === "") continue;

        let stockDeducted = Boolean(i.stockDeducted);

        if (i.inventoryId && deductStockOnSave && !stockDeducted) {
          try {
            await api.inventory.adjustStock(i.inventoryId, -1);
            stockDeducted = true;
          } catch (stockErr) {
            console.warn("No se pudo descontar stock del repuesto:", stockErr);
            toast.warning(`No se pudo descontar stock de "${i.desc}"`);
          }
        }

        processedItems.push({
          desc: i.desc.trim(),
          price: Math.max(0, Number(i.price) || 0),
          inventoryId: i.inventoryId || null,
          stockDeducted,
        });
      }

      const validBudgetItems = processedItems;
      const totalBudget = validBudgetItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0
      );

      const budgetData =
        validBudgetItems.length > 0
          ? {
              items: validBudgetItems,
              total: totalBudget,
              approved: Boolean(order.budget?.approved),
              rejected: Boolean(order.budget?.rejected),
              dateApproved: order.budget?.dateApproved || null,
            }
          : null;

      // Pasa automáticamente a "presupuestado" al guardar (a menos que ya esté en reparación o listo)
      const targetStatus =
        order?.status === "en_reparacion" ||
        order?.status === "listo" ||
        order?.status === "entregado"
          ? order.status
          : "presupuestado";

      await api.orders.updateDiagnosisAndBudget(order._id, {
        diagnosis: diagText,
        budget: budgetData,
        status: targetStatus,
      });

      toast.success("Diagnóstico y Presupuesto guardados", {
        description: `La orden ${order.trackingCode} pasó a Presupuestado.`,
      });

      const clientEmail = order.clientId?.email;
      if (clientEmail && clientEmail.includes("@") && budgetData) {
        try {
          await sendBudgetReadyEmail({
            to: clientEmail.trim(),
            clientName: order.clientId?.name || "Cliente",
            orderCode: order.trackingCode,
            deviceType: order.deviceType,
            deviceModel: order.deviceModel,
            diagnosis: diagText.trim(),
            budgetItems: validBudgetItems,
            budgetTotal: totalBudget.toLocaleString("es-AR"),
            workshopName: profile?.name || "RepairIT",
            workshopPhone: profile?.phone || "",
            workshopAddress: profile?.address || "",
          });
        } catch (err) {
          console.warn("No se pudo enviar email de presupuesto:", err);
        }
      }

      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar diagnóstico", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setSavingDiag(false);
    }
  };

  const isDiagnosticoStep =
    (order?.status || "").toLowerCase().trim() === "diagnostico" || !order?.diagnosis;

  const inStockItems = inventoryItems.filter((inv) => (inv.quantity || 0) > 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/80 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 cursor-default"
      >
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              {isDiagnosticoStep
                ? "Agregar Diagnóstico y Presupuesto"
                : "Editar Diagnóstico y Presupuesto"}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Orden N°{" "}
              <strong className="font-mono text-foreground">{order.trackingCode}</strong>{" "}
              &bull; {order.deviceType} {order.deviceModel}
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

        <form onSubmit={handleSaveDiagnosis} className="p-4 sm:p-6 space-y-5">
          {/* Banner de Estado del Presupuesto */}
          {order.budget?.approved ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-between text-xs text-emerald-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Presupuesto Aprobado por el Cliente</strong>{" "}
                  {order.budget.dateApproved && `el ${order.budget.dateApproved}`}
                </span>
              </div>
              <Badge className="bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                Aprobado
              </Badge>
            </div>
          ) : order.budget?.rejected ? (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center justify-between text-xs text-rose-400">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Presupuesto Rechazado por el Cliente</strong>
                </span>
              </div>
              <Badge className="bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold text-[10px]">
                Rechazado
              </Badge>
            </div>
          ) : order.budget?.items?.length ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-between text-xs text-amber-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Presupuesto Pendiente de Aprobación</strong> del cliente en el portal
                  público
                </span>
              </div>
              <Badge className="bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold text-[10px]">
                Pendiente
              </Badge>
            </div>
          ) : null}

          {/* Falla Declarada de Recepción (Referencia rápida) */}
          <div className="bg-muted/15 p-3.5 rounded-xl border border-border/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Falla Declarada en Recepción
            </span>
            <p className="text-xs text-foreground italic">
              &quot;{order.issue || "Sin detalles específicos"}&quot;
            </p>
          </div>

          {/* Informe de Diagnóstico Técnico */}
          <div className="space-y-1.5">
            <Label
              htmlFor="diag-text"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Diagnóstico Técnico Realizado
            </Label>
            <Textarea
              id="diag-text"
              rows={3}
              placeholder="Escribí el diagnóstico técnico (fallas detectadas en inspección, componentes a reemplazar...)"
              value={diagText}
              onChange={(e) => setDiagText(e.target.value)}
              className="bg-background/80 border-border text-xs focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
            />
          </div>

          {/* Presupuesto de Mano de Obra y Repuestos */}
          <div className="space-y-3 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                Ítems del Presupuesto (Mano de obra y repuestos)
              </Label>
              {/* Desplegable estilo OrderStatusDropdown para Repuestos de Stock */}
              {inStockItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 border border-primary/40 px-2.5 text-[10px] font-bold text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Package className="w-3 h-3" />
                      <span>+ Repuesto de Stock</span>
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-card border-border text-foreground max-h-56 overflow-y-auto w-72 sm:w-80 p-1"
                  >
                    {inStockItems.map((inv) => (
                      <DropdownMenuItem
                        key={inv._id}
                        onClick={() => handleAddInventoryBudgetItem(inv._id)}
                        className="text-xs cursor-pointer flex justify-between items-center py-2 px-2.5 rounded-md hover:bg-muted"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="block truncate font-medium">{inv.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {inv.code}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-primary shrink-0">
                          ${Number(inv.price || 0).toLocaleString("es-AR")}
                          <span className="text-muted-foreground text-[10px] ml-1">
                            ({inv.quantity} u.)
                          </span>
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {budgetItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/50"
                >
                  <div className="flex-grow min-w-0">
                    <Input
                      type="text"
                      placeholder="Descripción (ej: Reemplazo de módulo pantalla)"
                      value={item.desc}
                      onChange={(e) => handleBudgetItemChange(idx, "desc", e.target.value)}
                      className="bg-background text-xs h-8 w-full rounded-lg"
                    />
                    {item.inventoryId && (
                      <span className="text-[10px] text-primary font-semibold inline-flex items-center gap-1 mt-1">
                        <Package className="w-3 h-3" />
                        Vinculado a Inventario{" "}
                        {item.stockDeducted ? "(Stock ya descontado ✓)" : "(Restará 1 u.)"}
                      </span>
                    )}
                  </div>
                  <div className="relative w-28 sm:w-32 shrink-0">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      placeholder="Monto"
                      value={item.price}
                      onChange={(e) => handleBudgetItemChange(idx, "price", e.target.value)}
                      className="bg-background text-xs h-8 pl-6 font-mono rounded-lg"
                    />
                  </div>
                  {budgetItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBudgetItem(idx)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Botón para agregar ítem manual ubicado debajo del ítem o lista */}
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBudgetItem}
                className="h-7 text-xs font-semibold border-border/80 text-foreground hover:bg-muted rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar Ítem
              </Button>
            </div>

            {budgetItems.some((i) => i.inventoryId && !i.stockDeducted) && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={deductStockOnSave}
                  onChange={(e) => setDeductStockOnSave(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>
                  Descontar automáticamente 1 unidad del stock de inventario al guardar
                </span>
              </label>
            )}

            {/* Total calculado */}
            <div className="flex justify-between items-baseline bg-primary/5 p-3 rounded-xl border border-primary/20 mt-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                TOTAL PRESUPUESTADO:
              </span>
              <span className="text-xl font-black font-outfit text-primary font-mono">
                $
                {budgetItems
                  .reduce((acc, i) => acc + Math.max(0, Number(i.price) || 0), 0)
                  .toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={savingDiag}
              className="h-9 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs px-5 rounded-xl cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {savingDiag
                ? "Guardando..."
                : isDiagnosticoStep
                ? "Guardar y Presupuestar"
                : "Guardar Diagnóstico"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

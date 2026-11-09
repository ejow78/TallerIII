import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Store,
  Download,
  AlertCircle,
  Printer,
} from "lucide-react";

export function PosSalesHistory({
  salesLoading = false,
  filteredSales = [],
  salesBreakdown = { totalAmount: 0, cashAmount: 0, digitalAmount: 0, count: 0 },
  dateRangeFilter = "hoy",
  setDateRangeFilter,
  isMultiTaller = false,
  isAdmin = false,
  venues = [],
  selectedVenueFilter = "todas",
  setSelectedVenueFilter,
  onExportExcel,
  onPrintReceipt,
}) {
  return (
    <div className="space-y-4">
      {/* Barra de Filtros del Historial */}
      <Card className="bg-card/30 border-border/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5 text-left">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Registro de Caja y Arqueo de Cobros
            </h3>
            <p className="text-[11px] text-muted-foreground font-light">
              Filtrá por período para realizar tu cierre de caja o re-imprimí cualquier ticket en un clic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Píldoras de Rango de Fecha */}
            <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5">
              {[
                { id: "hoy", label: "Hoy" },
                { id: "7d", label: "7 Días" },
                { id: "mes", label: "Este Mes" },
                { id: "todo", label: "Todo" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setDateRangeFilter(r.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    dateRangeFilter === r.id
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {isMultiTaller && isAdmin && (
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-muted-foreground shrink-0" />
                <select
                  value={selectedVenueFilter}
                  onChange={(e) => setSelectedVenueFilter(e.target.value)}
                  className="h-8 bg-background/85 border border-border rounded-lg px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="todas">Todas las Sucursales</option>
                  {venues.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onExportExcel}
              className="h-8 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
              title="Exportar historial filtrado a Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {/* Tarjetas de Desglose / Arqueo de Caja (Estilo Features) */}
        <div className="rounded-xl bg-background/80 border border-border/70 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3 rounded-lg bg-card/50 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              {dateRangeFilter === "hoy" ? "Total Cobrado Hoy" : "Total del Período"}
            </span>
            <span className="font-outfit text-xl sm:text-2xl font-black text-foreground block mt-1">
              $
              {salesBreakdown.totalAmount.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] text-muted-foreground block">
              {salesBreakdown.count}{" "}
              {salesBreakdown.count === 1 ? "cobro registrado" : "cobros registrados"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-card/50 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Efectivo en Caja
            </span>
            <span className="font-outfit text-xl sm:text-2xl font-black text-emerald-400 block mt-1">
              $
              {salesBreakdown.cashAmount.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] text-emerald-400 block">
              Ventas de mostrador y señas
            </span>
          </div>

          <div className="p-3 rounded-lg bg-card/50 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Digital / Transferencias
            </span>
            <span className="font-outfit text-xl sm:text-2xl font-black text-sky-400 block mt-1">
              $
              {salesBreakdown.digitalAmount.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] text-sky-400 block">
              Tarjetas y transferencias
            </span>
          </div>
        </div>
      </Card>

      {/* Tabla / Tarjetas de Historial */}
      <Card className="bg-card/30 border-border/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {salesLoading ? (
            <div className="text-center py-16 text-xs font-light text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Cargando transacciones de caja...
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-xs font-light space-y-1">
              <AlertCircle className="w-8 h-8 opacity-30 mx-auto text-muted-foreground mb-1" />
              <p>No se encontraron transacciones registradas en este período.</p>
            </div>
          ) : (
            <>
              {/* Vista Móvil (< md): Tarjetas de Ventas */}
              <div className="space-y-3 p-3.5 md:hidden">
                {filteredSales.map((sale) => (
                  <div
                    key={sale._id}
                    className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2.5 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-primary block">
                          #{sale._id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
                          {`${new Date(sale.created_at).toLocaleDateString("es-AR", {
                            timeZone: "America/Argentina/Buenos_Aires",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })} • ${new Date(sale.created_at).toLocaleTimeString("es-AR", {
                            timeZone: "America/Argentina/Buenos_Aires",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })} hs`}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[9px] font-bold uppercase px-2 py-0.5 shrink-0"
                      >
                        {sale.payment_method}
                      </Badge>
                    </div>

                    <p className="text-xs text-foreground font-light leading-snug pt-1.5 border-t border-border/40">
                      {sale.items
                        ?.map((i) => `${i.name} (x${i.quantity})`)
                        .join(", ")}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          {sale.venueName} • {sale.cajero}
                        </span>
                        <span className="font-mono font-black text-base text-foreground">
                          $
                          {Number(sale.total).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onPrintReceipt(
                            sale._id,
                            sale.items,
                            Number(sale.total),
                            sale.payment_method,
                            sale.created_at
                          )
                        }
                        className="h-8 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Re-imprimir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista Escritorio (>= md): Tabla completa */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Ticket</th>
                      <th className="py-3.5 px-4">Fecha y Hora</th>
                      <th className="py-3.5 px-4">Sucursal</th>
                      <th className="py-3.5 px-4">Cajero</th>
                      <th className="py-3.5 px-4 max-w-xs">
                        Artículos Vendidos
                      </th>
                      <th className="py-3.5 px-4">Medio de Pago</th>
                      <th className="py-3.5 px-4 text-right">
                        Monto Cobrado
                      </th>
                      <th className="py-3.5 px-4 text-right">Imprimir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredSales.map((sale) => (
                      <tr
                        key={sale._id}
                        className="hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold font-mono text-[11px] text-primary">
                          #{sale._id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground font-mono text-[10px]">
                          {`${new Date(sale.created_at).toLocaleDateString("es-AR", {
                            timeZone: "America/Argentina/Buenos_Aires",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })} • ${new Date(sale.created_at).toLocaleTimeString("es-AR", {
                            timeZone: "America/Argentina/Buenos_Aires",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })} hs`}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                            <span className="text-foreground font-medium">
                              {sale.venueName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {sale.cajero}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="text-foreground font-light leading-tight">
                            {sale.items
                              ?.map((i) => `${i.name} (x${i.quantity})`)
                              .join(", ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 uppercase">
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-bold px-2 py-0.5"
                          >
                            {sale.payment_method}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground text-sm">
                          $
                          {Number(sale.total).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onPrintReceipt(
                                sale._id,
                                sale.items,
                                Number(sale.total),
                                sale.payment_method,
                                sale.created_at
                              )
                            }
                            className="h-8 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                            title="Re-imprimir Ticket de Venta"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Ticket
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
    </div>
  );
}

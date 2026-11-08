import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const activityChartConfig = {
  ingresados: {
    label: "Equipos Ingresados",
    color: "#38bdf8",
  },
  entregados: {
    label: "Equipos Entregados",
    color: "#10b981",
  },
  facturacion: {
    label: "Facturación ($)",
    color: "#60a5fa",
  },
};

const statusChartConfig = {
  cantidad: {
    label: "Órdenes",
    color: "#38bdf8",
  },
};

export default function DashboardCharts({
  isBasicPlan,
  userRole,
  chartMode,
  setChartMode,
  timeRange,
  setTimeRange,
  timeSeriesData,
  breakdownMode,
  setBreakdownMode,
  breakdownData,
}) {
  if (isBasicPlan) {
    return (
      <Card className="bg-card/25 border-border/80 border-dashed p-6 sm:p-8 text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="space-y-1 max-w-lg mx-auto">
          <h3 className="font-outfit text-base sm:text-lg font-bold text-foreground">
            Métricas en Tiempo Real y Gráficos Financieros
          </h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Visualizá curvas de flujo de equipos, evolución de facturación diaria y estadísticas por tipo de dispositivo actualizando al plan <strong className="text-primary font-semibold">Taller Pro</strong>.
          </p>
        </div>
        {userRole === "admin" && (
          <div className="pt-1">
            <Button asChild size="sm" variant="outline" className="text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 cursor-pointer">
              <Link to="/dashboard/perfil">Ver Planes Disponibles</Link>
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gráfico 1: Shadcn Interactive Area Chart (2 columnas) */}
      <Card className="lg:col-span-2 bg-card/30 border-border/80 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>
                {chartMode === "orders"
                  ? "Flujo de Equipos: Ingresados vs. Entregados"
                  : "Evolución de Facturación Diaria ($)"}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {chartMode === "orders"
                ? "Comparativa diaria de órdenes recibidas y equipos completados"
                : "Ingresos consolidados por cobros en Caja POS y presupuestos aprobados"}
            </CardDescription>
          </div>

          {/* Controles del gráfico */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5">
              <button
                type="button"
                onClick={() => setChartMode("orders")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  chartMode === "orders"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Órdenes
              </button>
              <button
                type="button"
                onClick={() => setChartMode("revenue")}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  chartMode === "revenue"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Facturación
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5">
              {[
                { id: "7d", label: "7d" },
                { id: "14d", label: "14d" },
                { id: "30d", label: "30d" },
              ].map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setTimeRange(range.id)}
                  className={`px-2 py-1 text-[11px] font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                    timeRange === range.id
                      ? "bg-card text-foreground border border-border/60 shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-4 flex-1 flex flex-col justify-center">
          <ChartContainer
            config={activityChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={timeSeriesData}
              margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillIngresados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-ingresados)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-ingresados)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillEntregados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-entregados)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-entregados)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillFacturacion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-facturacion)" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="var(--color-facturacion)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={chartMode === "revenue" ? 55 : 28}
                allowDecimals={false}
                tickFormatter={(val) =>
                  chartMode === "revenue"
                    ? val >= 1000
                      ? `$${(val / 1000).toFixed(0)}k`
                      : `$${val}`
                    : val
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {chartMode === "orders" ? (
                <>
                  <Area
                    dataKey="entregados"
                    type="monotone"
                    fill="url(#fillEntregados)"
                    stroke="var(--color-entregados)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="ingresados"
                    type="monotone"
                    fill="url(#fillIngresados)"
                    stroke="var(--color-ingresados)"
                    strokeWidth={2}
                  />
                </>
              ) : (
                <Area
                  dataKey="facturacion"
                  type="monotone"
                  fill="url(#fillFacturacion)"
                  stroke="var(--color-facturacion)"
                  strokeWidth={2.5}
                />
              )}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico 2: Distribución por Estado de Laboratorio / Equipos */}
      <Card className="bg-card/30 border-border/80 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="font-outfit text-base font-bold text-foreground">
              {breakdownMode === "status" ? "Estados de Taller" : "Tipos de Equipos"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {breakdownMode === "status"
                ? "Volumen por etapa operativa"
                : "Dispositivos más recibidos"}
            </CardDescription>
          </div>

          <div className="inline-flex rounded-lg border border-border/80 bg-background/60 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setBreakdownMode("status")}
              className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                breakdownMode === "status"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Estados
            </button>
            <button
              type="button"
              onClick={() => setBreakdownMode("devices")}
              className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                breakdownMode === "devices"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Equipos
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-4 flex-1 flex flex-col justify-center">
          <ChartContainer
            config={statusChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              data={breakdownData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={84}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="cantidad"
                fill="var(--color-cantidad)"
                radius={[0, 6, 6, 0]}
                barSize={22}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

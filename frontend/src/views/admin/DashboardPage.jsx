import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, PackageCheck, Wrench, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Retraso de 1 segundo para ver el skeleton de carga
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Grid de Skeletons para tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
          Panel de Control
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Resumen operativo del taller y control de stock de insumos técnicos.
        </p>
      </div>

      {/* Grid de Estadísticas Rápidas mediante Cards de shadcn/ui */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Órdenes Activas */}
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Órdenes Activas</span>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-foreground block">12</span>
            <span className="text-[10px] text-primary block font-medium mt-1">4 en diagnóstico, 8 en reparación</span>
          </CardContent>
        </Card>

        {/* Card 2: Entregados este Mes */}
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entregas del Mes</span>
            <PackageCheck className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-foreground block">45</span>
            <span className="text-[10px] text-emerald-400 block font-medium mt-1">+15% respecto al mes anterior</span>
          </CardContent>
        </Card>

        {/* Card 3: Repuestos en Stock */}
        <Card className="bg-card/45 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items en Inventario</span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-foreground block">84</span>
            <span className="text-[10px] text-muted-foreground block font-medium mt-1">Distribuidos en 14 categorías</span>
          </CardContent>
        </Card>

        {/* Card 4: Alertas de Stock */}
        <Card className="bg-destructive/5 border-destructive/20 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-xs font-semibold text-destructive/80 uppercase tracking-wider">Alertas de Stock</span>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-outfit font-black text-destructive block">2</span>
            <span className="text-[10px] text-destructive/80 block font-medium mt-1">Requieren compra urgente</span>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Órdenes Recientes mediante Card de shadcn */}
        <Card className="lg:col-span-2 bg-card/20 border-border shadow-sm">
          <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="font-outfit text-base font-bold text-foreground/90">
              Ingresos Recientes
            </CardTitle>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Actualizado hace 5m</span>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-xs font-light leading-relaxed max-w-sm">
              Aquí se desplegará el listado interactivo con filtros rápidos de diagnóstico. Ya podés probar la pestaña de Órdenes para dar de alta dispositivos.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-4 border-border text-xs gap-1 font-bold">
              <Link to="/dashboard/ordenes">
                Ir a Registro de Dispositivos <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Alertas de Stock Detalladas mediante Alert de shadcn/ui */}
        <Card className="bg-card/20 border-border shadow-sm">
          <CardHeader className="border-b border-border/50 py-4">
            <CardTitle className="font-outfit text-base font-bold text-foreground/90">
              Críticos de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-foreground p-3.5">
              <AlertCircle className="h-4 w-4 stroke-destructive" />
              <div className="ml-2">
                <AlertTitle className="text-xs font-bold font-outfit flex items-center justify-between">
                  <span>Pasta Térmica Arctic MX-6</span>
                  <Badge variant="destructive" className="text-[8px] font-bold py-0.5 px-1 uppercase tracking-wider shrink-0 select-none">Bajo Stock</Badge>
                </AlertTitle>
                <AlertDescription className="text-[10px] text-muted-foreground mt-1">
                  Mínimo requerido: 5 jeringas | Actual en stock: 2 jeringas.
                </AlertDescription>
              </div>
            </Alert>

            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-foreground p-3.5">
              <AlertCircle className="h-4 w-4 stroke-destructive" />
              <div className="ml-2">
                <AlertTitle className="text-xs font-bold font-outfit flex items-center justify-between">
                  <span>Alcohol Isopropílico 1L</span>
                  <Badge variant="destructive" className="text-[8px] font-bold py-0.5 px-1 uppercase tracking-wider shrink-0 select-none">Bajo Stock</Badge>
                </AlertTitle>
                <AlertDescription className="text-[10px] text-muted-foreground mt-1">
                  Mínimo requerido: 3 botellas | Actual en stock: 1 botella.
                </AlertDescription>
              </div>
            </Alert>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RepairIT - 404 Página no encontrada";
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-16 px-6 flex items-center justify-center overflow-hidden">
      {/* Fondo GridPattern idéntico al Hero con desvanecimiento radial */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        squares={[
          [4, 3],
          [2, 1],
          [7, 3],
          [10, 2],
          [12, 6],
          [15, 4],
          [18, 5],
          [8, 7],
          [14, 8],
          [20, 2],
          [24, 5],
        ]}
        className={cn(
          "stroke-white/[0.07] fill-white/[0.03] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,white,transparent_80%)] pointer-events-none"
        )}
      />

      <div className="relative z-10 max-w-xl w-full mx-auto text-center space-y-8 animate-fade-in">
        {/* Código de Error y Etiqueta Técnica */}
        <div className="space-y-3">
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Error 404 • Recurso no encontrado
          </p>

          <h1 className="font-outfit text-7xl sm:text-9xl font-black text-foreground tracking-tight select-none">
            4<span className="text-primary">0</span>4
          </h1>
        </div>

        {/* Título y Explicación */}
        <div className="space-y-3 max-w-md mx-auto">
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Página no encontrada
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            La sección o el enlace que estás buscando no existe en la plataforma, fue reubicado o la dirección web contiene un error de tipeo.
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto h-11 px-6 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-11 px-5 rounded-lg text-sm font-medium border-border/80 bg-card/60 hover:bg-card text-foreground flex items-center justify-center gap-2"
          >
            <Link to="/consulta">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span>Consultar Orden</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={handleBack}
            className="w-full sm:w-auto h-11 px-4 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar</span>
          </Button>
        </div>

        {/* Nota al pie técnica */}
        <div className="pt-6 border-t border-border/40 text-xs text-muted-foreground/70 font-mono">
          RepairIT Cloud Operating System • Soporte: soporte@repairit.cloud
        </div>
      </div>
    </div>
  );
}

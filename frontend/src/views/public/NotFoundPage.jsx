import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "RepairIT - 404 Página no encontrada";
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center overflow-hidden px-6">
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
        {/* Número 404 */}
        <div>
          <h1 className="font-outfit text-8xl sm:text-9xl font-black text-foreground tracking-tight select-none">
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

        {/* Único botón: Regresar que devuelve al inicio */}
        <div className="pt-2 flex justify-center">
          <Button
            asChild
            className="h-11 px-6 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              <span>Regresar al Inicio</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

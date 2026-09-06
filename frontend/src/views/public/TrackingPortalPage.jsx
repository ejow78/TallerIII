import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  QrCode,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function TrackingPortalPage() {
  document.title = "RepairIT | Consulta y Seguimiento de Orden";
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-formateo a mayúsculas y sin espacios
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/\s+/g, "");
    setTrackingCode(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanCode = trackingCode.trim();

    if (!cleanCode) {
      toast.error("Por favor, ingresá un código de orden", {
        description: "Ejemplo: RT-8K9M2P4X",
      });
      return;
    }

    if (cleanCode.length < 4) {
      toast.error("Código de orden incompleto", {
        description: "Revisá el código que figura en tu comprobante.",
      });
      return;
    }

    setLoading(true);

    // Redirección inteligente respetando el subdominio si estamos en producción
    if (window.location.hostname.includes("repairit.cloud")) {
      window.location.href = `https://tracking.repairit.cloud/seguimiento/${cleanCode}`;
    } else {
      navigate(`/seguimiento/${cleanCode}`);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background text-foreground">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Cabecera del Portal */}
        <div className="text-center space-y-2">
          <h1 className="font-outfit text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Seguimiento de tu Equipo
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto font-light">
            Ingresá el código alfanumérico que te entregó el taller para ver el estado de tu reparación en tiempo real.
          </p>
        </div>

        {/* Tarjeta Central de Búsqueda */}
        <Card className="bg-card/70 border-border/80 shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 pt-6 px-6 sm:px-8 border-b border-border/40">
            <CardTitle className="text-base font-outfit font-bold text-foreground">
              Consultar Estado de Reparación
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Sin llamadas ni esperas: presupuesto, diagnóstico y avance online.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="tracking-input"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Código de Seguimiento
                </label>
                <div className="relative">
                  <Input
                    id="tracking-input"
                    type="text"
                    required
                    value={trackingCode}
                    onChange={handleInputChange}
                    placeholder="Ej: RT-8K9M2P4X"
                    autoFocus
                    className="w-full bg-background/90 border-border/80 rounded-xl px-4 py-3.5 text-base sm:text-lg font-mono font-bold tracking-wider text-foreground placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <QrCode className="w-5 h-5 opacity-40" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Buscando orden...</span>
                ) : (
                  <>
                    <span>Consultar Estado</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Ayuda: ¿Dónde está el código? */}
            <div className="rounded-xl bg-card/40 border border-border/60 p-4 space-y-2.5 text-xs text-muted-foreground mt-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                <span>¿Dónde encuentro mi código de orden?</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc font-light text-[11px] sm:text-xs">
                <li>
                  En la parte superior de tu <strong>comprobante impreso</strong> (ej: <code>RT-XXXX</code>).
                </li>
                <li>
                  En el mensaje de WhatsApp o correo de bienvenida que te envió el taller al recibir tu equipo.
                </li>
                <li>
                  Si tu comprobante tiene un <strong>código QR</strong>, podés escanearlo con la cámara de tu celular para acceder directo.
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="py-3.5 px-6 sm:px-8 border-t border-border/40 bg-card/20 flex justify-center text-xs">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline font-medium transition-colors"
            >
              ← Volver al inicio
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

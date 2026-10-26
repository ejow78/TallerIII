import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, HelpCircle, ArrowRight, Camera, X } from "lucide-react";

export default function TrackingPortalPage() {
  document.title = "RepairIT | Consulta y Seguimiento de Orden";
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const navigate = useNavigate();

  // Auto-formateo a mayúsculas y sin espacios
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/\s+/g, "");
    setTrackingCode(value);
  };

  const navigateToOrder = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;
    setLoading(true);
    if (window.location.hostname.includes("repairit.cloud")) {
      window.location.href = `https://tracking.repairit.cloud/seguimiento/${cleanCode}`;
    } else {
      navigate(`/seguimiento/${cleanCode}`);
    }
  };

  const stopCameraScanner = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScannerOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  const extractCodeFromQr = (rawText) => {
    if (!rawText) return "";
    const trimmed = rawText.trim();
    // Si el QR contiene la URL de seguimiento (ej: https://tracking.repairit.cloud/seguimiento/RT-XXXX)
    const match = trimmed.match(/\/seguimiento\/([A-Za-z0-9-_]+)/i);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }
    return trimmed.toUpperCase().replace(/\s+/g, "");
  };

  const startCameraScanner = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Tu navegador no permite acceder a la cámara en este dispositivo.");
      return;
    }

    try {
      setScannerOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }

      const { default: jsQR } = await import("jsqr");

      const scanFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (qrResult && qrResult.data) {
            const detectedCode = extractCodeFromQr(qrResult.data);
            if (detectedCode.length >= 4) {
              stopCameraScanner();
              setTrackingCode(detectedCode);
              toast.success(`Código QR detectado: ${detectedCode}`);
              navigateToOrder(detectedCode);
              return;
            }
          }
        }
        animFrameRef.current = requestAnimationFrame(scanFrame);
      };

      animFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      console.error("Error al abrir cámara QR:", err);
      stopCameraScanner();
      toast.error("No se pudo acceder a la cámara", {
        description: "Verificá que hayas otorgado permisos de cámara al navegador.",
      });
    }
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

    navigateToOrder(cleanCode);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background text-foreground">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Tarjeta Central de Búsqueda */}
        <Card className="bg-card/70 border-border/80 shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="pb-5 pt-6 px-6 sm:px-8 border-b border-border/40 space-y-1.5">
            <CardTitle className="text-xl sm:text-2xl font-outfit font-black text-foreground tracking-tight">
              Seguimiento de tu Equipo
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Ingresá el código alfanumérico que te entregó el taller para ver el estado de tu reparación en tiempo real.
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
                    className="w-full bg-background/90 border-border/80 rounded-xl pl-4 pr-12 py-3.5 text-base sm:text-lg font-mono font-bold tracking-wider text-foreground placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={startCameraScanner}
                    title="Escanear código QR con la cámara"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
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

            {/* Ejemplo rápido para testing */}
            <div className="text-center text-xs text-muted-foreground font-medium pt-1">
              ¿Querés probar? Ingresá{" "}
              <button
                type="button"
                onClick={() => {
                  setTrackingCode("DEMO-ID");
                  navigateToOrder("demo-id");
                }}
                className="text-primary hover:underline cursor-pointer font-bold inline bg-transparent p-0 border-0"
              >
                demo-id
              </button>{" "}
              para ver una reparación simulada.
            </div>

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
                  También podés tocar el ícono de <strong>QR</strong> en el buscador para escanear tu comprobante con la cámara.
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="py-3.5 px-6 sm:px-8 border-t border-border/40 bg-card/20 flex justify-center text-xs">
            <a
              href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline font-medium transition-colors"
            >
              ← Volver al inicio
            </a>
          </CardFooter>
        </Card>
      </div>

      {/* Modal de Cámara para Escaneo de Código QR */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Camera className="w-4 h-4 text-primary" />
                <span>Escanear Código QR</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={stopCameraScanner}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative bg-black aspect-square w-full overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              {/* Marco guía de escaneo */}
              <div className="pointer-events-none absolute inset-10 border-2 border-primary/70 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
            </div>

            <div className="p-3.5 text-center text-xs text-muted-foreground font-light">
              Apuntá la cámara al código QR de tu orden de servicio.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

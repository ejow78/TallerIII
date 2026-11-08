import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

export function LandingDashboardModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in-0 duration-200 cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl w-full max-h-[92vh] rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col cursor-default"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-card/95 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              Vista previa ampliada del Panel de Control
            </span>
            <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
              (Presioná Esc para cerrar)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <a
                href="/hero-dashboard.png?v=2"
                download="repairit-panel-control.png"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-auto p-2 sm:p-4 bg-muted/20 flex items-center justify-center">
          <picture>
            <source srcSet="/hero-dashboard.webp?v=2" type="image/webp" />
            <img
              src="/hero-dashboard.png?v=2"
              alt="Panel de Control ampliado de RepairIT"
              className="max-w-full max-h-[80vh] w-auto h-auto rounded-lg shadow-lg object-contain"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { Turnstile } from "@marsidev/react-turnstile";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  document.title = "RepairIT - Recuperar Contraseña";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAEjQ5UUbknAkvYB3";

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Correo requerido", { description: "Ingresá tu correo electrónico." });
      return;
    }

    try {
      setLoading(true);
      const redirectUrl = window.location.hostname.includes("repairit.cloud")
        ? "https://app.repairit.cloud/reset-password"
        : `${window.location.origin}/reset-password`;

      const options = {
        redirectTo: redirectUrl,
      };

      if (captchaToken) {
        options.captchaToken = captchaToken;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), options);

      if (error) throw error;

      setSent(true);
      toast.success("Enlace enviado", {
        description: "Revisá tu correo para continuar con el restablecimiento."
      });
    } catch (err) {
      console.error("Error al recuperar contraseña:", err);
      toast.error("Error al enviar solicitud", {
        description: err.message || "Verificá el correo ingresado e intentá nuevamente."
      });
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex-grow flex items-center justify-center bg-background px-3.5 sm:px-6 py-5 sm:py-12 relative overflow-hidden">

        <Card className="max-w-md w-full bg-card/40 border-border p-5 sm:p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 text-center space-y-5">
          <div className="space-y-1.5">
            <CardTitle className="font-outfit text-xl sm:text-2xl font-bold text-foreground tracking-tight border-0 pb-0">
              ¡Revisá tu Correo!
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
              Enviamos las instrucciones de recuperación a <br />
              <strong className="text-foreground font-mono text-xs sm:text-sm break-all">{email}</strong>
            </CardDescription>
          </div>

          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Hacé clic en el botón de restablecimiento que te enviamos para ingresar tu nueva contraseña.
          </p>

          <div className="pt-1">
            <Button asChild className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-primary/15 cursor-pointer">
              <Link to="/login">
                Volver a Iniciar Sesión
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-background px-3.5 sm:px-6 py-5 sm:py-12 relative overflow-hidden">

      <Card className="max-w-md w-full bg-card/40 border-border p-4 sm:p-7 rounded-2xl shadow-2xl backdrop-blur relative z-10 space-y-3.5 sm:space-y-4">
        
        {/* Título y descripción */}
        <div className="text-center space-y-1 sm:space-y-1.5">
          <CardTitle className="font-outfit text-xl sm:text-2xl font-bold text-foreground tracking-tight border-0 pb-0">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-[11px] sm:text-xs text-muted-foreground font-light leading-relaxed">
            Ingresá tu correo electrónico registrado para enviarte un enlace de restablecimiento.
          </CardDescription>
        </div>

        {/* Formulario */}
        <form onSubmit={handleResetRequest} className="space-y-3 sm:space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Correo Electrónico
            </Label>
            <Input 
              id="reset-email"
              type="email" 
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tecnico@repairit.cloud"
              className="w-full h-10 bg-background/85 border-border rounded-lg px-3.5 text-base sm:text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          {/* Cloudflare Turnstile */}
          {siteKey && (
            <div className="flex justify-center py-1 w-full overflow-hidden min-h-[65px]">
              <div className="max-w-full flex justify-center scale-[0.92] xs:scale-100 origin-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={siteKey}
                  onSuccess={(token) => setCaptchaToken(token)}
                  options={{
                    theme: "dark",
                    size: "flexible",
                  }}
                />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-primary/15 transition-all mt-1 cursor-pointer select-none"
          >
            {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </Button>
        </form>

        <div className="text-center pt-1 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            ¿Recordaste tu contraseña?{" "}
            <Link 
              to="/login"
              className="text-primary hover:underline font-bold transition-colors"
            >
              Iniciá sesión acá
            </Link>
          </p>
        </div>

        <div className="text-center pt-1">
          <Button 
            variant="link"
            asChild
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer select-none"
          >
            <a href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}>
              &larr; Volver a la consulta pública
            </a>
          </Button>
        </div>

      </Card>
    </div>
  );
}

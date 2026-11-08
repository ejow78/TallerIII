import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { Turnstile } from "@marsidev/react-turnstile";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = "RepairIT - Recuperar Contraseña";
  }, []);
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
      <div className="flex-grow flex items-center justify-center bg-background px-4 sm:px-6 py-12 relative overflow-hidden">
        <GridPattern
          width={36}
          height={36}
          x={-1}
          y={-1}
          className="stroke-white/[0.06] fill-white/[0.02] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,white,transparent_80%)] pointer-events-none"
        />

        <Card className="max-w-md w-full bg-card/65 border border-border/70 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10 text-center space-y-6">
          <div className="flex flex-col items-center text-center space-y-1.5">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity pb-1">
              <span className="font-outfit text-3xl font-black tracking-tight text-foreground">
                Repair<span className="text-primary">IT</span>
              </span>
            </Link>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <CardTitle className="font-outfit text-xl sm:text-2xl font-bold text-foreground tracking-tight border-0 pb-0">
              ¡Revisá tu Correo!
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
              Enviamos el enlace seguro de restablecimiento a <br />
              <strong className="text-foreground font-mono text-xs sm:text-sm break-all">{email}</strong>
            </CardDescription>
          </div>

          <p className="text-xs text-muted-foreground font-light leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/40">
            Hacé clic en el enlace para ingresar tu nueva clave de acceso. Si no lo encontrás en tu bandeja de entrada, revisá la carpeta de correo no deseado (spam).
          </p>

          <div className="pt-1">
            <Button asChild className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 cursor-pointer">
              <Link to="/login" className="flex items-center justify-center gap-2">
                <span>Volver a Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-background px-4 sm:px-6 py-12 relative overflow-hidden">
      <GridPattern
        width={36}
        height={36}
        x={-1}
        y={-1}
        className="stroke-white/[0.06] fill-white/[0.02] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,white,transparent_80%)] pointer-events-none"
      />

      <Card className="max-w-md w-full bg-card/65 border border-border/70 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10 space-y-5">
        {/* Logo de la marca */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <span className="font-outfit text-3xl font-black tracking-tight text-foreground">
              Repair<span className="text-primary">IT</span>
            </span>
          </Link>
          <CardTitle className="font-outfit text-xl sm:text-2xl font-bold text-foreground tracking-tight border-0 pb-0 pt-1">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
            Ingresá tu correo electrónico registrado para enviarte un enlace de recuperación.
          </CardDescription>
        </div>

        {/* Formulario */}
        <form onSubmit={handleResetRequest} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
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
              className="w-full h-11 bg-background/70 border border-border/80 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
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
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer select-none flex items-center justify-center gap-2"
          >
            {loading ? "Enviando enlace..." : "Enviar Enlace de Recuperación"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border/60">
          <Link 
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Iniciar Sesión</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";
import { supabase } from "@/services/supabaseClient";
import { Turnstile } from "@marsidev/react-turnstile";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function LoginPage() {
  document.title = "RepairIT - Iniciar Sesión";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAEjQ5UUbknAkvYB3";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RepairIT - Iniciar Sesión";
    const token = sessionStorage.getItem("repairit_token") || localStorage.getItem("repairit_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error("Error al conectar con Google", {
        description: error.message,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.auth.login(email, password, false, captchaToken);
      toast.success("¡Acceso concedido!", {
        description: `Bienvenido de vuelta, ${data.name}.`
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error al iniciar sesión", {
        description: error.message || "Credenciales inválidas. Intente nuevamente."
      });
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-background px-4 sm:px-6 py-8 sm:py-16 relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Fondo técnico GridPattern */}
      <GridPattern
        width={38}
        height={38}
        x={-1}
        y={-1}
        squares={[
          [2, 2],
          [5, 4],
          [8, 1],
          [11, 5],
          [14, 2],
          [17, 4],
        ]}
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
            Acceso al Panel Técnico
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
            Ingresá tus credenciales autorizadas para gestionar las órdenes y el taller.
          </CardDescription>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Correo Electrónico
            </Label>
            <Input 
              id="login-email"
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="login-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Contraseña
              </Label>
              <Link 
                to="/recover-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-light"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input 
              id="login-password"
              type="password" 
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 bg-background/70 border border-border/80 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
            />
          </div>

          {/* Enlace a Registro */}
          <div className="text-center pt-0.5">
            <Link 
              to="/register"
              className="text-xs text-primary hover:underline font-medium transition-colors"
            >
              ¿Todavía no tenés cuenta? Registrate acá
            </Link>
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
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all mt-1 cursor-pointer select-none"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="relative flex py-0.5 items-center">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="flex-shrink mx-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">O continuar con</span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        <Button 
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-11 border border-border/80 bg-background/50 hover:bg-card/80 text-foreground text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Iniciar sesión con Google
        </Button>

        <div className="text-center pt-1">
          <Button 
            variant="link"
            asChild
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer select-none"
          >
            <a href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}>
              &larr; Volver a la página principal
            </a>
          </Button>
        </div>

      </Card>
    </div>
  );
}

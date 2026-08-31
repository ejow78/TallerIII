import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { Turnstile } from "@marsidev/react-turnstile";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAEjQ5UUbknAkvYB3";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RepairIT - Registrar Taller";
    const token = sessionStorage.getItem("repairit_token") || localStorage.getItem("repairit_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGoogleRegister = async () => {
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !workshopName.trim() || !email.trim() || !password) {
      toast.error("Campos incompletos", {
        description: "Por favor completá todos los campos."
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Contraseña débil", {
        description: "La contraseña debe tener al menos 6 caracteres."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", {
        description: "Verificá que ambas contraseñas coincidan exactamente."
      });
      return;
    }

    try {
      setLoading(true);

      const redirectUrl = window.location.hostname.includes("repairit.cloud")
        ? "https://app.repairit.cloud/dashboard"
        : `${window.location.origin}/dashboard`;

      const signUpOptions = {
        data: {
          name: name.trim(),
          workshop_name: workshopName.trim(),
        },
        emailRedirectTo: redirectUrl,
      };

      if (captchaToken) {
        signUpOptions.captchaToken = captchaToken;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: signUpOptions,
      });

      if (error) throw error;

      if (data?.session) {
        toast.success("¡Cuenta creada con éxito!", {
          description: `Bienvenido a RepairIT, ${name}.`
        });
        navigate("/dashboard");
        return;
      }

      setRegisteredEmail(email.trim().toLowerCase());
      toast.success("¡Registro recibido!", {
        description: "Te enviamos un correo para verificar tu cuenta."
      });
    } catch (err) {
      console.error("Error en registro:", err);
      toast.error("Error al registrar el taller", {
        description: err.message || "Ocurrió un problema inesperado. Intentá nuevamente."
      });
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!registeredEmail) return;
    try {
      const redirectUrl = window.location.hostname.includes("repairit.cloud")
        ? "https://app.repairit.cloud/dashboard"
        : `${window.location.origin}/dashboard`;

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: registeredEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      toast.success("Correo reenviado", {
        description: `Enviamos nuevamente el enlace de confirmación a ${registeredEmail}.`
      });
    } catch (err) {
      toast.error("No se pudo reenviar", {
        description: err.message
      });
    }
  };

  // Pantalla de Confirmación de Correo Enviado (Mismo estilo exacto)
  if (registeredEmail) {
    return (
      <div className="flex-grow flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <Card className="max-w-md w-full bg-card/40 border-border p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 text-center space-y-6">
          <div className="space-y-2">
            <CardTitle className="font-outfit text-2xl font-bold text-foreground tracking-tight border-0 pb-0">
              ¡Revisá tu Correo!
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
              Enviamos un enlace de verificación a <br />
              <strong className="text-foreground font-mono text-sm">{registeredEmail}</strong>
            </CardDescription>
          </div>

          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Hacé clic en el enlace que te enviamos para activar tu taller y acceder al panel de control.
          </p>

          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              className="w-full border-border/80 text-xs font-semibold py-2.5 rounded-lg hover:bg-card/70 cursor-pointer"
            >
              ¿No te llegó el correo? Reenviar enlace
            </Button>

            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-primary/15 cursor-pointer">
              <Link to="/login">
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <Card className="max-w-md w-full bg-card/40 border-border p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 space-y-6">
        
        {/* Título y descripción */}
        <div className="text-center space-y-2">
          <CardTitle className="font-outfit text-2xl font-bold text-foreground tracking-tight border-0 pb-0">
            Registrá tu Taller
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light">
            Creá tu cuenta para gestionar órdenes, finanzas y clientes con seguimiento online.
          </CardDescription>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="space-y-1.5">
            <Label htmlFor="reg-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Tu Nombre
            </Label>
            <Input 
              id="reg-name"
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-workshop" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Nombre del Taller
            </Label>
            <Input 
              id="reg-workshop"
              type="text" 
              required
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              placeholder="FixTech Electrónica"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Correo Electrónico
            </Label>
            <Input 
              id="reg-email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="taller@ejemplo.com"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-pass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Contraseña
            </Label>
            <Input 
              id="reg-pass"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Confirmar Contraseña
            </Label>
            <Input 
              id="reg-confirm"
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          {/* Cloudflare Turnstile */}
          {siteKey && (
            <div className="flex justify-center pt-1 overflow-hidden">
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
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-primary/15 transition-all mt-2 cursor-pointer select-none"
          >
            {loading ? "Creando taller..." : "Crear mi Cuenta de Taller"}
          </Button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="flex-shrink mx-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">O continuar con</span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        <Button 
          type="button"
          onClick={handleGoogleRegister}
          variant="outline"
          className="w-full border-border/80 hover:bg-card/65 hover:text-foreground text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
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
          Registrarse con Google
        </Button>

        <div className="text-center pt-1 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            ¿Ya tenés una cuenta registrada?{" "}
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

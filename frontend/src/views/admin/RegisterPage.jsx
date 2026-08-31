import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { Wrench, CheckCircle2, Mail, ArrowRight, ShieldCheck, Building2, User, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RepairIT - Registrar mi Taller";
    const token = sessionStorage.getItem("repairit_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !workshopName.trim() || !email.trim() || !password) {
      toast.error("Campos incompletos", {
        description: "Por favor complete todos los campos obligatorios."
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Contraseña débil", {
        description: "La contraseña debe contener al menos 6 caracteres."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", {
        description: "Verifique que ambas contraseñas coincidan exactamente."
      });
      return;
    }

    if (!acceptTerms) {
      toast.error("Términos y Condiciones", {
        description: "Debe aceptar los términos de servicio para continuar."
      });
      return;
    }

    try {
      setLoading(true);

      const redirectUrl = window.location.hostname.includes("repairit.cloud")
        ? "https://app.repairit.cloud/dashboard"
        : `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            name: name.trim(),
            workshop_name: workshopName.trim(),
            phone: phone.trim() || "+54 381 4223344",
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      // Si Supabase devuelve sesión inmediata (sin confirmación forzada)
      if (data?.session) {
        toast.success("¡Cuenta creada exitosamente!", {
          description: `Bienvenido a RepairIT, ${name}.`
        });
        navigate("/dashboard");
        return;
      }

      // Si requiere confirmación por email (flujo con Resend)
      setRegisteredEmail(email.trim().toLowerCase());
      toast.success("¡Registro recibido!", {
        description: "Te enviamos un correo para verificar tu cuenta."
      });
    } catch (err) {
      console.error("Error en registro:", err);
      toast.error("Error al registrar el taller", {
        description: err.message || "Ocurrió un problema inesperado. Intente nuevamente."
      });
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
        description: `Hemos enviado nuevamente el enlace de confirmación a ${registeredEmail}.`
      });
    } catch (err) {
      toast.error("No se pudo reenviar", {
        description: err.message
      });
    }
  };

  // Pantalla de Confirmación de Correo Enviado
  if (registeredEmail) {
    return (
      <div className="flex-grow flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <Card className="max-w-md w-full bg-card/40 border-border p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <Mail className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <CardTitle className="font-outfit text-2xl font-black text-foreground">
              ¡Revisá tu Correo!
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              Enviamos un enlace de verificación a <br />
              <strong className="text-foreground font-mono text-sm">{registeredEmail}</strong>
            </CardDescription>
          </div>

          <div className="p-4 bg-background/80 border border-border/80 rounded-xl text-left space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Siguientes pasos:</span>
            </div>
            <p>1. Abrí tu bandeja de entrada (revisá Spam si no lo ves).</p>
            <p>2. Hacé clic en <strong>"Confirmar mi Correo"</strong>.</p>
            <p>3. Tu taller quedará activo automáticamente en el panel.</p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              className="w-full border-border/80 text-xs font-semibold py-2.5 rounded-lg hover:bg-card/70 cursor-pointer"
            >
              ¿No te llegó el correo? Reenviar enlace
            </Button>

            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2.5 rounded-lg shadow-lg shadow-primary/15 cursor-pointer">
              <Link to="/login">
                <span>Ir a Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-background px-4 sm:px-6 py-12 relative overflow-hidden">
      
      {/* Glow de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="max-w-lg w-full bg-card/40 border-border p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 space-y-6">
        
        {/* Cabecera del formulario */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Registro de Nuevo Taller</span>
          </div>
          <CardTitle className="font-outfit text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight border-0 pb-0">
            Creá tu Cuenta en <span className="text-primary">RepairIT</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light max-w-sm mx-auto">
            Empezá a gestionar tus órdenes, finanzas y clientes con seguimiento online 24/7.
          </CardDescription>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre del Responsable */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                Tu Nombre
              </Label>
              <Input 
                id="reg-name"
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>

            {/* Nombre del Taller */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-workshop" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-primary" />
                Nombre del Taller
              </Label>
              <Input 
                id="reg-workshop"
                type="text" 
                required
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                placeholder="Ej. FixTech Tucumán"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Correo Electrónico */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                Correo Electrónico
              </Label>
              <Input 
                id="reg-email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="taller@ejemplo.com"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                Teléfono / Celular
              </Label>
              <Input 
                id="reg-phone"
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 381 4223344"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-pass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" />
                Contraseña
              </Label>
              <Input 
                id="reg-pass"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Confirmar Contraseña
              </Label>
              <Input 
                id="reg-confirm"
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí tu contraseña"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={acceptTerms} 
              onCheckedChange={(checked) => setAcceptTerms(checked)}
              className="border-border focus-visible:ring-primary mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="text-xs text-muted-foreground font-light cursor-pointer select-none leading-tight"
            >
              Acepto los{" "}
              <a href="/terminos" target="_blank" className="text-primary hover:underline font-medium">Términos de Servicio</a>
              {" "}y la{" "}
              <a href="/privacidad" target="_blank" className="text-primary hover:underline font-medium">Política de Privacidad</a>.
            </Label>
          </div>

          {/* Botón de Envío */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-primary/15 transition-all mt-3 cursor-pointer select-none"
          >
            {loading ? "Creando taller..." : "Crear mi Cuenta de Taller"}
          </Button>
        </form>

        {/* Enlace para Iniciar Sesión */}
        <div className="text-center pt-2 border-t border-border/60">
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

      </Card>
    </div>
  );
}

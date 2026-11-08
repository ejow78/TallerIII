import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { ArrowRight } from "lucide-react";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RepairIT - Nueva Contraseña";
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Contraseña corta", { description: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", { description: "Verificá que ambas contraseñas sean idénticas." });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success("¡Contraseña actualizada! 🎉", {
        description: "Tu clave ha sido cambiada con éxito. Ya podés acceder a tu panel."
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      toast.error("Error al actualizar contraseña", {
        description: err.message || "El enlace pudo haber expirado. Solicitá uno nuevo."
      });
    } finally {
      setLoading(false);
    }
  };

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
            Establecer Nueva Contraseña
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
            Ingresá tu nueva clave de acceso para asegurar tu cuenta de taller.
          </CardDescription>
        </div>

        {/* Formulario */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-pass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Nueva Contraseña
            </Label>
            <Input 
              id="new-pass"
              type="password" 
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full h-11 bg-background/70 border border-border/80 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-confirm" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Confirmar Nueva Contraseña
            </Label>
            <Input 
              id="new-confirm"
              type="password" 
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí tu nueva contraseña"
              className="w-full h-11 bg-background/70 border border-border/80 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer select-none flex items-center justify-center gap-2"
          >
            {loading ? "Guardando..." : "Actualizar Contraseña y Entrar"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            ¿Recordaste tu contraseña anterior?{" "}
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

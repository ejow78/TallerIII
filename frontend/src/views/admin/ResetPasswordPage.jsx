import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { Lock, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  document.title = "RepairIT - Nueva Contraseña";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex-grow flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <Card className="max-w-md w-full bg-card/40 border-border p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 space-y-6">
        
        {/* Título y descripción */}
        <div className="text-center space-y-2">
          <CardTitle className="font-outfit text-2xl font-bold text-foreground tracking-tight border-0 pb-0">
            Establecer Nueva Contraseña
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light">
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-confirm" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Confirmar Nueva Contraseña
            </Label>
            <Input 
              id="new-confirm"
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí tu nueva contraseña"
              className="w-full bg-background/85 border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-primary/15 transition-all mt-2 cursor-pointer select-none"
          >
            {loading ? "Guardando..." : "Actualizar Contraseña y Entrar"}
          </Button>
        </form>

        <div className="text-center pt-1 border-t border-border/60">
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

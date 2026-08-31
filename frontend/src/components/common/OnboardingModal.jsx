import { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { Wrench, User, Phone, MapPin, Sparkles } from "lucide-react";

export default function OnboardingModal({ onComplete }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workshopName, setWorkshopName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orgId, setOrgId] = useState(null);
  const [venueId, setVenueId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkOnboardingNeeded = async () => {
      try {
        const localUser = JSON.parse(sessionStorage.getItem("repairit_user") || localStorage.getItem("repairit_user") || "{}");
        if (localUser.role === "superadmin") return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserId(user.id);

        // Consultar perfil y organización actual
        const { data: profile } = await supabase
          .from("profiles")
          .select("*, organization:organizations(*), venue:venues(*)")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setOrgId(profile.organization_id);
          setVenueId(profile.venue_id);
          setUserName(profile.name || user.user_metadata?.name || "");

          const currentOrgName = profile.organization?.name || "";
          const currentVenuePhone = profile.venue?.phone || "";
          const currentVenueAddress = profile.venue?.address || "";

          // Si el nombre de la organización o sucursal es genérico o está vacío
          const isGenericOrg = !currentOrgName || currentOrgName === "Organización RepairIT" || currentOrgName === "Taller RepairIT";
          const isGenericVenue = !currentVenueAddress || currentVenueAddress === "Casa Central" || currentVenueAddress === "Av. Sarmiento 1234, San Miguel de Tucumán";

          if (isGenericOrg || isGenericVenue || !currentVenuePhone || currentVenuePhone === "+54 381 4223344") {
            setWorkshopName(user.user_metadata?.workshop_name || (isGenericOrg ? "" : currentOrgName));
            setPhone(user.user_metadata?.phone || (currentVenuePhone === "+54 381 4223344" ? "" : currentVenuePhone));
            setAddress(currentVenueAddress === "Casa Central" || currentVenueAddress === "Av. Sarmiento 1234, San Miguel de Tucumán" ? "" : currentVenueAddress);
            setOpen(true);
          }
        }
      } catch (err) {
        console.error("Error al verificar estado de onboarding:", err);
      }
    };

    checkOnboardingNeeded();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workshopName.trim()) {
      toast.error("Nombre requerido", { description: "Por favor indicá el nombre de tu taller." });
      return;
    }

    try {
      setLoading(true);

      // 1. Actualizar Organización
      if (orgId) {
        await supabase
          .from("organizations")
          .update({ name: workshopName.trim() })
          .eq("id", orgId);
      }

      // 2. Actualizar Sucursal Principal
      if (venueId) {
        await supabase
          .from("venues")
          .update({
            name: workshopName.trim(),
            phone: phone.trim() || "+54 381 4223344",
            address: address.trim() || "Local Comercial",
          })
          .eq("id", venueId);
      }

      // 3. Actualizar Perfil de Usuario
      if (userId) {
        await supabase
          .from("profiles")
          .update({
            name: userName.trim() || "Administrador",
          })
          .eq("id", userId);
      }

      // Actualizar localStorage y sessionStorage
      const stored = JSON.parse(sessionStorage.getItem("repairit_user") || localStorage.getItem("repairit_user") || "{}");
      stored.name = userName.trim() || stored.name;
      sessionStorage.setItem("repairit_user", JSON.stringify(stored));
      localStorage.setItem("repairit_user", JSON.stringify(stored));

      toast.success("¡Taller configurado con éxito! 🎉", {
        description: `Bienvenido a RepairIT. Tu taller "${workshopName}" ya está listo para operar.`
      });

      setOpen(false);
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Error al guardar onboarding:", err);
      toast.error("Error al guardar datos", { description: err.message || "Intentá nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <Card className="max-w-lg w-full bg-card/95 border-border p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur relative z-10 space-y-6">
        <div className="space-y-2 text-center pb-1">
          <div className="w-12 h-12 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center mx-auto text-primary mb-1">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold font-outfit text-foreground tracking-tight border-0 pb-0">
            ¡Te damos la bienvenida a RepairIT! 👋
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-light leading-relaxed">
            Configuremos los datos principales de tu taller para personalizar tus órdenes, comprobantes y mensajes de WhatsApp.
          </CardDescription>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="ob-workshop" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-primary" />
              Nombre del Taller / Negocio
            </Label>
            <Input 
              id="ob-workshop"
              type="text"
              required
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              placeholder="Ej. FixTech Electrónica & Celulares"
              className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ob-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              Tu Nombre y Apellido
            </Label>
            <Input 
              id="ob-name"
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ej. Javier Weimann"
              className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ob-phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                WhatsApp / Teléfono
              </Label>
              <Input 
                id="ob-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 381 4223344"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ob-address" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Dirección del Local
              </Label>
              <Input 
                id="ob-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej. Av. Sarmiento 1234"
                className="w-full bg-background/85 border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-primary/15 transition-all mt-4 cursor-pointer"
          >
            {loading ? "Guardando configuración..." : "Guardar y Comenzar a Gestionar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

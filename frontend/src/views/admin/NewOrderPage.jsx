import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { sendOrderCreatedEmail } from "@/services/emailService";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados del formulario
  const [clientName, setClientName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [deviceType, setDeviceType] = useState("Notebook");
  const [deviceModel, setDeviceModel] = useState("");
  const [accessories, setAccessories] = useState("");
  const [cosmeticCondition, setCosmeticCondition] = useState("");
  const [issue, setIssue] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const p = await api.auth.getProfile();
        setProfile(p);
      } catch (err) {
        console.error("Error al cargar perfil en NewOrderPage:", err);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (location.state?.client) {
      const c = location.state.client;
      if (c.name) setClientName(c.name);
      if (c.dni) setClientDni(c.dni);
      if (c.phone) setClientPhone(c.phone);
      if (c.email) setClientEmail(c.email);
      toast.info(`Datos precargados para cliente: ${c.name}`);
    }
  }, [location.state]);

  // Registrar orden
  const handleRegisterOrder = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("Debe aceptar los términos de recepción técnica.");
      return;
    }

    try {
      // 1. Registrar o actualizar cliente mediante la API
      const client = await api.clients.create({
        name: clientName,
        dni: clientDni,
        phone: clientPhone,
        email: clientEmail,
      });

      const dateStr = new Date().toLocaleDateString("es-AR");
      const timeStr = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

      // 2. Crear la orden de servicio vinculada
      const order = await api.orders.create({
        clientId: client._id,
        deviceType,
        deviceModel,
        accessories: accessories || "Ninguno",
        cosmetic: cosmeticCondition || "Sin detalles",
        issue,
        date: dateStr,
        time: timeStr,
      });

      toast.success("¡Dispositivo Registrado!", {
        description: `Código de seguimiento: ${order.trackingCode}.`,
      });

      // 3. Enviar confirmación por correo electrónico automáticamente
      if (clientEmail && clientEmail.includes("@")) {
        try {
          await sendOrderCreatedEmail({
            to: clientEmail.trim(),
            clientName: clientName.trim(),
            orderCode: order.trackingCode,
            deviceType,
            deviceModel,
            issue,
            workshopName: profile?.name || "RepairIT",
            workshopPhone: profile?.phone || "",
            workshopAddress: profile?.address || "",
          });
        } catch (err) {
          console.warn("No se pudo enviar email de recepción:", err);
        }
      }

      // Resetear formulario y navegar a la lista
      setClientName("");
      setClientDni("");
      setClientPhone("");
      setClientEmail("");
      setDeviceType("Notebook");
      setDeviceModel("");
      setAccessories("");
      setCosmeticCondition("");
      setIssue("");
      setAcceptTerms(false);
      
      navigate("/dashboard/ordenes");
    } catch (error) {
      toast.error("Error al registrar ingreso técnico", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <PlusCircle className="w-7 h-7 text-primary shrink-0" />
          <span>Ingreso de Equipos</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Registro rápido de dispositivos recibidos para diagnóstico y reparación.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full pt-2">
        <Card className="bg-card/40 border-border p-6 shadow-xl backdrop-blur-sm space-y-6">
          <div className="space-y-1">
            <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
              <PlusCircle className="w-5 h-5 text-primary" />
              Nuevo Ingreso Técnico
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Completá el perfil del cliente y las especificaciones del dispositivo.
            </CardDescription>
          </div>

          <form onSubmit={handleRegisterOrder} className="space-y-4">
            
            {/* Sección: Datos del Cliente */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">1. Datos del Cliente</span>
              
              <div className="space-y-1.5">
                <Label htmlFor="client-name" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Nombre Completo</Label>
                <Input 
                  id="client-name"
                  type="text" 
                  required 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder="Ej. Juan Pérez"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="client-dni" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">DNI / Identificación</Label>
                  <Input 
                    id="client-dni"
                    type="text" 
                    required 
                    value={clientDni} 
                    onChange={(e) => setClientDni(e.target.value)} 
                    placeholder="Ej. 38.450.123"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="client-phone" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Teléfono</Label>
                  <Input 
                    id="client-phone"
                    type="text" 
                    required 
                    value={clientPhone} 
                    onChange={(e) => setClientPhone(e.target.value)} 
                    placeholder="+54 381 1234567"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client-email" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email</Label>
                <Input 
                  id="client-email"
                  type="email" 
                  required 
                  value={clientEmail} 
                  onChange={(e) => setClientEmail(e.target.value)} 
                  placeholder="cliente@ejemplo.com"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>
            </div>

            <Separator className="border-border/60" />

            {/* Sección: Datos del Equipo */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">2. Datos del Equipo</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="device-type" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Tipo de Dispositivo</Label>
                  <select 
                    id="device-type"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full h-9 bg-background/85 border border-border rounded-md px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Notebook">Notebook</option>
                    <option value="PC Escritorio">PC Escritorio</option>
                    <option value="Consola">Consola</option>
                    <option value="Celular">Celular</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-model" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Marca y Modelo</Label>
                  <Input 
                    id="device-model"
                    type="text" 
                    required 
                    value={deviceModel} 
                    onChange={(e) => setDeviceModel(e.target.value)} 
                    placeholder="ASUS ROG Strix G15"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="device-accessories" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Accesorios Recibidos</Label>
                  <Input 
                    id="device-accessories"
                    type="text" 
                    value={accessories} 
                    onChange={(e) => setAccessories(e.target.value)} 
                    placeholder="Ej. Cargador original, funda protectora"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-cosmetic" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Estado Cosmético</Label>
                  <Input 
                    id="device-cosmetic"
                    type="text" 
                    value={cosmeticCondition} 
                    onChange={(e) => setCosmeticCondition(e.target.value)} 
                    placeholder="Ej. Rayón en tapa superior, marcas de uso"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="device-issue" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Falla Reportada</Label>
                <Textarea 
                  id="device-issue"
                  required 
                  rows={3}
                  value={issue} 
                  onChange={(e) => setIssue(e.target.value)} 
                  placeholder="Describí los síntomas del dispositivo..."
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs resize-none"
                />
              </div>
            </div>

            {/* Checkbox de Recepción */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms} 
                onCheckedChange={(checked) => setAcceptTerms(checked)}
                className="border-border focus-visible:ring-primary"
              />
              <div className="grid gap-1 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-[10px] text-muted-foreground font-light leading-tight select-none cursor-pointer"
                >
                  Confirmo la recepción física del equipo y autorizo la apertura del dispositivo para su diagnóstico.
                </Label>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 rounded-md transition-all select-none cursor-pointer mt-2"
            >
              Registrar Ingreso
            </Button>

          </form>
        </Card>
      </div>
    </div>
  );
}
